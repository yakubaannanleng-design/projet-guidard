const VITESSE = 6000; // ms entre chaque mot en mode auto
const CLE_PROGRESS = "guidar-progress-v1";
const CLE_VALIDATION_AUDIO = "guidar-audio-validation-v1";
const CLE_PREFERENCES = "guidar-preferences-v1";

// ══════════════════════════════════════════════════
// ÉTAT
// ══════════════════════════════════════════════════
function chargerProgression() {
  const progression = { lecon: 0, mot: 0, vus: {}, sauvegardePresente: false };
  try {
    const sauvegarde = JSON.parse(localStorage.getItem(CLE_PROGRESS) || "null");
    if (!sauvegarde || typeof sauvegarde !== "object") return progression;
    progression.sauvegardePresente = true;
    if (Number.isInteger(sauvegarde.lecon) && sauvegarde.lecon >= 0 && sauvegarde.lecon < LECONS.length) {
      progression.lecon = sauvegarde.lecon;
    }
    if (Number.isInteger(sauvegarde.mot) && sauvegarde.mot >= 0 && sauvegarde.mot < LECONS[progression.lecon].mots.length) {
      progression.mot = sauvegarde.mot;
    }
    if (sauvegarde.vus && typeof sauvegarde.vus === "object" && !Array.isArray(sauvegarde.vus)) {
      Object.entries(sauvegarde.vus).forEach(([index, nombre]) => {
        const lecon = Number(index);
        if (Number.isInteger(lecon) && lecon >= 0 && lecon < LECONS.length &&
            Number.isInteger(nombre) && nombre >= 0 && nombre <= LECONS[lecon].mots.length) {
          progression.vus[lecon] = nombre;
        }
      });
    }
  } catch (error) {
    console.error("Impossible de lire la progression sauvegardée.", error);
  }
  return progression;
}

const progressionInitiale = chargerProgression();
let curL = progressionInitiale.lecon;
let curM = progressionInitiale.mot;
const vus = progressionInitiale.vus;
let autoPlay = false, tmr = null, lectureDifferee = null, kbOn = false, speechRun = 0, avertissementStockage = false;
let focusAvantMenu = null;
let audioEnCours = null;
let validationsAudio = chargerValidationsAudio();
let preferences = chargerPreferences();

function chargerValidationsAudio() {
  try {
    const sauvegarde = JSON.parse(localStorage.getItem(CLE_VALIDATION_AUDIO) || "{}");
    if (!sauvegarde || typeof sauvegarde !== "object" || Array.isArray(sauvegarde)) return {};
    return Object.fromEntries(Object.entries(sauvegarde).filter(([, etat]) =>
      etat === "conforme" || etat === "corriger"
    ));
  } catch (error) {
    console.error("Impossible de lire les validations audio sauvegardées.", error);
    return {};
  }
}

function cleValidationAudio(leconIndex, motIndex) {
  const entree = LECONS[leconIndex].mots[motIndex];
  return `${leconIndex}:${motIndex}:${entree.g || ""}:${entree.f || ""}`;
}

function sauvegarderValidationsAudio() {
  try {
    localStorage.setItem(CLE_VALIDATION_AUDIO, JSON.stringify(validationsAudio));
  } catch (error) {
    console.error("Impossible de sauvegarder les validations audio.", error);
    toast("La validation audio ne peut pas être sauvegardée sur cet appareil.");
  }
}

function marquerValidationAudio(etat) {
  if (etat !== "conforme" && etat !== "corriger") {
    console.error("État de validation audio invalide.", etat);
    return;
  }
  const cle = cleValidationAudio(curL, curM);
  if (validationsAudio[cle] === etat) delete validationsAudio[cle];
  else validationsAudio[cle] = etat;
  sauvegarderValidationsAudio();

  document.querySelectorAll(".audio-validation button").forEach(bouton => {
    const actif = validationsAudio[cle] === bouton.dataset.validation;
    bouton.classList.toggle("on", actif);
    bouton.setAttribute("aria-pressed", String(actif));
  });
}

function sauvegarderProgression() {
  try {
    localStorage.setItem(CLE_PROGRESS, JSON.stringify({ lecon: curL, mot: curM, vus }));
  } catch (error) {
    console.error("Impossible de sauvegarder la progression.", error);
    if (!avertissementStockage) {
      avertissementStockage = true;
      toast("La progression ne peut pas être sauvegardée sur cet appareil.");
    }
  }
}

// ══════════════════════════════════════════════════
