// VOIX — robuste sur PC, Android Chrome et hors ligne
// ══════════════════════════════════════════════════
// L'application ne devine plus les noms de fichiers : le manifeste js/audio-manifest.js
// est la source de vérité. Il est produit par scripts\Audio-Tracking.cjs.
// ══════════════════════════════════════════════════
const VOIX_OK = typeof window !== "undefined" && "speechSynthesis" in window;
const MANIFESTE_AUDIO = (typeof AUDIO_MANIFEST !== "undefined" && AUDIO_MANIFEST && AUDIO_MANIFEST.lessons)
  ? AUDIO_MANIFEST.lessons
  : {};

function initVoix() {
  if (!VOIX_OK) return;
  // Précharge les voix — nécessaire sur Chrome
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.addEventListener(
      "voiceschanged", () => {}, { once: true }
    );
  }
}

// ══════════════════════════════════════════════════
// EMPREINTE D'UNE ENTRÉE
// Même algorithme que scripts\Audio-Tracking.cjs : elle permet de détecter
// un enregistrement qui ne correspond plus à l'entrée affichée.
// ══════════════════════════════════════════════════
function empreinte(texte) {
  let h = 0x811c9dc5;
  for (let i = 0; i < texte.length; i++) {
    h ^= texte.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}

// ══════════════════════════════════════════════════
// ÉTAT DE L'ENREGISTREMENT
// disponible : le fichier existe et correspond à l'entrée
// absent     : l'entrée n'a pas encore d'enregistrement
// desaligne  : le fichier existe mais l'entrée a changé depuis l'enregistrement
// ══════════════════════════════════════════════════
function numeroAudio(leconIndex, motIndex) {
  const lecon = LECONS[leconIndex];
  if (!lecon || !Array.isArray(lecon.mots)) return 0;
  let numero = 0;
  for (let index = 0; index <= motIndex && index < lecon.mots.length; index++) {
    if (lecon.mots[index].g) numero++;
  }
  return numero;
}

function etatAudio(leconIndex, motIndex) {
  const lecon = LECONS[leconIndex];
  const mot = lecon && lecon.mots[motIndex];
  if (!mot || !mot.g) return { etat: "absent", numero: 0, chemin: null };
  const numero = numeroAudio(leconIndex, motIndex);
  const entrees = MANIFESTE_AUDIO[String(leconIndex + 1)];
  const entree = entrees && entrees[String(numero)];
  if (!entree || !entree.f) return { etat: "absent", numero, chemin: null };
  const chemin = "audio_lecon" + (leconIndex + 1) + "/" + entree.f;
  if (entree.h && entree.h !== empreinte(mot.g + "|" + (mot.f || ""))) {
    return { etat: "desaligne", numero, chemin, fichier: entree.f };
  }
  return { etat: "disponible", numero, chemin, fichier: entree.f };
}

function proportionAudioLecon(leconIndex) {
  const lecon = LECONS[leconIndex];
  if (!lecon || !Array.isArray(lecon.mots)) return { disponibles: 0, total: 0 };
  let total = 0;
  let disponibles = 0;
  for (let index = 0; index < lecon.mots.length; index++) {
    if (!lecon.mots[index].g) continue;
    total++;
    if (etatAudio(leconIndex, index).etat === "disponible") disponibles++;
  }
  return { disponibles, total };
}

// ══════════════════════════════════════════════════
// SYNTHÈSE VOCALE
// ══════════════════════════════════════════════════
function lire(texte, vitesse, cb) {
  if (!VOIX_OK) { if (cb) cb(); return; }
  if (!texte || !texte.trim()) { if (cb) cb(); return; }
  const u = new SpeechSynthesisUtterance(texte);
  u.lang   = "fr-FR";
  u.rate   = (vitesse || 0.85) * preferences.vitesse;
  u.pitch  = 1;
  u.volume = 1;
  // Préférer une voix française si disponible
  const voix = window.speechSynthesis.getVoices().filter(v => v.lang.toLowerCase().startsWith("fr"));
  if (voix.length > 0) u.voice = voix[0];
  let termine = false;
  const terminer = delai => {
    if (termine) return;
    termine = true;
    if (cb) setTimeout(cb, delai);
  };
  u.onend   = () => terminer(500);
  u.onerror = () => terminer(200);
  window.speechSynthesis.speak(u);
}

function stopAudio() {
  if (!audioEnCours) return;
  audioEnCours.onended = null;
  audioEnCours.onerror = null;
  audioEnCours.pause();
  audioEnCours.removeAttribute("src");
  audioEnCours = null;
}

// ══════════════════════════════════════════════════
// LECTURE D'UNE ENTRÉE
// Ordre : enregistrement Guidar validé, puis traduction française.
// Sans enregistrement, seule la traduction est lue : l'application ne fabrique
// jamais une prononciation Guidar à partir d'une voix de synthèse française.
// ══════════════════════════════════════════════════
function speak(onComplete, explicite) {
  lireEntree(curL, curM, onComplete, explicite);
}

function lireEntree(leconIndex, motIndex, onComplete, explicite) {
  clearTimeout(lectureDifferee);
  lectureDifferee = null;
  const run = ++speechRun;
  stopAudio();
  if (VOIX_OK) window.speechSynthesis.cancel();
  if (autoPlay) {
    clearTimeout(tmr);
    stopBar();
  }

  const lecon = LECONS[leconIndex];
  const m = lecon && lecon.mots[motIndex];
  if (!m) {
    if (onComplete) onComplete();
    return;
  }

  const terminer = () => {
    if (run === speechRun && onComplete) onComplete();
  };
  const lireTraduction = () => {
    if (run !== speechRun) return;
    if (VOIX_OK) lire(propre(m.f), 0.88, terminer);
    else terminer();
  };
  const lireApproximation = () => {
    if (run !== speechRun) return;
    if (!VOIX_OK) {
      toast("La voix de synthèse n’est pas disponible dans ce navigateur.");
      terminer();
      return;
    }
    const phonetique = obtenirPhonetique(m);
    const son = phonetique ? propre(phonetique.texte) : propre(m.g);
    lire(son, 0.60, lireTraduction);
  };
  const lireSansEnregistrement = () => {
    if (preferences.approximationVocale) {
      lireApproximation();
      return;
    }
    if (explicite) {
      toast("Enregistrement Guidar à venir : seule la traduction française est lue.");
    }
    lireTraduction();
  };

  const enregistrement = etatAudio(leconIndex, motIndex);

  if (enregistrement.etat === "desaligne") {
    console.warn("Enregistrement désynchronisé.", enregistrement.chemin);
    toast("Cet enregistrement ne correspond plus à l’entrée : il faut le ré-enregistrer.");
    lireSansEnregistrement();
    return;
  }

  if (enregistrement.etat !== "disponible") {
    lireSansEnregistrement();
    return;
  }

  // Délai obligatoire après cancel() sur Android Chrome
  setTimeout(() => {
    if (run !== speechRun) return;
    const audio = new Audio();
    audioEnCours = audio;
    audio.preload = "auto";
    audio.playbackRate = preferences.vitesse || 1;
    let erreurTraitee = false;
    const surErreur = () => {
      if (erreurTraitee || run !== speechRun) return;
      erreurTraitee = true;
      audioEnCours = null;
      console.warn("Enregistrement illisible :", enregistrement.chemin);
      if (explicite) toast("Cet enregistrement est illisible : vérifie le fichier audio.");
      lireSansEnregistrement();
    };
    audio.onended = () => {
      if (run !== speechRun) return;
      audioEnCours = null;
      lireTraduction();
    };
    audio.onerror = surErreur;
    audio.src = encodeURI(enregistrement.chemin);
    audio.load();
    try {
      const lecture = audio.play();
      if (lecture && typeof lecture.catch === "function") lecture.catch(surErreur);
    } catch (error) {
      console.warn("Impossible de lire cet enregistrement audio.", enregistrement.chemin, error);
      surErreur();
    }
  }, 280);
}

// ══════════════════════════════════════════════════
