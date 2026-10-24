#!/usr/bin/env python3
"""Cari foto Gedung TULT / Telkom University di Wikimedia Commons.
Coba beberapa query, cetak kandidat + lisensi untuk dipilih."""
import json
import urllib.parse
import urllib.request

UA = "PortfolioAssetResearch/1.0 (personal portfolio; contact mghazyfh28@gmail.com)"

QUERIES = [
    "Telkom University",
    "TULT Telkom",
    "Telkom University Bandung campus",
]


def search(term: str) -> list[dict]:
    params = {
        "action": "query",
        "generator": "search",
        "gsrsearch": term,
        "gsrnamespace": "6",
        "gsrlimit": "40",
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
    out = []
    for p in pages.values():
        ii = (p.get("imageinfo") or [{}])[0]
        em = ii.get("extmetadata") or {}
        out.append(
            {
                "title": p.get("title", "?"),
                "w": ii.get("width"),
                "h": ii.get("height"),
                "license": (em.get("LicenseShortName") or {}).get("value", "?"),
                "artist": (em.get("Artist") or {}).get("value", "?")[:80],
                "thumb": ii.get("thumburl"),
                "page": ii.get("descriptionurl"),
                "index": p.get("index"),
            }
        )
    out.sort(key=lambda x: x.get("index") or 999)
    return out


def main() -> None:
    for q in QUERIES:
        print(f"\n=== {q} ===")
        try:
            rows = search(q)
        except Exception as e:  # noqa: BLE001
            print("  ERROR:", e)
            continue
        for r in rows[:30]:
            print(
                f"- {r['title']} | {r['w']}x{r['h']} | {r['license']} | {r['page']}"
            )


if __name__ == "__main__":
    main()
