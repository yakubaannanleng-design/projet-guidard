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

// ══════════════════════════════════════════════════
// 3. RENDU DES ÉCRANS (simulation DOM légère)
// ══════════════════════════════════════════════════
console.log("\nRENDU DES ÉCRANS");
const elements = new Map();
function element(id) {
  if (!elements.has(id)) {
    elements.set(id, {
      id, innerHTML: "", textContent: "", value: "", hidden: false, scrollTop: 0,
      type: "", tagName: "DIV", isContentEditable: false,
      style: { setProperty() {}, display: "" }, dataset: {},
      classList: { _c: new Set(), toggle(c, v) { v ? this._c.add(c) : this._c.delete(c); }, add(c) { this._c.add(c); }, remove(c) { this._c.delete(c); }, contains(c) { return this._c.has(c); } },
      attributes: {},
      setAttribute(n, v) { this.attributes[n] = v; },
      getAttribute(n) { return this.attributes[n] ?? null; },
      hasAttribute(n) { return n in this.attributes; },
      removeAttribute(n) { delete this.attributes[n]; },
      focus() {}, blur() {}, select() {}, setSelectionRange() {},
      addEventListener() {}, removeEventListener() {}, appendChild() {}, remove() {},
      contains() { return false; },
      querySelector() { return element("inner"); },
      querySelectorAll() { return []; },
      closest() { return null; }
    });
  }
  return elements.get(id);
}
const contexteRendu = {
  console,
  setTimeout: (fn) => { try { fn(); } catch (erreur) { contexteRendu._erreurs.push(erreur); } return 0; },
  clearTimeout: () => {}, requestAnimationFrame: (fn) => fn(),
  URL, URLSearchParams, Math, Date, JSON,
  getComputedStyle: () => ({ transform: "none" }),
  SpeechSynthesisUtterance: function (texte) { this.texte = texte; },
  localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
  navigator: {},
  Audio: function () { return { play: () => Promise.resolve(), load() {}, addEventListener() {}, pause() {}, removeAttribute() {}, set playbackRate(v) {}, get playbackRate() { return 1; } }; },
  document: {
    getElementById: (id) => element(id),
    querySelector: (sel) => element("q:" + sel),
    querySelectorAll: (sel) => sel.includes(".hdr")
      ? ["hdr", "search-area", "welcome-card", "home-dashboard", "main", "bbar", "keyboard"].map(element)
      : [],
    createElement: () => element("tmp"),
    addEventListener: () => {},
    body: element("body"),
    activeElement: null
  },
  window: {
    location: { search: "", href: "http://localhost/guidar-final.html" },
    speechSynthesis: { getVoices: () => [], speak() {}, cancel() {}, addEventListener: () => {} },
    addEventListener: () => {},
    history: { replaceState() {} }
  },
  toast: () => {},
  _erreurs: []
};
vm.createContext(contexteRendu);
for (const fichier of ["js/data.js", "js/audio-manifest.js", "js/menu.js", "js/state.js", "js/player.js", "js/audio.js", "js/keyboard.js"]) {
  vm.runInContext(lire(fichier), contexteRendu, { filename: fichier });
}
function essayer(nom, action) {
  try { action(); reussis++; console.log("  ok   " + nom); }
  catch (erreur) { echecs++; console.log("  ÉCHEC " + nom + " → " + erreur.message); }
}
essayer("démarrage de l’application", () => { vm.runInContext(lire("js/init.js"), contexteRendu, { filename: "js/init.js" }); });
essayer("affichage d’une entrée", () => { contexteRendu.show(1); });
verifier("le mot et son état d’enregistrement sont affichés", element("main").innerHTML.includes("statut-audio"));
verifier("le nom du fichier audio est proposé", element("main").innerHTML.includes("lecon1_001.mp3"));
essayer("navigation entre les entrées", () => { contexteRendu.go(1); contexteRendu.go(-1); });
essayer("ouverture du menu", () => { contexteRendu.openMenu(); });
verifier("le fond devient inactif pendant le menu", element("main").hasAttribute("inert"));
essayer("fermeture du menu", () => { contexteRendu.closeMenu(); });
verifier("le fond redevient actif", !element("main").hasAttribute("inert"));
essayer("choix d’une leçon", () => { contexteRendu.ouvrirLeconsMenu(); });
verifier("la progression audio par leçon est affichée", element("menu-liste").innerHTML.includes("enregistrement(s) disponible(s)"));
essayer("bibliothèque numérique", () => { contexteRendu.afficherBibliotheque(); });
verifier("la bibliothèque affiche des résultats", element("resource-results").innerHTML.includes("resource-result"));
essayer("filtre de la bibliothèque", () => { contexteRendu.majResultatsBibliotheque("salut", 0); });
verifier("le compteur de résultats est mis à jour", /résultat\(s\)/.test(element("resource-count").textContent));
essayer("quiz", () => { contexteRendu.ouvrirQuiz(); contexteRendu.demarrerQuiz(0); });
verifier("une question de quiz est posée", element("menu-liste").innerHTML.includes("quiz-question"));
essayer("paramètres", () => { contexteRendu.ouvrirParametres(); });
verifier("le réglage de prononciation approximative existe", element("menu-liste").innerHTML.includes("approximationVocale"));
essayer("sections de l’application", () => {
  contexteRendu.naviguerEcranFenetre("lecons");
  verifier("le bouton « Choisir une leçon » ouvre la liste des leçons", element("section-toolbar").innerHTML.includes("ouvrirLeconsMenu()"), element("section-toolbar").innerHTML);
  contexteRendu.naviguerEcranFenetre("accueil");
  contexteRendu.naviguerEcranFenetre("compte");
  contexteRendu.naviguerEcranFenetre("quiz");
});
essayer("recherche globale", () => { contexteRendu.rechercherApplication("salut"); });
verifier("la recherche propose des résultats", element("search-results").innerHTML.includes("search-result"));
essayer("lecture d’une entrée avec enregistrement", () => { contexteRendu.lireEntree(0, 1, () => {}); });
essayer("lecture d’une entrée sans enregistrement", () => { contexteRendu.lireEntree(4, 1, () => {}); });
if (contexteRendu._erreurs.length) {
  echecs++;
  console.log("  ÉCHEC erreurs asynchrones pendant le rendu : " + contexteRendu._erreurs.map(e => e.message).join(" | "));
}

// 4. CHARTE VISUELLE ET COHÉRENCE HTML/JS
// ══════════════════════════════════════════════════
console.log("\nCHARTE VISUELLE");
const css = lire("css/style.css");
const html = lire("guidar-final.html");
const sourcesJs = ["js/init.js", "js/menu.js", "js/player.js", "js/keyboard.js", "js/interactions.js", "js/audio.js"]
  .map(f => lire(f)).join("\n");

verifier("l’en-tête affiche le badge « Guidar »", /class="hdr-badge"[^>]*>Guidar</.test(html));
verifier("l’ancien compteur de leçon a disparu de la page", !html.includes("hdr-lecon"));
verifier("aucun script ne référence l’ancien compteur de leçon", !sourcesJs.includes("hdr-lecon"));
verifier("le bloc éditorial de la carte est présent", css.includes(".card-head{"));
verifier("la charte définit le fond papier chaud", css.includes("--app-bg:#f6f3ec"));
verifier("la charte définit l’accent vert profond", css.includes("--accent:#14624a"));
verifier("le thème sombre est toujours disponible", css.includes("body.theme-dark{"));
verifier("le contraste renforcé est toujours disponible", css.includes("body.contraste-renforce{"));
verifier("la barre basse est flottante", /\.bbar\{[^}]*position:fixed/.test(css));
verifier("le liseré or remplace l’étiquette « À DÉCOUVRIR »", !css.includes("À DÉCOUVRIR"));
verifier("le halo de la scène est un dégradé radial", /\.main::before\{[^}]*radial-gradient/.test(css));

essayer("l’en-tête éditorial de la carte est rendu", () => {
  contexteRendu.show(1);
  const rendu = element("main").innerHTML;
  verifier("la carte indique la leçon", rendu.includes("card-lesson"));
  verifier("la carte indique la position dans la leçon", /card-count">\s*2\s*\/\s*\d+/.test(rendu), rendu.slice(0, 400));
});

console.log("\n" + reussis + " contrôle(s) réussi(s), " + echecs + " échec(s).");
console.log(`Couverture audio : ${couverts}/${totalEntrees} entrées (${totalEntrees ? Math.round(couverts / totalEntrees * 100) : 0} %).`);
if (echecs) process.exitCode = 1;
