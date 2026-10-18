// VOIX — robuste sur PC, Android Chrome et hors ligne
// ══════════════════════════════════════════════════
const VOIX_OK = typeof window !== "undefined" && "speechSynthesis" in window;

function initVoix() {
  if (!VOIX_OK) return;
  // Précharge les voix — nécessaire sur Chrome
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.addEventListener(
      "voiceschanged", () => {}, { once: true }
    );
  }
}

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

function pistesAudio(leconIndex, motIndex) {
  const mot = LECONS[leconIndex].mots[motIndex];
  if (!mot || !mot.g) return [];
  const numeroMot = LECONS[leconIndex].mots
    .slice(0, motIndex + 1)
    .filter(entree => entree.g).length;
  const numeroLecon = leconIndex + 1;
  const dossier = `audio_lecon${numeroLecon}/`;
  const noms = [String(numeroMot).padStart(3, "0")];
  if (numeroMot >= 10) {
    noms.push(String(numeroMot).padStart(4, "0"));
  }
  const prefixes = [`lecon${numeroLecon}`, `leçon${numeroLecon}`];
  const extensions = ["m4a", "mp3", "aac"];
  return [...new Set(prefixes.flatMap(prefix =>
    noms.flatMap(nom =>
      extensions.map(extension => `${dossier}${prefix}_${nom}.${extension}`)
    )
  ))];
}

function speak(onComplete) {
  lireEntree(curL, curM, onComplete);
}

function lireEntree(leconIndex, motIndex, onComplete) {
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

  // Délai obligatoire après cancel() sur Android Chrome
  setTimeout(() => {
    if (run !== speechRun) return;
    const sources = pistesAudio(leconIndex, motIndex);
    if (sources.length === 0) {
      lireTraduction();
      return;
    }

    const audio = new Audio();
    audioEnCours = audio;
    let sourceIndex = 0;
    const lireSourceSuivante = () => {
      if (run !== speechRun) return;
      if (sourceIndex >= sources.length) {
        audioEnCours = null;
        console.warn("Aucun enregistrement audio trouvé pour cette entrée.", sources);
        toast("Audio Guidar introuvable ou illisible : vérifie le nom et le format.");
        lireApproximation();
        return;
      }

      const indexActuel = sourceIndex++;
      let erreurTraitee = false;
      const essayerSourceSuivante = () => {
        if (erreurTraitee || run !== speechRun) return;
        erreurTraitee = true;
        lireSourceSuivante();
      };

      audio.onended = () => {
        if (run !== speechRun) return;
        audioEnCours = null;
        lireTraduction();
      };
      audio.onerror = essayerSourceSuivante;
      audio.src = encodeURI(sources[indexActuel]);
      audio.load();
      try {
        const lecture = audio.play();
        if (lecture && typeof lecture.catch === "function") {
          lecture.catch(essayerSourceSuivante);
        }
      } catch (error) {
        console.warn("Impossible de lire cet enregistrement audio.", sources[indexActuel], error);
        essayerSourceSuivante();
      }
    };
    lireSourceSuivante();
  }, 280);
}

// ══════════════════════════════════════════════════
