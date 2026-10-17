// INIT
// ══════════════════════════════════════════════════
if (VOIX_OK) initVoix();
appliquerPreferences();
document.querySelector(".logo").alt = "Icône GuidarApp";
if (!progressionInitiale.sauvegardePresente) {
  const premiereEntree = LECONS[curL].mots.findIndex(mot => mot.g);
  if (premiereEntree >= 0) curM = premiereEntree;
}
document.getElementById("hdr-lecon").textContent = LECONS[curL].titre;
show(curM);
