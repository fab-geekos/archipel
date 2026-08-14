/* =============================================================================
   Les îles de l'archipel.
   -----------------------------------------------------------------------------
   AJOUTER UN PROJET = ajouter un objet ci-dessous. Rien d'autre à toucher.

   ⚠️ RÈGLE À TENIR : la description doit tenir en DEUX LIGNES MAXIMUM.
   Soit environ 180 caractères, la plus longue actuelle en fait 176. Ce n'est
   pas cosmétique : la hauteur du bloc de texte est figée sur la description la
   plus haute, donc une seule description trop longue rabaisse la scène et
   RÉTRÉCIT LES VISUELS DE TOUS LES PROJETS. Si c'est dépassé, la console
   affiche un avertissement au chargement.

   id          identifiant court et unique (sert aux ancres et au débogage)
   name        nom affiché sous le carrousel
   tagline     3 à 5 mots, au-dessus du nom
   description 1 à 2 phrases, sous le nom, 180 caractères grand maximum
   url         adresse ouverte au clic (nouvel onglet)
   hue         teinte OKLCH de l'île, 0-360. Colore le halo du fond et le
               panneau d'attente. Prendre une valeur éloignée des voisines.
   image       chemin vers le visuel, ex. "images/todo.webp".
               null = panneau d'attente coloré, en attendant l'image.
   ========================================================================== */

export const PROJECTS = [
  {
    id: "todo",
    name: "Todo",
    tagline: "Tâches et priorités",
    description:
      "Moins de bruit, plus d'action.",
    url: "https://fab-geekos.github.io/todo/",
    hue: 248,
    image: null,
  },
  {
    id: "citations",
    name: "Citations",
    tagline: "Passages de lecture",
    description:
      "Les pages passent, les mots restent.",
    url: "https://citations-b350f.web.app",
    hue: 32,
    image: "images/citations.webp",
  },
  {
    id: "energie-matin",
    name: "Jauge d'énergie",
    tagline: "Le bilan du réveil",
    description:
      "Parce que «ça va» ne suffit pas.",
    url: "https://fab-geekos.github.io/energy-accounting/",
    hue: 78,
    image: null,
  },
  {
    id: "energy-accounting",
    name: "Energy Accounting",
    tagline: "La journée en flux",
    description:
      "Tu finis ta journée. Mais à combien ?",
    url: "https://fab-geekos.github.io/energy-accounting/energy.html",
    hue: 328,
    image: null,
  },
  {
    id: "capitales",
    name: "Capitales du monde",
    tagline: "Quiz de géographie",
    description:
      "Il est capital de connaître sa géographie.",
    url: "https://fab-geekos.github.io/capitalsquizz/",
    hue: 168,
    image: null,
  },
  {
    id: "vocabulaire",
    name: "Vocabulaire anglais",
    tagline: "Mots et expressions",
    description:
      "Bryan is in the kitchen.",
    url: "https://voc-anglais-f5973.web.app",
    hue: 123,
    image: null,
  },
];
