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
let jetonRendu = 0;

function show(idx) {
  const leconIndex = curL;
  curM = idx;
  const jeton = ++jetonRendu;
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
    if (jeton !== jetonRendu) return;
    if (!m.g) {
      // Mot note/titre — pas de texte Guidar
      main.innerHTML = `<div class="note-card">${echapperHtml(m.f)}</div>${navigationMots}`;
    } else {
      const cleAudio = cleValidationAudio(leconIndex, idx);
      const audioConforme = validationsAudio[cleAudio] === "conforme";
      const audioACorriger = validationsAudio[cleAudio] === "corriger";
      const phonetique = obtenirPhonetique(m);
      const noteValidation = LECONS[leconIndex].aValider
        ? '<p class="entry-validation">Transcription initiale : graphie et traduction à valider par un spécialiste.</p>'
        : "";
      main.innerHTML = `
        <div class="wg">${echapperHtml(m.g)}</div>
        ${phonetique ? `<div class="prononciation${phonetique.provisoire ? " prononciation-provisoire" : ""}" aria-label="${phonetique.provisoire ? "Aide de prononciation approximative, à valider" : "Aide de prononciation"}">${echapperHtml(phonetique.texte)}</div>` : ""}
        <div class="sep"></div>
        <div class="wf">${echapperHtml(m.f)}</div>
        ${statutAudioHtml(leconIndex, idx)}
        ${navigationMots}
        ${noteValidation}
        ${blocValidationAudio(leconIndex, idx, cleAudio, audioConforme, audioACorriger)}
      `;
    }
    // Fade in
    setTimeout(() => {
      if (jeton !== jetonRendu) return;
      main.querySelectorAll(".wg,.wf,.note-card").forEach(el => el.classList.remove("fade"));
    }, 30);

    // Compteur et progression
    document.getElementById("ctr").textContent = (idx+1) + " / " + mots.length;
    const pourcentage = Math.round((idx+1)/mots.length*100);
    const barre = document.getElementById("prog");
    barre.style.width = pourcentage + "%";
    barre.setAttribute("aria-valuenow", pourcentage);
    const annonce = document.getElementById("annonce");
    if (annonce) annonce.textContent = m.g ? (m.g + " — " + (m.f || "")) : (m.f || "");
    if (typeof mettreAJourAccueil === "function") mettreAJourAccueil();

  }, 220);
}

// ══════════════════════════════════════════════════
// ÉTAT DE L'ENREGISTREMENT AFFICHÉ SOUS LE MOT
// ══════════════════════════════════════════════════
function statutAudioHtml(leconIndex, motIndex) {
  const etat = etatAudio(leconIndex, motIndex);
  if (etat.etat === "desaligne") {
    return '<p class="statut-audio est-desaligne"><span aria-hidden="true">⚠</span> Enregistrement à revérifier : l’entrée a changé depuis l’enregistrement.</p>';
  }
  if (etat.etat === "disponible") {
    return '<p class="statut-audio est-disponible"><span aria-hidden="true">🎧</span> Enregistrement disponible.</p>';
  }
  return '<p class="statut-audio est-absent"><span aria-hidden="true">🎙</span> Enregistrement à venir : seule la traduction française est lue.</p>';
}

function blocValidationAudio(leconIndex, motIndex, cleAudio, audioConforme, audioACorriger) {
  const etat = etatAudio(leconIndex, motIndex);
  if (etat.etat !== "disponible") {
    return '<div class="audio-validation"><details><summary>Vérifier l’enregistrement</summary>' +
      '<div class="audio-validation-label">Aucun enregistrement pour cette entrée : la vérification sera possible dès que le fichier sera ajouté.</div>' +
      '</details></div>';
  }
  return '<div class="audio-validation"><details>' +
    '<summary>Vérifier l’enregistrement</summary>' +
    '<div class="audio-validation-label">Après écoute, indique si l’enregistrement correspond à cette entrée.</div>' +
    '<div class="audio-validation-fichier">' + echapperHtml(etat.fichier) + '</div>' +
    '<button type="button" data-validation="conforme" onclick="marquerValidationAudio(\'conforme\')"' +
    ' class="' + (audioConforme ? "on" : "") + '" aria-pressed="' + audioConforme + '">✓ Correspond</button>' +
    '<button type="button" data-validation="corriger" onclick="marquerValidationAudio(\'corriger\')"' +
    ' class="' + (audioACorriger ? "on" : "") + '" aria-pressed="' + audioACorriger + '">⚠ À corriger</button>' +
    '</details></div>';
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
  if (b) {
    b.textContent = autoPlay ? "⏸ Pause" : "▶ Auto";
    b.classList.toggle("on", autoPlay);
    b.setAttribute("aria-pressed", String(autoPlay));
  }
  clearTimeout(tmr);
  clearTimeout(lectureDifferee);
  lectureDifferee = null;
  stopBar();
  speechRun++;
  stopAudio();
  if (VOIX_OK) window.speechSynthesis.cancel();
  if (autoPlay) {
    lectureDifferee = setTimeout(() => {
      lectureDifferee = null;
      speak(() => { if (autoPlay) sched(); });
    }, 350);
  }
}

// ══════════════════════════════════════════════════
