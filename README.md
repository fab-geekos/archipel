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
  description: "Une à deux phrases, 180 caractères maximum.",
  url: "https://fab-geekos.github.io/mon-projet/",
  hue: 205,          // teinte OKLCH 0-360, à éloigner de celles des voisines
  image: null,       // ou "images/mon-projet.webp"
}
```

⚠️ **La description doit tenir en deux lignes**, soit environ **180 caractères**.
La hauteur du bloc de texte est figée sur la description la plus haute : une
seule description trop longue rétrécit les visuels de tous les projets. En cas
de dépassement, un avertissement s'affiche dans la console du navigateur.

Le carrousel s'adapte tout seul au nombre d'îles. Pousser sur `main` suffit à
mettre en ligne, GitHub Pages republie en une minute environ.

## Ajouter les images

Déposer le fichier dans `images/`, puis renseigner `image` dans `projects.js`.
Tant que `image` vaut `null`, la carte affiche un panneau coloré avec le nom du
projet.

Format attendu : **carré** (1200 × 1200 par exemple), en `.webp` de préférence,
autour de 200 Ko par image. C'est aussi le format que sortent par défaut ImageFX
et Leonardo.

Pour changer de format, une seule chose à modifier, en haut de
[`css/styles.css`](css/styles.css) :

```css
--card-ar-w: 1;   /* 4 pour du 4:3 paysage, 4 pour du 4:5 portrait */
--card-ar-h: 1;   /* 3                      5                      */
```

Le carrousel se recompose tout seul, et `aspect-ratio` garantit qu'aucune image
ne se déforme.

## Développement local

```bash
python -m http.server 5500
```

Puis http://localhost:5500. Un serveur est nécessaire : la page utilise des
modules JavaScript, qui ne se chargent pas en ouvrant le fichier directement.

## Stack

HTML, CSS et JavaScript vanilla. Aucune étape de build, aucune dépendance,
aucun backend. Deux polices chargées depuis Google Fonts, c'est tout.
