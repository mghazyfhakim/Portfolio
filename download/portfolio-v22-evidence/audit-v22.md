# Audit Web Design Guidelines (Vercel skill) — Revisi v2.2

Pipeline 5 plugin, tahap 4. Audit difokuskan pada file yang berubah di putaran
feedback ini (3 item: AI Engineer plate, StatusBoard polling, Footer 3D Ghazy).
Format: aturan → file:baris → status.

## src/data/portfolio.ts
- Portrait AI Engineer (baris 100–110): field `zoom: 1.45` dihapus →
  identik dengan portrait Software Engineer (baris 79–89) yang tidak
  punya zoom → PASS — "yg rapih" (Software Engineer card) jadi
  treatment bersama, logo duduk natural di bingkai 4:5.
- Alt tetap deskriptif ("Logo PT Puma Makmur Aneka Engineering") → PASS
- Tidak ada perubahan pada data lain → tidak ada regresi.

## src/components/portfolio/status-board.tsx
- Polling otomatis 60 dtk (POLL_MS = 60_000, baris 24): setara TTL cache
  server → setiap poll mengambil hasil fresh; cache server tetap
  dihormati → PASS
- Tombol "Periksa ulang" (baris 168–177): aria-label eksplisit
  ("Periksa ulang sekarang"), min-h-11 (touch target 44px), disabled
  saat loading, focus-visible bg-surface → PASS
- Indikator status agregat (baris 153–161): aria-live="polite",
  pulse-dot + teks "SEMUA DOMAIN LIVE" / "ADA YANG GANGGUAN",
  label "fresh" / "cache" untuk transparansi → PASS
- Countdown (baris 191–205): tabular-nums, aria-label durasi detik,
  jeda diumumkan ("polling dijeda (tab tak terlihat)") saat tab
  hidden → PASS
- Memory safety: aliveRef + abortRef + cleanup timer di unmount
  (baris 88–93) → tidak ada leak timer atau fetch ghost → PASS
- Visibility API (baris 96–110): polling pause saat tab hidden,
  resume + re-probe saat kembali → hemat bandwidth user → PASS
- Aksesibilitas: aria-live polite pada container (baris 122) → status
  terupdate diumumkan ke SR tanpa interupsi → PASS
- Fallback unreachable (baris 142–161): link manual ke 3 domain,
  teks "Buka langsung untuk memastikan" — jujur, tidak ada klaim
  karangan → PASS

## src/components/portfolio/footer.tsx
- Gambar diganti dengan monumen 3D "Ghazy" (baris 14–22) →
  tidak ada broken image, tidak ada 404 asset → PASS
- Aria-label="Monumen 3D Ghazy" pada container → PASS
- text-[clamp(4rem,16vw,16rem)] + whitespace-nowrap → tidak bocor
  viewport di mobile (clamp maksimum 16rem, viewport 390px cukup) → PASS
- Right column (menu, kontak, kredit) tidak berubah → tidak ada
  regresi → PASS
- Foto puma-portrait.jpg tidak lagi direferensikan di footer; masih
  dipakai di heroPanels[0] → asset masih relevan, tidak jadi orphan → PASS

## src/app/globals.css
- .footer-scene perspective 1200px (baris 202–205) → PASS
- .footer-monument transform rotateX(-12deg) rotateY(11deg) — mirror
  dari .stat-monument (rotateX(14deg) rotateY(-9deg)) supaya tidak
  terbaca duplikat → PASS
- .footer-3d ekstrusi 16 langkah text-shadow em-based TANPA blur
  (baris 214–233) — hard-edge, satu-satunya pengecualian "no shadow"
  di DESIGN.md (sudah didokumenkan untuk stat-3d, sekarang extend
  ke footer) → PASS
- Hover 3D hanya pada (hover:hover) and (pointer:fine) — baris
  235–239 → perangkat sentuh tidak kena sticky-hover → PASS
- prefers-reduced-motion: .footer-monument transition:none, tilt
  statis dipertahankan (baris 271–274) → PASS
- will-change: transform hanya pada .footer-monument (baris 211) →
  hemat komposit di laptop 12GB → PASS

## Playwright CLI (tahap 5)
- 44 screenshot (22 desktop + 22 mobile): hero, 4 pelat tentang
  (termasuk AI Engineer TANPA zoom), 5 pelat karya, band + penjabaran,
  monumen 3D, tile, StatusBoard fresh + polling 3 dtk, kontak,
  footer 3D, status after-refresh, footer-3d hover → PASS
- Console errors: 0; pageerror: 0; requestfailed: 0
  (console-errors.json) → PASS
- VLM cross-check:
  - desktop-20-footer-3d-ghazy.png → 3D "Ghazy" ter-render dengan
    depth, tidak ada clipping/overflow, layout clean → PASS
  - desktop-17-status-board-fresh.png → SEMUA DOMAIN LIVE · fresh,
    Periksa ulang button, countdown "cek berikutnya dalam 41 dtk",
    "cache server 60 dtk" terlihat → PASS
  - desktop-21-status-after-refresh.png → countdown reset ke 59 dtk
    setelah klik → polling manual jalan → PASS
  - mobile-17 + mobile-20 → layout responsif stack proper,
    tidak ada horizontal scroll → PASS

## Compliance lintian (Vercel 100+ aturan)
- Touch target ≥44px: tombol "Periksa ulang" min-h-11 → PASS
- prefers-reduced-motion: lengkap untuk stat-3d + footer-3d → PASS
- aria-live: polite pada StatusBoard aggregat + row list → PASS
- tabular-nums: countdown, ms, HTTP code → PASS
- rel noreferrer + target _blank: link domain di StatusBoard → PASS
- focus-visible: outline 2px + bg-surface pada tombol → PASS
- transition property eksplisit: `transition-[background-color,transform]`
  pada tombol, `transform` pada footer-monument → PASS
- Tidak ada teks di atas foto 3D (footer 3D murni teks emas di atas
  ground hijau — kontras tinggi, AA compliant) → PASS

## Kesimpulan
- 3 item perbaikan v2.2 terpenuhi, 0 lintian Vercel gagal, 0 console
  error. Build produksi hijau. Siap user review.
