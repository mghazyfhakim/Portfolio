#!/usr/bin/env python3
"""Verifikasi + unduh foto TULT dari Wikimedia Commons (CC BY 4.0).
Simpan ke public/media/tult.jpg + tulis metadata kredit ke JSON."""
import json
import urllib.parse
import urllib.request

UA = "PortfolioAssetResearch/1.0 (personal portfolio; contact mghazyfh28@gmail.com)"
FILE_TITLE = "File:Mount Malabar TULT 2024.jpg"
OUT = "/home/z/my-project/public/media/tult.jpg"
META_OUT = "/home/z/my-project/tool-results/tult-meta.json"


def get_info() -> dict:
    params = {
        "action": "query",
        "titles": FILE_TITLE,
        "prop": "imageinfo",
        "iiprop": "url|size|extmetadata",
        "iiurlwidth": "1600",
        "format": "json",
    }
    url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        data = json.load(r)
    pages = (data.get("query") or {}).get("pages") or {}
    if not pages:
        raise SystemExit(f"Respons tak terduga: {json.dumps(data)[:500]}")
    page = next(v for v in pages.values() if isinstance(v, dict))
    ii = (page.get("imageinfo") or [{}])[0]
    em = ii.get("extmetadata") or {}

    def strip(v: str | None) -> str:
        if not v:
            return ""
        import re

        return re.sub(r"<[^>]+>", "", v).strip()

    return {
        "title": page.get("title"),
        "thumb": ii.get("thumburl"),
        "w": ii.get("thumbwidth"),
        "h": ii.get("thumbheight"),
        "license": (em.get("LicenseShortName") or {}).get("value", ""),
        "licenseUrl": (em.get("LicenseUrl") or {}).get("value", ""),
        "artist": strip((em.get("Artist") or {}).get("value", "")),
        "descPage": ii.get("descriptionurl"),
        "credit": strip((em.get("Credit") or {}).get("value", "")),
    }


def download(url: str, dest: str) -> None:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r, open(dest, "wb") as f:
        f.write(r.read())


def main() -> None:
    meta = get_info()
    print(json.dumps(meta, indent=2, ensure_ascii=False))
    if not meta.get("thumb"):
        raise SystemExit("TIDAK ADA thumburl — batal.")
    download(meta["thumb"], OUT)
    json.dump(meta, open(META_OUT, "w"), ensure_ascii=False, indent=2)
    print("TERSIMPAN:", OUT)


if __name__ == "__main__":
    main()
