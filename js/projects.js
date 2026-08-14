/* =============================================================================
   Les îles de l'archipel.
   -----------------------------------------------------------------------------
   AJOUTER UN PROJET = ajouter un objet ci-dessous. Rien d'autre à toucher.

   ⚠️ RÈGLE À TENIR : la description doit tenir sur UNE SEULE LIGNE.
   Soit 80 caractères, la plus longue actuelle en fait 42. Ce n'est pas
   cosmétique : la hauteur du bloc de texte est réservée en CSS, donc une seule
   description trop longue déborde, et comme la page ne défile jamais, ce qui
   déborde est perdu. Si c'est dépassé, la console affiche un avertissement au
   chargement.

   La réserve était de deux lignes quand les descriptions décrivaient les
   projets. Elles sont devenues des accroches, la seconde ligne restait vide,
   et elle a été rendue à la scène : en format paysage, une ligne de texte en
   moins vaut près du double en largeur d'image.

   id          identifiant court et unique (sert aux ancres et au débogage)
   name        nom affiché sous le carrousel
   tagline     3 à 5 mots, au-dessus du nom
   description l'accroche, sous le nom. UNE ligne, 80 caractères maximum
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
      "Les livres passent, les mots restent.",
    url: "https://citations-b350f.web.app",
    hue: 32,
    image: "images/citations.webp",
  },
  {
    id: "energie-matin",
    name: "Jauge d'énergie",
    tagline: "Le bilan du réveil",
    description:
      "Parce que « ça va » ne suffit pas.",
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
