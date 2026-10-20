# Setup Guide — Hermes Agent Mastery Pack

> Step-by-step install pack ini di Hermes Agent Anda. Estimated 15 menit.

---

## Pre-flight Check

Sebelum mulai, verify 3 hal:

### 1. Hermes Agent terinstall dan jalan

Cek di Windows:
```powershell
# Cek CLI Hermes Agent
hermes --version
# Harus muncul version 0.21.5+ atau lebih baru

# PENTING: Cek HERMES_HOME (path custom atau default)
echo $env:HERMES_HOME
# Kalau kosong → HERMES_HOME default: C:\Users\<nama-anda>\.hermes\
# Kalau ada (misal: E:\Hermes) → HERMES_HOME custom, install ke situ
```

**Penting**: HERMES_HOME adalah lokasi Hermes Agent baca SOUL.md + skills. Kalau Anda install ke path yang salah, Hermes Agent tidak akan detect file-nya.

Cara cepat verify path Hermes Agent pakai:
```powershell
# Generate marker untuk verify
hermes skills opt-out --remove --dry-run 2>&1 | Select-String "Marker:"
# Output: "Marker: <HERMES_HOME>\.no-bundled-skills"
# Path di output adalah HERMES_HOME actual Anda
```

Kalau HERMES_HOME custom (bukan `C:\Users\<nama-anda>\.hermes\`), ganti semua `$hermesDir = "$env:USERPROFILE\.hermes"` di script install dengan `$hermesDir = "<path-HERMES_HOME-anda>"`.

### 2. Lokasi pack ini

Pack ini sudah Anda download ke `E:\hermes-agent-mastery\` (atau lokasi lain). Verify:

```powershell
# Ganti path sesuai lokasi Anda
$packPath = "E:\hermes-agent-mastery"

Test-Path "$packPath\SOUL.md"
Test-Path "$packPath\skills\code-review\SKILL.md"
Test-Path "$packPath\skills\typescript-refactor\SKILL.md"
Test-Path "$packPath\skills\unit-test-generator\SKILL.md"
Test-Path "$packPath\skills\brainstorm-3-options\SKILL.md"
# Semua harus True
```

### 3. Tutup Hermes Agent window

Sebelum modify file, **tutup Hermes Agent desktop app** dulu:
- Klik kanan icon Hermes Agent di system tray (kanan bawah, dekat jam)
- Pilih **Quit** (bukan minimize)

Hermes Agent akan reload file saat dibuka lagi.

---

## Step 1 — Backup existing config (jaga-jaga)

Kalau Anda sudah pernah customize Hermes Agent sebelumnya, backup dulu:

```powershell
$hermesDir = "$env:USERPROFILE\.hermes"

# Backup SOUL.md kalau ada
if (Test-Path "$hermesDir\SOUL.md") {
    Copy-Item "$hermesDir\SOUL.md" "$hermesDir\SOUL.md.backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    Write-Host "Backup SOUL.md: OK" -ForegroundColor Green
}

# Backup skills folder kalau ada
if (Test-Path "$hermesDir\skills") {
    $backupDir = "$hermesDir\skills.backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    Copy-Item "$hermesDir\skills" $backupDir -Recurse
    Write-Host "Backup skills folder: OK ($backupDir)" -ForegroundColor Green
}
```

---

## Step 2 — Install SOUL.md

```powershell
$packPath = "E:\hermes-agent-mastery"  # ganti sesuai lokasi Anda
$hermesDir = "$env:USERPROFILE\.hermes"

# Pastikan .hermes folder ada
if (-not (Test-Path $hermesDir)) {
    New-Item -ItemType Directory -Path $hermesDir -Force | Out-Null
    Write-Host "Created: $hermesDir" -ForegroundColor Green
}

# Copy SOUL.md
Copy-Item "$packPath\SOUL.md" "$hermesDir\SOUL.md" -Force
Write-Host "Installed: SOUL.md" -ForegroundColor Green

# Verify
Test-Path "$hermesDir\SOUL.md"
Get-Content "$hermesDir\SOUL.md" | Select-Object -First 5
```

---

## Step 3 — Install 4 custom skills

```powershell
$packPath = "E:\hermes-agent-mastery"
$hermesDir = "$env:USERPROFILE\.hermes"
$skillsDest = "$hermesDir\skills"

# Buat skills folder kalau belum ada
if (-not (Test-Path $skillsDest)) {
    New-Item -ItemType Directory -Path $skillsDest -Force | Out-Null
    Write-Host "Created: $skillsDest" -ForegroundColor Green
}

# Copy semua skill folder dari pack
Copy-Item "$packPath\skills\*" $skillsDest -Recurse -Force
Write-Host "Installed: 4 skills" -ForegroundColor Green

# Verify
Write-Host "`nInstalled skills:" -ForegroundColor Cyan
Get-ChildItem $skillsDest -Recurse -Filter "SKILL.md" | ForEach-Object {
    $skillName = $_.Directory.Name
    Write-Host "  - $skillName ($($_.FullName))" -ForegroundColor Gray
}
```

Expected output:
```
Installed skills:
  - code-review (C:\Users\...\hermes\skills\code-review\SKILL.md)
  - typescript-refactor (C:\Users\...\hermes\skills\typescript-refactor\SKILL.md)
  - unit-test-generator (C:\Users\...\hermes\skills\unit-test-generator\SKILL.md)
  - brainstorm-3-options (C:\Users\...\hermes\skills\brainstorm-3-options\SKILL.md)
```

---

## Step 4 — Buka Hermes Agent dan verify

1. Buka Hermes Agent desktop (klik icon di Start Menu atau tray)
2. Tunggu sampai UI siap (sampai muncul "Gateway ready" di status bar)
3. Buka session baru (Ctrl+N atau klik "New session")
4. Ketik dan send:

```
/skills
```

Atau pakai slash command di input box. Harus muncul list skills termasuk yang baru kita install.

5. Test SOUL.md ter-load. Ketik dan send:

```
Halo, siapa kamu dan apa style jawabanmu?
```

Response harus sesuai SOUL.md yang kita install — pragmatic engineer tone, langsung jawab tanpa sycophancy.

---

## Step 5 — Personalisasi SOUL.md (10 menit)

SOUL.md di pack ini punya personality "pragmatic senior engineer" — generik, cocok untuk banyak orang. Tapi untuk full potensi, edit sesuai style Anda.

Buka SOUL.md di text editor (VS Code, Notepad++, atau Notepad):

```powershell
code "$env:USERPROFILE\.hermes\SOUL.md"
# atau
notepad "$env:USERPROFILE\.hermes\SOUL.md"
```

Section yang harus Anda edit:

### A. Section "Bahasa"
Default: Indonesia untuk chat umum, English untuk istilah teknis.
Kalau Anda mau full English, ganti section ini.

### B. Section "Coding defaults"
Default: TypeScript + Python dengan convention tertentu.
Edit kalau Anda pakai stack lain (Go, Rust, Java, C#).

### C. Section "What to avoid"
Default: jangan emoji, jangan "sebagai model AI", jangan sycophancy.
Tambah hal spesifik yang Anda benci dari output AI.

### D. Section "Defaults saat ambiguous"
Default: TypeScript + Next.js + PostgreSQL kalau user tidak specify stack.
Ganti kalau default Anda beda (misal: Laravel + MySQL, atau Django + Postgres).

Setelah edit, **save file, tutup Hermes Agent, buka lagi**. Perubahan langsung apply.

---

## Troubleshooting

### Q: Skills tidak muncul saat ketik `/skills`

**Kemungkinan 1**: Hermes Agent belum restart. Tutup Hermes Agent di tray → buka lagi.

**Kemungkinan 2**: Folder structure salah. Verify:
```powershell
Get-ChildItem "$env:USERPROFILE\.hermes\skills" -Recurse -Filter "SKILL.md"
```
Harus muncul 4 file SKILL.md dengan path lengkap. Kalau tidak, ulang Step 3.

**Kemungkinan 3**: Hermes Agent tidak punya skill system (versi lama). Update Hermes Agent:
```powershell
hermes update
```

### Q: SOUL.md tidak ke-load (personality masih default)

**Kemungkinan 1**: File kosong atau whitespace only. Cek:
```powershell
$content = Get-Content "$env:USERPROFILE\.hermes\SOUL.md" -Raw
Write-Host "Length: $($content.Length) chars"
if ($content.Trim().Length -eq 0) {
    Write-Host "File kosong, copy ulang SOUL.md dari pack" -ForegroundColor Red
}
```

**Kemungkinan 2**: File ada di working directory (salah). Hermes Agent **hanya load dari `~/.hermes/SOUL.md`**, bukan dari current directory. Verify:
```powershell
Test-Path "$env:USERPROFILE\.hermes\SOUL.md"
# Harus True
```

**Kemungkinan 3**: Hermes Agent belum restart. Tutup di tray → buka lagi.

### Q: Hermes Agent error saat startup setelah install

**Kemungkinan**: SOUL.md punya syntax error atau prompt-injection pattern. Cek log:
```powershell
# Log Hermes Agent ada di
"$env:USERPROFILE\.hermes\logs\"
Get-ChildItem "$env:USERPROFILE\.hermes\logs\" | Sort-Object LastWriteTime -Descending | Select-Object -First 3 | ForEach-Object {
    Write-Host "=== $($_.Name) ===" -ForegroundColor Cyan
    Get-Content $_.FullName -Tail 50
}
```

Kalau ada error "prompt-injection pattern detected", edit SOUL.md dan hapus pattern yang ter-trigger (biasanya kalimat "ignore previous instructions" atau sejenis).

### Q: Slash command skill tidak jalan

Slash command harus invoke skill. Ketik:
```
/code-review
```

Harus muncul balasan yang bilang skill loaded + minta input kode.

Kalau tidak, cek:
```powershell
# Cek skill ter-list
hermes skills list
```

Harus muncul 4 skill yang kita install.

### Q: RAM laptop 12GB, Hermes Agent + Ollama bareng bisa?

**RAM budget**:
- Hermes Agent UI + model default (Qwen3.5 4B): 3 GB
- Ollama service idle: 200 MB
- Hermes model `hermes-erp-b2b-id` loaded di Ollama: 5 GB
- Windows + browser + IDE: 4 GB
- **Total: 12.2 GB** (over sedikit)

**Strategi**:
- Kalau lagi pakai Hermes Agent dengan Qwen3.5 4B: unload Hermes model dari Ollama
  ```powershell
  ollama stop hermes-erp-b2b-id
  ```
  Free 5 GB RAM.
- Kalau lagi butuh function call ERP via Hermes Agent: switch Hermes Agent ke Ollama provider (model `hermes-erp-b2b-id`), Qwen3.5 4B tidak dipakai.

Lihat `MODEL-STRATEGY.md` untuk detail pemilihan model per use case.

---

## Verifikasi install berhasil

Jalankan test singkat (5 menit):

### Test 1: SOUL.md ter-load

Ketik di Hermes Agent:
```
Beritahu tentang dirimu. Bagaimana style jawabanmu?
```

Harus muncul: pragmatic engineer tone, langsung jawab, no sycophancy, Indonesia + istilah teknis English.

### Test 2: Skill code-review

Ketik:
```
/code-review

function add(a, b) {
  return a + b
}
```

Harus muncul review dengan format severity 🔴/🟡/🟢 + diff fix.

### Test 3: Skill brainstorm-3-options

Ketik:
```
/brainstorm-3-options

Mau pilih database untuk ERP B2B: PostgreSQL, MySQL, atau SQLite. Mana yang bagus?
```

Harus muncul format 3 opsi (A/B/C) dengan Pro/Con/Cocok kalau, plus Rekomendasi.

### Test 4: Skill typescript-refactor

Ketik:
```
/typescript-refactor

function getUser(id: any): any {
  let user: any = null
  if (id != null) {
    user = database.find((u) => u.id === id)
  }
  return user
}
```

Harus muncul diff dengan type guard, async/await, no `any`.

### Test 5: Skill unit-test-generator

Ketik:
```
/unit-test-generator

function calculateDiscount(price: number, discount: number): number {
  if (discount < 0 || discount > 100) throw new Error('Invalid discount')
  return price - (price * discount / 100)
}
```

Harus muncul jest test dengan struktur describe/it/AAA pattern.

Kalau semua test pass, install berhasil. Lanjut ke `VIBE-CODING-WORKFLOW.md` untuk workflow lengkap.
