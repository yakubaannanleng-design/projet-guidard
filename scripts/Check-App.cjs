// CONTRÔLE GÉNÉRAL DE L'APPLICATION
// ══════════════════════════════════════════════════
// Usage : node .\scripts\Check-App.cjs
//
// Contrôle :
//   1. la correspondance entre js\data.js, les fichiers audio et js\audio-manifest.js
//   2. le moteur audio (recherche d'enregistrement, empreintes)
//   3. la recherche et la bibliothèque
//
// Code de sortie 1 si une anomalie est détectée.
// ══════════════════════════════════════════════════
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { spawnSync } = require("node:child_process");

const projectRoot = path.resolve(__dirname, "..");
const lire = (chemin) => fs.readFileSync(path.join(projectRoot, chemin), "utf8");

let reussis = 0;
let echecs = 0;
function verifier(nom, condition, detail) {
  if (condition) { reussis++; console.log("  ok   " + nom); }
  else { echecs++; console.log("  ÉCHEC " + nom + (detail ? " → " + detail : "")); }
}

// ══════════════════════════════════════════════════
// 1. COHÉRENCE DES ENREGISTREMENTS
// ══════════════════════════════════════════════════
console.log("COHÉRENCE DES ENREGISTREMENTS");
const suivi = spawnSync(process.execPath, [path.join(__dirname, "Audio-Tracking.cjs"), "--check"], {
  cwd: projectRoot,
  encoding: "utf8"
});
const sortieSuivi = (suivi.stdout || "") + (suivi.stderr || "");
const lignesResume = sortieSuivi.split(/\r?\n/).filter(ligne => /^\s+Leçon|^\s+Total/.test(ligne));
lignesResume.forEach(ligne => console.log("  " + ligne.trim()));
const anomalieSuivi = sortieSuivi.includes("ANOMALIES À CORRIGER");
verifier("aucune anomalie entre les données et les fichiers audio", !anomalieSuivi);

// ══════════════════════════════════════════════════
// 2. MOTEUR AUDIO ET RECHERCHE
// ══════════════════════════════════════════════════
console.log("\nMOTEUR AUDIO");
const sansEcoute = () => {};
const elementFactice = () => ({
  style: {}, classList: { toggle() {}, add() {}, remove() {} },
  setAttribute() {}, appendChild() {}, remove() {}, select() {}, focus() {},
  querySelector: () => null, querySelectorAll: () => [], addEventListener() {},
  getAttribute: () => null, innerHTML: "", textContent: "", value: ""
});
const contexte = {
  console,
  setTimeout: () => 0,
  clearTimeout: () => {},
  URLSearchParams, Math, Date, JSON,
  localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
  navigator: {},
  Audio: function () { return { play: () => Promise.resolve(), load() {}, addEventListener() {} }; },
  document: {
    getElementById: () => elementFactice(),
    querySelector: () => elementFactice(),
    querySelectorAll: () => [],
    createElement: () => elementFactice(),
    addEventListener: sansEcoute,
    body: elementFactice(),
    activeElement: null
  },
  window: {
    location: { search: "", href: "http://localhost/guidar-final.html" },
    speechSynthesis: { getVoices: () => [], speak() {}, cancel() {}, addEventListener: sansEcoute },
    addEventListener: sansEcoute,
    history: { replaceState() {} }
  },
  toast: () => {}
};
vm.createContext(contexte);
for (const fichier of ["js/data.js", "js/audio-manifest.js", "js/menu.js", "js/state.js", "js/player.js", "js/audio.js"]) {
  vm.runInContext(lire(fichier), contexte, { filename: fichier });
}

const lecons = vm.runInContext("LECONS", contexte);
const manifeste = vm.runInContext("AUDIO_MANIFEST", contexte);

const premiere = contexte.etatAudio(0, 1);
verifier("leçon 1, 1re entrée : enregistrement disponible", premiere.etat === "disponible", JSON.stringify(premiere));
verifier("leçon 1, 1re entrée : bon fichier", premiere.chemin === "audio_lecon1/lecon1_001.mp3", premiere.chemin);
verifier("leçon 1, 9e entrée : enregistrement absent", contexte.etatAudio(0, 9).etat === "absent");
verifier("leçon 5 : enregistrement absent", contexte.etatAudio(4, 1).etat === "absent");
verifier("entrée de note (sans graphie) : aucun enregistrement", contexte.etatAudio(0, 0).etat === "absent");

let verifies = 0;
let desynchronises = 0;
lecons.forEach((lecon, indexLecon) => {
  lecon.mots.filter(mot => mot.g).forEach((mot, position) => {
    const entree = manifeste.lessons[String(indexLecon + 1)] && manifeste.lessons[String(indexLecon + 1)][String(position + 1)];
    if (!entree) return;
    verifies++;
    if (entree.h !== contexte.empreinte(mot.g + "|" + (mot.f || ""))) desynchronises++;
  });
});
verifier("toutes les empreintes du manifeste correspondent aux données", desynchronises === 0, verifies + " vérifiées, " + desynchronises + " désynchronisées");

const totalEntrees = lecons.reduce((n, lecon) => n + lecon.mots.filter(mot => mot.g).length, 0);
let couverts = 0;
lecons.forEach((lecon, index) => { couverts += contexte.proportionAudioLecon(index).disponibles; });
verifier("la couverture annoncée correspond aux fichiers présents", couverts === Object.keys(manifeste.lessons).reduce((n, cle) => n + Object.keys(manifeste.lessons[cle]).length, 0), String(couverts));

console.log("\nRECHERCHE ET BIBLIOTHÈQUE");
verifier("recherche insensible aux accents", contexte.normaliserTexte("Élève à l'école") === "eleve a l'ecole");
verifier("recherche conserve les caractères Guidar", contexte.normaliserTexte("əsɗoko") === "əsɗoko");
verifier("recherche « salut » trouve des résultats", contexte.entreesBibliotheque("salut", -1).length > 0);
verifier("recherche sans résultat renvoie 0", contexte.entreesBibliotheque("zzzzzz", -1).length === 0);
verifier("filtre par leçon 5 limité à la leçon 5", contexte.entreesBibliotheque("", 4).every(e => e.leconIndex === 4));

console.log("\n" + reussis + " contrôle(s) réussi(s), " + echecs + " échec(s).");
console.log(`Couverture audio : ${couverts}/${totalEntrees} entrées (${totalEntrees ? Math.round(couverts / totalEntrees * 100) : 0} %).`);
if (echecs) process.exitCode = 1;
