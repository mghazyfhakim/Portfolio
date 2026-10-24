# CRITIQUE — Portfolio "Pinned Poster" (ronde akhir, format taste-skill critique.md §4)

Tanggal: 2026-10-24 · Viewport dinilai: 1440 / 768 / 390 · Bukti: .taste-skill/inspect/*.jpg, .check/*.png

## Skor (bobot Awwwards)
- Komposisi 8.2 — monumen pinned benar-benar menahan bingkai; setiap layar punya satu dominan (judul, pelat, figur, email display). Pelat karya membaca seperti buku pelat berkat baris overlay yang tak bergerak.
- Tipografi 8.5 — Anton sebagai monumen (9.5vw/12vw/17vw) + Work Sans tenang; rasio display:body jauh di atas median studi; tanpa monospace, tanpa eyebrow, tanpa nomor indeks.
- Warna 8.0 — hijau botol + emas hangat, satu inversi (band teknologi) + satu inversi penuh (kontak); aksen hanya pada aksi; foto membawa warna dunia nyata.
- Imaji 8.3 — 6 screenshot nyata situs live milik subjek + 5 foto arsip berkredit (CC BY/PD) + 1 fragmen UI digambar kode (data-ui). Semua gambar nyata, nol placeholder.
- Gerak 7.8 — signature move = pinned story ×2; marquee 40 detik (berhenti di reduced-motion); entrance berjenjang opacity 0.35→1 + rise; hover/fokus di semua kontrol. Dimeter: melewati ambang still-page.
- Salinan 8.0 — Bahasa Indonesia, fakta murni dari CV (1.331+ test, 35+ PR, 0 bug, HKI, v2.4.0→v2.5.0), nol bukti karangan; email nyata; doman nyata.
- **Total tertimbang ± 8.0** (ambang "bagus" panel = 7.5).

## Tiga masalah teratas + status
1. ~~Judul pelat tertutup pelat berikutnya saat transisi~~ → DIPERBAIKI: baris judul pindah ke overlay sticky (z-30) yang tak pernah tertutup; isinya bertukar per pelat aktif. Lebih setia ke kalimat blueprint "the row never moves".
2. ~~Zona data-reveal terbaca "kosong" oleh DOM-pass meter~~ → DIPERBAIKI: floor opacity entrance 0.35 (fade-rise tetap terasa, konten tak pernah hilang dari pengukuran/pengguna).
3. ~~Sideways overflow 108px~~ → DIPERBAIKI: scale-[1.15] dihapus dari img pelat (crop via object-cover) + overflow-x: clip di html.

## Keputusan desain yang dipertahankan (dengan justifikasi satu kalimat)
- `pinned-over-picture` + `long-pin` (WARN): judul menyeberangi foto ADALAH ide hero blueprint pinned-poster ("the middle letters sit on the image"); legibility dijaga tint 32% multiply + emas pada semua panel.
- `no-footage` (WARN): tidak ada klip jujur milik subjek yang bisa dipakai; footage pabrik orang lain justru menyesatkan di halaman yang menjual kejujuran data.
- `size-count` 15 (WARN): sistem tipe fluid 5 peran (small/body/lead/head/fig) menghasilkan nilai antara clamp; peran tetap lima.
- `empty-middle` (WARN): artefak lebar track marquee terduplikasi + pelat full-bleed; sheet film membuktikan tiap layar tersusun penuh.
- Jeda satu layar (frame 10, about tail): "deliberate rest" satu-satunya di halaman — diizinkan aturan rumah.

## Laporan pipeline 5 skill (taste step 10)
1. **Frontend Design (Anthropic)** — arah diambil dari vernakular subjek (engineer yang menjaga estate produksi live), bukan estetika default; lima AI-tell didokumenkan dan dihindari.
2. **Taste Skill (MIT)** — dijalankan PENUH: draw.mjs membagi 3 arah (seed 1593697766) → pinned-poster dipilih atas dasar inventaris subjek; house rules + laws diterapkan; lint.mjs 0 FAIL; inspect.mjs 0 FAIL di 1440/768/390; critique tertulis di atas.
3. **Awesome DESIGN.md (VoltAgent)** — kontrak visual ditulis di project root (DESIGN.md, format Stitch 9 seksi) dari direction sheet; build melacak token per baris; bukan file brand resmi.
4. **Web Design Guidelines (Vercel)** — audit per file:line dieksekusi; temuan diperbaiki (touch target 44px, aria-live, tabular-nums, rel noreferrer, transition eksplisit, sr-only list untuk marquee, dst.).
5. **Playwright CLI (Microsoft)** — verifikasi browser nyata via agent-browser (screenshot 1440/768/390 + console + errors + fokus keyboard + klik navigasi): 0 error console, 0 page error, semua interaksi responsif.

## Arah, ide, live thing
- Direction: **The pinned poster** (seed 1593697766, tone bold, sector personal-portfolio) — Anton / Work Sans / hijau botol + emas.
- Kalimat ide: "Estate produksi yang dia jaga sendirian menjadi panel-panel pinned-poster: namanya menahan bingkai, sistem yang LIVE hari ini lewat di bawahnya."
- Live thing: papan status produksi — /api/status mengecek 3 domain asli (timeout 3 dtk, cache 60 dtk), menampilkan LIVE + latensi + waktu WIB; fallback jujur bila tak terjangkau.

## Gambar terpakai (wajib lapor)
- Screenshot milik subjek (diambil sendiri via browser): puma-portrait/wide, weavory-portrait/wide, pajak (tidak terpakai — login kosong; diganti fragmen data-ui).
- Arsip berkredit (kredit tampil di footer): Gedung Sate (Gunawan Kartapranata, CC BY-SA 3.0, Wikimedia); Industrial Gasket (Asian sealing product, CC BY-SA 4.0, Wikimedia); Zenith Z-19 (ajmexico, CC BY 2.0, Flickr); Machine shop Petone 1924 (A.P. Godber, Public domain, Wikimedia); Menara air Yosowilangun (Wibowo Djatmiko, CC BY-SA 3.0, Wikimedia).
- Digambar kode: ChatFragment (data-ui) — fakta nyata: nama produk, Gemini 3.8 Flash, 3 kemampuan dari CV. Tidak ada percakapan fiktif.

## Konten contoh yang harus diganti sebelum rilis
- TIDAK ADA — seluruh angka, nama, URL, email, telepon diambil dari CV user. Satu baris tambahan ("Terbuka untuk peran full-stack, back-end, dan AI engineering") berasal dari pernyataan user sendiri.

## Cek yang TIDAK dijalankan
- inspect.mjs film lengkap dengan scenes.mjs (halaman tak memakai scroll-scene library taste-skill — pinned story diimplementasi manual dengan CSS sticky murni).
