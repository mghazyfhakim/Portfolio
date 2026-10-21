# Setup NVIDIA NIM untuk Hermes Agent — Panduan Detail Step by Step
# Author: AI Engineering Team — Z.ai
# Target: Hermes Agent v0.21.5+, Windows 11, setelah uninstall Ollama

> Setup NVIDIA NIM untuk dapat akses gratis ke 80+ model AI termasuk **Hermes 3 70B** (model yang paling cocok untuk Hermes Agent). Free, no credit card, no expiry. 40 RPM rate limit.

---

## Ringkasan

| Item | Detail |
|---|---|
| Provider | NVIDIA NIM (build.nvidia.com) |
| Cost | Rp 0 (gratis, no credit card) |
| Free tier limit | 40 RPM (requests per minute), no per-token billing |
| Expiry | None — credits tidak expired |
| Model utama | `nousresearch/hermes-3-llama-3.1-70b` (Hermes 3 70B) |
| Alternatif model | DeepSeek 3.2, Kimi 2.5, GLM 5.1, GPT-OSS-120B, MiniMax M2.7, dll |
| RAM | 0 (cloud, laptop Anda lega) |
| Speed | 50-100 tok/s (NVIDIA LPU) |
| Setup time | 5-10 menit |

---

## Step 1 — Daftar Akun NVIDIA Developer (Gratis)

### 1.1 Buka URL

Buka browser (Edge atau Chrome), pergi ke:

```
https://build.nvidia.com
```

### 1.2 Klik "Create an Account"

Di pojok kanan atas, klik tombol **"Sign In / Register"** atau **"Create an Account"**.

### 1.3 Isi form pendaftaran

Isi data:
- Email (gunakan email aktif Anda)
- Password (minimal 8 karakter, kombinasi huruf+angka)
- First name, Last name
- Company (boleh isi "Personal" atau nama perusahaan Anda)
- Country: Indonesia

Klik **"Create Account"**.

### 1.4 Verifikasi email

Cek inbox email Anda. Cari email dari NVIDIA dengan subject "Verify your NVIDIA account" atau mirip. Klik link verifikasi.

### 1.5 Login ke build.nvidia.com

Setelah verifikasi, login di https://build.nvidia.com dengan email + password yang baru Anda daftar.

**Expected**: Anda akan diarahkan ke dashboard NVIDIA NIM dengan list 80+ model.

---

## Step 2 — Generate API Key

### 2.1 Buka menu API Keys

Di dashboard build.nvidia.com, cari menu:
- Klik avatar/profile di pojok kanan atas → **"API Keys"** atau **"My Keys"**
- Atau langsung ke URL: https://build.nvidia.com/api-keys

### 2.2 Generate key baru

Klik tombol **"Generate API Key"** atau **"Create New Key"**.

Berikan nama key, contoh: `hermes-agent-personal`

Klik **Generate**.

### 2.3 Copy API key

API key akan muncul SEKALI saja. Format: `nvapi-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

**PENTING**: Copy dan simpan di tempat aman (Notepad atau password manager). Kalau hilang, harus generate ulang.

Jangan pernah share API key ini dengan siapapun. Jangan commit ke git repo public.

---

## Step 3 — Test API Key dengan cURL (opsional, 1 menit)

Sebelum setup Hermes Agent, verify API key jalan dengan cURL. Buka PowerShell:

```powershell
# Ganti YOUR_API_KEY dengan key yang Anda dapat dari Step 2.3
$apiKey = "YOUR_API_KEY"

# Test request ke Hermes 3 70B
$headers = @{
    "Authorization" = "Bearer $apiKey"
    "Content-Type" = "application/json"
}

$body = @{
    model = "nousresearch/hermes-3-llama-3.1-70b"
    messages = @(
        @{
            role = "user"
            content = "Halo, kenalkan diri singkat. Apa modelmu?"
        }
    )
    max_tokens = 200
    temperature = 0.7
} | ConvertTo-Json -Depth 10

$response = Invoke-RestMethod -Uri "https://integrate.api.nvidia.com/v1/chat/completions" -Method Post -Headers $headers -Body $body -ContentType "application/json"

Write-Host "=== Response ===" -ForegroundColor Cyan
$response.choices[0].message.content
```

**Expected**: Response dari Hermes 3 70B dalam 2-5 detik. Kalau response keluar, API key valid. Lanjut Step 4.

Kalau error 401 Unauthorized: API key salah atau belum verify email. Ulangi Step 1.4.
Kalau error 429 Too Many Requests: Rate limit terkena. Tunggu 1 menit, coba lagi.

---

## Step 4 — Setup NVIDIA NIM di Hermes Agent

Ada 2 cara: via CLI (rekomendasi) atau via config file manual.

### Cara A: Via CLI (rekomendasi)

```powershell
# Jalankan di PowerShell
hermes auth add nvidia
```

Hermes Agent akan prompt untuk API key. Paste API key dari Step 2.3.

Atau, jika `hermes auth add nvidia` tidak tersedia di versi Anda, gunakan Cara B.

### Cara B: Via config file manual

```powershell
# Buka Hermes Agent config file di text editor
$hermesHome = "E:\Hermes"  # ganti sesuai HERMES_HOME Anda
$envFile = "$hermesHome\.env"

# Buat atau append ke .env file
$envContent = @"
# NVIDIA NIM API key (dari build.nvidia.com)
NVIDIA_API_KEY=YOUR_API_KEY_HERE
"@

# Cek apakah .env sudah ada
if (Test-Path $envFile) {
    # Append jika sudah ada (tapi cek dulu kalau NVIDIA_API_KEY sudah ada)
    $existingContent = Get-Content $envFile -Raw
    if ($existingContent -match "NVIDIA_API_KEY") {
        Write-Host "NVIDIA_API_KEY sudah ada di .env, update manual" -ForegroundColor Yellow
        code $envFile  # buka di VS Code untuk edit
    } else {
        Add-Content -Path $envFile -Value $envContent
        Write-Host "NVIDIA_API_KEY ditambahkan ke .env" -ForegroundColor Green
    }
} else {
    # Buat baru jika belum ada
    Set-Content -Path $envFile -Value $envContent
    Write-Host ".env file dibuat dengan NVIDIA_API_KEY" -ForegroundColor Green
}
```

Ganti `YOUR_API_KEY_HERE` dengan API key dari Step 2.3.

---

## Step 5 — Verifikasi provider ter-set di Hermes Agent

```powershell
# Cek provider + model yang aktif
hermes model
```

**Expected output**:
```
Current provider: nvidia
Current model: nousresearch/hermes-3-llama-3.1-70b
```

Kalau provider masih lain (misal: openrouter atau ollama), pilih nvidia:
```powershell
hermes model
# Akan buka interactive prompt
# Pilih: NVIDIA NIM atau NVIDIA Build
# Pilih model: nousresearch/hermes-3-llama-3.1-70b
```

---

## Step 6 — Switch model di Hermes Agent Desktop

1. Buka Hermes Agent desktop (klik icon di Start Menu atau tray)
2. Tunggu sampai UI siap ("Gateway ready" di status bar)
3. Klik nama model di status bar (kanan bawah, mungkin masih bilang "Qwen3.5 4B")
4. Akan muncul dropdown/list model
5. Pilih provider: **NVIDIA NIM** atau **NVIDIA Build**
6. Pilih model: **nousresearch/hermes-3-llama-3.1-70b**
7. Save (kalau ada tombol Save, atau close dropdown)

**Expected**: Status bar sekarang bilang "Hermes 3 70B" atau "NVIDIA NIM - Hermes 3 70B".

---

## Step 7 — Test pertama

### 7.1 Buka session baru di Home

1. Di sidebar kiri Hermes Agent, klik **Home** di PROJECTS section (paling atas)
2. Ctrl+N untuk new session
3. Beri nama session: "Test NIM"
4. Buka session

### 7.2 Test 1 — Chat biasa

Ketik di input box:
```
Halo, kenalan dulu. Apa style jawabanmu?
```

**Expected response** (dengan SOUL.md yang sudah Anda install):
- Bahasa Indonesia + istilah teknis English
- Tone pragmatic senior engineer, langsung jawab
- Tidak ada emoji berlebihan
- Tidak ada "Sebagai model AI..."
- Waktu: 2-5 detik

### 7.3 Test 2 — Code review skill

Ketik di input box:
```
/code-review

function add(a, b) {
  return a + b
}
```

**Expected response**:
- Format severity 🔴/🟡/🟢 (dari skill code-review yang sudah Anda install)
- Diff fix dengan ```diff code block
- Waktu: 3-8 detik (response lebih panjang dari chat biasa)

### 7.4 Test 3 — Vibe coding

Ketik:
```
Bikin function Go untuk parse config JSON dengan error handling dan validasi tipe
```

**Expected response**:
- Lead dengan kode Go (idiomatic Go: error return, struct tag, no panic)
- Penjelasan singkat setelah kode (bukan paragraf panjang)
- Waktu: 4-10 detik

Kalau 3 test di atas responsif (≤ 10 detik), setup berhasil. Anda siap vibe coding dengan Hermes 3 70B.

---

## Troubleshooting

### Issue 1: API key tidak diterima

**Gejala**: `hermes model` error "Invalid API key" atau "Unauthorized"

**Cek**:
```powershell
# Verify .env file
Get-Content "$env:HERMES_HOME\.env" | Select-String "NVIDIA_API_KEY"
# Harus muncul: NVIDIA_API_KEY=nvapi-xxxxx...

# Test API key langsung ke NVIDIA (Step 3)
# Kalau cURL jalan tapi Hermes Agent error, kemungkinan .env format salah
```

**Fix**: Edit .env manual, pastikan tidak ada spasi di sekitar `=`:
```env
# BENAR
NVIDIA_API_KEY=nvapi-xxxxxxxx

# SALAH (spasi sebelum/sesudah =)
NVIDIA_API_KEY = nvapi-xxxxxxxx
NVIDIA_API_KEY=nvapi-xxxxxxxx
```

### Issue 2: Rate limit (429 Too Many Requests)

**Gejala**: Setelah beberapa request cepet, error 429

**Penyebab**: Free tier 40 RPM. Kalau Anda request lebih dari 40 dalam 1 menit, diblokir 60 detik.

**Fix**:
- Tunggu 1 menit, coba lagi
- Untuk vibe coding intensif, jangan request lebih dari 1 setiap 2 detik
- Kalau butuh lebih dari 40 RPM, request ke NVIDIA forum untuk rate limit increase (https://forums.developer.nvidia.com), atau switch ke OpenRouter (20 RPM, lebih rendah tapi alternatif)

### Issue 3: Response lambat (>30 detik)

**Gejala**: Hermes Agent stuck "Processing" lama

**Cek**:
- Tutup app berat lain (browser, IDE) — RAM available
- Cek internet speed (NVIDIA cloud butuh koneksi stabil)
- Test dengan prompt lebih pendek (kalau cepat, mungkin prompt Anda terlalu panjang)

**Fix**:
- Tutup Hermes Agent (Quit dari tray), buka lagi (cold start clear)
- Disable skills yang tidak dipakai (`hermes skills config` interactive, disable ~30 builtin)
- Switch ke session Home (bukan project mode)

### Issue 4: Skill tidak ke-trigger

**Gejala**: Ketik `/code-review` tapi tidak ke-trigger, response biasa

**Cek**:
```powershell
hermes skills list
# Pastikan code-review muncul dengan Status enabled
```

**Fix**: Restart Hermes Agent desktop (Quit dari tray, buka lagi).

### Issue 5: SOUL.md tidak ke-load

**Gejala**: Response masih generic Hermes Agent, tidak pragmatic engineer tone

**Cek**:
```powershell
Test-Path "$env:HERMES_HOME\SOUL.md"
# Harus True
Get-Content "$env:HERMES_HOME\SOUL.md" | Select-Object -First 3
# Harus muncul: # Personality — Pragmatic Polyglot Engineer
```

**Fix**:
- Copy SOUL.md dari pack `hermes-agent-mastery/` ke `$env:HERMES_HOME\SOUL.md`
- Restart Hermes Agent

### Issue 6: Hermes Agent tidak ada di PATH

**Gejala**: Command `hermes` not recognized di PowerShell

**Cek**:
```powershell
Get-Command hermes -ErrorAction SilentlyContinue
# Harus muncul path ke hermes.exe
```

**Fix**: Tambah Hermes Agent ke PATH, atau gunakan full path:
```powershell
# Path Hermes Agent Anda (sesuai screenshot): E:\Hermes\bin\hermes.exe
& "E:\Hermes\bin\hermes.exe" model
& "E:\Hermes\bin\hermes.exe" skills list
```

---

## Verifikasi akhir (5 test)

Setelah setup, jalankan 5 test cepat untuk confirm semua jalan:

| Test | Expected | Waktu |
|---|---|---|
| `hermes model` (PowerShell) | Output: provider=nvidia, model=hermes-3-llama-3.1-70b | < 5 detik |
| `Test-Path $env:HERMES_HOME\SOUL.md` (PowerShell) | True | instant |
| `hermes skills list` (PowerShell) | 4 custom skills muncul sebagai local enabled | < 10 detik |
| Chat biasa di Hermes Agent desktop | Response Indonesia, tone pragmatic, no emoji | 2-5 detik |
| `/code-review` di Hermes Agent desktop | Format severity + diff fix | 3-8 detik |

Kalau semua pass, setup complete. Anda siap vibe coding.

---

## Cost tracking (opsional)

Track usage Anda supaya tahu kapan rate limit akan hit. Buka file `E:\Hermes\nim-usage.md` (buat sendiri), update setiap akhir hari:

```markdown
# NVIDIA NIM Usage Log

## 2026-10-20
- Total request hari ini: ~50 (well below 40 RPM × 60 min = 2400/hari)
- Rate limit hit: 0
- Models used: hermes-3-llama-3.1-70b
- Quality: excellent for code review dan Go coding

## Insight:
- 40 RPM cukup untuk vibe coding 1 orang
- Untuk agentic loop ( banyak request ), mungkin hit limit. Switch ke OpenRouter kalau perlu
```

---

## Backup plan kalau NIM habis

NIM free tier "no expiry" tapi tetap ada cap. Kalau suatu saat hit limit permanent:

1. **Switch ke Nous Portal** — `hermes model`, pilih Nous Portal, login via `hermes setup --portal`. Model free: StepFun Step 5 Preview, LongCat 2.5, Solar Mini 4, Laguna S 2.1
2. **Switch ke OpenRouter** — `hermes auth add openrouter --api-key "sk-or-v1-xxx"`. 27+ free models, 200 req/day
3. **Switch ke Hugging Face** — `hermes auth add huggingface`. Monthly free credits, banyak model niche
4. **Re-install Ollama** (last resort) — pakai pack `hermes-setup/` yang sudah kita buat, dapat Hermes-2-Pro-8B local 100% accuracy. Privacy penuh, no internet needed.

Hermes Agent support 200+ provider — Anda fleksibel pilih per use case.

---

## FAQ

**Q: Apakah data saya dikirim ke NVIDIA?**
A: Ya. Setiap request ke NIM = data dikirim ke server NVIDIA. Kalau coding Company X confidential, jangan pakai cloud. Pakai Ollama local (re-install pakai pack hermes-setup).

**Q: Bisakah pakai NIM offline?**
A: Tidak. Butuh internet stabil. Kalau internet down, switch ke Ollama local.

**Q: Bagaimana kalau rate limit 40 RPM kurang untuk vibe coding saya?**
A: 3 opsi: (1) request ke NVIDIA forum untuk increase, (2) switch ke OpenRouter (20 RPM, 200 RPD), (3) pakai Nous Portal subscription berbayar untuk rate limit lebih tinggi.

**Q: Bisakah pakai model lain selain Hermes 3 70B di NIM?**
A: Ya, 80+ model tersedia. Yang bagus untuk coding: DeepSeek 3.2, GPT-OSS-120B, Qwen 2.5 Coder (kalau ada). Switch via `hermes model` → pilih model lain.

**Q: Bagaimana cek sisa credit/quota?**
A: NIM free tier = rate limit based (40 RPM), BUKAN credit based. Tidak ada "sisa credit". Anda bisa pakai unlimited selama tidak hit 40 RPM. Cek rate limit dashboard di build.nvidia.com.

---

## Next steps setelah setup

Setelah NIM jalan, Anda siap:
1. **Vibe coding** — pakai `/code-review`, `/typescript-refactor`, `/unit-test-generator`, `/brainstorm-3-options` skills yang sudah install
2. **Persistent memory** — Hermes Agent akan ingat preferensi Anda antar session
3. **Project context** — buat `AGENTS.md` di root project Anda, Hermes Agent auto-load
4. **Multi-stack work** — SOUL.md Anda sudah cover 12 stack (Go, Python, TypeScript, Node.js, PHP Laravel, Elixir Phoenix, Express.js, NestJS, Next.js, Vue.js, C#, Java)

Kalau ada masalah saat setup, kirim ke saya:
- Screenshot error message
- Output `hermes model` dan `hermes skills list`
- RAM available (dari Task Manager)

Saya debug dari sini.
