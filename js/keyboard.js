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
function champSaisieActif() {
  const actif = document.activeElement;
  if (!actif) return null;
  if (actif.tagName === "TEXTAREA") return actif;
  if (actif.tagName === "INPUT" && ["text", "search", "email", "url", ""].includes((actif.type || "text").toLowerCase())) return actif;
  return null;
}
function insererDansChamp(champ, caractere) {
  champ.focus();
  let insere = false;
  try {
    insere = document.execCommand("insertText", false, caractere);
  } catch (error) {
    insere = false;
  }
  if (!insere) {
    const debut = champ.selectionStart ?? champ.value.length;
    const fin = champ.selectionEnd ?? debut;
    champ.value = champ.value.slice(0, debut) + caractere + champ.value.slice(fin);
    champ.setSelectionRange(debut + caractere.length, debut + caractere.length);
    champ.dispatchEvent(new Event("input", { bubbles: true }));
  }
}
async function kopy(c) {
  const champ = champSaisieActif();
  if (champ) {
    insererDansChamp(champ, c);
    toast("« " + c + " » inséré dans le champ.");
    return;
  }
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

  const zoneCopie = document.createElement("textarea");
  zoneCopie.value = c;
  zoneCopie.setAttribute("readonly", "");
  zoneCopie.style.position = "fixed";
  zoneCopie.style.opacity = "0";
  document.body.appendChild(zoneCopie);
  zoneCopie.select();
  let copie = false;
  try {
    copie = document.execCommand("copy");
  } catch (error) {
    erreurPressePapiers = erreurPressePapiers || error;
  } finally {
    zoneCopie.remove();
  }
  if (copie) {
    toast("✅ «" + c + "» copié !");
  } else {
    if (erreurPressePapiers) console.error("La copie vers le presse-papiers a échoué.", erreurPressePapiers);
    toast("Copie impossible : sélectionnez la lettre «" + c + "» manuellement.");
  }
}

// ══════════════════════════════════════════════════
