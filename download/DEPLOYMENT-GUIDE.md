# Panduan Deployment Portfolio v2.2 — Zero Cost

Portfolio Next.js 16 dengan API route `/api/status` (server-side fetch ke 3
domain). Pilihan deployment yang tetap gratis harus support serverless
function. Berikut 3 jalur, urut dari yang paling gampang.

---

## Jalur A — Vercel + GitHub (REKOMENDASI)

**Kenapa:** Native Next.js (zero config), free hobby tier selamanya, auto
HTTPS + CDN global, custom domain gratis.

**Limit free:** 100 GB bandwidth/bulan, 100k function invocations/hari,
1000 build/bulan. Cukup untuk portfolio pribadi 10x lipat.

### Step 1 — Push project ke GitHub

Project ini masih di workspace Z.ai (preview link). Anda perlu pindahkan
ke GitHub repo Anda (`github.com/mghazyfhakim`).

**Cara paling gampang:**

1. Download ZIP project dari preview link (atau minta saya kirim ZIP)
2. Extract di laptop Windows Anda, mis. ke `D:\portfolio`
3. Hapus folder berikut (tidak perlu di repo):
   - `node_modules/`, `.next/`, `db/`, `skills/`, `tests/`, `examples/`,
     `mini-services/`, `design-md-candidates/`, `.taste-skill*`,
     `.check/`, `.zscripts/`, `tool-results/`, `upload/`
4. Buka PowerShell di folder itu:
   ```powershell
   git init
   git add .
   git commit -m "Portfolio v2.2 — pinned-poster hijau botol + emas"
   git branch -M main
   ```
5. Buat repo baru di https://github.com/new
   - Repository name: `portfolio`
   - Visibility: **Public** (supaya Vercel hobby tier tetap gratis) atau
     Private (Vercel tetap gratis untuk personal use)
   - **JANGAN** centang "Add README", ".gitignore", "license" (sudah ada)
6. Copy perintah yang GitHub kasih, jalankan:
   ```powershell
   git remote add origin https://github.com/mghazyfhakim/portfolio.git
   git push -u origin main
   ```

### Step 2 — Connect ke Vercel

1. Buka https://vercel.com/new
2. Sign in dengan akun GitHub yang sama
3. Klik **Import** di repo `portfolio`
4. Framework Preset otomatis terdeteksi: **Next.js** → biarkan default
5. Root Directory: `./` (default)
6. Build Command: `next build` (default, otomatis)
7. Output Directory: `.next` (default)
8. Install Command: `npm install` atau `bun install` (default, terdeteksi
   dari lockfile)
9. Klik **Deploy** — tunggu 2–3 menit

Selesai! URL live: `https://portfolio-xxx-mghazyfhakim.vercel.app`

### Step 3 (opsional) — Custom domain gratis

Kalau punya domain (mis. `ghazyfawazhakim.com`, atau subdomain gratis dari
Freenom/.is-a.dev):

1. Vercel Dashboard → klik project portfolio → **Settings** → **Domains**
2. Ketik domain → klik **Add**
3. Vercel kasih instruksi DNS:
   - Untuk root domain: A record `76.76.21.21`
   - Untuk subdomain: CNAME ke `cname.vercel-dns.com`
4. Set di dashboard DNS provider Anda (Cloudflare, Namecheap, Niagahoster,
   dll)
5. Tunggu 5–30 menit propagasi DNS → SSL otomatis dipasang Vercel

### Update selanjutnya

Setiap `git push` ke `main` → Vercel auto-deploy baru (2–3 menit).
Pull request otomatis dapat preview URL terpisah.

---

## Jalur B — Cloudflare Pages + GitHub (alternatif)

**Kenapa:** Free tier lebih besar (unlimited bandwidth, 500 build/bulan),
CDN Cloudflare cepat di Indonesia.

**Trade-off:** Perlu install adapter `@cloudflare/next-on-pages`, dan ubah
`/api/status` dari `runtime = "nodejs"` ke `runtime = "edge"`. Cache
in-memory di serverless tetap jalan (per-instance, 60 dtk TTL).

### Step 1 — Push ke GitHub (sama dengan Jalur A Step 1)

### Step 2 — Sesuaikan kode untuk Cloudflare

Edit `src/app/api/status/route.ts` baris 3:
```ts
// ganti
export const runtime = "nodejs";
// jadi
export const runtime = "edge";
```

Lalu install adapter:
```powershell
npm install --save-dev @cloudflare/next-on-pages
```

Tambahkan script di `package.json`:
```json
"scripts": {
  "build:pages": "npx @cloudflare/next-on-pages"
}
```

Edit `next.config.ts` tambahkan:
```ts
const nextConfig = {
  experimental: {
    runtime: "edge",
  },
};
```

Commit & push perubahan ke GitHub.

### Step 3 — Deploy

1. Buka https://dash.cloudflare.com → sign up/login
2. Kiri → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. Pilih repo `portfolio`
4. Framework preset: **Next.js (Static HTML Export)** JANGAN, pilih
   **Next.js** biasa
5. Build command: `npx @cloudflare/next-on-pages`
6. Build output directory: `.vercel/output/static` (output adapter)
7. Klik **Save and Deploy** — tunggu 5–10 menit (build Cloudflare lebih
   lambat dari Vercel)

URL live: `https://portfolio-xxx.pages.dev`

---

## Jalur C — GitHub Pages (TIDAK disarankan)

**Kenapa tidak:** GitHub Pages hanya bisa serve static file. API route
`/api/status` (server-side fetch) tidak jalan. Anda harus rewrite status
check jadi client-side fetch langsung ke 3 domain — tapi CORS preflight akan
gagal karena ketiga domain Anda mungkin tidak set `Access-Control-Allow-
Origin: *`.

**Workaround jika tetap mau:**

1. Tambahkan header CORS di ketiga domain Anda:
   ```
   Access-Control-Allow-Origin: *
   Access-Control-Allow-Methods: GET, HEAD
   Access-Control-Allow-Headers: Content-Type
   ```
2. Ubah `StatusBoard` jadi fetch client-side langsung (hapus `/api/status`)
3. Aktifkan static export: `next.config.ts` tambahkan
   `output: "export"`
4. Tambahkan GitHub Actions workflow untuk build + deploy ke `gh-pages`
   branch

Banyak kerja, hasil tidak se-good Vercel/Cloudflare. Skip jalur ini.

---

## File yang HARUS di-push vs yang BOLEH dibuang

### HARUS di-push (repo):
```
src/                    # semua kode React/Next.js
public/                 # media (logo Puma, SIREKAS, TULT, dll) — 1.3MB
package.json
bun.lock                # atau package-lock.json — pilih salah satu
next.config.ts
tsconfig.json
tailwind.config.ts
postcss.config.mjs
eslint.config.mjs
components.json
.gitignore
DESIGN.md               # kontrak visual (opsional, tapi bagus untuk Arsip)
```

### BOLEH dibuang (jangan push, sudah di .gitignore):
```
node_modules/           # 600+ MB, diinstall ulang oleh Vercel
.next/                  # build artifact
db/                     # SQLite lokal, tidak dipakai portfolio
skills/                 # skill Z.ai internal, tidak untuk publik
tests/                  # test internal
examples/               # contoh skill Z.ai
mini-services/          # mikroservice internal
design-md-candidates/   # folder riset
.taste-skill*/          # clone repo taste-skill
.check/                 # internal
.zscripts/              # internal
tool-results/           # log tool
upload/                 # file upload user (CV, logo asli)
.env                    # hanya punya DATABASE_URL lokal, tidak dipakai
dev.log                 # log dev server
worklog.md              # internal log kerja
*.log
```

### File aman di-deploy:
- `.env` hanya berisi `DATABASE_URL=file:/home/z/my-project/db/custom.db`
  (SQLite lokal, tidak dipakai portfolio. Boleh di-ignore, tidak ada
  secret).

---

## Checklist sebelum push

- [ ] `npm run build` sukses lokal (sudah, 7.7s)
- [ ] Tidak ada secret di `.env` (sudah, hanya SQLite lokal)
- [ ] `node_modules/` dan `.next/` di-ignore (sudah di .gitignore)
- [ ] Tidak ada file besar > 50MB di repo (cek: logo SIREKAS wide 1.3MB
      OK, foto TULT < 1MB OK)
- [ ] `package.json` name + version diisi (sudah)
- [ ] `next.config.ts` tidak ada setting production-only (sudah bersih)

---

## Troubleshooting umum

**Build gagal di Vercel: "Module not found"**
- Penyebab: ada import path yang case-sensitive beda dengan lokal (Windows
  case-insensitive, Linux case-sensitive). Cek semua import `@/components/...`
  harus persis sama case-nya dengan nama file.

**Build gagal: "Type error"**
- Vercel strict mode TypeScript. Jalankan `npx tsc --noEmit` lokal dulu.
  Kalau ada error di `examples/` atau `skills/`, tambahkan ke
  `tsconfig.json` exclude.

**Status board tidak menampilkan data di production**
- Kemungkinan besar: Vercel function cold start, /api/status butuh 3
  detik pertama. Refresh halaman. Sudah by-design — StatusBoard punya
  retry + fallback unreachable.

**Foto tidak muncul**
- Cek URL `/media/xxx.jpg` — harus ada di `public/media/`. Kalau hilang
  saat push, kemungkinan .gitignore terlalu agresif. Cek:
  `git ls-files public/ | head -20`.

**Polling status board tidak jalan**
- Vercel hobby tier punya limit function duration 10 detik (cukup untuk
  fetch 3 domain dengan timeout 3 detik). Kalau makin lambat, mungkin
  region Vercel jauh. Set region ke `sin1` (Singapore) di
  vercel.json:
  ```json
  { "regions": ["sin1"] }
  ```

---

## Total biaya

- **Vercel hobby tier**: $0/bulan selamanya (selama dipakai personal,
  bukan commercial team)
- **GitHub free tier**: $0/bulan (unlimited public repo, 100 private repo)
- **Domain custom (opsional)**: Rp 150rb–500rb/tahun (.com .id .me) —
  bukan wajib, subdomain `*.vercel.app` sudah cukup untuk portfolio

**Total wajib: Rp 0/bulan.** Optional: domain custom kalau mau kelihatan
lebih profesional.
