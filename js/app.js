/* =============================================================================
   ARCHIPEL — carrousel bouclé.

   Principe : les cartes ne bougent jamais dans le DOM. À chaque déplacement on
   recalcule, pour chacune, sa distance signée la plus courte sur l'anneau
   (d = -2..2 pour cinq îles) et on pose sa position, son échelle, son opacité
   et son flou. C'est ce qui rend la boucle invisible : il n'y a pas de bord
   dont on pourrait s'approcher, donc jamais de saut à rattraper.
   ========================================================================== */

import { PROJECTS } from "./projects.js";

const $ = (id) => document.getElementById(id);

const ring = $("ring");
const dotsEl = $("dots");
const readout = $("readout");
const els = {
  tagline: $("tagline"),
  name: $("name"),
  desc: $("desc"),
  host: $("host"),
  counter: $("counter"),
};

const N = PROJECTS.length;

/* Décalage horizontal (en multiples de la largeur de carte), échelle, opacité
   et flou par niveau d'éloignement. Le décalage est volontairement inférieur à
   une largeur pleine : les voisines dépassent de derrière l'île nette au lieu
   de s'aligner à côté d'elle. */
const LEVELS = [
  { x: 0.00, s: 1.00, o: 1.00, blur: 0.0 },
  { x: 0.60, s: 0.82, o: 0.55, blur: 1.6 },
  { x: 1.02, s: 0.68, o: 0.26, blur: 3.2 },
];

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");

let active = 0;
let cards = [];
let dots = [];
let maxVisible = 2;
let lastDragNav = -Infinity;   /* horodatage du dernier défilement par glissement */

/* --- Construction ---------------------------------------------------------- */

function buildCard(p, i) {
  const a = document.createElement("a");
  a.className = "card";
  a.href = p.url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.dataset.index = String(i);
  a.draggable = false; /* sinon le navigateur lance son propre glisser de lien */
  a.style.setProperty("--hue", p.hue);
  a.setAttribute("aria-label", `${p.name}, ouvrir dans un nouvel onglet`);

  const art = document.createElement("div");
  art.className = "card__art";
  art.setAttribute("aria-hidden", "true");

  if (p.image) {
    const img = document.createElement("img");
    img.src = p.image;
    img.alt = "";
    img.loading = i === 0 ? "eager" : "lazy";
    img.decoding = "async";
    art.append(img);
  } else {
    const waiting = document.createElement("span");
    waiting.className = "card__waiting";
    waiting.textContent = p.name;
    art.append(waiting);
  }

  const open = document.createElement("span");
  open.className = "card__open";
  open.setAttribute("aria-hidden", "true");
  open.textContent = "Ouvrir";

  a.append(art, open);

  a.addEventListener("click", (e) => {
    /* Un glissement se termine par un clic sur la carte relâchée. Sans ce
       garde-fou, faire défiler à la souris ouvrirait aussi le lien. */
    if (performance.now() - lastDragNav < 300) {
      e.preventDefault();
      return;
    }
    /* Une île en retrait ne s'ouvre pas : le premier clic l'amène au centre. */
    if (i !== active) {
      e.preventDefault();
      goTo(i);
    }
  });

  return a;
}

function buildDot(p, i) {
  const b = document.createElement("button");
  b.className = "dot";
  b.type = "button";
  b.setAttribute("aria-label", p.name);
  b.addEventListener("click", () => goTo(i));
  return b;
}

/* --- Placement ------------------------------------------------------------- */

/* Distance signée la plus courte entre i et l'île active, sur l'anneau.
   Pour N=5 : -2, -1, 0, 1, 2. */
function ringDistance(i) {
  return ((i - active + N + Math.floor(N / 2)) % N) - Math.floor(N / 2);
}

function layout() {
  const w = cards[0].offsetWidth; /* largeur de mise en page, insensible au scale */

  cards.forEach((card, i) => {
    const d = ringDistance(i);
    const level = LEVELS[Math.min(Math.abs(d), LEVELS.length - 1)];
    const hidden = Math.abs(d) > maxVisible;
    const isActive = d === 0;

    card.style.setProperty("--x", `${Math.sign(d) * level.x * w}px`);
    card.style.setProperty("--s", hidden ? level.s * 0.9 : level.s);
    card.style.setProperty("--o", hidden ? 0 : level.o);
    card.style.setProperty("--blur", `${level.blur}px`);
    card.style.setProperty("--z", String(30 - Math.abs(d) * 10));

    card.classList.toggle("is-active", isActive);
    card.tabIndex = isActive ? 0 : -1;
    card.setAttribute("aria-hidden", isActive ? "false" : "true");
  });

  dots.forEach((dot, i) => {
    dot.setAttribute("aria-current", i === active ? "true" : "false");
  });
}

function renderReadout(animate) {
  const p = PROJECTS[active];

  els.tagline.textContent = p.tagline;
  els.name.textContent = p.name;
  els.desc.textContent = p.description;
  els.host.textContent = new URL(p.url).hostname;
  els.counter.textContent =
    `${String(active + 1).padStart(2, "0")} / ${String(N).padStart(2, "0")}`;

  document.body.style.setProperty("--isle-h", p.hue);

  if (animate && !reduceMotion.matches) {
    readout.animate(
      [
        { opacity: 0, transform: "translateY(10px)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 420, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
    );
  }
}

function goTo(i, { animate = true } = {}) {
  active = ((i % N) + N) % N;
  layout();
  renderReadout(animate);
}

const next = () => goTo(active + 1);
const prev = () => goTo(active - 1);

/* --- Adaptation à l'écran --------------------------------------------------- */

/* Combien de voisines de chaque côté l'écran peut accueillir sans que l'île
   nette ne se retrouve à l'étroit. */
function updateVisibility() {
  const w = innerWidth;
  maxVisible = w >= 1100 ? 2 : w >= 720 ? 1 : 0;
}

/* Volontairement un minuteur et non requestAnimationFrame : rAF ne s'exécute
   pas sur un onglet en arrière-plan, et l'archipel est typiquement ouvert dans
   un onglet qu'on laisse dormir. Le replacement doit être prêt au retour. */
let resizeTimer = 0;
addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    updateVisibility();
    layout();
  }, 90);
});

/* --- Commandes -------------------------------------------------------------- */

addEventListener("keydown", (e) => {
  if (e.altKey || e.ctrlKey || e.metaKey) return;

  switch (e.key) {
    case "ArrowRight": e.preventDefault(); next(); break;
    case "ArrowLeft":  e.preventDefault(); prev(); break;
    case "Home":       e.preventDefault(); goTo(0); break;
    case "End":        e.preventDefault(); goTo(N - 1); break;
    case "Enter":
      /* Si rien de précis n'a le focus, Entrée ouvre l'île nette. Sinon on
         laisse le navigateur activer l'élément focalisé. */
      if (document.activeElement === document.body) {
        e.preventDefault();
        cards[active].click();
      }
      break;
  }
});

/* Molette et pavé tactile : un cran par geste, pas un défilement continu. */
let wheelLock = 0;
addEventListener(
  "wheel",
  (e) => {
    const now = performance.now();
    if (now - wheelLock < 380) return;

    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) < 12) return;

    wheelLock = now;
    delta > 0 ? next() : prev();
  },
  { passive: true }
);

/* Glissement à la souris ou au doigt. */
let dragX = null;
ring.addEventListener("pointerdown", (e) => { dragX = e.clientX; });
ring.addEventListener("pointerup", (e) => {
  if (dragX === null) return;
  const dx = e.clientX - dragX;
  dragX = null;
  if (Math.abs(dx) <= 44) return;
  lastDragNav = performance.now();
  dx < 0 ? next() : prev();
});
ring.addEventListener("pointercancel", () => { dragX = null; });

$("next").addEventListener("click", next);
$("prev").addEventListener("click", prev);

/* --- Démarrage --------------------------------------------------------------- */

cards = PROJECTS.map(buildCard);
dots = PROJECTS.map(buildDot);
ring.append(...cards);
dotsEl.append(...dots);

updateVisibility();
goTo(0, { animate: false });

/* Les cartes sont placées sans transition au premier rendu, sinon elles
   glissent toutes depuis le centre au chargement. On force le calcul de mise
   en page avant de réactiver les transitions, plutôt que d'attendre une frame
   qui ne viendra pas si la page s'ouvre dans un onglet en arrière-plan. */
void document.body.offsetWidth;
document.body.classList.add("is-ready");
