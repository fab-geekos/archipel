"""
Prépare un visuel d'île pour l'archipel.

    python outils/image.py <fichier source> <id du projet>

Exemple :

    python outils/image.py sources/citations_SDA.png citations

Écrit `images/<id>.webp`, redimensionné et compressé. Il ne reste plus qu'à
renseigner `image: "images/<id>.webp"` dans js/projects.js, une seule fois par
projet : ensuite, réécrire le fichier suffit à changer le visuel.

Pourquoi une conversion plutôt que le fichier tel quel :
un PNG d'ImageFX pèse environ 1 Mo, le même visuel en webp en fait 100 à 300 Ko
pour une différence invisible à l'oeil. Sur six îles, c'est 6 Mo contre 1, et
l'archipel doit s'ouvrir instantanément, c'est tout son intérêt.
"""

import sys
from pathlib import Path

from PIL import Image

# Largeur d'affichage maximale de la carte : `--card-w` est plafonné à 1480px
# dans css/styles.css. Au-delà, on stockerait des pixels que personne ne verra.
LARGEUR_CIBLE = 1600

# 82 est le point où le webp cesse de se voir sur une illustration. Monter à 90
# double le poids sans rien apporter, descendre à 75 fait baver les aplats.
QUALITE = 82

RACINE = Path(__file__).resolve().parent.parent


def main() -> int:
    if len(sys.argv) != 3:
        print(__doc__)
        return 1

    source = Path(sys.argv[1])
    if not source.is_absolute():
        source = RACINE / source

    if not source.exists():
        print(f"Introuvable : {source}")
        return 1

    cible = RACINE / "images" / f"{sys.argv[2]}.webp"
    cible.parent.mkdir(exist_ok=True)

    image = Image.open(source).convert("RGB")
    largeur, hauteur = image.size
    ratio = largeur / hauteur

    # Le carrousel est réglé en 16/9 (1.778). `object-fit: cover` rattrape un
    # petit écart en rognant, mais un format franchement différent ferait
    # perdre une vraie part de l'image, mieux vaut le dire tout de suite.
    if abs(ratio - 16 / 9) > 0.08:
        print(
            f"  ⚠ format {largeur}x{hauteur} (ratio {ratio:.2f}) loin du 16/9 "
            f"attendu : la carte va rogner ce qui dépasse."
        )

    # On ne réduit jamais vers le haut : agrandir n'ajoute aucun détail, ça ne
    # ferait que gonfler le fichier pour une image tout aussi floue.
    if largeur > LARGEUR_CIBLE:
        hauteur_cible = round(LARGEUR_CIBLE * hauteur / largeur)
        image = image.resize((LARGEUR_CIBLE, hauteur_cible), Image.LANCZOS)
    elif largeur < 1200:
        print(
            f"  ⚠ {largeur}px de large seulement : la carte fait jusqu'à 1480px, "
            f"le visuel sera un peu doux sur grand écran."
        )

    image.save(cible, "WEBP", quality=QUALITE, method=6)

    ko_avant = source.stat().st_size / 1024
    ko_apres = cible.stat().st_size / 1024
    print(
        f"  {source.name} {largeur}x{hauteur} ({ko_avant:.0f} Ko)\n"
        f"  → {cible.relative_to(RACINE)} {image.size[0]}x{image.size[1]} "
        f"({ko_apres:.0f} Ko)"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
