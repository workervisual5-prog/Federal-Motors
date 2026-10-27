"""Blend the client-supplied hero car render into the dark page background.

Feathers the hard-edged floor strip (left, right, top corners and bottom) with an
elliptical alpha falloff. The car pixels themselves are not altered.

Usage: python3 -I scripts/blend-hero.py
"""
import os
from PIL import Image, ImageChops, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "originals", "hero-tiggo-federal-motors-original.webp")
DST = os.path.join(ROOT, "src", "assets", "hero", "hero-tiggo-federal-motors.png")

im = Image.open(SRC).convert("RGBA")
im = im.crop(im.getchannel("A").getbbox())
w, h = im.size

# Elliptical falloff centred under the car; fully opaque inside 70% of the radius.
cx, cy, rx, ry = w * 0.49, h * 0.47, w * 0.56, h * 0.62
ramp = Image.new("L", (w, h))
px = ramp.load()
for y in range(h):
    for x in range(w):
        r = (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2) ** 0.5
        t = min(max((1.0 - r) / 0.3, 0.0), 1.0)  # 1 inside r<=0.7, 0 at r>=1
        px[x, y] = int(255 * t * t * (3 - 2 * t))  # smoothstep

# Extra fade towards the bottom so the reflections dissolve.
bottom = Image.linear_gradient("L").resize((w, h))  # 0 at top → 255 at bottom
bottom = bottom.point(lambda v: 255 if v < 150 else int(255 * max(0.0, (255 - v) / 105)))
# The floor strip's top edge is exposed beside the car. Find that edge and the car's
# horizontal extent just above it, then fade the floor upward only outside the car.
A = im.getchannel("A")
ap = A.load()
floor_top = next(y for y in range(h) if all(ap[x, y] > 250 for x in range(8, w - 8)))
car_cols = [x for x in range(w) if ap[x, floor_top - 4] > 128]
car_l, car_r = car_cols[0], car_cols[-1]
edge = Image.new("L", (w, h), 255)
ep = edge.load()
for y in range(floor_top - 2, h):
    v = min(max((y - floor_top) / 140, 0.0), 1.0)
    v = v * v * (3 - 2 * v)
    for x in range(w):
        e = min(max((car_l + 10 - x) / 40, 0.0), 1.0) + min(max((x - car_r + 10) / 40, 0.0), 1.0)
        ep[x, y] = int(255 * (1 - min(e, 1.0) * (1 - v)))

# Soft side fades that stop just short of the car's bumpers.
sides = Image.new("L", (w, h))
sp = sides.load()
for x in range(w):
    t = min(max((x - 0) / (car_l - 4), 0.0), 1.0) * min(max((w - x) / (w - car_r - 4), 0.0), 1.0)
    t = t * t * (3 - 2 * t)
    for y in range(h):
        sp[x, y] = int(255 * t) if y >= floor_top - 2 else 255

mask = ImageChops.multiply(ImageChops.multiply(ImageChops.multiply(ramp, bottom), edge), sides).filter(ImageFilter.GaussianBlur(6))

alpha = ImageChops.multiply(im.getchannel("A"), mask)
im.putalpha(alpha)
os.makedirs(os.path.dirname(DST), exist_ok=True)
im.save(DST, optimize=True)
print(DST, im.size)
