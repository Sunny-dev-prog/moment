from __future__ import annotations

import json
import math
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageChops, ImageColor, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
RULES_PATH = ROOT / "src" / "components" / "shanxi-card4" / "shanxi-match-rules.json"
NOODLE_DIR = ROOT / "src" / "assets" / "card4" / "shanxi" / "alpha-noodles"
REPORT_DIR = ROOT / "docs" / "generated" / "shanxi-combos"
REPORT_PATH = ROOT / "docs" / "generated" / "shanxi-visual-difference-report.md"

NOODLE_FILE_MAP = {
    "daoxiao": "noodle-daoxiao.png",
    "tijian": "noodle-tijian.png",
    "lamian": "noodle-lamian.png",
    "ganmian": "noodle-ganmian.png",
    "maoer": "noodle-maoerduo.png",
    "helao": "noodle-helao.png",
}

COMBOS = [
    ("rou", "daoxiao"),
    ("tomato", "lamian"),
    ("beef", "maoer"),
    ("tomato", "tijian"),
    ("rou", "ganmian"),
    ("beef", "lamian"),
    ("tomato", "helao"),
    ("rou", "maoer"),
    ("beef", "daoxiao"),
    ("tomato", "ganmian"),
]


@dataclass
class RenderArtifact:
    combo_name: str
    image_path: Path
    base_lab: tuple[float, float, float]
    highlight_lab: tuple[float, float, float]
    oil_lab: tuple[float, float, float]


def clamp(value: float, min_value: float, max_value: float) -> float:
    return min(max_value, max(min_value, value))


def hash_seed(seed: str) -> int:
    value = 2166136261
    for char in seed:
        value ^= ord(char)
        value = (value * 16777619) & 0xFFFFFFFF
    return value


def random_unit(seed: str, salt: str) -> float:
    return (hash_seed(f"{seed}:{salt}") % 10_000) / 10_000


def rgba(color: str, alpha: float) -> tuple[int, int, int, int]:
    r, g, b = ImageColor.getrgb(color)
    return r, g, b, int(clamp(alpha, 0, 1) * 255)


def draw_sauce(draw: ImageDraw.ImageDraw, sauce_layer: Image.Image, sauce: dict, rule: dict, seed: str) -> None:
    base = rgba(sauce["palette"]["base"], 0.9)
    shadow = rgba(sauce["palette"]["shadow"], 0.72)
    highlight = rgba(sauce["palette"]["highlight"], 0.48)
    oil = rgba(sauce["palette"]["oil"], 0.34)
    spread_offset = random_unit(seed, "spread") * 0.1 - 0.05

    cx = 320 + spread_offset * 60
    cy = 318
    rx = 126 + rule["attachmentArea"] * 72
    ry = 84 + rule["pooling"] * 44

    draw.ellipse((cx - rx, cy - ry, cx + rx, cy + ry), fill=base)
    draw.ellipse((cx - rx * 0.4, cy - ry * 0.62, cx + rx * 0.26, cy - ry * 0.1), fill=highlight)
    draw.ellipse((cx - rx * 0.12, cy - ry * 0.1, cx + rx * 0.54, cy + ry * 0.32), fill=oil)

    path_draw = ImageDraw.Draw(sauce_layer)
    for index in range(3):
        sx = 210 + index * 70 + spread_offset * 50
        sy = 190 + index * 12
        ex = 245 + index * 62
        ey = 438 + index * 24 + rule["flowPath"] * 36
        width = int(16 - index * 2 + sauce["viscosity"] * 5)
        path_draw.line((sx, sy, ex, ey), fill=shadow if index != 1 else oil, width=width, joint="curve")


def render_combo(index: int, sauce_type: str, noodle_shape: str, rules: dict) -> RenderArtifact:
    sauce = rules["sauces"][sauce_type]
    noodle = rules["noodles"][noodle_shape]
    rule = rules["rules"][f"{sauce_type}:{noodle_shape}"]
    seed = f"{index}:{sauce_type}:{noodle_shape}"

    canvas = Image.new("RGBA", (640, 640), (0, 0, 0, 0))
    glow = Image.new("RGBA", (640, 640), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse((112, 112, 528, 528), fill=(255, 220, 146, 90))
    glow = glow.filter(ImageFilter.GaussianBlur(radius=32))
    canvas.alpha_composite(glow)

    plate = Image.new("RGBA", (640, 640), (0, 0, 0, 0))
    plate_draw = ImageDraw.Draw(plate)
    plate_draw.ellipse((120, 128, 520, 520), fill=(50, 20, 8, 34))
    plate_draw.ellipse((145, 150, 495, 495), fill=(247, 233, 214, 236))
    plate_draw.ellipse((168, 173, 472, 468), fill=(255, 247, 236, 252))
    canvas.alpha_composite(plate)

    noodle_image = Image.open(NOODLE_DIR / NOODLE_FILE_MAP[noodle_shape]).convert("RGBA")
    noodle_scale = 360 if noodle["strandDensity"] > 0.6 else 392
    noodle_image.thumbnail((noodle_scale, noodle_scale))
    noodle_shadow = Image.new("RGBA", noodle_image.size, (0, 0, 0, 0))
    noodle_shadow.alpha_composite(noodle_image)
    noodle_shadow = noodle_shadow.filter(ImageFilter.GaussianBlur(radius=10))
    shadow_layer = Image.new("RGBA", (640, 640), (0, 0, 0, 0))
    shadow_layer.alpha_composite(noodle_shadow, dest=(320 - noodle_image.width // 2 + 4, 320 - noodle_image.height // 2 + 16))
    canvas.alpha_composite(ImageChops.multiply(shadow_layer, Image.new("RGBA", (640, 640), (80, 44, 18, 110))))
    canvas.alpha_composite(noodle_image, dest=(320 - noodle_image.width // 2, 320 - noodle_image.height // 2))

    sauce_layer = Image.new("RGBA", (640, 640), (0, 0, 0, 0))
    sauce_draw = ImageDraw.Draw(sauce_layer)
    draw_sauce(sauce_draw, sauce_layer, sauce, rule, seed)
    sauce_layer = sauce_layer.filter(ImageFilter.GaussianBlur(radius=2.4))
    canvas.alpha_composite(sauce_layer)

    shine = Image.new("RGBA", (640, 640), (0, 0, 0, 0))
    shine_draw = ImageDraw.Draw(shine)
    shine_draw.ellipse((250, 210, 388, 272), fill=rgba(sauce["palette"]["highlight"], 0.24 + sauce["gloss"] * 0.18))
    shine = shine.filter(ImageFilter.GaussianBlur(radius=18))
    canvas.alpha_composite(shine)

    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    combo_name = f"{index + 1:02d}-{sauce_type}-{noodle_shape}"
    image_path = REPORT_DIR / f"{combo_name}.png"
    canvas.save(image_path)

    return RenderArtifact(
        combo_name=combo_name,
        image_path=image_path,
        base_lab=rgb_to_lab(ImageColor.getrgb(sauce["palette"]["base"])),
        highlight_lab=rgb_to_lab(ImageColor.getrgb(sauce["palette"]["highlight"])),
        oil_lab=rgb_to_lab(ImageColor.getrgb(sauce["palette"]["oil"])),
    )


def rgb_to_lab(rgb: tuple[int, int, int]) -> tuple[float, float, float]:
    def pivot_rgb(value: float) -> float:
        value /= 255
        return ((value + 0.055) / 1.055) ** 2.4 if value > 0.04045 else value / 12.92

    r, g, b = (pivot_rgb(channel) for channel in rgb)
    x = r * 0.4124 + g * 0.3576 + b * 0.1805
    y = r * 0.2126 + g * 0.7152 + b * 0.0722
    z = r * 0.0193 + g * 0.1192 + b * 0.9505

    def pivot_xyz(value: float) -> float:
        return value ** (1 / 3) if value > 0.008856 else 7.787 * value + 16 / 116

    x, y, z = pivot_xyz(x / 0.95047), pivot_xyz(y / 1.0), pivot_xyz(z / 1.08883)
    l = 116 * y - 16
    a = 500 * (x - y)
    b_channel = 200 * (y - z)
    return l, a, b_channel


def ciede2000(lab1: tuple[float, float, float], lab2: tuple[float, float, float]) -> float:
    l1, a1, b1 = lab1
    l2, a2, b2 = lab2
    avg_lp = (l1 + l2) / 2
    c1 = math.sqrt(a1 ** 2 + b1 ** 2)
    c2 = math.sqrt(a2 ** 2 + b2 ** 2)
    avg_c = (c1 + c2) / 2
    g = 0.5 * (1 - math.sqrt((avg_c ** 7) / (avg_c ** 7 + 25 ** 7)))
    a1p = (1 + g) * a1
    a2p = (1 + g) * a2
    c1p = math.sqrt(a1p ** 2 + b1 ** 2)
    c2p = math.sqrt(a2p ** 2 + b2 ** 2)
    avg_cp = (c1p + c2p) / 2

    h1p = math.degrees(math.atan2(b1, a1p)) % 360
    h2p = math.degrees(math.atan2(b2, a2p)) % 360

    delta_lp = l2 - l1
    delta_cp = c2p - c1p

    if c1p * c2p == 0:
        delta_hp = 0
    elif abs(h2p - h1p) <= 180:
        delta_hp = h2p - h1p
    elif h2p <= h1p:
        delta_hp = h2p - h1p + 360
    else:
        delta_hp = h2p - h1p - 360

    delta_hp = 2 * math.sqrt(c1p * c2p) * math.sin(math.radians(delta_hp) / 2)

    if c1p * c2p == 0:
        avg_hp = h1p + h2p
    elif abs(h1p - h2p) <= 180:
        avg_hp = (h1p + h2p) / 2
    elif h1p + h2p < 360:
        avg_hp = (h1p + h2p + 360) / 2
    else:
        avg_hp = (h1p + h2p - 360) / 2

    t = (
        1
        - 0.17 * math.cos(math.radians(avg_hp - 30))
        + 0.24 * math.cos(math.radians(2 * avg_hp))
        + 0.32 * math.cos(math.radians(3 * avg_hp + 6))
        - 0.20 * math.cos(math.radians(4 * avg_hp - 63))
    )
    delta_ro = 30 * math.exp(-(((avg_hp - 275) / 25) ** 2))
    rc = 2 * math.sqrt((avg_cp ** 7) / (avg_cp ** 7 + 25 ** 7))
    sl = 1 + ((0.015 * ((avg_lp - 50) ** 2)) / math.sqrt(20 + ((avg_lp - 50) ** 2)))
    sc = 1 + 0.045 * avg_cp
    sh = 1 + 0.015 * avg_cp * t
    rt = -math.sin(math.radians(2 * delta_ro)) * rc

    return math.sqrt(
        (delta_lp / sl) ** 2
        + (delta_cp / sc) ** 2
        + (delta_hp / sh) ** 2
        + rt * (delta_cp / sc) * (delta_hp / sh)
    )


def build_report(artifacts: list[RenderArtifact]) -> None:
    lines = [
        "# 山西面食组合视觉差异报告",
        "",
        "说明：视觉差异度采用主色 / 高光 / 油亮点三采样的 CIEDE2000 累计值，用于反映综合色差而非单点色差。",
        "",
        "| 组合 | 参考组合 | DeltaE00 | 视觉差异度 | 图片 |",
        "| --- | --- | ---: | ---: | --- |",
    ]

    for index, artifact in enumerate(artifacts):
        best_name = "-"
        best_delta = 0.0
        for previous in artifacts[:index]:
            delta = (
                ciede2000(artifact.base_lab, previous.base_lab)
                + ciede2000(artifact.highlight_lab, previous.highlight_lab)
                + ciede2000(artifact.oil_lab, previous.oil_lab)
            )
            if delta > best_delta:
                best_delta = delta
                best_name = previous.combo_name

        score = min(best_delta, 100)
        lines.append(
            f"| {artifact.combo_name} | {best_name} | {best_delta:.2f} | {score:.2f} | [预览](./generated/shanxi-combos/{artifact.image_path.name}) |"
        )

    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    rules = json.loads(RULES_PATH.read_text(encoding="utf-8"))
    artifacts = [render_combo(index, sauce_type, noodle_shape, rules) for index, (sauce_type, noodle_shape) in enumerate(COMBOS)]
    build_report(artifacts)


if __name__ == "__main__":
    main()
