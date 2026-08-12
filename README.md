# Archipel

Page d'accueil personnelle. Un seul favori qui mène à tous les projets, sous
forme de carrousel bouclé : une île nette au centre, ses voisines en retrait
derrière elle.

**En ligne : https://fab-geekos.github.io/archipel/**

## Ajouter un projet

Une seule chose à modifier : le tableau `PROJECTS` dans
[`js/projects.js`](js/projects.js). Chaque entrée est commentée sur place.

```js
{
  id: "mon-projet",
  name: "Mon projet",
  tagline: "Trois mots",
  description: "Une à trois phrases.",
  url: "https://fab-geekos.github.io/mon-projet/",
  hue: 205,          // teinte OKLCH 0-360, à éloigner de celles des voisines
  image: null,       // ou "images/mon-projet.webp"
}
```

Le carrousel s'adapte tout seul au nombre d'îles. Pousser sur `main` suffit à
mettre en ligne, GitHub Pages republie en une minute environ.

## Ajouter les images

Déposer le fichier dans `images/`, puis renseigner `image` dans `projects.js`.
Tant que `image` vaut `null`, la carte affiche un panneau coloré avec le nom du
projet.

Format attendu : **portrait 4:5** (par exemple 1000 × 1250), en `.webp` de
préférence, autour de 200 Ko par image.

## Développement local

```bash
python -m http.server 5500
```

Puis http://localhost:5500. Un serveur est nécessaire : la page utilise des
modules JavaScript, qui ne se chargent pas en ouvrant le fichier directement.

## Stack

HTML, CSS et JavaScript vanilla. Aucune étape de build, aucune dépendance,
aucun backend. Deux polices chargées depuis Google Fonts, c'est tout.
