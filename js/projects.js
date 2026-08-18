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
    description:
      "Moins de bruit, plus d'action.",
    url: "https://fab-geekos.github.io/todo/",
    hue: 248,
    image: null,
  },
  {
    id: "citations",
    name: "Citations",
    description:
      "Les livres passent, les mots restent.",
    url: "https://citations-b350f.web.app",
    hue: 32,
    image: "images/citations.webp",
  },
  /* Une seule île depuis que les deux pages d'energy-accounting ont fusionné.
     Il y en avait deux, « Jauge d'énergie » vers index.html et « Energy
     Accounting » vers energy.html, qui sont désormais deux onglets du même
     document. Deux îles pour un seul fichier auraient été deux entrées pour
     une seule chose. */
  {
    id: "energie",
    name: "Jauge d'énergie",
    description:
      "Parce que « ça va » ne suffit pas.",
    url: "https://fab-geekos.github.io/energy-accounting/",
    hue: 78,
    image: null,
  },
  {
    id: "capitales",
    name: "Capitales du monde",
    description:
      "Connaître sa géographie, c'est capital.",
    url: "https://fab-geekos.github.io/capitalsquizz/",
    hue: 168,
    image: "images/capitales.webp",
  },
  {
    id: "vocabulaire",
    name: "Vocabulaire anglais",
    description:
      "Bryan is in the kitchen.",
    url: "https://voc-anglais-f5973.web.app",
    hue: 123,
    image: null,
  },
];
