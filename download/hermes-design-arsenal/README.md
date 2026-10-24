# Hermes Design Arsenal — Kit 5 Skill Desain untuk A/B Test

Kit ini menjawab dua permintaan sekaligus:

1. **Portfolio dibangun dua kali** — oleh Z.ai (sudah selesai, live) dan oleh Hermes Agent
   (jalankan `CHALLENGE-BRIEF.md`), lalu dinilai buta dengan `EVALUATION-RUBRIC.md`.
2. **Lima plugin desain terpasang di Hermes** — file skill siap salin ke `E:\Hermes\skills\`.

## Struktur

```
hermes-design-arsenal/
├── README.md                  ← file ini
├── INSTALL.md                 ← cara pasang ke E:\Hermes\skills\ (5 menit)
├── CHALLENGE-BRIEF.md         ← brief identik untuk Hermes (copy-paste utuh)
├── EVALUATION-RUBRIC.md       ← lembar nilai buta A/B (maks 42)
├── DESIGN.md                  ← arah desain "DATASHEET" (kontrak visual bersama)
└── skills/
    ├── frontend-design/       ← Anthropic official, SKILL.md asli
    ├── taste-skill/           ← Leonxlnx taste-skill v2 (MIT), SKILL.md asli
    ├── design-md/             ← wrapper + katalog VoltAgent (MIT) + 2 contoh DESIGN.md
    ├── web-design-guidelines/ ← Vercel Labs, SKILL.md asli + command.md (100+ aturan)
    └── playwright-visual-check/ ← wrapper Microsoft Playwright CLI (Apache-2.0)
```

## Provenance & lisensi (jujur, siap audit)

| Skill | Repo resmi | Lisensi | File dalam kit |
|---|---|---|---|
| frontend-design | anthropics/claude-code → plugins/frontend-design | Anthropic terms | unduhan mentah 2026-10-24 |
| taste-skill v2 | Leonxlnx/taste-skill | MIT | unduhan mentah (ruleset utuh) |
| awesome-design-md | VoltAgent/awesome-design-md | MIT | katalog + 2 contoh + wrapper |
| web-design-guidelines | vercel-labs/agent-skills | per repo | SKILL.md + command.md asli |
| playwright-visual-check | microsoft/playwright-cli | Apache-2.0 | wrapper perintah CLI |

Contoh DESIGN.md (Vercel, Linear) adalah analisis pihak ketiga dari tim VoltAgent —
BUKAN dokumen resmi brand. Jangan klaim endorse; jangan pakai logo mereka.

## Urutan kerja yang disarankan

1. Baca `INSTALL.md` → pasang 5 skill + Playwright CLI (± 5 menit).
2. Copy-paste `CHALLENGE-BRIEF.md` ke Hermes Agent, biarkan dia kerja sampai lapor.
3. Sementara Hermes bekerja, lihat hasil sisi Z.ai (sudah live + screenshot audit di
   folder `portfolio-audit-screenshots/`).
4. Simpan kedua hasil, screenshot, nilai buta dengan rubric, baru buka identitas.

## Catatan versi

- File SKILL.md diunduh mentah pada 2026-10-24. Repo hulu bisa berubah; kalau Hermes
  terasa ketinggalan perilaku, re-download dari repo resmi di tabel atas.
- taste-skill v2 masih eksperimen (versi 2.x); pinned v1 tersedia di repo yang sama.
