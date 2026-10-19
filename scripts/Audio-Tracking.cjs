// SUIVI DES ENREGISTREMENTS GUIDAR
// ══════════════════════════════════════════════════
// Usage :
//   node .\scripts\Audio-Tracking.cjs          construit le manifeste et affiche l'état
//   node .\scripts\Audio-Tracking.cjs --check  contrôle seul (code de sortie 1 si anomalie)
//
// Produit :
//   js\audio-manifest.js                  source de vérité utilisée par l'application
//   docs\enregistrements-a-realiser.csv  liste des enregistrements manquants
//   docs\enregistrements-etat.csv        état complet, entrée par entrée
//
// L'empreinte associe chaque enregistrement à l'entrée de js\data.js qu'il décrit.
// Si une entrée est modifiée ou déplacée, l'empreinte ne correspond plus : l'application
// refuse de jouer un enregistrement décalé et le contrôle signale l'anomalie.
// ══════════════════════════════════════════════════
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const projectRoot = path.resolve(__dirname, "..");
const dataPath = path.join(projectRoot, "js", "data.js");
const manifestPath = path.join(projectRoot, "js", "audio-manifest.js");
const docsDirectory = path.join(projectRoot, "docs");
const checkOnly = process.argv.includes("--check");

// ── Empreinte d'une entrée (identique à celle de js/audio.js) ──
function empreinte(texte) {
  let h = 0x811c9dc5;
  for (let i = 0; i < texte.length; i++) {
    h ^= texte.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}

// ── Chargement des leçons ──
const source = fs.readFileSync(dataPath, "utf8");
const context = {};
vm.runInNewContext(`${source}\nglobalThis.LECONS_EXPORT = LECONS;`, context, { filename: dataPath });
const lessons = context.LECONS_EXPORT;
if (!Array.isArray(lessons) || lessons.length === 0) {
  throw new Error("Aucune leçon valide n’a été trouvée dans js/data.js.");
}

// ── Analyse des dossiers audio ──
const NOM_AUDIO = /^(lecon|leçon)(\d+)[_-](\d+)\.(m4a|mp3|aac|wav|ogg|opus)$/i;
const fichiersParLecon = new Map();
const dossiersAudio = fs
  .readdirSync(projectRoot, { withFileTypes: true })
  .filter((entree) => entree.isDirectory() && /^audio_lecon\d+$/i.test(entree.name))
  .map((entree) => entree.name);

for (const dossier of dossiersAudio) {
  const numeroDossier = Number(dossier.replace(/^audio_lecon/i, ""));
  const cheminDossier = path.join(projectRoot, dossier);
  const fichiers = fs
    .readdirSync(cheminDossier, { withFileTypes: true })
    .filter((entree) => entree.isFile())
    .map((entree) => entree.name);

  for (const fichier of fichiers) {
    const correspondance = fichier.match(NOM_AUDIO);
    if (!correspondance) {
      const cle = `${dossier}/${fichier}`;
      if (!fichiersParLecon.has(cle)) fichiersParLecon.set(cle, { nom: cle, anomalie: "Nom de fichier non reconnu" });
      continue;
    }
    const numeroLecon = Number(correspondance[2]);
    const numeroFichier = Number(correspondance[3]);
    const cle = `${dossier}/${fichier}`;
    const anomalie = numeroLecon !== numeroDossier
      ? `Le fichier se trouve dans ${dossier} mais indique la leçon ${numeroLecon}`
      : null;
    const element = { nom: cle, numeroFichier, anomalie };
    const existant = fichiersParLecon.get(cle);
    if (existant) Object.assign(existant, element);
    else fichiersParLecon.set(cle, element);
  }
}

// Un numéro peut être couvert par plusieurs fichiers (préfixe « lecon » ou « leçon »).
const parLeconEtNumero = new Map();
for (const element of fichiersParLecon.values()) {
  if (element.anomalie) continue;
  const numeroLecon = Number(element.nom.match(/audio_lecon(\d+)/i)[1]);
  const cle = `${numeroLecon}:${element.numeroFichier}`;
  if (!parLeconEtNumero.has(cle)) parLeconEtNumero.set(cle, []);
  parLeconEtNumero.get(cle).push(element);
}

// ── Manifeste précédent (sert à repérer les entrées modifiées depuis l'enregistrement) ──
let manifestePrecedent = { lessons: {} };
if (fs.existsSync(manifestPath)) {
  try {
    const contexteManifeste = {};
    vm.runInNewContext(`${fs.readFileSync(manifestPath, "utf8")}\nglobalThis.MANIFESTE_EXPORT = AUDIO_MANIFEST;`, contexteManifeste, { filename: manifestPath });
    if (contexteManifeste.MANIFESTE_EXPORT && contexteManifeste.MANIFESTE_EXPORT.lessons) {
      manifestePrecedent = contexteManifeste.MANIFESTE_EXPORT;
    }
  } catch (error) {
    console.warn("Manifeste précédent illisible, il sera reconstruit :", error.message);
  }
}

// ── Construction de l'état, entrée par entrée ──
const anomalies = [];
const notes = [];
const etatLecons = {};
const lignesEtat = [];
const lignesAFaire = [];

for (let indexLecon = 0; indexLecon < lessons.length; indexLecon++) {
  const lecon = lessons[indexLecon];
  if (!Array.isArray(lecon.mots)) {
    anomalies.push(`Leçon ${indexLecon + 1} : la liste d’entrées est absente.`);
    continue;
  }
  const numeroLecon = indexLecon + 1;
  const dossier = `audio_lecon${numeroLecon}/`;
  const manifeste = {};
  let position = 0;

  for (let indexEntree = 0; indexEntree < lecon.mots.length; indexEntree++) {
    const entree = lecon.mots[indexEntree];
    if (!entree.g) continue;
    position += 1;
    const identifiant = `L${String(numeroLecon).padStart(2, "0")}-E${String(indexEntree + 1).padStart(2, "0")}`;
    const empreinteEntree = empreinte(`${entree.g}|${entree.f || ""}`);

    const candidats = parLeconEtNumero.get(`${numeroLecon}:${position}`) || [];
    if (candidats.length > 1) {
      anomalies.push(`${identifiant} : ${candidats.length} fichiers pour la position ${position} (${candidats.map(c => c.nom).join(", ")}).`);
    }
    const retenu = candidats[0] || null;

    let statut;
    let remarque = "";
    if (!retenu) {
      statut = "À enregistrer";
      remarque = `Fichier attendu : ${dossier}lecon${numeroLecon}_${String(position).padStart(3, "0")}.mp3`;
    } else if (retenu.anomalie) {
      statut = "Fichier à corriger";
      remarque = retenu.anomalie;
      anomalies.push(`${identifiant} : ${retenu.anomalie}.`);
    } else {
      const empreintePrecedente = manifestePrecedent.lessons[numeroLecon] && manifestePrecedent.lessons[numeroLecon][position]
        ? manifestePrecedent.lessons[numeroLecon][position].h
        : null;
      if (empreintePrecedente && empreintePrecedente !== empreinteEntree) {
        statut = "À ré-enregistrer";
        remarque = `Le contenu de l’entrée a changé depuis l’enregistrement : ${retenu.nom} doit être refait.`;
        anomalies.push(`${identifiant} : le contenu a changé depuis l’enregistrement (${retenu.nom}). L’enregistrement est écarté tant qu’il n’est pas refait.`);
      } else {
        statut = "Enregistré";
        manifeste[position] = { f: retenu.nom.split("/")[1], h: empreinteEntree };
      }
    }

    const ligne = [
      identifiant,
      lecon.titre || `Leçon ${numeroLecon}`,
      position,
      entree.g,
      entree.f || "",
      entree.p || "",
      entree.pProvisoire ? "Provisoire" : entree.p ? "Présente" : "Manquante",
      statut,
      retenu ? retenu.nom : `${dossier}lecon${numeroLecon}_${String(position).padStart(3, "0")}.mp3`,
      remarque
    ];
    lignesEtat.push(ligne);
    if (statut !== "Enregistré") lignesAFaire.push(ligne);
  }

  // Fichiers audio sans entrée correspondante
  for (const [cle, elements] of parLeconEtNumero) {
    const [leconFichier, numeroFichier] = cle.split(":").map(Number);
    if (leconFichier !== numeroLecon) continue;
    if (numeroFichier > position) {
      anomalies.push(`Leçon ${numeroLecon} : le fichier ${elements[0].nom} n'a pas d'entrée correspondante (${position} entrées audio).`);
    }
  }

  etatLecons[numeroLecon] = manifeste;
  const dossierPresent = fs.existsSync(path.join(projectRoot, dossier));
  if (!dossierPresent && position > 0) {
    notes.push(`Leçon ${numeroLecon} : le dossier ${dossier} sera créé pour accueillir les enregistrements.`);
    if (!checkOnly) fs.mkdirSync(path.join(projectRoot, dossier), { recursive: true });
  }
}

// ── Écriture du manifeste ──
const horodatage = new Date().toISOString();
if (!checkOnly) {
  const lignes = [
    "/* Généré par scripts\\Audio-Tracking.cjs — ne pas modifier à la main. */",
    `/* ${horodatage} */`,
    "const AUDIO_MANIFEST = " + JSON.stringify({ version: 1, generatedAt: horodatage, lessons: etatLecons }, null, 2) + ";",
    ""
  ];
  fs.writeFileSync(manifestPath, lignes.join("\n"), "utf8");
}

// ── Écriture des fichiers CSV ──
function csvCell(valeur) {
  return `"${String(valeur ?? "").replace(/"/g, '""')}"`;
}
function ecrireCsv(nomFichier, entetes, lignes) {
  const contenu = [entetes, ...lignes].map(ligne => ligne.map(csvCell).join(";")).join("\r\n");
  fs.writeFileSync(path.join(docsDirectory, nomFichier), `\uFEFF${contenu}\r\n`, "utf8");
}
const entetesEtat = [
  "Identifiant", "Leçon", "Position", "Graphie Guidar", "Traduction française",
  "Aide de prononciation", "État de la prononciation", "Statut de l’enregistrement",
  "Fichier audio", "Remarques"
];
fs.mkdirSync(docsDirectory, { recursive: true });
ecrireCsv("enregistrements-etat.csv", entetesEtat, lignesEtat);
ecrireCsv("enregistrements-a-realiser.csv", entetesEtat, lignesAFaire);

// ── Rapport ──
const totalEntrees = lignesEtat.length;
const totalEnregistrees = lignesEtat.filter(l => l[7] === "Enregistré").length;
console.log("ENREGISTREMENTS GUIDAR");
console.log("─────────────────────");
for (let indexLecon = 0; indexLecon < lessons.length; indexLecon++) {
  const lecon = lessons[indexLecon];
  const lignes = lignesEtat.filter(l => l[1] === (lecon.titre || `Leçon ${indexLecon + 1}`));
  if (!lignes.length) continue;
  const faites = lignes.filter(l => l[7] === "Enregistré").length;
  const pourcentage = lignes.length ? Math.round(faites / lignes.length * 100) : 0;
  const reste = lignes.length - faites;
  console.log(
    `  Leçon ${String(indexLecon + 1).padStart(2, "0")}  ${faites}/${lignes.length}  (${String(pourcentage).padStart(3)} %)  ` +
    (reste ? `${reste} à enregistrer` : "complète ✓") + `  ${lecon.titre || ""}`
  );
}
console.log("─────────────────────");
console.log(`  Total : ${totalEnregistrees}/${totalEntrees} enregistrements (${totalEntrees ? Math.round(totalEnregistrees / totalEntrees * 100) : 0} %)`);
console.log(`  À enregistrer : ${lignesAFaire.length}`);
console.log(`  Manifeste : ${path.relative(projectRoot, manifestPath)}${checkOnly ? " (non réécrit, mode --check)" : ""}`);
console.log(`  Liste de travail : docs\\enregistrements-a-realiser.csv`);

if (anomalies.length) {
  console.log("\nANOMALIES À CORRIGER");
  console.log("─────────────────────");
  anomalies.forEach(anomalie => console.log("  ! " + anomalie));
  if (checkOnly) process.exitCode = 1;
} else {
  console.log("\nAucune anomalie de correspondance entre les données et les fichiers audio.");
}
if (notes.length) {
  console.log("\nREMARQUES");
  console.log("─────────────────────");
  notes.forEach(note => console.log("  · " + note));
}
