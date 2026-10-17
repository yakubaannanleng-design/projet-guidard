const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const projectRoot = path.resolve(__dirname, "..");
const dataPath = path.join(projectRoot, "js", "data.js");
const outputDirectory = path.join(projectRoot, "docs");
const source = fs.readFileSync(dataPath, "utf8");
const context = {};

vm.runInNewContext(`${source}\nglobalThis.LECONS_EXPORT = LECONS;`, context, {
  filename: dataPath
});

const lessons = context.LECONS_EXPORT;
if (!Array.isArray(lessons) || lessons.length === 0) {
  throw new Error("Aucune leçon valide n’a été trouvée dans js/data.js.");
}

function csvCell(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function writeCsv(filename, headers, rows) {
  const content = [headers, ...rows]
    .map(row => row.map(csvCell).join(";"))
    .join("\r\n");
  fs.writeFileSync(path.join(outputDirectory, filename), `\uFEFF${content}\r\n`, "utf8");
}

const entryHeaders = [
  "Identifiant",
  "Leçon",
  "Numéro de l’entrée dans l’application",
  "Transcription Guidar actuelle",
  "Traduction française actuelle",
  "Aide de prononciation actuelle",
  "État de la prononciation dans l’application",
  "Graphie validée (oui/non)",
  "Traduction validée (oui/non)",
  "Prononciation validée (oui/non)",
  "Correction proposée par le spécialiste",
  "Commentaires",
  "Nom du spécialiste",
  "Date de validation"
];

const entryRows = [];
lessons.forEach((lesson, lessonIndex) => {
  if (!Array.isArray(lesson.mots)) {
    throw new Error(`La liste d’entrées est absente pour ${lesson.titre || `la leçon ${lessonIndex + 1}`}.`);
  }

  lesson.mots.forEach((entry, entryIndex) => {
    if (!entry.g) return;
    entryRows.push([
      `L${String(lessonIndex + 1).padStart(2, "0")}-E${String(entryIndex + 1).padStart(2, "0")}`,
      lesson.titre || `Leçon ${lessonIndex + 1}`,
      entryIndex + 1,
      entry.g,
      entry.f || "",
      entry.p || "",
      entry.pProvisoire ? "Provisoire — à valider" : entry.p ? "Présente — à vérifier" : "Manquante",
      "",
      "",
      "",
      "",
      "",
      "",
      ""
    ]);
  });
});

const alphabetHeaders = [
  "Caractère rencontré dans l’application",
  "Nom de la lettre",
  "Son confirmé par le spécialiste",
  "Exemple Guidar validé",
  "Traduction de l’exemple",
  "Commentaires",
  "Nom du spécialiste",
  "Date de validation"
];
const alphabetCandidates = ["ə", "Ə", "ɗ", "ɓ", "ŋ", "Ŋ", "ɔ", "ǫ", "Ǫ", "ɛ", "ɨ", "ã", "ƴ"];

const syllableHeaders = [
  "Identifiant",
  "Consonne(s)",
  "Voyelle",
  "Syllabe validée",
  "Aide de prononciation",
  "Exemple de mot Guidar",
  "Traduction française",
  "Enregistrement validé",
  "Nom du spécialiste",
  "Date de validation",
  "Commentaires"
];

fs.mkdirSync(outputDirectory, { recursive: true });
writeCsv("validation-lexique.csv", entryHeaders, entryRows);
writeCsv("validation-alphabet.csv", alphabetHeaders, alphabetCandidates.map(character => [
  character,
  "",
  "",
  "",
  "",
  "Caractère déjà rencontré dans l’application ; alphabet complet et son à confirmer.",
  "",
  ""
]));
writeCsv("validation-syllabes.csv", syllableHeaders, []);

console.log(`${entryRows.length} entrée(s) exportée(s) depuis ${lessons.length} leçon(s).`);
console.log(`Fiches de validation créées dans ${outputDirectory}.`);
