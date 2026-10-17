// MENU
// ══════════════════════════════════════════════════
function chargerPreferences() {
  const defaut = { texteGrand: false, contraste: false, masquerPhon: false, vitesse: 1 };
  try {
    const enregistre = JSON.parse(localStorage.getItem(CLE_PREFERENCES) || "null");
    if (!enregistre || typeof enregistre !== "object" || Array.isArray(enregistre)) return defaut;
    return { texteGrand: enregistre.texteGrand === true, contraste: enregistre.contraste === true, masquerPhon: enregistre.masquerPhon === true, vitesse: Number.isFinite(enregistre.vitesse) ? Math.min(1.25, Math.max(0.75, enregistre.vitesse)) : 1 };
  } catch (error) { console.error("Impossible de lire les préférences sauvegardées.", error); return defaut; }
}
function appliquerPreferences() {
  document.body.classList.toggle("texte-agrandi", preferences.texteGrand);
  document.body.classList.toggle("contraste-renforce", preferences.contraste);
  document.body.classList.toggle("masquer-approximations", preferences.masquerPhon);
}
function sauvegarderPreferences() {
  try { localStorage.setItem(CLE_PREFERENCES, JSON.stringify(preferences)); }
  catch (error) { console.error("Impossible de sauvegarder les préférences.", error); toast("Les préférences ne peuvent pas être sauvegardées sur cet appareil."); }
  appliquerPreferences();
}
const CATEGORIES_NUMERIQUES = [
  { titre: "Salutations et expressions", icone: "💬", lecons: [0, 7] },
  { titre: "Nombres", icone: "🔢", lecons: [1] },
  { titre: "Famille", icone: "👨‍👩‍👧", lecons: [2] },
  { titre: "Corps humain", icone: "🧍", lecons: [3] },
  { titre: "Temps et moments de la journée", icone: "🕒", lecons: [4] },
  { titre: "Jours de la semaine", icone: "📅", lecons: [5] },
  { titre: "Mois de l’année", icone: "🗓️", lecons: [6] },
  { titre: "Verbes et conjugaison", icone: "🗣️", lecons: [8] },
  { titre: "Vocabulaire et culture", icone: "🌱", lecons: [9] },
  { titre: "Dialogue", icone: "💬", lecons: [10] }
];
function echapperHtml(texte) {
  const remplacements = { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" };
  return String(texte).replace(/[&<>"']/g, caractere => remplacements[caractere]);
}
function afficherMenu(titre, contenu) {
  document.getElementById("menu-titre").textContent = titre;
  document.getElementById("menu-liste").innerHTML = contenu;
  document.getElementById("menu-liste").scrollTop = 0;
}
function ouvrirAlphabet() {
  const exemples = ["ə", "Ə", "ɗ", "ɓ", "ŋ", "Ŋ", "ɔ", "ǫ", "Ǫ", "ɛ", "ɨ", "ã", "ƴ"];
  const boutons = exemples.map(caractere => '<button type="button" onclick="kopy(\'' + caractere + '\')" aria-label="Copier ' + caractere + '">' + caractere + '</button>').join("");
  afficherMenu("Alphabet et syllabes", '<div class="module-note"><strong>Première étape pour apprendre le Guidar.</strong><br>Les lettres affichées sont des caractères rencontrés dans les contenus déjà fournis, pas encore un alphabet complet validé.</div>' +
    '<h2 class="menu-section-title">Caractères à étudier</h2><div class="alphabet-samples">' + boutons + '</div>' +
    '<div class="module-note"><strong>Parcours à compléter avec le spécialiste :</strong><br>ordre de l’alphabet · nom et son des lettres · voyelles et consonnes · syllabes simples puis combinées · exemples et enregistrements. Aucun son non confirmé n’est enseigné ici.</div>' +
    '<p class="content-status">Fondations en préparation et à valider</p><br><br><button type="button" class="resource-back" onclick="openMenu()">← Retour au menu</button>');
}
function afficherBibliotheque(filtre = "", categorieChoisie = -1) {
  const recherche = filtre.trim().toLocaleLowerCase("fr");
  const categorie = CATEGORIES_NUMERIQUES[categorieChoisie];
  const inclusions = categorie ? categorie.lecons : CATEGORIES_NUMERIQUES.flatMap(element => element.lecons);
  const entrees = inclusions.flatMap(index => (LECONS[index]?.mots || []).map(mot => ({ mot, lecon: LECONS[index] })))
    .filter(({ mot }) => mot.g && mot.f && (mot.g.toLocaleLowerCase("fr").includes(recherche) || mot.f.toLocaleLowerCase("fr").includes(recherche)));
  const resultats = entrees.length
    ? entrees.map(({ mot, lecon }) => '<article class="resource-result"><div class="resource-guidar">' + echapperHtml(mot.g) + '</div><div class="resource-translation">' + echapperHtml(mot.f) + '</div><div class="resource-meta">' + echapperHtml(lecon.titre) + (mot.pProvisoire ? ' · prononciation provisoire' : !mot.p ? ' · prononciation à compléter/valider' : '') + '</div></article>').join("")
    : '<p class="module-note">Aucun résultat pour cette recherche. Essayez un autre mot ou un autre thème.</p>';
  const selecteur = '<label class="menu-section-title" for="resource-category">Thème</label><select class="resource-search" id="resource-category" aria-label="Filtrer par thème" onchange="afficherBibliotheque(document.getElementById(\'resource-search\').value, Number(this.value))"><option value="-1">Tous les thèmes</option>' +
    CATEGORIES_NUMERIQUES.map((element, index) => '<option value="' + index + '" ' + (categorieChoisie === index ? 'selected' : '') + '>' + echapperHtml(element.titre) + '</option>').join("") + '</select>';
  const rechercheHtml = '<label class="menu-section-title" for="resource-search">Recherche</label><input class="resource-search" id="resource-search" type="search" value="' + echapperHtml(filtre) + '" placeholder="Guidar ou français…" oninput="afficherBibliotheque(this.value, Number(document.getElementById(\'resource-category\').value))">';
  afficherMenu("Bibliothèque numérique", '<div class="module-note">Contenus transcrits en texte à partir des ressources fournies, sans afficher les scans. Les graphies et traductions sont à valider par un spécialiste ; les prononciations manquantes sont signalées.</div>' + selecteur + rechercheHtml + '<p class="resource-meta" role="status">' + entrees.length + ' résultat(s)</p>' + resultats + '<button type="button" class="resource-back" onclick="openMenu()">← Retour au menu</button>');
  const champ = document.getElementById("resource-search"); champ.focus(); champ.setSelectionRange(champ.value.length, champ.value.length);
}
function ouvrirParametres() {
  const coche = (nom, titre, description, active) => '<label class="setting-row"><span><strong>' + titre + '</strong><br><small>' + description + '</small></span><input type="checkbox" aria-label="' + titre + '" ' + (active ? 'checked' : '') + ' onchange="preferences.' + nom + '=this.checked;sauvegarderPreferences()"></label>';
  afficherMenu("Paramètres et accessibilité", '<div class="module-note">Réglages enregistrés uniquement sur cet appareil.</div><div class="settings-list">' +
    coche("texteGrand", "Texte agrandi", "Agrandir les mots et les traductions.", preferences.texteGrand) + coche("contraste", "Contraste renforcé", "Fond noir et texte plus contrasté.", preferences.contraste) + coche("masquerPhon", "Masquer les aides provisoires", "N’afficher que les prononciations confirmées.", preferences.masquerPhon) +
    '<label class="setting-row"><span><strong>Vitesse de lecture</strong><br><small>Ralentir ou accélérer la voix de synthèse.</small></span><input type="range" min="0.75" max="1.25" step="0.05" value="' + preferences.vitesse + '" aria-label="Vitesse de lecture" oninput="preferences.vitesse=Number(this.value);document.getElementById(\'vitesse-affichee\').textContent=Math.round(preferences.vitesse*100)+\'%\';sauvegarderPreferences()"><span id="vitesse-affichee" class="setting-value">' + Math.round(preferences.vitesse * 100) + '%</span></label></div>' +
    '<p class="module-note">La synthèse vocale française de l’appareil sert d’aide et ne remplace pas un enregistrement Guidar validé.</p><br><button type="button" class="resource-back" onclick="openMenu()">← Retour au menu</button>');
}
function ouvrirClavierDepuisMenu() { closeMenu(); if (!kbOn) toggleKb(); }
function openMenu() {
  if (document.getElementById("menu").style.display !== "flex") focusAvantMenu = document.activeElement;
  clearTimeout(tmr); clearTimeout(lectureDifferee); lectureDifferee = null;
  if (autoPlay) { autoPlay = false; document.getElementById("b-auto").textContent = "▶ Auto"; document.getElementById("b-auto").classList.remove("on"); document.getElementById("b-auto").setAttribute("aria-pressed", "false"); stopBar(); }
  speechRun++; stopAudio(); if (VOIX_OK) window.speechSynthesis.cancel();
  document.getElementById("menu-titre").textContent = "Menu d’apprentissage";
  const liste = document.getElementById("menu-liste");
  const cartes = '<div class="module-note">Sans compte ni connexion : ta progression et tes réglages restent sur cet appareil.</div><h2 class="menu-section-title">Apprendre et consulter</h2>' +
    '<button type="button" class="menu-card" onclick="ouvrirAlphabet()"><span class="menu-card-icon" aria-hidden="true">🔠</span><span><span class="menu-card-title">Alphabet et syllabes</span><span class="menu-card-description">Première étape pour débutants, enfants et adultes · contenu à valider.</span></span></button>' +
    '<button type="button" class="menu-card" onclick="afficherBibliotheque()"><span class="menu-card-icon" aria-hidden="true">📚</span><span><span class="menu-card-title">Bibliothèque numérique</span><span class="menu-card-description">Rechercher parmi les mots et traductions déjà intégrés.</span></span></button>' +
    '<button type="button" class="menu-card" onclick="ouvrirParametres()"><span class="menu-card-icon" aria-hidden="true">⚙️</span><span><span class="menu-card-title">Paramètres et accessibilité</span><span class="menu-card-description">Taille du texte, contraste, aides phonétiques et vitesse de lecture.</span></span></button>' +
    '<button type="button" class="menu-card" onclick="ouvrirClavierDepuisMenu()"><span class="menu-card-icon" aria-hidden="true">⌨️</span><span><span class="menu-card-title">Clavier Guidar</span><span class="menu-card-description">Copier les lettres spéciales pour les écrire facilement.</span></span></button><h2 class="menu-section-title">Parcours d’apprentissage</h2>';
  liste.innerHTML = cartes + LECONS.map((l, i) => {
    const actif = i === curL, nombreVu = Math.min(vus[i] || 0, l.mots.length), terminee = l.mots.length > 1 && nombreVu === l.mots.length;
    const audiosValides = l.mots.filter((mot, j) => mot.g && validationsAudio[cleValidationAudio(i, j)] === "conforme").length, nombreAudios = l.mots.filter(mot => mot.g).length;
    return '<button type="button" class="menu-item" onclick="chooseLecon(' + i + ')" ' + (actif ? 'aria-current="page"' : '') + ' style="background:' + (actif ? 'rgba(200,146,42,.18)' : 'rgba(200,146,42,.04)') + ';border:1px solid ' + (actif ? 'rgba(200,146,42,.45)' : 'rgba(200,146,42,.12)') + '"><span class="mi-ico">' + l.icone + '</span><div class="mi-txt"><div class="mi-titre">' + echapperHtml(l.titre) + '</div><div class="mi-count">' + nombreVu + ' / ' + l.mots.length + ' entrée(s) vues' + (terminee ? ' — Leçon terminée ✓' : '') + '</div><div class="mi-count">' + audiosValides + ' / ' + nombreAudios + ' audio(s) confirmé(s)</div></div>' + (actif ? '<span class="mi-check">✓</span>' : '') + '</button>';
  }).join("");
  const menu = document.getElementById("menu"); menu.style.display = "flex"; menu.setAttribute("aria-hidden", "false"); menu.querySelector(".menu-close").focus();
}
function closeMenu() {
  const menu = document.getElementById("menu");
  const cibleFocus = focusAvantMenu && !menu.contains(focusAvantMenu)
    ? focusAvantMenu
    : document.querySelector(".bbar button[aria-label=\"Choisir une leçon\"]");
  if (cibleFocus && cibleFocus.focus) cibleFocus.focus();
  menu.style.display = "none";
  menu.setAttribute("aria-hidden", "true");
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
  focusAvantMenu = document.querySelector(".bbar button");
  closeMenu();
  document.getElementById("hdr-lecon").textContent = LECONS[i].titre;
  show(0);
}

// ══════════════════════════════════════════════════
