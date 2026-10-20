---
Task ID: main
Agent: main (Z.ai)
Task: Build blueprint strategi PDF untuk Hermes-Powered B2B ERP & Company Website (dual-track, zero-cost hybrid) sesuai klarifikasi user.

Work Log:
- Klarifikasi 8 dimensi via AskUserQuestion: Hermes=NousResearch, Deliverable=Blueprint PDF, Track=Dual-track (A=production optimize, B=greenfield), Scope=ERP+Website+Hermes Agent+Integration Layer, Budget=Zero cost, Stack=Ikut rekomendasi, Deployment=Hybrid, Bahasa=Bilingual heading + Bahasa Indonesia body.
- Load skill PDF (Report route), baca report.md (1704 baris), cover.md (985), palette.md (252), fonts.md (103), overflow.md (300+), charts.md, pagination.md, typography.md.
- Susun outline 13 sections (cover + 12 chapters).
- Generate cascade palette dengan seed 42 → tech blue-teal theme (#1f6c92 accent, #32454e header fill, #f4f5f5 page bg).
- Tulis script body PDF (`/home/z/my-project/scripts/build_blueprint_body.py`) ~1470 baris: TocDocTemplate, install_font_fallback, 12 chapter bilingual, 8 tabel (palette HEADER_FILL + TABLE_STRIPE), JSON code block untuk function calling schema, callout_row metric cards, header/footer dengan page number.
- Sanitize & execute → error: Noto Sans SC tidak tersedia sebagai static weight file (hanya variable font). Fix: skip registrasi, pakai SarasaMonoSC untuk CJK fallback.
- Sukses generate body PDF: 16 halaman.
- Tulis cover HTML (`/home/z/my-project/scripts/blueprint_cover.html`): Template 01 HUD Data Terminal, ultra-thick vertical anchor line, grid background 2% opacity, 6 tag chips, meta block, footer.
- Cover validate: 2 issue (text-line gap 34px < 40px min, text-text overlap 60px). Fix: geser content ke left:145px (gap 44px), restructure title block tanpa span.accent, geser bottom-rule ke bottom:120px.
- Render cover via html2poster.js --width 794px → 154 KB PDF.
- Merge cover + body via pypdf dengan normalisasi A4 (toleransi 0.3pt).
- pdf_qa.py round 1: 1 error (page size mismatch 595.9 vs 595.3), 10 warnings (6 em-dash di awal baris, 4 callout table not centered).
- Fix 1: tighten normalisasi A4 ke 0.3pt tolerance.
- Fix 2: replace 102 occurrences " — " → "&nbsp;— " (non-breaking space em-dash) agar em-dash selalu menempel kata sebelumnya.
- Fix 3: rewrite callout_row sebagai single Table N-column × 2-row (bukan N nested Tables) sehingga validator hanya melihat satu outer table yang centered.
- Fix 4: replace em-dash placeholder di tabel cost sheet (baris Domain, kolom Tier) dengan "n/a".
- pdf_qa.py final: 13 pass, 0 warning, 0 error. PDF QA PASS.

Stage Summary:
- Deliverable: `/home/z/my-project/download/Hermes_B2B_ERP_Website_Blueprint.pdf` (336 KB, 17 halaman).
- Konten: 12 chapter bilingual heading + Bahasa Indonesia body, 8 tabel data (palette-compliant), 1 JSON code block (tool schema), 6 callout metric cards, cover Template 01 HUD.
- Quality: PASS pdf_qa (page size consistent, font embedded, no overflow, fill ratio adequate, margins symmetric, table centered, TOC populated, punctuation clean).
- Scripts persisted untuk iterasi: build_blueprint_body.py, blueprint_cover.html, merge_blueprint.py.
- Total biaya operasional di dokumen: Rp 0 - ~170rb/bulan (cloud free-tier + on-prem Hermes listrik + domain). Selaras dengan karakter frugal user.
