// NETTOYAGE POUR LA VOIX
// Remplace les caractères spéciaux par leur son approché
// ══════════════════════════════════════════════════
function propre(txt) {
  if (!txt) return "";
  return txt
    .replace(/[ƏƐ]/g,  "eu")
    .replace(/[əɛ]/g,  "eu")
    .replace(/ɗ/g,  "d")
    .replace(/ɓ/g,  "b")
    .replace(/ŋ/g,  "ng")
    .replace(/ɔ/g,  "o")
    .replace(/ɨ/g,  "i")
    .replace(/ã/g,  "an")
    .replace(/ƴ/g,  "y")
    .replace(/ʼ/g,  "")
    .replace(/[()./\[\]]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function obtenirPhonetique(mot) {
  if (!mot.p) return null;
  return { texte: mot.p, provisoire: mot.pProvisoire === true };
}

// ══════════════════════════════════════════════════
// AFFICHAGE
// ══════════════════════════════════════════════════
function show(idx) {
  const leconIndex = curL;
  curM = idx;
  const mots = LECONS[leconIndex].mots;
  const m    = mots[idx];
  const main = document.getElementById("main");
  const navigationMots = `
    <div class="word-navigation" aria-label="Navigation entre les mots de la leçon">
      <button type="button" onclick="go(-1)" aria-label="Mot précédent" title="Mot précédent"><span aria-hidden="true">◀</span></button>
      <button type="button" onclick="go(1)" aria-label="Mot suivant" title="Mot suivant"><span aria-hidden="true">▶</span></button>
    </div>`;
  vus[leconIndex] = Math.max(vus[leconIndex] || 0, idx + 1);
  sauvegarderProgression();

  // Fade out
  main.querySelectorAll(".wg,.wf,.note-card").forEach(el => el.classList.add("fade"));

  setTimeout(() => {
    if (curL !== leconIndex || curM !== idx) return;
    if (!m.g) {
      // Mot note/titre — pas de texte Guidar
      main.innerHTML = `<div class="note-card">${m.f}</div>${navigationMots}`;
    } else {
      const cleAudio = cleValidationAudio(leconIndex, idx);
      const audioConforme = validationsAudio[cleAudio] === "conforme";
      const audioACorriger = validationsAudio[cleAudio] === "corriger";
      const phonetique = obtenirPhonetique(m);
      const noteValidation = LECONS[leconIndex].aValider
        ? '<p class="entry-validation">Transcription initiale : graphie et traduction à valider par un spécialiste.</p>'
        : "";
      main.innerHTML = `
        <div class="wg">${m.g}</div>
        ${phonetique ? `<div class="prononciation${phonetique.provisoire ? " prononciation-provisoire" : ""}" aria-label="${phonetique.provisoire ? "Aide de prononciation approximative, à valider" : "Aide de prononciation"}">${phonetique.texte}</div>` : ""}
        <div class="sep"></div>
        <div class="wf">${m.f}</div>
        ${navigationMots}
        ${noteValidation}
        <div class="audio-validation"><details>
          <summary>Vérifier l’enregistrement</summary>
          <div class="audio-validation-label">Après écoute, indique si l’enregistrement correspond à cette entrée.</div>
          <button type="button" data-validation="conforme" onclick="marquerValidationAudio('conforme')"
            class="${audioConforme ? "on" : ""}" aria-pressed="${audioConforme}">✓ Correspond</button>
          <button type="button" data-validation="corriger" onclick="marquerValidationAudio('corriger')"
            class="${audioACorriger ? "on" : ""}" aria-pressed="${audioACorriger}">⚠ À corriger</button>
        </details></div>
      `;
    }
    // Fade in
    setTimeout(() => {
      main.querySelectorAll(".wg,.wf,.note-card").forEach(el => el.classList.remove("fade"));
    }, 30);

    // Compteur et progression
    document.getElementById("ctr").textContent = (idx+1) + " / " + mots.length;
    const pourcentage = Math.round((idx+1)/mots.length*100);
    const barre = document.getElementById("prog");
    barre.style.width = pourcentage + "%";
    barre.setAttribute("aria-valuenow", pourcentage);
    if (typeof mettreAJourAccueil === "function") mettreAJourAccueil();

  }, 220);
}

// ══════════════════════════════════════════════════
// TIMER BAR
// ══════════════════════════════════════════════════
function startBar() {
  const f = document.getElementById("tfill");
  f.style.transition = "none";
  f.style.transform  = "scaleX(1)";
  requestAnimationFrame(() => {
    f.style.transition = `transform ${VITESSE}ms linear`;
    f.style.transform  = "scaleX(0)";
  });
}
function stopBar() {
  const f = document.getElementById("tfill");
  const cs = getComputedStyle(f);
  f.style.transition = "none";
  f.style.transform  = cs.transform;
}

// ══════════════════════════════════════════════════
// NAVIGATION
// ══════════════════════════════════════════════════
function go(dir) {
  clearTimeout(tmr);
  clearTimeout(lectureDifferee);
  stopBar();
  speechRun++;
  stopAudio();
  if (VOIX_OK) window.speechSynthesis.cancel();
  const mots = LECONS[curL].mots;
  curM = ((curM + dir) % mots.length + mots.length) % mots.length;
  show(curM);
  if (autoPlay) {
    lectureDifferee = setTimeout(() => {
      lectureDifferee = null;
      speak(() => { if (autoPlay) sched(); });
    }, 350);
  }
}

function sched() {
  clearTimeout(tmr);
  startBar();
  tmr = setTimeout(() => go(1), VITESSE);
}

function toggleAuto() {
  autoPlay = !autoPlay;
  const b = document.getElementById("b-auto");
  if (b && autoPlay) {
    b.textContent = "⏸ Pause";
    b.classList.add("on");
    b.setAttribute("aria-pressed", "true");
    clearTimeout(tmr);
    stopBar();
    speechRun++;
    stopAudio();
    if (VOIX_OK) window.speechSynthesis.cancel();
    clearTimeout(lectureDifferee);
    lectureDifferee = setTimeout(() => {
      lectureDifferee = null;
      speak(() => { if (autoPlay) sched(); });
    }, 350);
  } else if (b) {
    b.textContent = "▶ Auto";
    b.classList.remove("on");
    b.setAttribute("aria-pressed", "false");
    clearTimeout(tmr);
    clearTimeout(lectureDifferee);
    lectureDifferee = null;
    stopBar();
    speechRun++;
    stopAudio();
    if (VOIX_OK) window.speechSynthesis.cancel();
  } else if (autoPlay) {
    clearTimeout(tmr);
    stopBar();
    speechRun++;
    stopAudio();
    if (VOIX_OK) window.speechSynthesis.cancel();
    lectureDifferee = setTimeout(() => {
      lectureDifferee = null;
      speak(() => { if (autoPlay) sched(); });
    }, 350);
  } else {
    clearTimeout(tmr);
    clearTimeout(lectureDifferee);
    lectureDifferee = null;
    stopBar();
    speechRun++;
    stopAudio();
    if (VOIX_OK) window.speechSynthesis.cancel();
  }
}

// ══════════════════════════════════════════════════
