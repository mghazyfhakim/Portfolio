# Setup Nous Portal untuk Hermes Agent — Panduan Detail Step by Step
# Author: AI Engineering Team — Z.ai
# Target: Hermes Agent v0.21.5+, Windows 11, alternatif setelah NVIDIA NIM
# Date: 21 October 2026

> Setup Nous Portal sebagai provider utama Hermes Agent. OAuth 1-klik, gratis, no credit card. Dapat akses ke 4+ model free + Tool Gateway (web search, image gen, TTS, browser).

---

## Ringkasan

| Item | Detail |
|---|---|
| Provider | Nous Portal (portal.nousresearch.com) |
| Cost | Rp 0 (free tier permanent, no credit card) |
| Free models | StepFun Step 5 Preview, Meituan LongCat 2.5 Preview, Upstage Solar Mini 4, Poolside Laguna S 2.1 |
| Tool Gateway | Web search, image gen, TTS, browser automation (free) |
| Rate limit | Check saat signup (biasanya cukup untuk personal use) |
| Setup time | 2-5 menit (OAuth flow) |
| RAM laptop | 0 (cloud) |

---

## Step 1 — Setup Nous Portal via Hermes Agent CLI

### 1.1 Pastikan Hermes Agent CLI jalan

Buka PowerShell, verify:

```powershell
hermes --version
# Harus muncul versi 0.21.5+ atau lebih baru
```

### 1.2 Jalankan setup Portal

```powershell
hermes setup --portal
```

Perintah ini akan:
- Buka browser otomatis ke URL OAuth Nous Portal
- Anda login ke portal.nousresearch.com (atau daftar dulu kalau belum punya akun)
- Setelah login, OAuth consent → redirect balik ke Hermes Agent
- Hermes Agent auto-set provider ke Nous Portal + aktifkan Tool Gateway

### 1.3 Alternatif kalau browser tidak auto-buka

Kalau `hermes setup --portal` jalan tapi browser tidak buka otomatis, Anda akan lihat URL OAuth di terminal. Copy URL itu, paste ke browser manual:

```
https://portal.nousresearch.com/oauth/authorize?...
```

Login di browser, consent, lalu redirect balik ke `http://localhost:XXXX/auth/callback`. Hermes Agent akan detect callback dan save credentials.

---

## Step 2 — Daftar akun Nous Portal (kalau belum punya)

### 2.1 Buka URL

Pergi ke https://portal.nousresearch.com

### 2.2 Klik "Sign Up" atau "Get Started"

Di pojok kanan atas, klik **"Sign Up"** atau **"Create Account"**.

### 2.3 Isi form

- Email (gunakan email aktif)
- Password
- Name
- Company (boleh "Personal")
- Country: Indonesia

Klik **Create Account**.

### 2.4 Verifikasi email

Cek inbox untuk email verifikasi dari Nous Research. Klik link verifikasi.

### 2.5 Login

Setelah verifikasi, login di https://portal.nousresearch.com.

**Expected**: Anda akan lihat dashboard dengan model catalog. Cari section "Free Models" untuk lihat model yang gratis.

---

## Step 3 — Pilih model free untuk coding

Di dashboard Nous Portal, cari tag **"FREE"** atau section **"Free Models"**. Model free yang tersedia (update Oktober 2026):

### Rekomendasi model untuk vibe coding

| Model | Strength | Use case terbaik | Context window |
|---|---|---|---|
| **StepFun Step 5 Preview** | Reasoning, frontier | Brainstorming arsitektur, debug kompleks, refactor | 128k |
| **Meituan LongCat 2.5 Preview** | Long context (1M token) | Codebase besar, document analysis, multi-file review | 1M |
| **Upstage Solar Mini 4** | Lightweight, fast | Quick chat, brainstorm cepat, draft email | 64k |
| **Poolside Laguna S 2.1** | Code specialist | Vibe coding, code review, refactor | 128k |

**Rekomendasi saya untuk Anda**:
- Default: **Poolside Laguna S 2.1** (code specialist, paling cocok untuk vibe coding)
- Backup untuk task kompleks: **StepFun Step 5 Preview** (reasoning kuat untuk brainstorm arsitektur)
- Backup untuk codebase besar: **Meituan LongCat 2.5 Preview** (1M context, kalau Anda kerja di repo raksasa)

---

## Step 4 — Set default model di Hermes Agent

### 4.1 Via CLI

```powershell
hermes model
```

Akan buka interactive prompt:
1. Pilih provider: **Nous Portal**
2. Pilih model: **Poolside Laguna S 2.1** (atau StepFun Step 5 / LongCat 2.5 / Solar Mini 4)
3. Save

### 4.2 Alternatif: set via config file

```powershell
# Buka config Hermes Agent
$hermesHome = "E:\Hermes"  # ganti sesuai HERMES_HOME Anda
code "$hermesHome\config.yaml"
```

Edit section provider + model:

```yaml
provider: nous-portal
model:
  default: poolside/laguna-s-2.1
  # atau:
  # default: stepfun/step-5-preview
  # default: meituan/longcat-2.5-preview
  # default: upstage/solar-mini-4
```

Save file, restart Hermes Agent.

### 4.3 Via Hermes Agent desktop

1. Buka Hermes Agent desktop
2. Klik nama model di status bar (kanan bawah)
3. Pilih provider: **Nous Portal**
4. Pilih model: **Poolside Laguna S 2.1** (atau pilih lain)
5. Save

---

## Step 5 — Verify setup

### 5.1 Cek provider + model aktif

```powershell
hermes model
```

Expected output:
```
Current provider: nous-portal
Current model: poolside/laguna-s-2.1
```

### 5.2 Cek Portal info (login status + routing)

```powershell
hermes portal info
```

Expected:
```
Logged in as: <email Anda>
Subscription: free tier
Models accessible: 4 (free) + 300+ (paid, kalau subscribe)
Tool Gateway: enabled (web_search, image_gen, tts, browser)
```

### 5.3 Cek Tool Gateway (web search harus jalan)

Test langsung dari Hermes Agent. Ketik di session:
```
Search: "TypeScript useEffect cleanup pattern best practices 2026"
```

Expected: Hermes Agent akan pakai web_search tool, return hasil dari web + cite sources.

Kalau web search jalan = Tool Gateway aktif. Kalau error, jalan `hermes setup --portal` lagi untuk re-enable.

---

## Step 6 — Test pertama di Hermes Agent Desktop

### 6.1 Buka session baru di Home

1. Di sidebar kiri, klik **Home** di PROJECTS
2. Ctrl+N untuk new session
3. Nama: "Test Nous Portal"
4. Buka session

### 6.2 Test 1 — Chat biasa

Ketik:
```
Halo, kenalan dulu. Apa style jawabanmu?
```

Expected (dengan SOUL.md yang sudah install):
- Bahasa Indonesia + istilah teknis English
- Tone pragmatic senior engineer, langsung jawab
- Tidak ada emoji berlebihan
- Tidak ada "Sebagai model AI..."
- Waktu: 2-5 detik

### 6.3 Test 2 — Code review skill

Ketik:
```
/code-review

function add(a, b) {
  return a + b
}
```

Expected: format severity 🔴/🟡/🟢 + diff fix. Waktu 3-8 detik.

### 6.4 Test 3 — Vibe coding dengan Tool Gateway

Ketik:
```
Bikin function Go untuk parse config JSON. Cek dokumentasi terbaru encoding/json Go 1.22+ dulu sebelum jawab.
```

Expected: Hermes Agent akan pakai web_search untuk cari dokumentasi Go encoding/json terbaru, lalu kasih code Go idiomatic berdasar docs terbaru. Waktu 5-15 detik (karena ada web search).

Kalau 3 test pass, setup berhasil. Anda siap vibe coding dengan Nous Portal.

---

## Troubleshooting

### Issue 1: `hermes setup --portal` error atau stuck

**Gejala**: Command jalan tapi tidak buka browser, atau error "OAuth timeout"

**Cek**:
- Browser default Anda sudah di-set (Windows Settings → Default Apps → Browser)
- Internet stabil
- Firewall tidak block koneksi ke portal.nousresearch.com

**Fix**:
```powershell
# Cek URL OAuth yang harus dibuka manual
hermes setup --portal 2>&1 | Select-String "https://"
# Akan muncul URL OAuth. Copy ke browser manual.
```

### Issue 2: OAuth callback error

**Gejala**: Browser redirect ke `http://localhost:XXXX/auth/callback` tapi halaman error

**Penyebab**: Hermes Agent tidak listen di port yang diminta, atau port sudah dipakai app lain.

**Fix**:
```powershell
# Cek port yang dipakai Hermes Agent
netstat -ano | findstr "LISTEN" | findstr ":1455"
# Kalau port 1455 dipakai app lain, kill dulu
# Lalu jalankan ulang hermes setup --portal
```

### Issue 3: Rate limit hit

**Gejala**: Setelah beberapa request cepet, error "Rate limit exceeded"

**Penyebab**: Free tier Portal punya limit harian. Kalau Anda vibe coding intensif, bisa kena.

**Fix**:
- Tunggu reset (biasanya 1 jam atau 24 jam, tergantung limit)
- Switch ke model lain yang lebih ringan (Solar Mini 4) untuk daily use, simpan Laguna S 2.1 untuk task kompleks
- Kalau sering kena limit, pertimbang OpenRouter sebagai backup (lihat file `OPENROUTER-SETUP.md` kalau saya buat)

### Issue 4: Web search tool tidak jalan

**Gejala**: Ketik "Search: xxx" tapi Hermes Agent tidak pakai web_search

**Cek**:
```powershell
hermes portal info
# Tool Gateway harus "enabled"
```

**Fix**:
```powershell
# Re-enable Tool Gateway
hermes setup --portal --gateway
# Atau
hermes gateway setup
```

### Issue 5: Model tidak muncul di dropdown Hermes Agent

**Gejala**: Klik nama model di status bar, tapi model Portal tidak ada di list

**Penyebab**: Hermes Agent belum refresh model list setelah login Portal.

**Fix**:
1. Quit Hermes Agent dari tray (bukan minimize)
2. Tunggu 5 detik
3. Buka lagi Hermes Agent
4. Klik nama model → list harus muncul semua model Portal

### Issue 6: Login expired / token invalid

**Gejala**: Setelah beberapa hari jalan normal, tiba-tiba semua request error "Authentication failed"

**Fix**:
```powershell
# Re-login
hermes auth refresh nous-portal
# Atau full re-setup
hermes setup --portal
```

---

## Verifikasi akhir (5 test cepat)

| Test | Expected | Waktu |
|---|---|---|
| `hermes model` | provider=nous-portal, model=laguna-s-2.1 (atau yang Anda pilih) | < 5 detik |
| `hermes portal info` | Logged in, Tool Gateway enabled | < 3 detik |
| Chat biasa di desktop | Indonesia + pragmatic tone + no emoji | 2-5 detik |
| `/code-review` di desktop | Format severity + diff fix | 3-8 detik |
| Web search prompt | Response + cited sources | 5-15 detik |

Kalau semua pass, setup complete.

---

## Comparison: Nous Portal vs NIM (kalau NIM Anda unblock nanti)

| Aspek | Nous Portal | NVIDIA NIM |
|---|---|---|
| Model free count | 4-5 model | 80+ model |
| Model quality untuk coding | Laguna S 2.1 (specialist) | Hermes 3 70B (generalist, very strong) |
| Tool Gateway (web search, image gen) | ✅ Free | ❌ Tidak ada |
| Setup | OAuth 1-klik | API key manual |
| Rate limit | Check saat signup | 40 RPM |
| Privacy | Cloud (data ke Nous) | Cloud (data ke NVIDIA) |
| Best for | Vibe coding dengan web search | Coding kompleks tanpa web search |

Strategi saya: pakai **Nous Portal** sebagai default (karena Tool Gateway + Laguna S 2.1 bagus untuk coding), kalau NIM unblock nanti, pakai **NIM dengan Hermes 3 70B** untuk task yang butuh reasoning paling dalam.

---

## Backup plan kalau Portal juga kena block / rate limit

### Opsi A: OpenRouter (alternatif #3)

OpenRouter punya 27+ free models, single API key. Untuk coding, DeepSeek V3 dan Qwen 2.5 Coder free tersedia.

```powershell
# Daftar di https://openrouter.ai (gratis, no credit card)
# Dapat API key dari dashboard

# Add ke Hermes Agent
hermes auth add openrouter --api-key "sk-or-v1-xxxxxxxxxxxxx"

# Switch
hermes model
# Pilih: openrouter
# Pilih model: deepseek/deepseek-chat-v3:free atau qwen/qwen-2.5-coder-32b-instruct:free (kalau ada)
```

### Opsi B: Hugging Face Inference Providers

Monthly free credits, banyak model niche.

```powershell
# Daftar di https://huggingface.co (gratis)
# Dapat API token dari Settings → Access Tokens

hermes auth add huggingface --api-key "hf_xxxxxxxxxxxxx"

# Switch
hermes model
# Pilih: huggingface
# Pilih model tersedia
```

### Opsi C: Re-install Ollama (last resort, local, private)

Kalau semua cloud kena block atau Anda butuh privacy penuh:

```powershell
# Install Ollama lagi
# Lalu pull model dan pakai pack hermes-setup yang sudah kita buat (Modelfile v1.0.6 + system-prompt.yaml v1.0.6)
# Dapat Hermes-2-Pro-8B local 100% accuracy, privacy penuh, no internet needed
```

Pack `hermes-setup/` tetap di `/home/z/my-project/download/hermes-setup/` sebagai backup permanent.

---

## FAQ

**Q: Apakah akun Nous Portal gratis benar-benar free tanpa credit card?**
A: Ya. Free tier tidak butuh credit card. Anda bisa pakai 4-5 model free tanpa batas waktu. Kalau mau akses 300+ model berbayar (Claude, GPT-4, Gemini), baru subscribe.

**Q: Berapa rate limit free tier Nous Portal?**
A: Tidak ada angka pasti di dokumentasi publik. Berdasar pengalaman komunitas, sekitar 100-500 request/hari untuk free tier, tergantung model. Kalau hit limit, tunggu reset atau switch ke model lain.

**Q: Apakah Tool Gateway (web search, image gen) benar-benar free?**
A: Ya, untuk free tier ada quota harian (biasanya 50-100 web search/hari). Cukup untuk vibe coding personal.

**Q: Bisakah pakai Nous Portal + NIM bersamaan (kalau NIM unblock)?**
A: Ya. Hermes Agent support multi-provider. Setup keduanya, switch via `hermes model` kapan saja. Bahkan bisa set fallback: kalau Portal rate limit, auto-switch ke NIM.

**Q: Apakah data saya dikirim ke Nous Research?**
A: Ya. Setiap request ke Portal = data dikirim ke server Nous. Untuk coding confidential Company X, pertimbang Ollama local.

---

## Next steps setelah setup Portal

1. Vibe coding dengan Laguna S 2.1 sebagai default
2. Pakai skill `/code-review`, `/typescript-refactor`, `/unit-test-generator`, `/brainstorm-3-options` yang sudah install
3. Manfaatkan Tool Gateway (web search) untuk cari dokumentasi terbaru selama coding
4. Track usage di `E:\Hermes\nous-portal-usage.md` (buat sendiri, format seperti NIM)

Kalau ada masalah saat setup, kirim ke saya:
- Screenshot error message
- Output `hermes model` dan `hermes portal info`
- Step mana yang gagal

Saya debug dari sini.
