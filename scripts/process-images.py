"""Normalise original vehicle photos into src/assets/vehicles/.

Safe, non-generative edits only:
  * exposure / contrast auto-levels (clipped, gentle)
  * partial grey-world white balance
  * a light shared "showroom" grade (slightly cooler shadows, warmer highlights)
  * pixelation of privacy regions (number plates, third-party decals)

The vehicle itself is never redrawn. Originals in /originals are never modified.

Usage:  python3 -I scripts/process-images.py
"""
import os
import sys
from PIL import Image, ImageFilter, ImageOps, ImageEnhance

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "originals")
DST = os.path.join(ROOT, "src", "assets", "vehicles")
MAX_EDGE = 1800

# Regions to pixelate, in original-image pixel coordinates (x0, y0, x1, y1).
PRIVACY = {
    "chery-tiggo-9-pro-phev-2026-front": [(470, 1080, 730, 1215)],  # number plate
    "chery-tiggo-9-pro-phev-2026-rear": [(190, 515, 405, 630), (400, 790, 576, 886)],  # decal, plate
    "chery-tiggo-9-pro-phev-2026-rear-three-quarter": [(768, 432, 960, 588)],  # decal
    "honda-civic-oriel-ug-1-8-2018-front": [(725, 1200, 1170, 1400)],  # number plate
    "honda-civic-oriel-ug-1-8-2018-rear": [(740, 750, 1140, 960)],  # number plate
    "toyota-hilux-revo-v-2021-rear": [(735, 1120, 1040, 1280)],  # number plate
    "toyota-hilux-revo-v-2021-front": [(715, 1195, 1105, 1375)],  # number plate
}

# Per-image exposure lift for dim indoor shots.
EXPOSURE = {
    "mercedes-benz-c63-amg-2008-front-three-quarter-left": 1.12,
    "mercedes-benz-c63-amg-2008-front-three-quarter-right": 1.12,
    "mercedes-benz-c63-amg-2008-rear-three-quarter": 1.12,
}


def pixelate(im, box, block=18):
    region = im.crop(box)
    w, h = region.size
    small = region.resize((max(1, w // block), max(1, h // block)), Image.BILINEAR)
    im.paste(small.resize((w, h), Image.NEAREST).filter(ImageFilter.GaussianBlur(2)), box)


def grey_world(im, strength=0.35):
    r, g, b = im.split()
    means = [sum(i * c for i, c in enumerate(ch.histogram())) / (im.width * im.height) for ch in (r, g, b)]
    grey = sum(means) / 3
    chans = []
    for ch, m in zip((r, g, b), means):
        gain = 1 + strength * (grey / max(m, 1) - 1)
        chans.append(ch.point(lambda v, k=gain: min(255, int(v * k))))
    return Image.merge("RGB", chans)


def grade(im):
    # Cooler shadows, warmer highlights, very subtle.
    r, g, b = im.split()
    r = r.point(lambda v: min(255, int(v + 6 * (v / 255) ** 2)))
    b = b.point(lambda v: min(255, int(v + 5 * (1 - v / 255) ** 2)))
    return Image.merge("RGB", (r, g, b))


def process(path, out_path, name):
    im = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
    for box in PRIVACY.get(name, []):
        pixelate(im, box)
    im = grey_world(im)
    im = ImageOps.autocontrast(im, cutoff=(0.4, 0.4), preserve_tone=True)
    if name in EXPOSURE:
        im = ImageEnhance.Brightness(im).enhance(EXPOSURE[name])
    im = ImageEnhance.Contrast(im).enhance(1.05)
    im = ImageEnhance.Color(im).enhance(1.03)
    im = grade(im)
    im.thumbnail((MAX_EDGE, MAX_EDGE), Image.LANCZOS)
    im = im.filter(ImageFilter.UnsharpMask(radius=1.2, percent=40, threshold=3))
    im.save(out_path, "JPEG", quality=90, optimize=True, progressive=True)


def main():
    count = 0
    slugs = sorted(d for d in os.listdir(SRC) if os.path.isdir(os.path.join(SRC, d)))  # skip brand/hero files
    for slug in slugs:
        os.makedirs(os.path.join(DST, slug), exist_ok=True)
        for f in sorted(os.listdir(os.path.join(SRC, slug))):
            name = os.path.splitext(f)[0]
            process(os.path.join(SRC, slug, f), os.path.join(DST, slug, name + ".jpg"), name)
            count += 1
    unused = set(PRIVACY) | set(EXPOSURE)
    for slug in slugs:
        unused -= {os.path.splitext(f)[0] for f in os.listdir(os.path.join(SRC, slug))}
    if unused:
        sys.exit(f"Unknown image names in config: {sorted(unused)}")
    print(f"Processed {count} images into {DST}")


if __name__ == "__main__":
    main()
