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

### La page ne défile jamais

`<body>` fait exactement `100svh` avec `overflow: hidden` : la molette est
réservée au changement d'île, il n'y a rien à faire défiler. Demande explicite
de Fabien.

⚠️ Conséquence : ce qui dépasse est **coupé sans recours**, l'utilisateur ne peut
pas récupérer le contenu en défilant. C'est pour ça que la carte est
dimensionnée par la place que la scène a **vraiment** (`height: min(var(--card-h),
100%)` sur `.card`, `.ring` en `height: 100%`) et non par une fraction de
fenêtre : les textes du bas occupent une hauteur fixe, donc une fenêtre courte
laisse bien moins de place qu'un pourcentage ne le suggère. Vérifié jusqu'à
1280x450, où la carte se réduit mais où rien n'est coupé. Le portrait 4:5 est
tenu par `aspect-ratio`, la largeur suit toujours la hauteur.

### Les hauteurs sont figées, pas fluides

`freezeReadoutHeight()` mesure les descriptions des cinq projets et fige la
hauteur du bloc de texte sur **le plus haut**. Sans ça, une description de deux
lignes au lieu de trois raccourcit le bloc, la scène récupère la place, et tout
remonte d'un cran au changement d'île. Refait à chaque redimensionnement (le
nombre de lignes dépend de la largeur) et une fois les polices web posées (elles
changent le nombre de lignes). La région live est mise en sourdine pendant la
mesure, sinon un lecteur d'écran annoncerait les cinq projets.

Pour la même raison, la transition du texte est un **fondu seul**, sans aucun
déplacement vertical. Demande explicite de Fabien.

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

### Les thèmes

`:root` porte le mode **clair** (le défaut), `body.dark` ne redéfinit que ce qui
change. Tous les jetons dépendant du thème sont dans ces deux blocs, nulle part
ailleurs.

⚠️ Les valeurs composées avec une teinte variable (halo du fond, panneau
d'attente) sont stockées en **nombres nus** (`--halo-l`, `--art-l1`, ...) et
recomposées dans la règle qui les utilise. Un jeton du genre
`--halo: oklch(0.42 0.075 var(--isle-h))` déclaré sur `:root` serait invalide :
la substitution a lieu sur l'élément qui déclare, et `--isle-h` n'y existe pas.

Un court script en tête de `<body>` pose la classe `dark` **avant le premier
rendu** : `app.js` est un module, donc différé, et la page aurait clignoté en
clair avant de basculer. La clé y est répétée en dur, c'est assumé.

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
   **Retirés à la demande de Fabien (ne pas les remettre) :** la signature
   « archipel » en haut à gauche, l'aide clavier du bas, et l'adresse du projet
   sous la description. Il reste le compteur, le bouton de thème et les points.
8. **Deux thèmes, convention maison.** Classe `dark` sur `<body>`, clé
   `archipel_theme` dans localStorage, **clair par défaut**, bouton rond
   `.icon-btn` en haut à droite, 🌙 vers le sombre et ☀️ pour en revenir. C'est
   exactement ce que font todo et citations-livres, demande explicite de Fabien.
   Pour inverser le défaut, il suffit de changer la comparaison dans `setTheme`.

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
