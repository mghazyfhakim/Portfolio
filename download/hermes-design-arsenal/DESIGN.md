# DESIGN.md — Portfolio "DATASHEET" — Muhammad Ghazy Fhakim

> Dokumen arah desain (design system document) format getdesign.md / Google Stitch.
> Dipakai bersama oleh: AI engineer (Z.ai) DAN Hermes Agent — agar perbandingan hasil adil.
> Sumber metode: Frontend Design (Anthropic) + Taste Skill v2 (Leonxlnx) + Web Design Guidelines (Vercel).

---

## 1. Baca Brief-nya (Frontend Design: "ground in the subject matter")

- **Subjek**: Muhammad Ghazy Fhakim — AI engineer & web developer. Pekerjaan harian: B2B industrial
  sealing (gasket, mechanical seal, O-ring, packing) di PT Puma Makmur AE. Obsesi: AI agent systems
  (Hermes Agent, function calling, benchmark lokal), web engineering (Next.js, Go, TypeScript).
- **Audiens**: recruiter teknis, kolaborator, klien potensial.
- **Satu pekerjaan utama halaman ini**: membuktikan kompetensi lewat artefak nyata + memicu kontak.
- **Vernakular dunia subjek** (inventory 8–12 butir, sumber ide WAJIB dari sini):
  1. Gambar teknik & title block (ISO 5457) — kotak identitas di pojok drawing sheet
  2. Datasheet komponen: part number, material, rating tekanan/suhu, dimensi, toleransi
  3. Exploded view — potongan komponen yang dipecah per lapisan berlabel
  4. RAL color standard (warna cat industri) & safety orange untuk marking mesin
  5. Crosshair + koordinat mm — kursor CAD
  6. Log servis / maintenance record — riwayat tanggal + tindakan
  7. Tabel spec padat dengan stripe tonal dan band header terisi
  8. Materi seal: EPDM, Viton, PTFE, graphite — sebagai metafora "material skill"
  9. "Operating envelope" — batas tekanan & suhu tempat komponen bekerja
  10. Stamp APPROVED / QC PASSED — stempel lingkaran hasil inspeksi
  11. Plotter — mesin gambar yang menggambar garis per garis
  12. Revision block — tabel revisi dokumen di footer drawing

## 2. Kalimat Ide (Taste Skill: idea sentence)

> On this page, **the engineering datasheet & drawing sheet dari industri sealing tempat
> subjek bekerja** menjadi **sistem layout portofolio itu sendiri**: setiap section adalah
> satu "sheet" dari drawing set, setiap proyek adalah satu "komponen" dengan spec table.

Competitor test: portfolio developer lain TIDAK bisa mengklaim vernakular datasheet gasket —
itu milik subjek ini saja. "Clean and modern" bukan ide; ini yang bukan.

## 3. Palet Warna (6 token, hex bernama)

| Token | Hex | Peran |
|---|---|---|
| `--paper` | `#E9EAE6` | Kertas teknikal dingin (bukan cream hangat #F4F1EA — itu AI tell) |
| `--ink` | `#17191C` | Tinta karbon — teks utama & garis struktur tebal |
| `--steel` | `#5F6468` | Baja mesin — teks sekunder, meta |
| `--signal` | `#E4470B` | Safety orange (RAL 2009) — SATU aksen: stamp, penanda, garis aktif. Jangan untuk body text |
| `--form` | `#F4F4F1` | Bidang form/table stripe — sedikit lebih terang dari paper |
| `--caution` | `#F2C300` | Kuning industri — hanya untuk status "available", hemat |

- Kontras minimal: ink/paper ≈ 14:1 (AAA), steel/paper ≈ 5.6:1 (AA), signal/paper ≈ 3.6:1
  (hanya untuk elemen grafis & teks besar ≥24px, bukan body).
- DILARANG: gradient sebagai dekorasi, glass/blur panel, glow, shadow pada elemen diam.
- Kematian warna: tidak ada biru/indigo default, tidak ada ungu.

## 4. Tipografi

| Peran | Family | Weight | Catatan |
|---|---|---|---|
| Display / judul | **Barlow Condensed** | 600–700 | Rasa DIN — huruf signage & gambar teknik industri |
| Body | **Barlow** | 400–500 | Satu keluarga dengan display: konsisten, frugal |
| Data spec / part code / koordinat | **IBM Plex Mono** | 400–500 | HANYA di dalam spec table, part number, readout — terjustifikasi subjek |

- Skala type (fluid, clamp): display hero clamp(3.5rem, 9vw, 7.5rem); heading section
  clamp(2rem, 4.5vw, 3.5rem); body 1rem/1.6; spec value 0.8125rem.
- Line length body < 80 karakter.
- DILARANG (AI tells dari skill Frontend Design): satu kata di headline diberi warna beda,
  ALL-CAPS eyebrow label di atas tiap heading, meta string disambung middle dot "·",
  label "WORD — fragment" dengan em dash berjarak, panah "→" menempel di link/button.
- Pengecualian terkontrol: ALL-CAPS diperbolehkan HANYA untuk nilai kolom judul tabel spec
  (part no, qty, rating) karena itu format asli datasheet — bukan dekorasi di atas heading.

## 5. Konsep Layout

Halaman = satu **drawing set** ISO 5457:

1. **Sheet frame** — border tebal 2px ink melingkar viewport (fixed), tick marks di tengah
   tiap sisi, label sheet di tepi kanan atas. Seluruh konten hidup DI DALAM frame.
2. **SHEET 01 — TITLE BLOCK (hero)**: grid kotak-kotak bergaya title block drawing asli —
   PART NAME (nama, raksasa, Barlow Condensed), DESIGNATION, MATERIAL, SCALE 1:1, REV,
   DATE, DRAWN BY. Sel kanan: **exploded view SVG** potongan seal 3 lapis berlabel.
3. **MATERIAL BELT**: marquee horizontal isi material (skill) — EPDM / VITON / PTFE
   diganti TypeScript / Next.js / Go / dsb. Satu pita, kecepatan lambat, pause on hover.
4. **SHEET 02 — COMPONENT CATALOG**: daftar proyek sebagai baris spec padat — part code,
   nama, kategori, tahun, status. Hover/klik → baris mengembang menampilkan description +
   stack + hasil terukur. Komposisi list penuh-lebar, BUKAN kartu.
5. **SHEET 03 — OPERATING ENVELOPE**: kemampuan teknis sebagai tabel envelope (domain,
   material, rating) + diagram sumbu tekanan-suhu SVG sederhana dengan titik-titik domain.
   Komposisi dua kolom asimetris 7/5.
6. **SHEET 04 — SERVICE LOG**: pengalaman sebagai log maintenance: tanggal, unit, tindakan,
   hasil. Satu kolom sempit kiri (tanggal) — mono, kanan narasi.
7. **SHEET 05 — REQUEST FOR QUOTATION (contact)**: email raksasa sebagai judul, tombol
   magnetik "Send inquiry", meta lokasi/jam kerja.
8. **REVISION BLOCK (footer)**: tabel revisi asli: REV / DATE / DESCRIPTION / BY + jam
   lokal live (WIB) + koordinat kota. Sticky footer rule dipatuhi.

- Nomor sheet (01/02/…) terjustifikasi konten: drawing set memang urutan bernomor.
- Grid asimetris di dalam; margin luar frame selalu simetris.
- Section berjarak 120–180px; tidak ada stretch kosong > ½ layar.
- Setiap section punya heading yang menamai isinya (h1 tunggal di hero).

## 6. Dial (Taste Skill v2)

| Dial | Nilai | Makna |
|---|---|---|
| DESIGN_VARIANCE | TINGGI | Title-block grid, list katalog, diagram, log — tetangga tak pernah senada |
| MOTION_INTENSITY | SEDANG–TINGGI | Satu signature move + entrance + feedback; tanpa hujan efek |
| VISUAL_DENSITY | BIMODAL | Hero lapang; catalog/envelope/log padat seperti dokumen aslinya |

## 7. Signature Move & The Live Thing

- **Signature move**: exploded view SVG seal di hero — tiga lapisan (CARBON / ELASTOMER /
  BACKING) memisah seiring scroll (desktop: + hover parallax), tiap lapisan diberi label
  domain subjek: AGENT SYSTEMS / WEB ENGINEERING / INDUSTRIAL B2B.
- **The live thing**: crosshair cursor dengan readout koordinat mm live di tepi frame
  (desktop, pointer:fine saja; touch & reduced-motion → nonaktif, fallback: kursor normal).
- **Plotter load sequence**: saat load, title block tergambar berurutan (garis → teks →
  stamp), seperti plotter — sekali, orkestrasi tunggal, < 1.2s, lalu diam.
- Motion layer transform/opacity saja; SEMUA punya fallback `prefers-reduced-motion`
  (konten tampil, travel dihilangkan). Marquee berhenti. Exploded view jadi diagram statis.

## 8. Copy deck ringkas (EN — bahasa fungsional portofolio publik)

- H1: "MUHAMMAD GHAZY FHAKIM" — supporting: "AI engineer & web developer. I build agent
  systems and industrial-grade web tools — measured, benchmarked, shipped."
- Katalog: 5 komponen (lihat data.ts). Setiap baris: code, name, category, year, status,
  description 2 kalimat, stack, 1 hasil terukur.
- Envelope: 4 domain × material × rating.
- Contact CTA: "Send inquiry" — bukan "Submit".
- Placeholder data ditandai `[EDIT]` di data.ts — swap sebelum launch.

## 9. Quality floor (Web Design Guidelines — wajib lolos)

- Semantik: header/nav/main/section/footer; satu h1; label setiap section.
- Keyboard: semua interaktif reachable; focus-visible ring 2px signal orange offset 2px.
- Kontras AA untuk teks; aria-label untuk icon-only; alt text; lang="en".
- Tap target ≥ 44px; touch-action aman; `-webkit-tap-highlight-color` transparan.
- `prefers-reduced-motion` dihormati penuh; `prefers-color-scheme` TIDAK dipakai —
  sheet kertas adalah satu identitas (dark mode diharamkan oleh arah desain ini).
- Meta: title, description, theme-color #E9EAE6, favicon part-drawing.
- Tanpa layout thrash: animasi transform/opacity; scroll listener di-rAF-throttle.
