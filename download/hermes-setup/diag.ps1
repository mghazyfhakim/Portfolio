# ============================================================================
# Hermes Diagnostic Script - jalankan untuk debug masalah step by step
# ============================================================================
# Jalankan:  powershell -ExecutionPolicy Bypass -File .\diag.ps1
# ============================================================================

$ErrorActionPreference = "Continue"
Set-StrictMode -Off

function Write-Step($msg) { Write-Host "[STEP] $msg" -ForegroundColor Cyan }
function Write-OK($msg)   { Write-Host "[OK]   $msg" -ForegroundColor Green }
function Write-Warn($msg) { Write-Host "[WARN] $msg" -ForegroundColor Yellow }
function Write-Err($msg)  { Write-Host "[ERR]  $msg" -ForegroundColor Red }
function Write-Info($msg) { Write-Host "       $msg" -ForegroundColor Gray }

Write-Host ""
Write-Host "=== Hermes Diagnostic ===" -ForegroundColor Cyan
Write-Host ""

# --- DIAG 1: Cek Ollama service jalan ---
Write-Step "DIAG 1: Cek Ollama service di localhost:11434"
try {
    $tags = Invoke-RestMethod -Uri "http://localhost:11434/api/tags" -Method Get -TimeoutSec 5
    Write-OK "Ollama service jalan"
    Write-Info "Models tersedia: $($tags.models.Count)"
    foreach ($m in $tags.models) {
        Write-Info "  - $($m.name)  ($([math]::Round($m.size/1GB,2)) GB)"
    }
} catch {
    Write-Err "Ollama service TIDAK jalan. Start dengan: ollama serve (di window lain)"
    exit 1
}

# --- DIAG 2: Cek custom model ada ---
Write-Step "DIAG 2: Cek custom model 'hermes-erp-b2b-id' ada"
$customModel = $tags.models | Where-Object { $_.name -eq "hermes-erp-b2b-id" -or $_.name -like "hermes-erp-b2b-id:*" }
if ($customModel) {
    Write-OK "Custom model 'hermes-erp-b2b-id' ditemukan"
} else {
    Write-Err "Custom model 'hermes-erp-b2b-id' TIDAK ditemukan di Ollama"
    Write-Host ""
    Write-Host "Jalankan command ini untuk create:" -ForegroundColor Yellow
    Write-Host "  ollama create hermes-erp-b2b-id -f .\Modelfile" -ForegroundColor White
    Write-Host ""
    Write-Host "Setelah itu, jalankan diag.ps1 lagi." -ForegroundColor Yellow
    exit 1
}

# --- DIAG 3: Cek RAM available (FIXED) ---
Write-Step "DIAG 3: Cek RAM available (rumus benar)"
$osRam = Get-CimInstance Win32_OperatingSystem
# FreePhysicalMemory di WMI = kilobytes (KB). Konversi: KB / 1024 = MB, / 1024 = GB
$availableRamGB = [math]::Round($osRam.FreePhysicalMemory / 1024 / 1024, 2)
$totalRamGB = [math]::Round((Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory / 1GB, 2)
Write-OK "RAM total: $totalRamGB GB"
Write-OK "RAM available: $availableRamGB GB"
if ($availableRamGB -lt 5) {
    Write-Warn "RAM available < 5 GB. Hermes butuh ~5-6 GB saat inference."
    Write-Host "  Tutup browser/IDE/WhatsApp dulu, lalu jalankan diag.ps1 lagi." -ForegroundColor Gray
} else {
    Write-OK "RAM available cukup untuk Hermes inference"
}

# --- DIAG 4: Test baseline function call dengan verbose output ---
Write-Step "DIAG 4: Test function call dengan verbose"
Write-Info "Prompt: 'Cek stok produk SKU-001'"
Write-Info "Estimasi 30-180 detik (model harus di-load ke RAM dari disk pertama kali)..."

$body = @{
    model = "hermes-erp-b2b-id"
    messages = @(@{ role = "user"; content = "Cek stok produk SKU-001" })
    stream = $false
    options = @{ temperature = 0.3; num_ctx = 2048 }
} | ConvertTo-Json -Depth 10

Write-Info "Body yang dikirim:"
Write-Host $body -ForegroundColor DarkGray
Write-Host ""

$startTime = Get-Date
try {
    $response = Invoke-RestMethod -Uri "http://localhost:11434/api/chat" -Method Post -Body $body -ContentType "application/json" -TimeoutSec 300
    $endTime = Get-Date
    $durationSec = [math]::Round(($endTime - $startTime).TotalSeconds, 1)

    Write-OK "Response diterima dalam $durationSec detik"
    Write-Host ""
    Write-Host "=== FULL RESPONSE OBJECT ===" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10
    Write-Host ""
    Write-Host "=== message.content (Hermes output) ===" -ForegroundColor Cyan
    Write-Host $response.message.content -ForegroundColor White
    Write-Host ""
    Write-Host "=== METRICS ===" -ForegroundColor Cyan
    Write-Info "Prompt tokens:    $($response.prompt_eval_count)"
    Write-Info "Generated tokens: $($response.eval_count)"
    Write-Info "Total tokens:     $($response.prompt_eval_count + $response.eval_count)"
    if ($response.prompt_eval_duration) {
        $promptLatencyMs = [math]::Round($response.prompt_eval_duration / 1e6, 0)
        Write-Info "First-token latency: $promptLatencyMs ms"
    }
    if ($response.eval_duration -and $response.eval_count) {
        $tps = [math]::Round($response.eval_count / ($response.eval_duration / 1e9), 2)
        Write-Info "Throughput: $tps tok/s"
    }

    # Validasi function call
    if ($response.message.content -match '"name"\s*:\s*"get_inventory"') {
        Write-OK "Function call DETECTED: get_inventory"
    } else {
        Write-Warn "Function call TIDAK terdeteksi. Response Hermes mungkin bukan tool call JSON."
        Write-Host "  Tapi ini tetap valid untuk debugging - lihat output di atas." -ForegroundColor Gray
    }
} catch {
    $endTime = Get-Date
    $durationSec = [math]::Round(($endTime - $startTime).TotalSeconds, 1)
    Write-Err "Gagal set $durationSec detik: $($_.Exception.Message)"
    Write-Host ""
    Write-Host "Kemungkinan penyebab:" -ForegroundColor Yellow
    Write-Host "  1. OOM: RAM tidak cukup load model. Tutup browser dulu." -ForegroundColor Yellow
    Write-Host "  2. Timeout: model loading lama (>300 detik). Coba lagi." -ForegroundColor Yellow
    Write-Host "  3. Model corrupt: re-pull dengan 'ollama rm interstellarninja/hermes-2-pro-llama-3-8b' lalu 'ollama pull interstellarninja/hermes-2-pro-llama-3-8b'" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Diagnostic selesai ===" -ForegroundColor Cyan
Write-Host ""
Read-Host "Tekan Enter untuk keluar"
