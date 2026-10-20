# ============================================================================
# Hermes-2-Pro-Llama-3-8B Setup Script untuk Windows
# ============================================================================
# Script: setup.ps1
# Author: AI Engineering Team - Z.ai
# Tujuan: Install Ollama + pull Hermes-2-Pro + create custom Modelfile + test
# Hardware target: Windows 10/11, CPU 16GB RAM, tanpa GPU
# Runtime: PowerShell 5.1+ (default di Windows 10/11)
# Durasi eksekusi: ~10-20 menit (tergantung kecepatan internet untuk pull 5GB model)
# ============================================================================

# Strict mode - tangkap error lebih awal
$ErrorActionPreference = "Stop"
Set-StrictMode -Version 3.0

# ----------------------------------------------------------------------------
# Konfigurasi
# ----------------------------------------------------------------------------
$OllamaVersion = "0.5.0"            # Cek latest: https://github.com/ollama/ollama/releases
$ModelName = "noussphere/hermes-2-pro-llama-3-8b"
$CustomModelName = "hermes-erp-b2b-id"
$OllamaInstallPath = "$env:USERPROFILE\AppData\Local\Programs\Ollama"
$ModelfileSource = ".\Modelfile"   # File Modelfile di folder yang sama dengan script ini
$MinimumRAM_GB = 8                 # Hard minimum (Q4_K_M tuned atau Q3_K_M)
$RecommendedRAM_GB = 16             # Ideal jika ada headroom
$RequiredAvailableRAM_GB = 6       # Saat runtime, available harus ≥6GB untuk Q4_K_M tuned

# Warna output
function Write-Step($msg) { Write-Host "[STEP] $msg" -ForegroundColor Cyan }
function Write-OK($msg)   { Write-Host "[OK]   $msg" -ForegroundColor Green }
function Write-Warn($msg) { Write-Host "[WARN] $msg" -ForegroundColor Yellow }
function Write-Err($msg)  { Write-Host "[ERROR] $msg" -ForegroundColor Red }

# ----------------------------------------------------------------------------
# Pre-flight check
# ----------------------------------------------------------------------------
Write-Step "Pre-flight check: hardware & OS"

# Cek RAM
$ram = (Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory / 1GB
if ($ram -lt $MinimumRAM_GB) {
    Write-Err "RAM terdeteksi $([math]::Round($ram,1))GB. Minimum untuk Hermes-2-Pro-8B Q4_K_M adalah $MinimumRAM_GB GB."
    Write-Host ""
    Write-Host "Alternatif:" -ForegroundColor Yellow
    Write-Host "  1. Tutup aplikasi lain (browser, IDE, Docker) sebelum jalankan Hermes" -ForegroundColor Yellow
    Write-Host "  2. Jika RAM tetap kurang, pakai Q3_K_M (~3.5GB model): edit Modelfile line FROM menjadi 'noussphere/hermes-2-pro-llama-3-8b:Q3_K_M'" -ForegroundColor Yellow
    Write-Host "  3. Atau gunakan cloud GPU spot instance (lihat blueprint Chapter 5)" -ForegroundColor Yellow
    exit 1
} elseif ($ram -lt $RecommendedRAM_GB) {
    Write-Warn "RAM terdeteksi $([math]::Round($ram,1))GB. Memenuhi minimum $MinimumRAM_GB GB tapi di bawah rekomendasi $RecommendedRAM_GB GB."
    Write-Host "       Hermes akan jalan tapi throughput mungkin 4-6 tok/s (vs 6-10 tok/s di 16GB RAM)." -ForegroundColor Gray
    Write-Host "       Tips: TUTUP browser dan IDE sebelum benchmark untuk free up RAM." -ForegroundColor Gray
} else {
    Write-OK "RAM: $([math]::Round($ram,1)) GB (di atas rekomendasi $RecommendedRAM_GB GB)"
}

# Cek RAM yang saat ini tersedia (available, bukan total)
$osRam = Get-CimInstance Win32_OperatingSystem
$availableRamGB = [math]::Round($osRam.FreePhysicalMemory / 1MB / 1024, 1)
Write-Host "       RAM saat ini tersedia: $availableRamGB GB (idealnya ≥$RequiredAvailableRAM_GB GB untuk Hermes Q4_K_M tuned)" -ForegroundColor Gray
if ($availableRamGB -lt $RequiredAvailableRAM_GB) {
    Write-Warn "RAM available hanya $availableRamGB GB. Hermes butuh ~$RequiredAvailableRAM_GB GB."
    Write-Host "       Solusi (urutan):" -ForegroundColor Yellow
    Write-Host "         1. Tutup Microsoft Edge, Chrome, Firefox (browser paling boros)" -ForegroundColor Yellow
    Write-Host "         2. Tutup WhatsApp, Discord, Telegram, Spotify (chat app boros)" -ForegroundColor Yellow
    Write-Host "         3. Tutup VS Code, IntelliJ, Eclipse (IDE kalau ada)" -ForegroundColor Yellow
    Write-Host "         4. Restart Windows kalau masih kurang (RAM fragment perlu clear)" -ForegroundColor Yellow
    Write-Host "         5. Kalau Available < 5 GB setelah restart, fallback ke Q3_K_M:" -ForegroundColor Yellow
    Write-Host "            Edit Modelfile, ganti 'FROM noussphere/hermes-2-pro-llama-3-8b'" -ForegroundColor Yellow
    Write-Host "            jadi 'FROM noussphere/hermes-2-pro-llama-3-8b:Q3_K_M'" -ForegroundColor Yellow
    $continue = Read-Host "Lanjutkan saja? (y/N)"
    if ($continue -ne 'y') { exit 0 }
}

# Cek physical cores (untuk tuning num_thread di Modelfile)
$cores = (Get-CimInstance Win32_Processor).NumberOfCores
Write-OK "Physical cores: $cores (untuk tuning num_thread di Modelfile)"

# Cek disk space (butuh ~10GB free: 5GB model + 5GB headroom)
$freeSpace = (Get-PSDrive -Name C).Free / 1GB
if ($freeSpace -lt 10) {
    Write-Err "Disk space tidak cukup. Free: $([math]::Round($freeSpace,1)) GB. Butuh minimum 10 GB."
    exit 1
} else {
    Write-OK "Disk space: $([math]::Round($freeSpace,1)) GB free di C:"
}

# Cek apakah Modelfile ada di folder yang sama
if (-not (Test-Path $ModelfileSource)) {
    Write-Err "Modelfile tidak ditemukan di $ModelfileSource. Pastikan script ini dijalankan dari folder yang berisi Modelfile."
    exit 1
} else {
    Write-OK "Modelfile ditemukan: $ModelfileSource"
}

# Hint untuk 12GB RAM: tutup aplikasi berat
$ram = (Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory / 1GB
if ($ram -le 12) {
    Write-Host ""
    Write-Host "[HINT] Karena RAM Anda $([math]::Round($ram,1))GB, sebelum lanjut:" -ForegroundColor Cyan
    Write-Host "       1. Tutup browser (Chrome/Edge/Firefox) — bisa pakai 2-4GB RAM" -ForegroundColor White
    Write-Host "       2. Tutup IDE (VS Code, IntelliJ) — bisa pakai 1-3GB RAM" -ForegroundColor White
    Write-Host "       3. Tutup Docker Desktop jika tidak dipakai — bisa pakai 2-4GB RAM" -ForegroundColor White
    Write-Host "       4. Cek Task Manager (Ctrl+Shift+Esc) → tab Processes → sort by Memory" -ForegroundColor White
    $ready = Read-Host "Sudah siap? Tekan Enter untuk lanjut, atau Ctrl+C untuk batal"
}

# ----------------------------------------------------------------------------
# Step 1: Cek apakah Ollama sudah terinstall
# ----------------------------------------------------------------------------
Write-Step "Step 1: Cek Ollama installation"

$ollamaExe = Get-Command ollama -ErrorAction SilentlyContinue
if ($ollamaExe) {
    $version = (ollama --version) 2>&1
    Write-OK "Ollama sudah terinstall: $version"
} else {
    Write-Step "Step 1a: Ollama belum terinstall. Download installer..."

    $installerUrl = "https://ollama.com/download/OllamaSetup.exe"
    $installerPath = "$env:TEMP\OllamaSetup.exe"

    try {
        Invoke-WebRequest -Uri $installerUrl -OutFile $installerPath -UseBasicParsing
        Write-OK "Installer terdownload: $installerPath"
    } catch {
        Write-Err "Gagal download installer: $($_.Exception.Message)"
        Write-Host "Alternatif: download manual dari https://ollama.com/download/windows"
        exit 1
    }

    Write-Step "Step 1b: Jalankan installer (silent mode)..."
    Start-Process -FilePath $installerPath -ArgumentList "/S" -Wait
    Write-OK "Installer selesai"

    # Refresh PATH
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")

    # Verify
    $ollamaExe = Get-Command ollama -ErrorAction SilentlyContinue
    if (-not $ollamaExe) {
        Write-Err "Ollama terinstall tapi tidak ada di PATH. Restart PowerShell lalu jalankan ulang script ini."
        exit 1
    }
    Write-OK "Ollama siap: $(ollama --version)"
}

# ----------------------------------------------------------------------------
# Step 2: Start Ollama service (kalau belum jalan)
# ----------------------------------------------------------------------------
Write-Step "Step 2: Start Ollama service"

$ollamaRunning = $false
try {
    $response = Invoke-RestMethod -Uri "http://localhost:11434/api/tags" -Method Get -TimeoutSec 3 -ErrorAction Stop
    $ollamaRunning = $true
    Write-OK "Ollama service sudah jalan di http://localhost:11434"
} catch {
    Write-Step "Step 2a: Start Ollama service..."
    Start-Process -FilePath "ollama" -ArgumentList "serve" -WindowStyle Hidden
    Start-Sleep -Seconds 5

    # Verify
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:11434/api/tags" -Method Get -TimeoutSec 5
        $ollamaRunning = $true
        Write-OK "Ollama service berjalan"
    } catch {
        Write-Err "Gagal start Ollama service. Coba jalankan manual: ollama serve"
        exit 1
    }
}

# ----------------------------------------------------------------------------
# Step 3: Pull Hermes-2-Pro-Llama-3-8B model
# ----------------------------------------------------------------------------
Write-Step "Step 3: Pull model $ModelName (5GB, mungkin 5-15 menit tergantung internet)"

# Cek apakah model sudah ada
$existingModels = $response.models | ForEach-Object { $_.name }
if ($existingModels -contains $ModelName) {
    Write-OK "Model $ModelName sudah ada. Skip pull."
} else {
    Write-Step "Step 3a: Download model (silent, progress via log)..."
    $pullProcess = Start-Process -FilePath "ollama" -ArgumentList "pull", $ModelName -NoNewWindow -PassThru
    $pullProcess.WaitForExit()
    if ($pullProcess.ExitCode -ne 0) {
        Write-Err "Gagal pull model. Exit code: $($pullProcess.ExitCode)"
        Write-Host "Coba manual: ollama pull $ModelName"
        exit 1
    }
    Write-OK "Model $ModelName berhasil di-download"
}

# ----------------------------------------------------------------------------
# Step 4: Create custom model dari Modelfile (dengan system prompt ERP B2B)
# ----------------------------------------------------------------------------
Write-Step "Step 4: Create custom model $CustomModelName dari Modelfile"

$existingModels = (Invoke-RestMethod -Uri "http://localhost:11434/api/tags" -Method Get).models | ForEach-Object { $_.name }
if ($existingModels -contains $CustomModelName) {
    Write-Warn "Custom model $CustomModelName sudah ada. Akan di-replace dengan Modelfile baru."
    ollama rm $CustomModelName 2>&1 | Out-Null
}

$createOutput = ollama create $CustomModelName -f $ModelfileSource 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Err "Gagal create custom model: $createOutput"
    exit 1
}
Write-OK "Custom model $CustomModelName berhasil dibuat"

# ----------------------------------------------------------------------------
# Step 5: Test baseline function call
# ----------------------------------------------------------------------------
Write-Step "Step 5: Test baseline function call"

$testPrompt = "Cek stok produk SKU-001"
$testPayload = @{
    model    = $CustomModelName
    messages = @(
        @{
            role    = "user"
            content = $testPrompt
        }
    )
    stream   = $false
    options  = @{
        temperature = 0.3
        num_ctx     = 2048     # tuned untuk 12GB RAM (single-channel, budget ketat)
    }
} | ConvertTo-Json -Depth 10

Write-Host "  Test prompt: '$testPrompt'" -ForegroundColor Gray
try {
    $testResponse = Invoke-RestMethod -Uri "http://localhost:11434/api/chat" -Method Post -Body $testPayload -ContentType "application/json" -TimeoutSec 120
    $responseText = $testResponse.message.content
    Write-OK "Response diterima:"
    Write-Host "  $responseText" -ForegroundColor White

    # Validasi apakah response mengandung tool call JSON
    if ($responseText -match '"name"\s*:\s*"get_inventory"') {
        Write-OK "Test PASS - Hermes memanggil get_inventory dengan benar"
    } else {
        Write-Warn "Test WARNING - Response tidak mengandung tool call get_inventory. Periksa output di atas."
    }
} catch {
    Write-Err "Gagal test baseline: $($_.Exception.Message)"
    exit 1
}

# ----------------------------------------------------------------------------
# Step 6: Print summary & next steps
# ----------------------------------------------------------------------------
Write-Host ""
Write-Host "================================================================" -ForegroundColor Green
Write-Host " SETUP SELESAI" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Model tersedia:"
ollama list
Write-Host ""
Write-Host "Endpoint API: http://localhost:11434"
Write-Host "Custom model name: $CustomModelName"
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Jalankan benchmark:    .\benchmark.ps1"
Write-Host "  2. Test dengan eval set:  lihat eval-set.json untuk 10 prompt"
Write-Host "  3. Integrate ke app:      panggil POST http://localhost:11434/api/chat"
Write-Host "                            dengan model = '$CustomModelName'"
Write-Host ""
Write-Host "Troubleshooting:"
Write-Host "  - Ollama lambat:          edit Modelfile, kurangi num_ctx ke 4096"
Write-Host "  - RAM kurang:            tutup app lain, cek Task Manager"
Write-Host "  - CPU pegging 100%:      kurangi num_thread di Modelfile ke (cores - 2)"
Write-Host ""
