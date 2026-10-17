// CLAVIER
// ══════════════════════════════════════════════════
function toggleKb() {
  kbOn = !kbOn;
  document.getElementById("keyboard").classList.toggle("on", kbOn);
  const bouton = document.getElementById("b-kb");
  if (bouton) {
    bouton.classList.toggle("on", kbOn);
    bouton.setAttribute("aria-expanded", String(kbOn));
  }
}
async function kopy(c) {
  let erreurPressePapiers = null;
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(c);
      toast("✅ «" + c + "» copié !");
      return;
    } catch (error) {
      erreurPressePapiers = error;
    }
  }

  const champ = document.createElement("textarea");
  champ.value = c;
  champ.setAttribute("readonly", "");
  champ.style.position = "fixed";
  champ.style.opacity = "0";
  document.body.appendChild(champ);
  champ.select();
  let copie = false;
  try {
    copie = document.execCommand("copy");
  } catch (error) {
    erreurPressePapiers = erreurPressePapiers || error;
  } finally {
    champ.remove();
  }
  if (copie) {
    toast("✅ «" + c + "» copié !");
  } else {
    if (erreurPressePapiers) console.error("La copie vers le presse-papiers a échoué.", erreurPressePapiers);
    toast("Copie impossible : sélectionnez la lettre «" + c + "» manuellement.");
  }
}

// ══════════════════════════════════════════════════
