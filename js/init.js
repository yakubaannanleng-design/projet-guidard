// INIT
// ══════════════════════════════════════════════════
if (VOIX_OK) initVoix();
appliquerPreferences();
document.getElementById("bg-project").style.backgroundImage =
  `url("${document.querySelector(".logo").src}")`;
document.getElementById("hdr-lecon").textContent = LECONS[curL].titre;
show(curM);
if (!progressionInitiale.sauvegardePresente) openMenu();
