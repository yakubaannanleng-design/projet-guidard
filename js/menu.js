// MENU
// ══════════════════════════════════════════════════
function chargerPreferences() {
  const defaut = { texteGrand: false, contraste: false, masquerPhon: false, approximationVocale: false, vitesse: 1, tailleTexte: 1, theme: "light" };
  try {
    const enregistre = JSON.parse(localStorage.getItem(CLE_PREFERENCES) || "null");
    if (!enregistre || typeof enregistre !== "object" || Array.isArray(enregistre)) return defaut;
    return { texteGrand: enregistre.texteGrand === true, contraste: enregistre.contraste === true, masquerPhon: enregistre.masquerPhon === true, approximationVocale: enregistre.approximationVocale === true, vitesse: Number.isFinite(enregistre.vitesse) ? Math.min(1.25, Math.max(0.75, enregistre.vitesse)) : 1, tailleTexte: Number.isFinite(enregistre.tailleTexte) ? Math.min(1.2, Math.max(0.85, enregistre.tailleTexte)) : 1, theme: enregistre.theme === "dark" ? "dark" : "light" };
  } catch (error) { console.error("Impossible de lire les préférences sauvegardées.", error); return defaut; }
}
function appliquerPreferences() {
  document.body.classList.toggle("texte-agrandi", preferences.texteGrand);
  document.body.classList.toggle("contraste-renforce", preferences.contraste);
  document.body.classList.toggle("masquer-approximations", preferences.masquerPhon);
  document.body.classList.toggle("theme-dark", preferences.theme === "dark");
  document.body.style.setProperty("--taille-texte", preferences.tailleTexte);
}
function sauvegarderPreferences() {
  try { localStorage.setItem(CLE_PREFERENCES, JSON.stringify(preferences)); }
  catch (error) { console.error("Impossible de sauvegarder les préférences.", error); toast("Les préférences ne peuvent pas être sauvegardées sur cet appareil."); }
  appliquerPreferences();
}
function reinitialiserPreferences() {
  preferences = { texteGrand: false, contraste: false, masquerPhon: false, approximationVocale: false, vitesse: 1, tailleTexte: 1, theme: "light" };
  sauvegarderPreferences();
  ouvrirParametres();
  toast("Les réglages d’affichage ont été réinitialisés.");
}
let quizSession = null;
let menuOuvert = false;
let vueMenu = "menu";
let ecranFenetre = new URLSearchParams(window.location.search).get("ecran");
const SECTIONS_FENETRE = {
  accueil: "Accueil",
  lecons: "Leçons",
  lecteur: "Lecteur Guidar",
  ressources: "Bibliothèque",
  quiz: "Quiz",
  compte: "Compte"
};
function echapperHtml(texte) {
  const remplacements = { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" };
  return String(texte).replace(/[&<>"']/g, caractere => remplacements[caractere]);
}
function afficherMenu(titre, contenu, vue) {
  document.getElementById("menu-titre").textContent = titre;
  document.getElementById("menu-liste").innerHTML = contenu;
  document.getElementById("menu-liste").scrollTop = 0;
  vueMenu = vue || "menu";
}
function normaliserTexte(texte) {
  return String(texte || "")
    .toLocaleLowerCase("fr")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
function masquerResultatsRecherche() {
  const resultats = document.getElementById("search-results");
  resultats.hidden = true;
  resultats.innerHTML = "";
}
function rechercherApplication(requete) {
  const resultats = document.getElementById("search-results");
  const recherche = normaliserTexte(requete.trim());
  if (recherche.length < 2) {
    masquerResultatsRecherche();
    return;
  }
  const correspondances = LECONS.flatMap((lecon, leconIndex) =>
    lecon.mots.map((mot, motIndex) => ({ lecon, leconIndex, mot, motIndex }))
      .filter(({ mot }) => mot.g && mot.f &&
        (normaliserTexte(mot.g).includes(recherche) || normaliserTexte(mot.f).includes(recherche)))
  ).slice(0, 8);
  resultats.innerHTML = correspondances.length
    ? correspondances.map(({ lecon, leconIndex, mot, motIndex }) =>
      '<button type="button" class="search-result" onclick="ouvrirEntree(' + leconIndex + ',' + motIndex + ')"><strong>' +
      echapperHtml(mot.g) + '</strong><span>' + echapperHtml(mot.f) + ' · ' + echapperHtml(lecon.titre) + '</span></button>'
    ).join("")
    : '<div class="search-empty" role="status">Aucun résultat. Essaie un autre mot.</div>';
  resultats.hidden = false;
}
function gererClavierRecherche(event) {
  if (event.key === "Escape") {
    masquerResultatsRecherche();
    event.target.blur();
  } else if (event.key === "Enter") {
    const premierResultat = document.querySelector("#search-results .search-result");
    if (premierResultat) {
      event.preventDefault();
      premierResultat.click();
    }
  }
}
function effacerRecherche() {
  const champ = document.getElementById("global-search");
  champ.value = "";
  masquerResultatsRecherche();
  champ.focus();
}
function ouvrirEntree(leconIndex, motIndex) {
  if (!Number.isInteger(leconIndex) || leconIndex < 0 || leconIndex >= LECONS.length ||
      !Number.isInteger(motIndex) || motIndex < 0 || motIndex >= LECONS[leconIndex].mots.length) {
    console.error("Entrée de recherche invalide.", { leconIndex, motIndex });
    return;
  }
  if (menuOuvert) closeMenu();
  clearTimeout(tmr);
  clearTimeout(lectureDifferee);
  lectureDifferee = null;
  speechRun++;
  stopAudio();
  if (VOIX_OK) window.speechSynthesis.cancel();
  curL = leconIndex;
  curM = motIndex;
  document.getElementById("hdr-lecon").textContent = LECONS[leconIndex].titre;
  masquerResultatsRecherche();
  show(motIndex);
}
function commencerApprentissage() {
  if (ecranFenetre === "accueil") {
    naviguerEcranFenetre("lecons");
    return;
  }
  masquerResultatsRecherche();
  document.getElementById("main").focus({ preventScroll: true });
  speak(undefined, true);
}
function mettreAJourAccueil() {
  const nombreTotal = LECONS.reduce((total, lecon) => total + lecon.mots.filter(mot => mot.g).length, 0);
  const nombreVu = LECONS.reduce((total, lecon, index) => {
    const limite = Math.min(vus[index] || 0, lecon.mots.length);
    return total + lecon.mots.reduce((compte, mot, motIndex) => compte + (mot.g && motIndex < limite ? 1 : 0), 0);
  }, 0);
  const pourcentage = nombreTotal ? Math.round(nombreVu / nombreTotal * 100) : 0;
  const compte = document.getElementById("home-progress-count");
  const barre = document.getElementById("home-progress-bar");
  const remplissage = document.getElementById("home-progress-fill");
  const lecon = document.getElementById("home-current-lesson");
  if (!compte || !barre || !remplissage || !lecon) return;
  compte.textContent = nombreVu + " / " + nombreTotal + " entrées consultées";
  barre.setAttribute("aria-valuenow", pourcentage);
  remplissage.style.width = pourcentage + "%";
  lecon.textContent = "Leçon en cours · " + LECONS[curL].titre;
}
function actionBoutonEcouter() {
  if (ecranFenetre === "lecteur") {
    speak(undefined, true);
    return;
  }
  naviguerEcranFenetre("lecteur");
}
function naviguerEcranFenetre(section) {
  if (!Object.prototype.hasOwnProperty.call(SECTIONS_FENETRE, section)) {
    console.error("Section GuidarApp inconnue.", section);
    toast("Impossible d’ouvrir cette section.");
    return;
  }
  ecranFenetre = section;
  const url = new URL(window.location.href);
  url.searchParams.set("ecran", section);
  window.history.replaceState(null, "", url);
  document.body.dataset.sectionWindow = section;
  document.querySelectorAll("[data-window-section]").forEach(bouton => {
    const actif = bouton.dataset.windowSection === section;
    bouton.classList.toggle("active", actif);
    if (actif) bouton.setAttribute("aria-current", "page");
    else bouton.removeAttribute("aria-current");
  });
  document.getElementById("section-toolbar").innerHTML = section === "accueil"
    ? ""
    : '<strong>' + SECTIONS_FENETRE[section] + '</strong>' +
      (section === "lecons" ? '<button type="button" class="section-action-button" onclick="ouvrirLeconsMenu()">Choisir une leçon</button>' : "") +
      (section === "lecteur" ? '<button type="button" class="section-action-button" onclick="ouvrirLeconsMenu()">Choisir une leçon</button><button type="button" class="section-action-button" onclick="speak(undefined, true)">🔊 Écouter</button>' : "");
  document.getElementById("section-toolbar").hidden = section === "accueil";
  mettreAJourAccueil();
  if (menuOuvert) closeMenu();
  if (section === "ressources") {
    openMenu();
    afficherBibliotheque();
  } else if (section === "quiz") {
    openMenu();
    ouvrirQuiz();
  } else if (section === "compte") {
    openMenu();
    afficherMenu("Compte", '<div class="account-preview"><div class="account-avatar" aria-hidden="true">👤</div><h2>Espace compte</h2><p>Les fonctions de compte arrivent dans une prochaine version.</p></div>' +
      '<div class="account-features"><div class="account-feature"><span aria-hidden="true">👤</span><div><strong>Profil</strong><small>Gérer les informations du compte</small></div><b>À venir</b></div>' +
      '<div class="account-feature"><span aria-hidden="true">☁️</span><div><strong>Synchronisation</strong><small>Retrouver ta progression sur tes appareils</small></div><b>À venir</b></div>' +
      '<div class="account-feature"><span aria-hidden="true">💾</span><div><strong>Sauvegarde</strong><small>Conserver et restaurer tes données d’apprentissage</small></div><b>À venir</b></div></div>' +
      '<div class="module-note">En attendant, la progression et les préférences restent enregistrées sur cet appareil.</div>', "compte");
  }
}
function initialiserSectionFenetre() {
  if (!Object.prototype.hasOwnProperty.call(SECTIONS_FENETRE, ecranFenetre)) {
    ecranFenetre = null;
    document.body.querySelector('[data-window-section="accueil"]').setAttribute("aria-current", "page");
    return;
  }
  naviguerEcranFenetre(ecranFenetre);
}
function retourAccueil() {
  if (ecranFenetre) {
    naviguerEcranFenetre("accueil");
    return;
  }
  masquerResultatsRecherche();
  if (menuOuvert) closeMenu();
  document.getElementById("main").scrollTop = 0;
  toast("Tu es sur ton espace d’apprentissage.");
}
function afficherCompte() {
  naviguerEcranFenetre("compte");
}
function melangerTableau(elements) {
  const resultat = elements.slice();
  for (let index = resultat.length - 1; index > 0; index--) {
    const autreIndex = Math.floor(Math.random() * (index + 1));
    [resultat[index], resultat[autreIndex]] = [resultat[autreIndex], resultat[index]];
  }
  return resultat;
}
function ouvrirQuiz() {
  if (!menuOuvert) openMenu();
  quizSession = null;
  const toutesEntrees = obtenirEntreesQuiz(-1);
  const nombreToutesQuestions = Math.min(10, toutesEntrees.length);
  const cartes = ['<button type="button" class="quiz-category" ' +
    (toutesEntrees.length < 4 ? "disabled" : 'onclick="demarrerQuiz(-1)"') +
    '><span class="quiz-category-icon" aria-hidden="true">🌍</span><span class="quiz-category-copy"><span class="quiz-category-title">Toutes les leçons</span><span class="quiz-category-meta">' +
    (toutesEntrees.length < 4 ? "Quiz bientôt disponible" : nombreToutesQuestions + " questions") +
    '</span></span></button>'];
  LECONS.forEach((lecon, index) => {
    const nombreEntrees = obtenirEntreesQuiz(index).length;
    const disponible = nombreEntrees >= 4;
    cartes.push('<button type="button" class="quiz-category" ' +
      (disponible ? 'onclick="demarrerQuiz(' + index + ')"' : "disabled") +
      '><span class="quiz-category-icon" aria-hidden="true">' + echapperHtml(lecon.icone || "📘") +
      '</span><span class="quiz-category-copy"><span class="quiz-category-title">' + echapperHtml(lecon.titre) +
      '</span><span class="quiz-category-meta">' +
      (disponible ? Math.min(10, nombreEntrees) + " questions" : "Quiz bientôt disponible") +
      '</span></span></button>');
  });
  afficherMenu("Quiz par leçon", '<div class="module-note"><strong>Choisis une catégorie pour jouer.</strong><br>Réponds aux questions en sélectionnant le mot Guidar qui correspond à sa traduction française.</div>' +
    '<h2 class="menu-section-title">Catégories de quiz</h2><div class="quiz-categories">' + cartes.join("") + '</div>' +
    '<div class="quiz-notice">Les questions utilisent les contenus actuels des leçons, qui doivent encore être validés par un spécialiste.</div>', "quiz");
}
function obtenirEntreesQuiz(choixLecon) {
  const source = choixLecon === -1
    ? LECONS.flatMap((lecon, leconIndex) => lecon.mots.map(mot => ({ mot, leconIndex })))
    : LECONS[choixLecon].mots.map(mot => ({ mot, leconIndex: choixLecon }));
  const vusGuidar = new Set();
  const vuesTraductions = new Set();
  return source.filter(({ mot }) => {
    if (!mot.g || !mot.f) return false;
    const guidar = normaliserTexte(mot.g.trim());
    const francais = normaliserTexte(mot.f.trim());
    if (vusGuidar.has(guidar) || vuesTraductions.has(francais) || !francais) return false;
    vusGuidar.add(guidar);
    vuesTraductions.add(francais);
    return true;
  });
}
function demarrerQuiz(choixLecon = -1) {
  if (!Number.isInteger(choixLecon) || choixLecon < -1 || choixLecon >= LECONS.length) {
    console.error("Parcours de quiz invalide.", choixLecon);
    toast("Impossible de démarrer ce quiz. Choisis un parcours valide.");
    return;
  }
  const entrees = obtenirEntreesQuiz(choixLecon);
  if (entrees.length < 4) {
    afficherMenu("Quiz indisponible", '<div class="module-note">Cette catégorie ne contient pas encore assez de réponses distinctes pour proposer un quiz fiable.</div><button type="button" class="resource-back" onclick="ouvrirQuiz()">Choisir une autre catégorie</button>', "quiz");
    return;
  }
  const questions = melangerTableau(entrees).map(({ mot, leconIndex }) => {
    const traduction = normaliserTexte(mot.f.trim());
    const distracteurs = melangerTableau(entrees.filter(entree =>
      normaliserTexte(entree.mot.g.trim()) !== normaliserTexte(mot.g.trim()) &&
      normaliserTexte(entree.mot.f.trim()) !== traduction
    )).slice(0, 3);
    return distracteurs.length === 3 ? {
      question: mot,
      leconIndex,
      choix: melangerTableau([mot, ...distracteurs.map(entree => entree.mot)]),
      repondu: false,
      correct: false
    } : null;
  }).filter(Boolean).slice(0, 10);
  if (questions.length === 0) {
    toast("Ce parcours n’a pas assez de traductions distinctes pour créer des questions.");
    return;
  }
  quizSession = { questions, index: 0, score: 0, choixLecon };
  afficherQuestionQuiz();
}
function afficherQuestionQuiz() {
  if (!quizSession) return;
  if (quizSession.index >= quizSession.questions.length) {
    const total = quizSession.questions.length;
    const score = quizSession.score;
    const message = score === total ? "Excellent, sans faute !" : score >= Math.ceil(total * 0.7) ? "Bravo, tu progresses bien !" : "Continue à t’entraîner, tu vas y arriver !";
    afficherMenu("Quiz terminé", '<div class="quiz-score"><span class="quiz-score-value">' + score + ' / ' + total + '</span><strong>' + message + '</strong><span>bonnes réponses</span></div>' +
      '<button type="button" class="quiz-primary" onclick="demarrerQuiz(' + quizSession.choixLecon + ')">Recommencer <span aria-hidden="true">↻</span></button>' +
      '<button type="button" class="resource-back quiz-back" onclick="openMenu()">Retour au menu</button>', "quiz-resultat");
    return;
  }
  const question = quizSession.questions[quizSession.index];
  const boutons = question.choix.map((choix, index) => {
    let classe = "quiz-answer";
    if (question.repondu && choix.g === question.question.g) classe += " quiz-correct";
    else if (question.repondu && question.choix[index].g === question.choix[question.selection]?.g) classe += " quiz-wrong";
    return '<button type="button" class="' + classe + '" ' + (question.repondu ? "disabled" : "") +
      ' onclick="repondreQuiz(' + index + ')"><span class="quiz-answer-index">' + String.fromCharCode(65 + index) +
      '</span><span>' + echapperHtml(choix.g) + '</span></button>';
  }).join("");
  const retour = question.repondu
    ? '<div class="quiz-feedback ' + (question.correct ? "is-correct" : "is-wrong") + '" role="status">' +
      (question.correct ? "Bonne réponse !" : "La bonne réponse est : " + echapperHtml(question.question.g)) +
      '</div><button type="button" class="quiz-primary" onclick="questionQuizSuivante()">' +
      (quizSession.index + 1 === quizSession.questions.length ? "Voir mon résultat" : "Question suivante") + ' <span aria-hidden="true">→</span></button>'
    : "";
  afficherMenu("Quiz Guidar", '<div class="quiz-progress"><span>Question ' + (quizSession.index + 1) + ' sur ' + quizSession.questions.length +
    '</span><span>Score : ' + quizSession.score + '</span></div><div class="quiz-progress-track"><span style="width:' +
    Math.round(quizSession.index / quizSession.questions.length * 100) + '%"></span></div>' +
    '<div class="quiz-question-label">Comment dit-on en Guidar ?</div><div class="quiz-question">' +
    echapperHtml(question.question.f) + '</div><div class="quiz-answers">' + boutons + '</div>' + retour +
    '<div class="quiz-notice">Les réponses utilisent le contenu existant, qui reste à valider par un spécialiste.</div>', "quiz");
}
function repondreQuiz(index) {
  if (!quizSession || !Number.isInteger(index)) return;
  const question = quizSession.questions[quizSession.index];
  if (!question || question.repondu || index < 0 || index >= question.choix.length) return;
  question.selection = index;
  question.repondu = true;
  question.correct = question.choix[index].g === question.question.g;
  if (question.correct) quizSession.score++;
  afficherQuestionQuiz();
}
function questionQuizSuivante() {
  if (!quizSession || !quizSession.questions[quizSession.index]?.repondu) return;
  quizSession.index++;
  afficherQuestionQuiz();
}
function ouvrirAide() {
  openMenu();
  afficherMenu("Guide de navigation",
    '<div class="module-note"><strong>Bienvenue dans GuidarApp.</strong><br>Utilise les gestes ou le pavé fléché pour passer d’un mot à l’autre. Le bouton central permet d’écouter le Guidar puis sa traduction.</div>' +
    '<h2 class="menu-section-title">Pour apprendre</h2>' +
    '<button type="button" class="menu-card" onclick="closeMenu();document.getElementById(\'global-search\').focus()"><span class="menu-card-icon" aria-hidden="true">⌕</span><span><span class="menu-card-title">Rechercher un mot</span><span class="menu-card-description">Écris en Guidar ou en français dans la barre de recherche.</span></span></button>' +
    '<button type="button" class="menu-card" onclick="afficherBibliotheque()"><span class="menu-card-icon" aria-hidden="true">▤</span><span><span class="menu-card-title">Ouvrir les ressources</span><span class="menu-card-description">Parcourir les mots par thème.</span></span></button>' +
    '<div class="module-note">Les prononciations provisoires sont signalées. Les contenus en attente de validation ne remplacent pas l’avis d’un spécialiste.</div>' +
    '<button type="button" class="resource-back" onclick="closeMenu()">Fermer le guide</button>', "aide");
}
function afficherNotifications() {
  openMenu();
  afficherMenu("Notifications",
    '<div class="module-note"><strong>Tu es à jour.</strong><br>Aucune nouvelle notification pour le moment. Les contenus à valider sont indiqués directement dans les leçons.</div>' +
    '<button type="button" class="resource-back" onclick="closeMenu()">Fermer</button>', "notifications");
}
function ouvrirAlphabet() {
  if (!menuOuvert) openMenu();
  const exemples = ["ə", "Ə", "ɗ", "ɓ", "ŋ", "Ŋ", "ɔ", "ǫ", "Ǫ", "ɛ", "ɨ", "ã", "ƴ"];
  const boutons = exemples.map(caractere => '<button type="button" onclick="kopy(\'' + caractere + '\')" aria-label="Copier ' + caractere + '">' + caractere + '</button>').join("");
  afficherMenu("Alphabet et syllabes", '<div class="module-note"><strong>Première étape pour apprendre le Guidar.</strong><br>Les lettres affichées sont des caractères rencontrés dans les contenus déjà fournis, pas encore un alphabet complet validé.</div>' +
    '<h2 class="menu-section-title">Caractères à étudier</h2><div class="alphabet-samples">' + boutons + '</div>' +
    '<div class="module-note">Clique sur un caractère : il est inséré dans le champ de recherche s’il est actif, sinon copié. Pour saisir un mot en Guidar, ouvre d’abord la recherche puis le clavier Guidar.</div>' +
    '<div class="module-note"><strong>Parcours à compléter avec le spécialiste :</strong><br>ordre de l’alphabet · nom et son des lettres · voyelles et consonnes · syllabes simples puis combinées · exemples et enregistrements. Aucun son non confirmé n’est enseigné ici.</div>' +
    '<p class="content-status">Fondations en préparation et à valider</p><br><br><button type="button" class="resource-back" onclick="openMenu()">← Retour au menu</button>', "alphabet");
}
function afficherBibliotheque(filtre = "", categorieChoisie = -1) {
  if (document.getElementById("menu").style.display !== "flex") openMenu();
  const recherche = filtre.trim().toLocaleLowerCase("fr");
  const inclusions = Number.isInteger(categorieChoisie) && categorieChoisie >= 0 && categorieChoisie < LECONS.length
    ? [categorieChoisie]
    : LECONS.map((_, index) => index);
  const entrees = inclusions.flatMap(leconIndex => (LECONS[leconIndex]?.mots || []).map((mot, motIndex) => ({ mot, lecon: LECONS[leconIndex], leconIndex, motIndex })))
    .filter(({ mot }) => mot.g && mot.f && (mot.g.toLocaleLowerCase("fr").includes(recherche) || mot.f.toLocaleLowerCase("fr").includes(recherche)));
  const resultats = entrees.length
    ? entrees.map(({ mot, lecon, leconIndex, motIndex }) => '<article class="resource-result"><div class="resource-result-heading"><div class="resource-guidar">' + echapperHtml(mot.g) + '</div><button type="button" class="resource-play" onclick="lireEntree(' + leconIndex + ',' + motIndex + ')" aria-label="Écouter ' + echapperHtml(mot.g) + ' et sa traduction ' + echapperHtml(mot.f) + '" title="Écouter le mot et sa traduction"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4h4l5 4V6l-5 4z"/><path d="M17 9a5 5 0 0 1 0 6M19 6a9 9 0 0 1 0 12"/></svg></button></div><div class="resource-translation">' + echapperHtml(mot.f) + '</div><div class="resource-meta">' + echapperHtml(lecon.titre) + (mot.pProvisoire ? ' · prononciation provisoire' : !mot.p ? ' · prononciation à compléter/valider' : '') + '</div></article>').join("")
    : '<p class="module-note">Aucun résultat pour cette recherche. Essayez un autre mot ou un autre thème.</p>';
  const selecteur = '<label class="menu-section-title" for="resource-category">Leçon</label><select class="resource-search" id="resource-category" aria-label="Filtrer par leçon" onchange="afficherBibliotheque(document.getElementById(\'resource-search\').value, Number(this.value))"><option value="-1">Toutes les leçons</option>' +
    LECONS.map((lecon, index) => '<option value="' + index + '" ' + (categorieChoisie === index ? 'selected' : '') + '>' + echapperHtml(lecon.titre) + '</option>').join("") + '</select>';
  const rechercheHtml = '<label class="menu-section-title" for="resource-search">Recherche</label><input class="resource-search" id="resource-search" type="search" value="' + echapperHtml(filtre) + '" placeholder="Guidar ou français…" oninput="afficherBibliotheque(this.value, Number(document.getElementById(\'resource-category\').value))">';
  afficherMenu("Bibliothèque numérique", '<div class="module-note">Ressources classées par leçon. Appuie sur le bouton haut-parleur de chaque mot pour écouter l’enregistrement Guidar, puis sa traduction. Si aucun enregistrement n’est disponible, une aide vocale de synthèse est proposée. Les graphies et traductions restent à valider par un spécialiste.</div>' + selecteur + rechercheHtml + '<p class="resource-meta" role="status">' + entrees.length + ' résultat(s)</p>' + resultats + '<button type="button" class="resource-back" onclick="openMenu()">← Retour au menu</button>');
  const champ = document.getElementById("resource-search"); champ.focus(); champ.setSelectionRange(champ.value.length, champ.value.length);
}
function ouvrirParametres() {
  if (document.getElementById("menu").style.display !== "flex") openMenu();
  const switcher = (nom, titre, description, active, symbole) => '<label class="settings-row"><span class="settings-icon" aria-hidden="true">' + symbole + '</span><span class="settings-copy"><strong>' + titre + '</strong><small>' + description + '</small></span><input type="checkbox" aria-label="' + titre + '" ' + (active ? 'checked' : '') + ' onchange="preferences.' + nom + '=this.checked;sauvegarderPreferences()"></label>';
  const groupe = (titre, contenu) => '<section class="settings-group"><h2>' + titre + '</h2><div class="settings-card">' + contenu + '</div></section>';
  const theme = '<div class="settings-row"><span class="settings-icon" aria-hidden="true">◐</span><span class="settings-copy"><strong>Thème</strong><small>Choisis une apparence claire ou sombre.</small></span><div class="theme-choice"><button type="button" aria-pressed="' + (preferences.theme === "light") + '" onclick="preferences.theme=\'light\';sauvegarderPreferences();ouvrirParametres()">Clair</button><button type="button" aria-pressed="' + (preferences.theme === "dark") + '" onclick="preferences.theme=\'dark\';sauvegarderPreferences();ouvrirParametres()">Sombre</button></div></div>';
  const taille = '<label class="settings-row"><span class="settings-icon" aria-hidden="true">A</span><span class="settings-copy"><strong>Taille du texte</strong><small>Ajuste la lecture des mots et des traductions.</small></span><input type="range" min="0.85" max="1.2" step="0.05" value="' + preferences.tailleTexte + '" aria-label="Taille du texte" oninput="preferences.tailleTexte=Number(this.value);document.getElementById(\'taille-texte-affichee\').textContent=Math.round(preferences.tailleTexte*100)+\'%\';sauvegarderPreferences()"><span id="taille-texte-affichee" class="setting-value">' + Math.round(preferences.tailleTexte * 100) + '%</span></label>';
  const vitesse = '<label class="settings-row"><span class="settings-icon" aria-hidden="true">♫</span><span class="settings-copy"><strong>Vitesse de lecture</strong><small>Règle la vitesse de la voix de synthèse.</small></span><input type="range" min="0.75" max="1.25" step="0.05" value="' + preferences.vitesse + '" aria-label="Vitesse de lecture" oninput="preferences.vitesse=Number(this.value);document.getElementById(\'vitesse-affichee\').textContent=Math.round(preferences.vitesse*100)+\'%\';sauvegarderPreferences()"><span id="vitesse-affichee" class="setting-value">' + Math.round(preferences.vitesse * 100) + '%</span></label>';
  const contenu = '<div class="settings-intro">Personnalise ton expérience. Ces réglages restent enregistrés sur cet appareil.</div>' +
    groupe("Affichage", theme + taille) +
    groupe("Accessibilité", switcher("texteGrand", "Texte agrandi", "Agrandir les mots et leur traduction.", preferences.texteGrand, "↕") + switcher("contraste", "Contraste renforcé", "Améliorer la lisibilité des éléments.", preferences.contraste, "◑")) +
    groupe("Apprentissage", vitesse + switcher("masquerPhon", "Masquer les aides provisoires", "Afficher uniquement les prononciations confirmées.", preferences.masquerPhon, "◉")) +
    '<p class="settings-note">La voix française de synthèse est une aide ; elle ne remplace pas un enregistrement Guidar validé.</p><button type="button" class="resource-back" onclick="reinitialiserPreferences()">Rétablir les réglages par défaut</button><button type="button" class="resource-back" onclick="openMenu()">← Retour au menu</button>';
  afficherMenu("Paramètres", contenu);
}
function ouvrirClavierDepuisMenu() { closeMenu(); if (!kbOn) toggleKb(); }
function ouvrirLeconsMenu() {
  if (document.getElementById("menu").style.display !== "flex") openMenu();
  const lecons = LECONS.map((lecon, index) => {
    const nombreVu = Math.min(vus[index] || 0, lecon.mots.length);
    const terminee = lecon.mots.length > 1 && nombreVu === lecon.mots.length;
    const audiosValides = lecon.mots.filter((mot, motIndex) => mot.g && validationsAudio[cleValidationAudio(index, motIndex)] === "conforme").length;
    const nombreAudios = lecon.mots.filter(mot => mot.g).length;
    const actif = index === curL;
    return '<button type="button" class="menu-item" onclick="chooseLecon(' + index + ')" ' + (actif ? 'aria-current="page"' : '') + ' style="background:' + (actif ? 'var(--accent-soft)' : 'var(--surface)') + ';border:1px solid ' + (actif ? 'var(--accent)' : 'var(--line)') + '"><span class="mi-ico">' + echapperHtml(lecon.icone || "📘") + '</span><div class="mi-txt"><div class="mi-titre">' + echapperHtml(lecon.titre) + '</div><div class="mi-count">' + nombreVu + ' / ' + lecon.mots.length + ' entrée(s) vues' + (terminee ? ' — Leçon terminée ✓' : '') + '</div><div class="mi-count">' + audiosValides + ' / ' + nombreAudios + ' audio(s) confirmé(s)</div></div>' + (actif ? '<span class="mi-check">✓</span>' : '<span class="menu-index-arrow" aria-hidden="true">›</span>') + '</button>';
  }).join("");
  afficherMenu("Choisir une leçon", '<p class="menu-subtitle">Parcours les leçons et reprends où tu veux.</p>' + lecons + '<button type="button" class="resource-back" onclick="openMenu()">← Menu principal</button>');
}
function openMenu() {
  if (document.getElementById("menu").style.display !== "flex") focusAvantMenu = document.activeElement;
  masquerResultatsRecherche();
  clearTimeout(tmr); clearTimeout(lectureDifferee); lectureDifferee = null;
  if (autoPlay) toggleAuto();
  speechRun++; stopAudio(); if (VOIX_OK) window.speechSynthesis.cancel();
  const liste = document.getElementById("menu-liste");
  document.getElementById("menu-titre").textContent = "Plus d’options";
  const rubrique = (titre, items) => '<h2 class="menu-section-title">' + titre + '</h2><div class="menu-index-group">' + items + '</div>';
  const item = (icone, titre, description, action) => '<button type="button" class="menu-index-item" onclick="' + action + '"><span class="menu-index-icon" aria-hidden="true">' + icone + '</span><span class="menu-index-copy"><strong>' + titre + '</strong><small>' + description + '</small></span><span class="menu-index-arrow" aria-hidden="true">›</span></button>';
  liste.innerHTML = '<p class="menu-index-intro">Accès rapide aux rubriques de GuidarApp.</p>' +
    rubrique("Apprendre", item("📘", "Leçons", "Choisir une leçon et suivre son avancement", "ouvrirLeconsMenu()") + item("📚", "Bibliothèque", "Rechercher et écouter les entrées", "afficherBibliotheque()") + item("✓", "Quiz", "Réviser les mots des leçons", "ouvrirQuiz()") + item("🔠", "Alphabet et syllabes", "Parcourir les bases de l’écriture", "ouvrirAlphabet()")) +
    rubrique("Outils", item("▶", "Lecture automatique", "Écouter et faire défiler les entrées", "basculerLectureAutomatique()") + item("⌨️", "Clavier Guidar", "Accéder aux caractères spéciaux", "ouvrirClavierDepuisMenu()") + item("⚙️", "Paramètres", "Affichage, accessibilité et lecture", "ouvrirParametres()")) +
    rubrique("Espace personnel", item("👤", "Compte", "Profil et fonctions à venir", "naviguerEcranFenetre('compte')"));
  const menu = document.getElementById("menu"); menu.style.display = "flex"; menu.setAttribute("aria-hidden", "false"); menu.querySelector(".menu-close").focus();
}
function basculerLectureAutomatique() {
  closeMenu();
  toggleAuto();
}
function retourEcranPrecedent() {
  const titre = document.getElementById("menu-titre").textContent;
  if (quizSession && (titre === "Quiz Guidar" || titre === "Quiz terminé")) {
    ouvrirQuiz();
    return;
  }
  if (titre === "Plus d’options") {
    if (ecranFenetre) {
      if (["ressources", "quiz", "compte"].includes(ecranFenetre)) naviguerEcranFenetre("accueil");
      else closeMenu();
      return;
    }
    closeMenu();
    return;
  }
  openMenu();
}
function closeMenu() {
  const menu = document.getElementById("menu");
  const cibleFocus = focusAvantMenu && !menu.contains(focusAvantMenu)
    ? focusAvantMenu
    : ecranFenetre ? document.getElementById("main") : document.querySelector(".nav-item");
  menu.style.display = "none";
  menu.setAttribute("aria-hidden", "true");
  if (cibleFocus && cibleFocus.focus) cibleFocus.focus();
}

function chooseLecon(i) {
  if (!Number.isInteger(i) || i < 0 || i >= LECONS.length) {
    console.error("Index de leçon invalide.", i);
    return;
  }
  clearTimeout(tmr);
  clearTimeout(lectureDifferee);
  lectureDifferee = null;
  speechRun++;
  stopAudio();
  if (VOIX_OK) window.speechSynthesis.cancel();
  curL = i; curM = 0;
  focusAvantMenu = ecranFenetre ? document.getElementById("main") : document.querySelector(".bbar button");
  closeMenu();
  document.getElementById("hdr-lecon").textContent = LECONS[i].titre;
  show(0);
}

// ══════════════════════════════════════════════════
