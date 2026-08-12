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
      "Gestion de tâches sur mesure. Agenda du jour et de la semaine, matrice d'Eisenhower, projets, contacts, listes de courses et de voyage. Deux espaces indépendants, pro et perso.",
    url: "https://fab-geekos.github.io/todo/",
    hue: 248,
    image: null,
  },
  {
    id: "citations",
    name: "Citations",
    tagline: "Passages de lecture",
    description:
      "Les passages surlignés sur la liseuse, relus dans l'ordre du livre ou tirés au hasard. Bibliothèque illustrée par les couvertures, import direct des fichiers de la liseuse.",
    url: "https://citations-b350f.web.app",
    hue: 32,
    image: null,
  },
  {
    id: "energie-matin",
    name: "Jauge d'énergie",
    tagline: "Le bilan du réveil",
    description:
      "Sommeil, corps, alimentation, stress, charge mentale. Quelques réponses au réveil et la jauge donne le niveau d'énergie disponible pour la journée qui commence.",
    url: "https://fab-geekos.github.io/energy-accounting/",
    hue: 78,
    image: null,
  },
  {
    id: "energy-accounting",
    name: "Energy Accounting",
    tagline: "La journée en flux",
    description:
      "La comptabilité de la journée, à partir de la jauge du matin. D'un côté ce qui draine, salle blanche, réunions, visios. De l'autre ce qui recharge, sieste, silence, pauses.",
    url: "https://fab-geekos.github.io/energy-accounting/energy.html",
    hue: 328,
    image: null,
  },
  {
    id: "capitales",
    name: "Capitales du monde",
    tagline: "Quiz de géographie",
    description:
      "Les capitales de la planète, à explorer continent par continent ou à réviser en quiz, sur une sélection de pays ou sur le monde entier.",
    url: "https://fab-geekos.github.io/capitalsquizz/",
    hue: 168,
    image: null,
  },
  {
    id: "vocabulaire",
    name: "Vocabulaire anglais",
    tagline: "Mots et expressions",
    description:
      "Le carnet de vocabulaire anglais, révisé par répétition espacée dans les deux sens. Correction tolérante à la frappe, tous les sens affichés, pièges de prononciation notés.",
    url: "https://voc-anglais-f5973.web.app",
    hue: 123,
    image: null,
  },
];
