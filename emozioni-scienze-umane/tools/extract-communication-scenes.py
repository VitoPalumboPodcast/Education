"""Extract scene regions from the three user-provided PDF sheets rendered at 1800px.

Usage: python tools/extract-communication-scenes.py <rendered-page-directory>
The PDF itself is not published; only these classroom illustrations are reused.
"""
from pathlib import Path
import sys
from PIL import Image

root = Path(__file__).resolve().parents[1]
rendered = Path(sys.argv[1])
destination = root / "images" / "comunicazione"
destination.mkdir(parents=True, exist_ok=True)
regions = [
    (1, "scuola", (53, 282, 1220, 656)),
    (1, "telefono", (75, 1536, 378, 1738)),
    (2, "biblioteca", (65, 351, 620, 677)),
    (3, "treno", (65, 534, 348, 721)),
    (3, "gioia", (660, 536, 963, 725)),
    (3, "chiamata", (662, 887, 916, 1077)),
    (3, "dizionario", (66, 1190, 349, 1401)),
    (3, "tramonto", (660, 1190, 961, 1401)),
]
for page, name, box in regions:
    with Image.open(rendered / f"pagina-{page}.png") as source:
        scene = source.crop(box).convert("RGB")
        scene.thumbnail((560, 350), Image.Resampling.LANCZOS)
        target = destination / f"{name}.jpg"
        scene.save(target, "JPEG", quality=82, optimize=True)
        print(target.name, target.stat().st_size)
