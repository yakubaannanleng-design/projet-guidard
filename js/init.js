// INIT
// ══════════════════════════════════════════════════
if (VOIX_OK) initVoix();
appliquerPreferences();
document.querySelector(".logo").alt = "Icône GuidarApp";
if (!LECONS[curL].mots[curM]?.g) {
  const prochaineEntree = LECONS[curL].mots.findIndex((mot, index) => index >= curM && mot.g);
  const premiereEntree = LECONS[curL].mots.findIndex(mot => mot.g);
  if (prochaineEntree >= 0) curM = prochaineEntree;
  else if (premiereEntree >= 0) curM = premiereEntree;
}
document.getElementById("hdr-lecon").textContent = LECONS[curL].titre;
show(curM);
