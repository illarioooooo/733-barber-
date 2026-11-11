"""Génère les images WebP du site à partir de _sources/photos.
Usage : python3 tools/optimize-images.py   (depuis le dossier 733-barber)
Remplacez les fichiers sources par des photos HD (mêmes noms) puis relancez."""
from pathlib import Path
from PIL import Image, ImageOps

SRC = Path("_sources/photos")
OUT = Path("images")
OUT.mkdir(exist_ok=True)

def load(name):
    for ext in (".png", ".jpg", ".jpeg", ".webp"):
        p = SRC / (name + ext)
        if p.exists():
            return ImageOps.exif_transpose(Image.open(p)).convert("RGB")
    raise FileNotFoundError(name)

SIZES = {"sm": 480, "lg": 1600}

def save(im, name, sizes=("sm", "lg"), q=78):
    """Écrit name-sm.webp / name-lg.webp (jamais agrandies au-delà de la source)."""
    for key in sizes:
        w = min(SIZES[key], im.width)
        h = round(im.height * w / im.width)
        im.resize((w, h), Image.LANCZOS).save(OUT / f"{name}-{key}.webp", "WEBP", quality=q, method=6)
        print(f"{name}-{key}.webp  {w}x{h}")

def crop_rel(im, l, t, r, b):
    W, H = im.size
    return im.crop((round(l * W), round(t * H), round(r * W), round(b * H)))

hex_ = load("salon-hexagones")
fire = load("salon-cheminee")
facade = load("facade")

save(fire, "salon-cheminee")
save(hex_, "salon-hexagones")
save(crop_rel(facade, 0, 0.26, 1, 0.70), "facade-733")
# Recadrages pour la galerie
save(crop_rel(hex_, 0, 0.12, 0.58, 1), "galerie-miroirs", ("lg",))
save(crop_rel(fire, 0.12, 0, 0.66, 0.62), "galerie-hexagones", ("lg",))
save(crop_rel(fire, 0.46, 0.18, 1, 1), "galerie-fauteuil", ("lg",))
# Image Open Graph 1200x630
og = ImageOps.fit(fire, (1200, 630), Image.LANCZOS)
og.save(OUT / "og-733.jpg", "JPEG", quality=82, optimize=True)
print("og-733.jpg")
