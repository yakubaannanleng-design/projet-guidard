// INIT
// ══════════════════════════════════════════════════
if (VOIX_OK) initVoix();
appliquerPreferences();
document.querySelector(".logo").alt = "Icône GuidarApp";
document.getElementById("hdr-lecon").textContent = LECONS[curL].titre;
show(curM);
if (!progressionInitiale.sauvegardePresente) openMenu();
