# INSTALL — Pasang 5 Skill Desain ke Hermes Agent

Target: `E:\Hermes\skills\` (HERMES_HOME kamu custom — JANGAN pakai `~/.hermes`).
Verifikasi dulu: `echo $env:HERMES_HOME` di PowerShell → harus `E:\Hermes`.

## Isi paket ini

| Folder | Sumber | Status file |
|---|---|---|
| `skills/frontend-design/` | Anthropic official (claude-code plugins) | SKILL.md asli, unduhan 2026-10-24 |
| `skills/taste-skill/` | Leonxlnx/taste-skill v2 (MIT) | SKILL.md asli (1200+ baris ruleset) |
| `skills/design-md/` | VoltAgent/awesome-design-md (MIT) | SKILL.md wrapper buatan + 2 contoh DESIGN.md + katalog |
| `skills/web-design-guidelines/` | Vercel Labs (MIT-style) | SKILL.md asli + command.md (100+ aturan) |
| `skills/playwright-visual-check/` | microsoft/playwright-cli (Apache-2.0) | SKILL.md wrapper buatan |

`DESIGN.md` di root paket = arah desain "DATASHEET" yang dipakai untuk build Z.ai —
kunci perbandingan adil. `CHALLENGE-BRIEF.md` = prompt yang diberikan ke Hermes.
`EVALUATION-RUBRIC.md` = lembar penilaian buta (blind).

## Langkah pemasangan (5 menit)

1. **Salin folder skill** — dari lokasi ekstraksi:
   ```powershell
   Copy-Item -Recurse skills\* E:\Hermes\skills\
   ```
   Struktur akhir yang benar: `E:\Hermes\skills\<nama-skill>\SKILL.md` (satu folder satu skill).

2. **Uji termuat atau tidak** — buka Hermes Agent, tanya:
   > "Sebutkan skill lokal yang bisa kamu pakai. Ada frontend-design, design-taste-frontend,
   > design-md, web-design-guidelines, playwright-visual-check?"

3. **Kalau Hermes menolak frontmatter** (pernah terjadi: field `platforms: []` kosong ditolak):
   - Buka SKILL.md yang ditolak, buang field metadata yang tidak dikenali (mis. blok
     `metadata:` milik Vercel, `license:` milik Anthropic) — sisakan `name` + `description`.
   - Isi markdown tidak perlu diubah.

4. **Install Playwright CLI** (untuk playwright-visual-check):
   ```powershell
   npm install -g @playwright/cli@latest
   playwright-cli --help          # verifikasi
   playwright-cli install --skills
   ```
   Butuh Node 18+. Kalau npm global dibatasi antivirus/permission, jalankan terminal sebagai admin.

5. **Catatan khusus taste-skill**: SKILL.md-nya mereferensi script bantu (`scripts/draw.mjs`,
   `scripts/inspect.mjs`) yang TIDAK ikut dalam file ini. Tanpa script, skill tetap bernilai
   (ruleset + alur kerja 10 langkah + house rules tetap terbaca). Untuk pengalaman penuh:
   ```powershell
   git clone https://github.com/Leonxlnx/taste-skill E:\Hermes\skills\taste-skill-full
   ```
   (butuh Node 22+ dan Chrome/Edge terpasang untuk inspector-nya).

## Verifikasi akhir
Minta Hermes: "Gunakan skill web-design-guidelines untuk audit satu file komponen kecil."
Dia harus fetch command.md dan mengeluarkan temuan format `file:line`. Kalau tidak,
cek kembali langkah 3 (frontmatter).
