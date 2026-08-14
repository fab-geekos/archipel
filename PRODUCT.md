# Archipel — vision produit & design

## Utilisateur

Fabien, seul. Depuis plusieurs PC (bureau et maison), sur des écrans de tailles
différentes. Usage desktop, souris et clavier. Le mobile doit rester correct mais
n'est pas la cible.

## But

Remplacer cinq favoris par un seul. La page est un **lanceur**, pas un portfolio :
on y passe deux secondes, on choisit une île, on part. Tout ce qui ralentit ce
geste est de trop.

Corollaire : aucune donnée, aucun compte, aucun backend. Une page statique.

## Nom

**Archipel.** Des îles autonomes, séparées, qui n'ont en commun que la mer et le
fait qu'on navigue de l'une à l'autre. C'est exactement le rapport entre les
projets : ils n'ont rien à voir entre eux, et c'est très bien.

## Ton visuel

Une carte marine de nuit, pas une carte postale.

L'ambiance vient d'un poste de navigation : fond sombre pour que les images
soient la seule source de lumière, voix typographique d'instrument (mono pour les
repères, sérif pour les noms), et une lueur qui change de couleur selon l'île
active, comme un climat qu'on approche.

## Anti-références

- Le bleu marine et or « voyage / croisière ». Premier réflexe de la métaphore
  maritime, donc à éviter.
- Le fond crème ou sable « éditorial chaleureux ». Le défaut IA de 2026.
- La grille de cartes identiques icône + titre + texte.
- Les illustrations SVG dessinées à la main pour combler l'absence d'images.
- Les intitulés en petites capitales espacées au-dessus de chaque bloc.

## Principes de design

1. **L'image d'abord.** La page est un cadre, pas un décor. Tout le chrome est
   sourd pour que les visuels portent la couleur.
2. **Une île à la fois.** Le carrousel montre un projet net, ses voisines en
   retrait derrière lui, floutées. On voit qu'il y a une collection sans jamais
   avoir à la lire.
3. **Sans butée.** Après la dernière île on revient à la première. On ne bute
   jamais contre un bord.
4. **Tout est fluide.** Les tailles de carte, de titre et de texte se calculent
   à partir de la largeur de l'écran. Aucun palier visible entre deux PC.
5. **Le clavier est un vrai chemin.** Flèches pour naviguer, Entrée pour ouvrir.
   Pas un ajout d'accessibilité posé après coup.
6. **Facile à étendre.** Ajouter un projet doit être une entrée de plus dans
   `js/projects.js`, jamais une modification du reste.

## Couleur

Stratégie **engagée** dans les deux modes : une couleur saturée porte toute la
surface, elle ne se contente jamais d'être un fond neutre.

**Clair (défaut)** : le lagon. L'eau transparente d'un archipel du Pacifique vue
de près. Turquoise très clair au centre, qui se creuse vers un bleu plus profond
sur les bords, comme un haut-fond qui plonge. Encre bleu-nuit.

**Sombre** : la carte marine de nuit. Vert bouteille très sombre, blanc cassé
teinté vers ce même vert. C'est le mode qui fera le mieux ressortir les visuels.

Dans les deux cas, l'accent est un **ambre de balisage**, simplement ramené à un
niveau qui tient sur une eau claire en mode clair. Il ne sert qu'aux repères
actifs et au focus.

Chaque projet porte en plus sa propre teinte, qui ne colore que deux choses : le
halo du fond et son panneau d'attente.

Le bouton de bascule est le même que dans todo et citations-livres, au même coin,
avec la même convention (`body.dark`, clé `archipel_theme`, clair par défaut).

## Typographie

Trois voix, sur des axes contrastés :

- **Fraunces** pour le nom du projet. Une seule graisse, grande taille, axe
  optique activé.
- **IBM Plex Sans** pour l'accroche.
- **IBM Plex Mono** pour les repères : compteur et bouton de thème.

Plex Sans et Plex Mono viennent de la même superfamille, elles s'accordent sans
se ressembler. Le sérif tranche franchement sur les deux.

Le nom était en **Instrument Serif**, écarté sur un constat mesurable : à
hauteur de capitale égale, il écrivait « Citations » en 302px là où Georgia en
prend 398, soit **24% plus étroit**. C'est un sérif de titrage condensé, et les
noms de projet avaient l'air d'avoir été étirés en hauteur. Fraunces remonte le
rapport à 4.81 contre 4.08, sans aller jusqu'à la neutralité de Georgia.
Critère à garder pour tout remplaçant : **des proportions normales**, pas un
condensé.
