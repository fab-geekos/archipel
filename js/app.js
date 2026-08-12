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
  counter: $("counter"),
};

const N = PROJECTS.length;

/* Contrainte permanente posée par Fabien : une description tient en deux
   lignes, jamais plus. Voir l'en-tête de projects.js. La place correspondante
   est réservée en CSS (`.readout__desc { min-height: 2lh }`). */
const MAX_DESC_CHARS = 180;

/* --- Thème ------------------------------------------------------------------
   Même convention que todo et citations-livres : classe `dark` sur <body>,
   clé `<projet>_theme` dans localStorage, clair par défaut, 🌙 pour aller vers
   le sombre et ☀️ pour en revenir. La classe a déjà pu être posée par le petit
   script en tête de <body>, on ne fait ici que la confirmer et l'entretenir. */

const THEME_KEY = "archipel_theme";
const THEME_COLOR = { light: "#bff6f7", dark: "#061610" };
const themeToggle = $("themeToggle");

function setTheme(dark) {
  document.body.classList.toggle("dark", dark);
  themeToggle.textContent = dark ? "☀️" : "🌙";
  themeToggle.title = dark ? "Passer en mode clair" : "Passer en mode sombre";
  $("themeColor").content = dark ? THEME_COLOR.dark : THEME_COLOR.light;
  localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
}

setTheme(localStorage.getItem(THEME_KEY) === "dark");
themeToggle.addEventListener("click", () =>
  setTheme(!document.body.classList.contains("dark"))
);

/* Décalage horizontal (en multiples de la largeur de carte), échelle, opacité
   et flou par niveau d'éloignement. Le décalage est volontairement inférieur à
   une largeur pleine : les voisines dépassent de derrière l'île nette au lieu
   de s'aligner à côté d'elle. */
const LEVELS = [
  { x: 0.00, s: 1.00, o: 1.00, blur: 0.0 },
  { x: 0.56, s: 0.82, o: 0.55, blur: 1.6 },
  { x: 0.94, s: 0.68, o: 0.26, blur: 3.2 },
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
  els.counter.textContent =
    `${String(active + 1).padStart(2, "0")} / ${String(N).padStart(2, "0")}`;

  document.body.style.setProperty("--isle-h", p.hue);

  if (animate && !reduceMotion.matches) {
    readout.animate(
      /* Fondu seul, aucun déplacement : le texte ne doit jamais bouger
         verticalement d'une île à l'autre. */
      [{ opacity: 0 }, { opacity: 1 }],
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

/* La place du bloc de texte est réservée en CSS (`min-height` en lignes), il
   n'y a donc rien à mesurer ici. Reste à signaler les descriptions qui
   dépasseraient la réserve : une seule suffit à faire déborder le bloc. */
function checkDescriptions() {
  const tooLong = PROJECTS
    .filter((p) => p.description.length > MAX_DESC_CHARS)
    .map((p) => `${p.name} (${p.description.length} car.)`);

  if (tooLong.length) {
    console.warn(
      `Archipel : description trop longue, à ramener sous ${MAX_DESC_CHARS} ` +
      `caractères pour tenir en 2 lignes : ${tooLong.join(", ")}`
    );
  }
}

/* Combien de voisines de chaque côté l'écran peut accueillir sans rogner sur la
   taille de l'île nette. Deux de chaque côté coûtent cher en largeur, donc on
   les réserve aux très grands écrans : ailleurs, mieux vaut une seule voisine
   et un visuel central nettement plus grand. */
function updateVisibility() {
  const w = innerWidth;
  maxVisible = w >= 1600 ? 2 : w >= 760 ? 1 : 0;
}

/* Un ResizeObserver plutôt que l'événement `resize` de la fenêtre : il se
   déclenche aussi au tout premier calcul de mise en page, et il suit la scène
   elle-même. Le minuteur est volontairement un setTimeout et non un
   requestAnimationFrame : rAF ne s'exécute pas sur un onglet en arrière-plan,
   et l'archipel est typiquement ouvert dans un onglet qu'on laisse dormir. */
let resizeTimer = 0;

function relayout() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    updateVisibility();
    layout();
  }, 90);
}

/* Les deux signaux, et pas un seul, parce qu'ils se rattrapent l'un l'autre :
   - le ResizeObserver voit le tout premier calcul de mise en page et les
     changements de place qui ne viennent pas de la fenêtre, mais sa livraison
     est liée à l'étape de rendu, donc suspendue sur un onglet qui ne dessine
     pas ;
   - l'événement `resize`, lui, arrive dans tous les cas, mais seulement quand
     c'est la fenêtre qui bouge.
   `relayout` est débouncé et idempotent, être appelé deux fois ne coûte rien.
   Pas de boucle possible : `layout()` ne pose que des transformations, il ne
   change jamais la taille de la scène. */
new ResizeObserver(relayout).observe(ring);
addEventListener("resize", relayout);

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
checkDescriptions();

/* Les cartes sont placées sans transition au premier rendu, sinon elles
   glissent toutes depuis le centre au chargement. On force le calcul de mise
   en page avant de réactiver les transitions, plutôt que d'attendre une frame
   qui ne viendra pas si la page s'ouvre dans un onglet en arrière-plan. */
void document.body.offsetWidth;
document.body.classList.add("is-ready");

/* Les polices web changent la taille des cartes via `ch` et la hauteur de
   ligne : on replace une fois qu'elles sont posées. */
document.fonts?.ready.then(relayout);
