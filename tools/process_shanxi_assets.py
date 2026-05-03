from __future__ import annotations

from pathlib import Path
from typing import Iterable

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
SHANXI_DIR = ROOT / "src" / "assets" / "card4" / "shanxi"
ALPHA_TOOL_DIR = SHANXI_DIR / "alpha-tools"
ALPHA_NOODLE_DIR = SHANXI_DIR / "alpha-noodles"
REPORT_DIR = ROOT / "docs" / "generated"

TOOL_FILES = [
    "tool-chopsticks.png",
    "tool-hands.png",
    "tool-knife.png",
    "tool-pinch.png",
    "tool-press.png",
    "tool-rollingpin.png",
]

NOODLE_FILES = [
    "dough.png",
    "noodle-daoxiao.png",
    "noodle-ganmian.png",
    "noodle-helao.png",
    "noodle-lamian.png",
    "noodle-maoerduo.png",
    "noodle-tijian.png",
]


def sample_background(image: Image.Image) -> tuple[int, int, int]:
    width, height = image.size
    points = [
        (8, 8),
        (width - 9, 8),
        (8, height - 9),
        (width - 9, height - 9),
        (width // 2, 8),
        (width // 2, height - 9),
    ]
    samples = [image.getpixel(point)[:3] for point in points]
    count = len(samples)
    return tuple(int(sum(channel[idx] for channel in samples) / count) for idx in range(3))


def build_alpha_mask(image: Image.Image, background: tuple[int, int, int]) -> Image.Image:
    rgba = image.convert("RGBA")
    width, height = rgba.size
    mask = Image.new("L", rgba.size, color=0)

    for y in range(height):
        for x in range(width):
            r, g, b, a = rgba.getpixel((x, y))
            diff = ((r - background[0]) ** 2 + (g - background[1]) ** 2 + (b - background[2]) ** 2) ** 0.5

            if diff <= 12:
                alpha = 0
            elif diff >= 58:
                alpha = 255
            else:
                alpha = int(((diff - 12) / (58 - 12)) * 255)

            mask.putpixel((x, y), int(alpha * (a / 255)))

    return mask.filter(ImageFilter.GaussianBlur(radius=0.65))


def remove_background(source: Path, target: Path) -> None:
    image = Image.open(source).convert("RGBA")
    background = sample_background(image)
    alpha = build_alpha_mask(image, background)
    output = image.copy()
    output.putalpha(alpha)
    target.parent.mkdir(parents=True, exist_ok=True)
    output.save(target)


def label(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str) -> None:
    font = ImageFont.load_default()
    draw.rectangle((xy[0] - 4, xy[1] - 2, xy[0] + 132, xy[1] + 14), fill=(255, 255, 255, 220))
    draw.text(xy, text, fill=(24, 24, 24), font=font)


def transparent_preview(image: Image.Image, tile_size: int) -> Image.Image:
    canvas = Image.new("RGBA", (tile_size, tile_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)
    step = 20
    for y in range(0, tile_size, step):
      for x in range(0, tile_size, step):
        fill = (232, 232, 232, 255) if (x // step + y // step) % 2 == 0 else (248, 248, 248, 255)
        draw.rectangle((x, y, x + step, y + step), fill=fill)
    preview = image.copy()
    preview.thumbnail((tile_size - 18, tile_size - 18))
    offset = ((tile_size - preview.width) // 2, (tile_size - preview.height) // 2)
    canvas.alpha_composite(preview, dest=offset)
    return canvas


def build_compare_sheet(file_names: Iterable[str]) -> None:
    tiles = []
    tile_size = 220

    for file_name in file_names:
        before = Image.open(SHANXI_DIR / file_name).convert("RGBA")
        after = Image.open(ALPHA_TOOL_DIR / file_name).convert("RGBA")
        before_tile = Image.new("RGBA", (tile_size, tile_size), (244, 244, 244, 255))
        before_copy = before.copy()
        before_copy.thumbnail((tile_size - 18, tile_size - 18))
        before_tile.alpha_composite(
            before_copy,
            dest=((tile_size - before_copy.width) // 2, (tile_size - before_copy.height) // 2),
        )
        tiles.append((file_name, before_tile, transparent_preview(after, tile_size)))

    canvas = Image.new("RGBA", (tile_size * 2 + 80, len(tiles) * (tile_size + 28) + 36), (252, 250, 247, 255))
    draw = ImageDraw.Draw(canvas)
    label(draw, (24, 10), "Before")
    label(draw, (tile_size + 52, 10), "After (Alpha)")

    for index, (name, before_tile, after_tile) in enumerate(tiles):
        top = 36 + index * (tile_size + 28)
        canvas.alpha_composite(before_tile, dest=(24, top))
        canvas.alpha_composite(after_tile, dest=(tile_size + 52, top))
        draw.text((24, top + tile_size + 6), name, fill=(80, 68, 58), font=ImageFont.load_default())

    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    canvas.save(REPORT_DIR / "shanxi-tool-background-compare.png")


def main() -> None:
    for file_name in TOOL_FILES:
        remove_background(SHANXI_DIR / file_name, ALPHA_TOOL_DIR / file_name)

    for file_name in NOODLE_FILES:
        remove_background(SHANXI_DIR / file_name, ALPHA_NOODLE_DIR / file_name)

    build_compare_sheet(TOOL_FILES)


if __name__ == "__main__":
    main()
