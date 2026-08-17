# Archipel — mémoire du projet

Page d'accueil personnelle de Fabien. Un favori unique qui remplace tous les autres.
Voir [PRODUCT.md](PRODUCT.md) pour la vision et la direction artistique.

## Architecture

Quatre fichiers servis, aucune dépendance, aucun build.

| Fichier | Rôle |
|---|---|
| `index.html` | squelette. Aucun contenu de projet en dur, tout est injecté. |
| `css/styles.css` | jetons + mise en forme. Feuille unique. |
| `js/projects.js` | **la donnée**. Le seul fichier à toucher pour ajouter une île. |
| `js/app.js` | le carrousel. |
| `outils/image.py` | hors site : prépare un visuel pour `images/`. Voir plus bas. |

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

### Les hauteurs sont réservées, pas mesurées

Le bloc de texte occupe la même place quel que soit le projet : `min-height:
1lh` sur le nom, `min-height: 1lh` sur la description. Sans ça, une description
plus courte raccourcit le bloc, la scène récupère la place, et tout remonte d'un
cran au changement d'île.

La description a été réservée sur deux lignes tant qu'elle décrivait le projet.
Depuis qu'elle est une accroche d'une ligne, la seconde ligne n'était plus qu'un
blanc permanent, et elle a été rendue à la scène.

⚠️ **Réservé en CSS, surtout pas mesuré en JS.** Une version précédente
mesurait toutes les descriptions et figeait la hauteur sur la plus haute. Défaut
de fond : une mesure dépend de l'état de mise en page au moment où elle est
prise. Prise pendant une largeur transitoire du chargement, elle figeait le bloc
à 1271 px, ce qui écrasait la scène à 0 et rendait les cartes invisibles, **sans
retour possible** puisque plus rien ne changeait de taille ensuite. Une réserve
en lignes n'a rien à mesurer, donc rien à rater. Ne pas revenir en arrière.

Pour la même raison, la transition du texte est un **fondu seul**, sans aucun
déplacement vertical. Demande explicite de Fabien.

### La cadence verticale

L'écart au-dessus du visuel et celui au-dessous des points sont **le même
jeton**, `--rhythm`, en `clamp(14px, 2.4vh, 28px)`. Demande de Fabien : un
écart identique de part et d'autre, et qui suive la taille d'écran.

⚠️ Il n'est **pas** posé en `gap` de la grille, et `body` est justement en
`gap: 0`. La scène est en `1fr` : une gouttière lui laisserait quand même tout
l'espace restant et le visuel grandirait d'autant. `--rhythm` est retranché
**à l'intérieur** de la scène, sur la hauteur de la carte
(`height: min(var(--card-h), calc(100% - 2 * var(--rhythm)))`). La carte étant
centrée, ce qui reste se partage en deux parts forcément égales : il n'y a
aucun réglage à tenir à jour de part et d'autre, l'égalité est structurelle.

C'est aussi ce qui a permis de retirer la sur-ligne **sans** agrandir le
visuel, comme Fabien le demandait : les 25px rendus sont passés dans l'air
autour de l'image, pas dans l'image.

### Replacement : deux signaux, pas un

`relayout()` est branché sur un `ResizeObserver` **et** sur l'événement `resize`.
Ils se rattrapent l'un l'autre : la livraison d'un ResizeObserver est liée à
l'étape de rendu, donc **suspendue sur un onglet qui ne dessine pas**, tandis
que `resize` arrive toujours mais seulement quand la fenêtre bouge. La fonction
est débouncée et idempotente, être appelée deux fois ne coûte rien.

### Le carrousel

Les cartes ne changent **jamais** de place dans le DOM. À chaque déplacement,
`layout()` calcule pour chacune sa distance signée la plus courte sur l'anneau
(`ringDistance`, -2 à 2 pour cinq îles, -3 à 2 pour six) et pose quatre variables CSS :
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
6bis. ⚠️ **Une description tient sur UNE SEULE LIGNE**, soit **80 caractères**
   (la plus longue actuelle en fait 42). Contrainte permanente de Fabien, à
   respecter pour **tout projet ajouté plus tard**. Raison : la hauteur du bloc
   de texte est réservée en CSS, donc une description plus longue déborde, et
   la page ne défilant jamais, ce qui déborde est perdu. `checkDescriptions()`
   émet un `console.warn` si le cas se présente.
   Les descriptions ne décrivent pas, ce sont des **accroches** : « Moins de
   bruit, plus d'action. » Fabien reconnaît ses apps à leur visuel, la ligne de
   texte sert au ton, pas à l'information.
7. **Le texte encadre le visuel, il ne s'empile pas d'un seul côté.** Le nom
   au-dessus du carrousel, l'accroche au-dessous, juste avant les points. Rien
   sur la carte : l'image doit rester pleine, et le nom n'y apparaît que dans
   le panneau d'attente tant qu'il n'y a pas de visuel.
   Tout était sous le carrousel à l'origine ; Fabien a d'abord fait remonter le
   bloc entier, puis redescendre la seule accroche. Ce sont **deux `<section>`
   distinctes** dans le HTML, placées dans l'ordre où l'oeil les prend : rien
   n'est réordonné en CSS, donc la lecture au clavier suit la lecture visuelle.
   **Retirés à la demande de Fabien (ne pas les remettre) :** la signature
   « archipel » en haut à gauche, l'aide clavier du bas, l'adresse du projet
   sous la description, et la **sur-ligne mono** (« Passages de lecture ») qui
   faisait doublon avec l'accroche. Il ne reste sous le nom qu'une seule ligne
   de texte, plus le compteur, le bouton de thème et les points.

9. **Le visuel central doit dominer la page**, demande explicite et répétée de
   Fabien. C'est le curseur à privilégier quand un arbitrage se présente. Deux
   conséquences déjà actées :
   - **Le bandeau du haut est hors flux** (`position: fixed`). Il ne portait que
     du chrome, il ne prend plus de rangée. C'est le plus gros gain de hauteur
     obtenu, et en paysage la hauteur vaut 1.78 fois sa valeur en largeur
     d'image. En contrepartie il survole le bloc de texte : c'est `.readout` qui
     garde ses distances, avec une réserve latérale dans son `max-width`.
   - **Pas de liseré ambre autour de l'île nette.** Retiré à la demande de
     Fabien : un cadre coloré se bat avec les couleurs du visuel. Le survol ne
     fait plus que creuser l'ombre. Le contour de `:focus-visible` reste, lui,
     il ne se montre qu'au clavier.
8. **Deux thèmes, convention maison.** Classe `dark` sur `<body>`, clé
   `archipel_theme` dans localStorage, **clair par défaut**, bouton rond
   `.icon-btn` en haut à droite, 🌙 vers le sombre et ☀️ pour en revenir. C'est
   exactement ce que font todo et citations-livres, demande explicite de Fabien.
   Pour inverser le défaut, il suffit de changer la comparaison dans `setTheme`.

## Les visuels

**Format 16/9 paysage**, et non le portrait prévu au départ : c'est ce que
sort ImageFX, en 2752x1536 (ratio 1.792, le 16:9 à 1% près, l'écart est absorbé
par `object-fit: cover`).

⚠️ **En paysage, c'est la HAUTEUR qui commande.** Une carte 16/9 est basse : la
hauteur libre de la scène la plafonne bien avant `--card-w`. Pour agrandir les
visuels, on prend donc de la hauteur ailleurs (padding, gap, lignes de texte),
jamais de la largeur. Une ligne de texte rendue à la scène vaut 1.78 fois sa
hauteur en largeur d'image.

Fabricaton d'un visuel :

1. Générer sur **Google ImageFX**, télécharger en 2K, déposer dans `sources/`
   (dossier ignoré par git, les originaux ne partent pas en ligne).
2. `python outils/image.py sources/<fichier> <id>` : redimensionne à 1600px de
   large et écrit `images/<id>.webp`. Environ 170 Ko au lieu de 2,7 Mo.
3. Renseigner `image` dans `projects.js`, une seule fois par projet. Ensuite,
   réécrire le fichier suffit à changer le visuel.

**Méthode de série** : un monde différent par île, ce qui est la métaphore de
l'archipel prise au mot. Deux invariants seulement, et ils suffisent à tenir la
série : un **bloc de style identique au mot près** dans tous les prompts, et
**une ouverture sur la mer et des îles au loin** dans chaque image (fenêtre,
arche, balcon, hublot). Leonardo.ai a été essayé pour sa référence de style,
puis écarté : ImageFX rend mieux.

Critère de choix d'une image : elle doit se lire **à petite taille, floutée,
derrière une autre**. Donc un seul point focal, jamais un beau tableau dense.

## Essayé puis écarté (ne pas refaire)

Trois « corrections » ont été appliquées puis annulées par Fabien. Elles
paraissent chacune évidente à qui relit le code sans cet historique.

1. **Ombre portée sous les cartes : il n'y en a pas, et c'est voulu.**
   `--shadow` et `--shadow-hi` valent `none` dans les deux thèmes.
   ⚠️ Le dégradé sombre qu'on voit au bas du visuel **au survol** n'est pas une
   ombre portée : c'est `.card__open`, le voile qui porte le mot « Ouvrir ».
   Il reste tel quel. La confusion entre les deux a coûté trois allers-retours,
   l'ombre a été divisée par deux puis rendue très légère avant que Fabien
   identifie la vraie source. Ne pas réintroduire d'ombre en croyant « finir »
   la carte.

2. **Ne pas demander une police sur une PLAGE d'`opsz`.** Fraunces l'était, et
   `font-optical-sizing` faisait donc varier le dessin avec le corps du texte :
   le J capital changeait de forme d'une taille à l'autre. Les polices de
   titrage sont demandées à une valeur d'`opsz` fixe dans le lien Google Fonts,
   la lettre est alors la même partout. Fraunces a fini par être remplacée
   (cf. la section Typographie de PRODUCT.md), mais la règle reste.

3. **Molette : verrou à durée fixe de 380ms, pas de détection de fin de geste.**
   Conséquence connue et acceptée : un geste latéral appuyé, prolongé par
   l'inertie du pavé, fait franchir plusieurs îles. La version qui n'en laisse
   passer qu'une par impulsion (minuteur de silence réarmé à chaque événement
   de la rafale) a été écrite, vérifiée, puis écartée.

## Avancement

- Fait : structure, carrousel bouclé, clavier, molette, glissement, points,
  flèches, halo par île, panneaux d'attente, adaptation écran, mouvement réduit,
  passage en 16/9, outil de préparation des visuels.
- Fait : le visuel de **Citations** (Terre du Milieu, scriptorium sur la mer).
- Reste : les quatre autres visuels, un monde par île.
- ⚠️ **Cinq îles, plus six.** « Jauge d'énergie » et « Energy Accounting »
  étaient deux entrées vers deux fichiers du même dépôt ; ces fichiers ont
  fusionné en une page à onglets, l'île est donc unique et pointe vers la
  racine. La piste visuelle retenue en son temps pour Energy Accounting, une
  veilleuse cyberpunk sous la pluie, tombe avec elle.
- Reste : accorder les teintes `hue` de `projects.js` aux visuels une fois
  ceux-ci choisis. Repoussé volontairement, on ne peut pas régler la couleur du
  halo sur des images qui n'existent pas.

## Règles de collaboration

- Committer et pousser à la fin de chaque lot, Fabien teste en ligne.
- Commits directs sur `main`, c'est la branche servie par GitHub Pages.
- Pas de tiret cadratin dans les textes produits pour Fabien.
