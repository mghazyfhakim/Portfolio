#!/usr/bin/env python3
"""Olah aset brand untuk portfolio v2.1 (feedback user):
1. logo-puma.png       — crop HEXAGON saja dari banner "PT. PUMA MAKMUR AE",
                          ditempel di kanvas hitam 4:5 (800x1000).
2. logo-sirekas.png    — wordmark Sirekas di kanvas navy 4:5 (800x1000).
3. logo-sirekas-wide.png — plate wide 1920x1080 untuk pelat karya SIREKAS,
                          logo diposisikan agak ke atas (baris judul pelat di 50%).
4. tult-portrait.jpg   — crop 4:5 foto menara TULT (700x1159 -> 800x1000).
Sekaligus hapus media yang tidak lagi terpakai."""
from PIL import Image
import os
from PIL import ImageFilter

UP = "/home/z/my-project/upload"
TR = "/home/z/my-project/tool-results"
MEDIA = "/home/z/my-project/public/media"

os.makedirs(MEDIA, exist_ok=True)


# ---------------------------------------------------------------- 1. PUMA
def puma_plate() -> None:
    src = Image.open(f"{UP}/Puma Makmur AE (WH-01).jpg").convert("RGB")
    w, h = src.size
    print(f"puma source: {w}x{h}")

    # deteksi kluster kolom putih (logo putih di atas hitam)
    gray = src.convert("L")
    px = gray.load()
    col_has = []
    for x in range(w):
        cnt = 0
        for y in range(0, h, 2):
            if px[x, y] > 90:
                cnt += 1
        col_has.append(cnt)

    # cari run kolom pertama (hexagon) — gap minimal 12 kolom sebagai pemisah
    GAP = 12
    runs = []
    start = None
    gap = 0
    for x, c in enumerate(col_has):
        if c > 0:
            if start is None:
                start = x
            gap = 0
        else:
            if start is not None:
                gap += 1
                if gap >= GAP:
                    runs.append((start, x - gap))
                    start = None
                    gap = 0
    if start is not None:
        runs.append((start, w - 1))
    print("runs:", runs[:4])
    if not runs:
        raise SystemExit("hexagon tidak terdeteksi")

    x0, x1 = runs[0]
    # rentang baris logo di dalam kolom tersebut
    y0, y1 = h, 0
    pxx = src.load()
    for x in range(x0, x1 + 1):
        for y in range(h):
            r, g, b = pxx[x, y]
            if r > 90 and g > 90 and b > 90:
                if y < y0:
                    y0 = y
                if y > y1:
                    y1 = y
    pad = 6
    x0, x1 = max(0, x0 - pad), min(w, x1 + pad)
    y0, y1 = max(0, y0 - pad), min(h, y1 + pad)
    hexa = src.crop((x0, y0, x1, y1))
    print(f"hexagon crop: {hexa.size}")

    # kanvas 4:5 hitam, hexagon ~62% tinggi kanvas
    CW, CH = 800, 1000
    target_h = int(CH * 0.62)
    scale = target_h / hexa.height
    target_w = int(hexa.width * scale)
    hexa_big = hexa.resize((target_w, target_h), Image.LANCZOS)
    canvas = Image.new("RGB", (CW, CH), (0, 0, 0))
    canvas.paste(
        hexa_big,
        ((CW - target_w) // 2, (CH - target_h) // 2),
    )
    canvas.save(f"{MEDIA}/logo-puma.png")
    print("OK logo-puma.png", canvas.size)


# ------------------------------------------------------------- 2-3. SIREKAS
def _sirekas_wordmark_rgba(pad_ratio: float = 0.06) -> Image.Image:
    """Ekstrak wordmark krem sebagai RGBA (alpha = kecerahan), bebas seam.
    Bg sumber punya gradasi halus sehingga paste persegi meninggalkan tepi."""
    import numpy as np

    src = Image.open(f"{UP}/Sirekas.png").convert("RGB")
    arr = np.asarray(src).astype(float)
    lum = arr.mean(axis=2)
    # soft alpha: jaga anti-alias tepi (jangan biner)
    alpha = np.clip((lum - 110.0) / (210.0 - 110.0), 0.0, 1.0)
    solid = alpha > 0.35
    ys, xs = np.where(solid)
    if len(xs) == 0:
        raise SystemExit("wordmark sirekas tidak terdeteksi")
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    pw = int((x1 - x0) * pad_ratio)
    ph = int((y1 - y0) * pad_ratio)
    x0, x1 = max(0, x0 - pw), min(src.width, x1 + pw)
    y0, y1 = max(0, y0 - ph), min(src.height, y1 + ph)
    a = Image.fromarray((alpha * 255).astype("uint8")).crop((x0, y0, x1, y1))
    a = a.filter(ImageFilter.GaussianBlur(radius=0.6))
    # warna wordmark: median piksel terang
    lit = arr[solid]
    color = tuple(int(v) for v in np.median(lit, axis=0))
    rgba = Image.new("RGBA", a.size, color + (0,))
    rgba.putalpha(a)
    return rgba


def sirekas_plates() -> None:
    wm = _sirekas_wordmark_rgba()
    bg = (10, 52, 100)  # navy sumber (median tepi)
    print("sirekas wordmark:", wm.size, "bg:", bg)

    def sharp(im: Image.Image) -> Image.Image:
        # dua tahap unsharp agar upscale 4x dari source 190px tetap kaku
        s = im.filter(ImageFilter.UnsharpMask(radius=2, percent=110, threshold=1))
        return s.filter(ImageFilter.UnsharpMask(radius=1, percent=60, threshold=1))

    # portrait 4:5 — wordmark ~70% lebar kanvas
    CW, CH = 800, 1000
    tw = int(CW * 0.70)
    th = int(wm.height * tw / wm.width)
    big = sharp(wm.resize((tw, th), Image.LANCZOS))
    canvas = Image.new("RGBA", (CW, CH), bg + (255,))
    canvas.alpha_composite(big, ((CW - tw) // 2, (CH - th) // 2))
    canvas.convert("RGB").save(f"{MEDIA}/logo-sirekas.png")
    print("OK logo-sirekas.png", (CW, CH), "wm:", (tw, th))

    # wide 1920x1080 — pusat vertikal ~40% (di atas scrim baris judul 50%)
    WW, WH = 1920, 1080
    tw = 780
    th = int(wm.height * tw / wm.width)
    big = sharp(wm.resize((tw, th), Image.LANCZOS))
    canvas = Image.new("RGBA", (WW, WH), bg + (255,))
    cx = (WW - tw) // 2
    cy = int(WH * 0.40) - th // 2
    cy = max(24, min(WH - th - 24, cy))
    canvas.alpha_composite(big, (cx, cy))
    canvas.convert("RGB").save(f"{MEDIA}/logo-sirekas-wide.png")
    print("OK logo-sirekas-wide.png", (WW, WH), "paste y=", cy, "wm:", (tw, th))


# ----------------------------------------------------------------- 4. TULT
def tult_portrait() -> None:
    src = Image.open(f"{TR}/tult-a.jpeg").convert("RGB")
    w, h = src.size
    print(f"tult source: {w}x{h}")
    crop_h = int(w * 5 / 4)  # 700x875
    top = 120
    if top + crop_h > h:
        top = h - crop_h
    im = src.crop((0, top, w, top + crop_h)).resize((800, 1000), Image.LANCZOS)
    im.save(f"{MEDIA}/tult-portrait.jpg", quality=88)
    print("OK tult-portrait.jpg", im.size)


# ------------------------------------------------------------- 5. CLEANUP
def cleanup() -> None:
    unused = [
        "asian-sealing-product-industrial-gasket.jpg",
        "zenith-z-19-terminal.jpg",
        "interior-of-the-machine-shop-at-the.jpg",
        "interior-of-the-machine-shop-at-the.png",
        "yosowilangun-sta-130807-2521-lmj.jpg",
        "pajak-wide.png",
        "pajak-portrait.png",
        "tult.jpg",
        "asian-sealing-product-industrial-gasket.png",
    ]
    for f in unused:
        p = f"{MEDIA}/{f}"
        if os.path.exists(p):
            os.remove(p)
            print("removed", f)


if __name__ == "__main__":
    puma_plate()
    sirekas_plates()
    tult_portrait()
    cleanup()
    print("\nSelesai. Isi public/media:")
    for f in sorted(os.listdir(MEDIA)):
        print(" -", f, os.path.getsize(f"{MEDIA}/{f}"), "bytes")
