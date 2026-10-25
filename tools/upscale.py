"""Nearest-neighbour upscale of pxl outputs into assets/ (PNG and animated GIF)."""
import sys
from pathlib import Path
from PIL import Image, ImageSequence

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "art" / "out"
JOBS = [  # (source, dest, scale)
    ("scenes/banner_day.gif", "banner-day.gif", 4),
    ("scenes/banner_night.gif", "banner-night.gif", 4),
    ("sprites/avatar.png", "avatar.png", 8),
] + [
    (f"sprites/plot_{n}.png", f"garden/{n}.png", 4)
    for n in ["empty", "sprout", "lolly_grow", "lolly_ripe", "cupcake_grow", "cupcake_ripe",
              "donut_grow", "donut_ripe"]
]


def up(img, s):
    return img.resize((img.width * s, img.height * s), Image.NEAREST)


for src, dst, s in JOBS:
    im = Image.open(SRC / src)
    out = ROOT / "assets" / dst
    out.parent.mkdir(parents=True, exist_ok=True)
    if getattr(im, "is_animated", False):
        frames, durs = [], []
        for f in ImageSequence.Iterator(im):
            frames.append(up(f.convert("RGBA"), s).convert("P", palette=Image.ADAPTIVE, colors=64))
            durs.append(f.info.get("duration", 200))
        frames[0].save(out, save_all=True, append_images=frames[1:], duration=durs, loop=0,
                       optimize=True, disposal=1)
    else:
        up(im, s).save(out, optimize=True)
    print(dst, out.stat().st_size // 1024, "KB")
sys.exit(0)
