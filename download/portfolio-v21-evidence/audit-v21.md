# Audit Web Design Guidelines (Vercel skill) — Revisi v2.1

Pipeline 5 plugin, tahap 4. Audit difokuskan pada file yang berubah di putaran
feedback ini. Format: aturan → file:baris → status.

## src/data/portfolio.ts
- Alt text deskriptif & spesifik (bukan "image of") — baris 44, 52, 59, 81, 92, 102, 114, 174, 184 → PASS
- Fakta dari sumber tunggal (CV + pernyataan user): rilis "tercatat di GitHub
  sejak v2.0.1" (baris 85), stat "81 commit" (baris 222) — menggantikan klaim
  v2.4.0→v2.5.0 sesuai koreksi user → PASS
- Kredit foto pihak ketiga yang masih tampil lengkap dengan lisensi + sumber
  (baris 240–255: Gedung Sate CC BY-SA 3.0; TULT atribusi Telkom University) → PASS

## src/components/portfolio/stats-live.tsx
- Heading seksi `sr-only` + `aria-labelledby="angka-title"` — baris 10–13 → PASS
  ( heading terlihat "ANGKA PRODUKSI" tetap sebagai <p> statis, bukan heading duplikat )
- Angka pendukung `tabular-nums` — baris 32 → PASS
- Tidak ada teks di atas foto → risiko kontras hilang sama sekali; figur emas
  #f4d96c di atas ground #133621 (kontras tinggi, sama dengan v2) → PASS
- Animasi baru (tilt/ekstrusi) statis secara default; hanya hover + reveal;
  fallback `prefers-reduced-motion` di globals.css:218–225 → PASS
- data-reveal dipisah dari elemen transform 3D (wrapper luar vs .stat-monument
  dalam, baris 22–26) supaya entrance tidak menimpa tilt → PASS

## src/components/portfolio/about-run.tsx
- Label pin "SATU ORANG." → "DEVELOPER." (baris 11) sesuai feedback user → PASS
- `zoom` di img (baris 31) murni presentasi; alt tetap informatif; tidak
  mengubah urutan DOM/aksessibilitas → PASS
- figcaption: nama 600, peran muted, kalimat ≤30 kata → PASS (unchanged)

## src/components/portfolio/proof-band.tsx
- List teknologi tetap tersedia sebagai <ul class="sr-only"> (baris 15–19) → PASS
- Penjabaran kategori (baris 39–49): grid responsif 1/2/3 kolom, label 600
  muted + item reguler; tidak ada angka indeks/eyebrow (aturan DESIGN.md) → PASS
- Tagline dihapus; tidak ada teks baru di atas band bergerak → PASS

## src/components/portfolio/footer.tsx
- Foto kiri kini screenshot karya sendiri (puma-portrait.jpg, baris 10–17)
  dengan alt bermakna → PASS
- Kalimat kredit menyesuaikan: hanya 2 foto pihak ketiga yang tampil
  (Gedung Sate + TULT) → PASS
- Link kredit: target _blank + rel noreferrer + fokus visible (unchanged) → PASS

## src/app/globals.css
- .stat-3d ekstrusi: 14 langkah text-shadow em-based TANPA blur (baris
  158–175) — hard-edge, bukan glow; dokumen sebagai satu-satunya pengecualian
  "no shadow" di DESIGN.md §6 → PASS
- Hover 3D hanya aktif pada (hover:hover) and (pointer:fine) — baris 177–181,
  191–195; perangkat sentuh tidak mendapat efek sticky-hover → PASS
- prefers-reduced-motion: transisi dimatikan, tilt statis dipertahankan
  (baris 218–225) → PASS
- will-change: transform hanya pada .stat-monument (baris 155) — hemat
  komposit di laptop 12GB → PASS

## Playwright CLI (tahap 5)
- 36 screenshot desktop (1440×900) + mobile (390×844): hero, 4 pelat tentang,
  5 pelat karya, band + penjabaran, monumen 3D, tile, kontak, footer → lolos
- Console errors: 0; pageerror: 0; requestfailed: 0 (console-errors.json)
- 404 aset: tidak ada (semua /media/* baru ter-resolve)

## Catatan lisensi
- Foto TULT bersumber dari situs kampus (label "Campus Life – Telkom
  University") — TIDAK ada lisensi CC eksplisit. Atribusi dicantumkan di
  footer. Bila user punya foto TULT pribadi, timpa
  `public/media/tult-portrait.jpg` (rasio 4:5) — tidak perlu ubah kode.
