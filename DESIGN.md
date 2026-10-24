# DESIGN.md — Portfolio Muhammad Ghazy Fawaz Hakim

> Kontrak visual binding (format Google Stitch / VoltAgent awesome-design-md).
> Diturunkan dari direction sheet taste-skill "pinned-poster" (seed 1593697766, tone bold, sector personal-portfolio).
> Sumber isu: design lama (datasheet krem+oranye) ditolak user karena terbaca AI-template. Kontrak ini menggantikannya penuh.
> **Revisi v2.1 (feedback user)**: foto arsip perkakas/terminal/mesin ditarik dari hero, potret, dan seksi angka; diganti plate logo brand (Puma Makmur, SIREKAS), foto TULT, foto Gedung Sate, dan monumen statistik 3D murni CSS. Pin "SATU ORANG." diganti "DEVELOPER.". Band teknologi diberi penjabaran kategori di bawahnya.
> File ini analisis tim sendiri, BUKAN dokumen resmi brand mana pun. Semua fakta konten dari CV user.

## 1. Visual Theme & Atmosphere

**"The Pinned Poster"** — nama sebagai bingkai yang menahan diri, sementara sistem produksi yang dijaganya lewat di bawah. Satu ide: *something stays put while everything else changes*.

- Suasana: poster malam pabrik — hijau botol pekat dengan tinta emas hangat; foto arsip dan screenshot produksi sebagai pembawa warna dunia nyata.
- Kepadatan: sinematik. Satu dominan per layar (judul monumen, satu foto penuh, satu figur raksasa); teks pendukung kecil dan tenang.
- Filosofi: kepercayaan diri tenang — engineer yang sistemnya live tidak perlu berteriak. Overkill ada pada skala tipe, panjang perjalanan scroll, dan data nyata; bukan pada ornamen.
- Bahasa konten: Bahasa Indonesia, kalimat pendek, fakta terukur dari CV. Tidak ada bukti karangan.

## 2. Color Palette & Roles

| Token | Hex | Peran fungsional |
|---|---|---|
| `--bg` | `#133621` | Ground seluruh halaman (hijau botol). Tidak pernah berubah kecuali seksi inversi. |
| `--surface` | `#1a4429` | Panel satu tingkat lebih terang dari ground (baris status, blok pendukung). |
| `--ink` | `#f4d96c` | SEMUA teks di atas ground/foto (emas hangat). Teks berjalan selalu full ink, bukan abu. |
| `--muted` | `#b3a55e` | Teks sekunder: peran di bawah nama, caption pendukung, legal. Tetap ≥ 4.5:1 di atas `--bg`. |
| `--accent` | `#f4d96c` | Aksen = tombol solid & satu indikator "live". Dipakai pada aksi utama dan satu hal lain, tidak lebih. |
| `--accent-ink` | `#133621` | Teks DI ATAS aksen emas (tombol, seksi inversi). |
| `--inverse-bg` | `#f4d96c` | Seksi kontak: seluruh layar dibalik (latar emas, tinta hijau). Tidak ada gradasi apa pun. |
| `--scrim` | `rgba(10,20,13,0.55→0.78)` | Scrim netral gelap HANYA di band teks di atas foto (legibility). Bukan dekorasi. |

Aturan warna: satu ground, satu tinta, satu aksen. Tidak ada gradasi, tidak ada glow, tidak ada bayangan pada elemen diam. Setiap panel/pelat boleh punya latar foto nyata; teks di atasnya selalu lewat scrim atau`--ink` solid yang terbaca. Pemisah permukaan = langkah tone, bukan garis.

## 3. Typography Rules

Dua wajah, tidak lebih. Semua ukuran memetakan ke 5 langkah berikut.

| Role | Face | Spec |
|---|---|---|
| Display / monumen | **Anton** 400 | Uppercase, tracking -0.01em, leading 0.86. Monumen hero ~9.5vw satu baris; pin seksi 12vw; figur statistik 17vw; band teknologi 8vw. |
| Text | **Work Sans** 400 | Body 17–19px, leading 1.5. Caption 15–16px. |
| Text emphasis / link | **Work Sans** 600 | Label aksi, nama di bawah potret (18px), link footer. |

Langkah tipe (clamp):
```css
--step-small: clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem);   /* 13–14px */
--step-body:  clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem);    /* 17–19px */
--step-lead:  clamp(1.25rem, 1.1rem + 0.7vw, 1.625rem);      /* 20–26px */
--step-head:  clamp(2.5rem, 1.2rem + 5vw, 5.5rem);           /* 40–88px */
--step-fig:   clamp(7.5rem, 17vw, 17.5rem);                  /* figur raksasa */
```

Larangan tipe: TANPA monospace (kecuali di dalam blok kode nyata — halaman ini tidak punya), TANPA label kapital kecil ber-tracking lebar, TANPA nomor indeks 01/02/03, TANPA eyebrow di atas judul. Angka yang berdampingan: `font-variant-numeric: tabular-nums`. Judul dua baris maksimal di semua lebar. `text-wrap: balance` pada display.

## 4. Component Stylings

- **Tombol**: solid `--accent` emas, teks `--accent-ink`, sudut siku (radius 0 di seluruh halaman — diputuskan sekali), padding 14×22px, Work Sans 600. Hover: latar `--ink`, teks tetap hijau, translateY(-1px). Fokus: `focus-visible` outline 2px `--ink` offset 3px. Tekan: translateY(0).
- **Link nav / footer**: Work Sans 600, warna `--ink`; hover turun ke `--muted` + underline; fokus visible.
- **Brand plates (potret peran)**: logo brand full-bleed di atas warna dasar resminya (Puma Makmur: hexagon putih di hitam murni; SIREKAS: wordmark krem di navy `#0a3464`), rasio 4:5 sama dengan foto, overlay `tinted` yang sama. Logo yang dipakai dua kali (Puma Makmur) diberi variasi skala img 1.45x agar tidak terbaca duplikat. Foto TULT memakai perlakuan foto biasa.
- **Baris status (live thing)**: `--surface` tanpa border, radius 0; nama domain Work Sans 600; status = titik bulat 10px emas (live) / muted (tak terjangkau) + teks; latensi `tabular-nums`; waktu cek `Intl.DateTimeFormat('id-ID')`.
- **Baris judul pelat karya**: tahun kiri · nama kapital tengah (Anton 22–30px) · fakta kanan, semua 15px kecuali nama; di atas scrim 90px; posisi vertikal identik 50% di setiap pelat.
- **Caption potret**: nama 18px Work Sans 600, peran 14px `--muted`, satu kalimat ≤30 kata dalam ukuran 280px.
- **Foto**: satu perlakuan untuk semua — sudut siku, tanpa filter kecuali `?grayscale` untuk set arsip hitam-putih; crop rasio identik dalam satu run (2:3 hero, 4:5 about).
- **Monumen statistik 3D (v2.1)**: figur raksasa Anton di dalam `.stat-scene` (perspective 1100px, origin 50% 34%); `.stat-monument` rotateX(14deg) rotateY(-9deg) + `preserve-3d`; `.stat-3d` translateZ(40px) + ekstrusi 14 langkah `text-shadow` em-based (0.012em → 0.168em, warna perunggu gelap `#6b5c22` → `#1d1b0a`, tanpa blur). Hover (hover+pointer:fine saja): tilt melunak ke rotateX(8deg) rotateY(-4deg). Tile angka pendukung: `bg-surface`, hover translateZ(26px). `prefers-reduced-motion`: tilt tetap (statis), hover & transisi dimatikan.
- **Penjabaran teknologi (v2.1)**: di bawah band marquee, grid 1/2/3 kolom berisi 6 baris kategori (Back-end, Front-end, Data & antrean, AI, Infrastruktur, Workflow) — label 14px `--muted` 600, item 17px dipisah `·`. Tanpa kalimat tagline.

## 5. Layout Principles

- Satu grid 12 kolom, margin luar sama kiri-kanan (24px mobile, 40px desktop) di seluruh halaman. Asimetri hidup DI DALAM grid, tidak pernah di bingkai.
- Run pinned: hero 1 pin (judul satu baris ~9.5vw, 3 panel 2:3 lebar ~37% lewat di bawah, ~100svh per panel); about 1 pin ("DEVELOPER." 12vw, 4 pelat peran 4:5 bergantian kolom 2↔11). Maksimal dua tahap pinned per halaman, ≤5 viewport per pin.
- Karya: 5 pelat full-bleed 100vw×100svh menempel tanpa celah (Puma B2B screenshot, Asisten Pajak fragmen kode, Weavory screenshot, SIREKAS plate logo, SI RAMPAK SEKAR foto Gedung Sate — asosiasi Bandung/Jawa Barat untuk platform pemerintah, arah user). Baris judul (tahun · nama · fakta) hidup di lapisan overlay `position: sticky` di 50% viewport, DI ATAS semua pelat (z-30) sehingga tidak pernah tertutup; isinya bertukar mengikuti pelat aktif (IntersectionObserver). Blueprint: "the row never moves — scrolling reads like turning plates in a book".
- Jarak antar-seksi mengalir setelah run pinned: 120–240px desktop. Tidak ada kehampaan >½ layar tanpa penutup di sisi jauhnya.
- Setiap seksi dibuka heading yang menamainya; layar pertama membawa satu `h1` (nama).
- Footer: split 1 viewport — foto kiri kolom 1–6, menu kanan besar di atas field `--surface`.

## 6. Depth & Elevation

Nol bayangan, nol glow, nol kaca. Kedalaman dibuat oleh: (1) tumpukan `position: sticky` — pelat saling menimpa secara fisik saat scroll; (2) scrim legibility di atas foto; (3) langkah tone `--bg` → `--surface`; (4) monumen statistik 3D (ekstrusi text-shadow keras — SATU-satunya pengecualian, diminta eksplisit user, hard-edge bukan glow). Judul pinned DI ATAS foto pada stacking order (z-index), bukan blend-mode difference (larangan dari direction sheet: blend di atas non-abu menghasilkan hue acak).

## 7. Do's and Don'ts

**Do**
- Satu ide per layar; biarkan data nyata, screenshot karya sendiri, dan logo brand menjadi kekayaan halaman.
- Pin ≤5 viewport; setiap layar di bawah pin membawa konten penuhnya sendiri.
- Scrim band untuk teks di atas foto; uji legibility tiap pelat.
- Kredit setiap foto pihak ketiga di footer (pemilik · lisensi · sumber): Gedung Sate (CC BY-SA 3.0) dan TULT (atribusi Telkom University).
- `prefers-reduced-motion`: marquee berhenti, entrance memudar tanpa jarak tempuh; konten tetap utuh tanpa JS.

**Don't**
- Jangan gradasi, jangan blend-mode difference, jangan monospace, jangan nomor indeks, jangan eyebrow, jangan kartu identik berjejer, jangan violet/indigo/biru, jangan krem+terracotta, jangan hijau asam di atas hitam.
- Jangan mengarang bukti (testimoni, logo klien, statistik di luar CV + pernyataan user: rilis produksi tercatat di GitHub sejak v2.0.1).
- Jangan hijack scroll; semua gerak berasal dari scroll asli halaman.
- Jangan menaruh apa pun menutupi judul pinned.
- Jangan pakai foto pihak ketiga SEBAGAI produk/karya miliknya — screenshot situsnya sendiri untuk itu; logo brand hanya di pelat identitas perannya.

## 8. Responsive Behavior

- Breakpoint tunggal praktis: mobile ≤ 768px menyusun ulang komposisi, bukan sekadar mengecil.
- Monumen: satu baris ~9.5vw desktop; mobile tetap satu baris 15–17vw bila ≤10 karakter, dua baris bila lebih — never wraps (clamp + `white-space: nowrap` + ukuran teruji).
- Panel hero: mobile full-width minus margin 16px, 2:3, mulai di belakang paruh bawah judul. Potret about: 72% lebar, bergantian kiri/kanan.
- Pelat karya: mobile 100vw×82svh; baris judul turun ke bawah pelat (nama 22px, tahun+fakta 13px baris kedua).
- Figur statistik: 30vw mobile; kalimat penjelas pindah ke atas figur.
- Kontak: email patah setelah `@` dua baris 11.5vw.
- Target sentuh ≥44px; `touch-action: manipulation`; status board & marquee punya fallback non-JS/non-motion.

## 9. Agent Prompt Guide

> Bangun satu halaman Next.js (route `/`) yang tampil persis seperti kontrak ini. Ground `#133621`, tinta `#f4d96c`, aksen emas hanya untuk aksi. Anton untuk display uppercase, Work Sans untuk teks. Struktur: hero pinned-poster (judul monumen 1 baris, 3 panel 2:3 lewat di bawah) → pin "DEVELOPER." dengan 4 pelat peran 4:5 bergantian (logo Puma Makmur, foto TULT, logo Puma Makmur zoom 1.45x, logo SIREKAS) → 5 pelat proyek full-bleed sticky dengan baris tahun·nama·fakta di scrim → band teknologi marquee 8vw + penjabaran 6 kategori → seksi angka tanpa foto: monumen "1.331+" 3D (perspective + ekstrusi text-shadow) + 4 tile angka + papan status live → seksi kontak inversi emas dengan email display → footer split screenshot/menu. Sudut siku di mana-mana, tanpa gradasi/bayangan lembut/monospace/nomor indeks. Semua angka dan fakta dari data/portfolio.ts (sumber tunggal). Foto pihak ketiga wajib berkredit di footer.
