# Archipel — mémoire du projet

Page d'accueil personnelle de Fabien. Un favori unique qui remplace cinq favoris.
Voir [PRODUCT.md](PRODUCT.md) pour la vision et la direction artistique.

## Architecture

Quatre fichiers, aucune dépendance, aucun build.

| Fichier | Rôle |
|---|---|
| `index.html` | squelette. Aucun contenu de projet en dur, tout est injecté. |
| `css/styles.css` | jetons + mise en forme. Feuille unique. |
| `js/projects.js` | **la donnée**. Le seul fichier à toucher pour ajouter une île. |
| `js/app.js` | le carrousel. |

### Le carrousel

Les cartes ne changent **jamais** de place dans le DOM. À chaque déplacement,
`layout()` calcule pour chacune sa distance signée la plus courte sur l'anneau
(`ringDistance`, valeurs -2 à 2 pour cinq îles) et pose quatre variables CSS :
`--x`, `--s`, `--o`, `--blur`, plus `--z`. C'est ce qui rend la boucle
invisible : il n'y a pas de bord, donc jamais de saut à rattraper, et aucun
clonage d'élément.

Les valeurs par niveau d'éloignement sont dans la constante `LEVELS`. Le
décalage `x` est exprimé en multiples de la largeur de carte et vaut moins de 1,
volontairement : les voisines dépassent **de derrière** l'île nette.

`maxVisible` (0, 1 ou 2 voisines par côté) dépend de la largeur de fenêtre et
est recalculé au redimensionnement.

### Le halo

`--isle-h` est déclarée en `@property` pour être **animable**. `renderReadout`
la pose sur `<body>` à partir du `hue` du projet, et `body::before` en tire un
dégradé radial. Résultat : le fond glisse d'une couleur à l'autre au lieu de
sauter. Sans `@property` (navigateur ancien), la couleur change d'un coup, ce
qui reste correct.

## Décisions validées (ne pas remettre en question sans accord)

1. **Patrimoine n'est pas dans l'archipel.** Une page en `https://` ne peut pas
   ouvrir un fichier `file://` local, les navigateurs l'interdisent. Comme
   Fabien consulte l'archipel depuis plusieurs PC, la vitrine est en ligne,
   donc Patrimoine en est exclu par construction. Ce n'est pas un oubli.
2. **Dépôt public.** GitHub Pages en gratuit l'exige. Sans danger : la page ne
   contient aucune donnée, et les apps qu'elle liste sont verrouillées par
   Firebase Auth sur un seul compte Google.
3. **Pas de Firebase ici.** Rien à stocker, rien à authentifier.
4. **Boucle sans butée**, demande explicite de Fabien.
5. **Ouverture en nouvel onglet**, l'archipel reste ouvert derrière.
6. **Tailles fluides** (`clamp`) plutôt que des paliers, l'usage est
   multi-écrans.
7. **Nom du projet affiché sous le carrousel, pas sur la carte.** L'image doit
   rester pleine. Le nom sur la carte n'apparaît que dans le panneau d'attente,
   tant qu'il n'y a pas d'image.

## Avancement

- Fait : structure, carrousel bouclé, clavier, molette, glissement, points,
  flèches, halo par île, panneaux d'attente, adaptation écran, mouvement réduit.
- Reste : **les images**. Cinq visuels portrait 4:5 dans `images/`, puis
  renseigner `image` dans `projects.js`. La DA n'est pas encore arrêtée ;
  méthode retenue : explorer sur Google ImageFX, puis produire la série sur
  Leonardo.ai en donnant la première image validée comme référence de style.

## Règles de collaboration

- Committer et pousser à la fin de chaque lot, Fabien teste en ligne.
- Commits directs sur `main`, c'est la branche servie par GitHub Pages.
- Pas de tiret cadratin dans les textes produits pour Fabien.
