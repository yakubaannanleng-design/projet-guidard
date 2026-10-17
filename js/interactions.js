// TOAST
// ══════════════════════════════════════════════════
let toastTmr = null;
function toast(msg) {
  clearTimeout(toastTmr);
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  toastTmr = setTimeout(() => t.classList.remove("show"), 2500);
}

// ══════════════════════════════════════════════════
// SWIPE MOBILE
// ══════════════════════════════════════════════════
let sx = 0, sy = 0, swipeAllowed = false;
document.addEventListener("touchstart", e => {
  sx = e.touches[0].clientX;
  sy = e.touches[0].clientY;
  swipeAllowed = Boolean(e.target.closest("#main")) &&
    !e.target.closest("button,input,select,textarea,summary,a");
}, {passive:true});
document.addEventListener("touchend", e => {
  if (!swipeAllowed || document.getElementById("menu").style.display === "flex") return;
  swipeAllowed = false;
  const dx = e.changedTouches[0].clientX - sx;
  const dy = e.changedTouches[0].clientY - sy;
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 55) {
    dx < 0 ? go(1) : go(-1);
  }
}, {passive:true});
let px = 0, py = 0, pointerSwipeAllowed = false;
document.getElementById("main").addEventListener("pointerdown", event => {
  if (event.pointerType === "touch") return;
  px = event.clientX;
  py = event.clientY;
  pointerSwipeAllowed = !event.target.closest("button,input,select,textarea,summary,a");
});
document.getElementById("main").addEventListener("pointerup", event => {
  if (!pointerSwipeAllowed || document.getElementById("menu").style.display === "flex") return;
  pointerSwipeAllowed = false;
  const dx = event.clientX - px;
  const dy = event.clientY - py;
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 70) dx < 0 ? go(1) : go(-1);
});

// CLAVIER PC (éviter conflit avec la touche P)
document.addEventListener("keydown", e => {
  const menu = document.getElementById("menu");
  if (menu.style.display === "flex") {
    if (e.key === "Escape") closeMenu();
    if (e.key === "Tab") {
      const boutons = menu.querySelectorAll("button:not([disabled])");
      const premier = boutons[0];
      const dernier = boutons[boutons.length - 1];
      if (e.shiftKey && document.activeElement === premier) {
        e.preventDefault();
        dernier.focus();
      } else if (!e.shiftKey && document.activeElement === dernier) {
        e.preventDefault();
        premier.focus();
      }
    }
    return;
  }
  if (e.key === "Escape" && kbOn) {
    toggleKb();
    const boutonOptions = document.querySelector(".header-action");
    if (boutonOptions) boutonOptions.focus();
    return;
  }
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
  if (e.key === "ArrowRight") go(1);
  if (e.key === "ArrowLeft")  go(-1);
  if (e.key === "Enter")      speak();
  if (e.key === " ") { e.preventDefault(); toggleAuto(); }
});

// ══════════════════════════════════════════════════
