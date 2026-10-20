# ============================================================================
# Hermes Benchmark Script untuk Windows
# ============================================================================
# Script: benchmark.ps1
# Author: AI Engineering Team - Z.ai
# Tujuan: Ukur 3 metrik kritis Hermes:
#   1. Latency first-token (ms) - berapa lama sampai token pertama muncul
#   2. Throughput (token/detik) - kecepatan generation setelah first-token
#   3. Function call accuracy (%) - berapa dari 10 eval prompt yang benar
# Output: console + benchmark-result.json (untuk tracking history)
# Durasi: ~10-20 menit (10 prompt x ~60-90 detik per prompt di CPU 16GB)
# ============================================================================

$ErrorActionPreference = "Continue"
Set-StrictMode -Off

# ----------------------------------------------------------------------------
# Konfigurasi
# ----------------------------------------------------------------------------
$ModelName = "hermes-erp-b2b-id"
$OllamaEndpoint = "http://localhost:11434"
$EvalSetPath = ".\eval-set.json"
$OutputPath = ".\benchmark-result.json"

function Write-Step($msg) { Write-Host "[STEP] $msg" -ForegroundColor Cyan }
function Write-OK($msg)   { Write-Host "[OK]   $msg" -ForegroundColor Green }
function Write-Warn($msg) { Write-Host "[WARN] $msg" -ForegroundColor Yellow }
function Write-Err($msg)  { Write-Host "[ERROR] $msg" -ForegroundColor Red }

# ----------------------------------------------------------------------------
# Pre-flight check
# ----------------------------------------------------------------------------
Write-Step "Pre-flight check"

# Hint untuk 12GB RAM: tutup aplikasi berat
$ram = (Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory / 1GB
if ($ram -le 12) {
    Write-Warn "RAM $([math]::Round($ram,1))GB terdeteksi. Untuk hasil benchmark akurat:"
    Write-Host "       TUTUP browser, IDE, Docker Desktop, dan app berat lain sebelum lanjut." -ForegroundColor Gray
    $osRam = Get-CimInstance Win32_OperatingSystem
    $availableRamGB = [math]::Round($osRam.FreePhysicalMemory / 1MB / 1024, 1)
    Write-Host "       RAM available saat ini: $availableRamGB GB (idealnya ≥ 6GB untuk Q4_K_M tuned)" -ForegroundColor Gray
    if ($availableRamGB -lt 6) {
        Write-Err "RAM available hanya $availableRamGB GB. Hermes butuh ~6GB. Tutup dulu app berat (browser, WhatsApp, IDE) lalu re-run benchmark."
        Write-Host "       Kalau setelah tutup app masih < 6 GB, restart Windows dulu." -ForegroundColor Yellow
        exit 1
    }
}

try {
    $tagsResponse = Invoke-RestMethod -Uri "$OllamaEndpoint/api/tags" -Method Get -TimeoutSec 5
    $existingModels = $tagsResponse.models | ForEach-Object { $_.name }
    if ($existingModels -notcontains $ModelName) {
        Write-Err "Model $ModelName tidak ditemukan. Jalankan setup.ps1 dulu."
        Write-Host "Available models: $($existingModels -join ', ')"
        exit 1
    }
    Write-OK "Model $ModelName tersedia"
} catch {
    Write-Err "Ollama service tidak jalan di $OllamaEndpoint. Start dengan: ollama serve"
    exit 1
}

if (-not (Test-Path $EvalSetPath)) {
    Write-Err "Eval set tidak ditemukan: $EvalSetPath"
    exit 1
}

# ----------------------------------------------------------------------------
# Load eval set
# ----------------------------------------------------------------------------
Write-Step "Load eval set dari $EvalSetPath"
$evalSet = Get-Content $EvalSetPath -Raw | ConvertFrom-Json
Write-OK "Loaded $($evalSet.prompts.Count) prompt eval"

# ----------------------------------------------------------------------------
# Run benchmark
# ----------------------------------------------------------------------------
Write-Step "Run benchmark - ini akan butuh ~10-20 menit"

$results = @()
$totalCorrect = 0
$totalLatencyMs = 0
$totalThroughput = 0
$totalEvalDuration = 0

$index = 0
foreach ($prompt in $evalSet.prompts) {
    $index++
    Write-Host ""
    Write-Host "[$index/$($evalSet.prompts.Count)] Prompt: $($prompt.prompt)" -ForegroundColor Gray

    $payload = @{
        model    = $ModelName
        messages = @(
            @{
                role    = "user"
                content = $prompt.prompt
            }
        )
        stream   = $false
        options  = @{
            temperature = 0.3
            num_ctx     = 2048
        }
    } | ConvertTo-Json -Depth 10

    $startTime = Get-Date
    try {
        $response = Invoke-RestMethod -Uri "$OllamaEndpoint/api/chat" -Method Post -Body $payload -ContentType "application/json" -TimeoutSec 300
        $endTime = Get-Date
        $duration = ($endTime - $startTime).TotalSeconds

        $responseText = $response.message.content
        $evalCount = $response.eval_count
        $promptEvalCount = $response.prompt_eval_count
        $totalTokens = $evalCount + $promptEvalCount

        # Hitung latency first-token (approximation: prompt_eval_duration / 1e9 detik, dari nanoseconds)
        $firstTokenLatencyMs = if ($response.prompt_eval_duration) { [math]::Round($response.prompt_eval_duration / 1e6, 0) } else { 0 }

        # Hitung throughput (token/detik untuk eval, exclude prompt)
        $throughput = if ($response.eval_duration -gt 0) { [math]::Round($evalCount / ($response.eval_duration / 1e9), 2) } else { 0 }

        # Validasi function call: cek apakah expected_tool_name muncul di response
        $isCorrect = $false
        $validationErrors = @()

        if ($responseText -match ('"name"\s*:\s*"' + [regex]::Escape($prompt.expected_tool_name) + '"')) {
            # Tool name benar - sekarang cek parameter
            $allParamsMatch = $true
            foreach ($param in $prompt.expected_params.PSObject.Properties) {
                $paramName = $param.Name
                $paramValue = $param.Value
                # Cek apakah parameter ada di response JSON
                $paramPattern = '"' + [regex]::Escape($paramName) + '"\s*:\s*'
                if ($paramValue -is [string]) {
                    $paramPattern += '"' + [regex]::Escape($paramValue) + '"'
                } elseif ($paramValue -is [int] -or $paramValue -is [double]) {
                    $paramPattern += [regex]::Escape($paramValue.ToString())
                } elseif ($paramValue -is [boolean]) {
                    $paramPattern += if ($paramValue) { 'true' } else { 'false' }
                } else {
                    # Object/array - skip deep validation untuk baseline
                    continue
                }
                if ($responseText -notmatch $paramPattern) {
                    $allParamsMatch = $false
                    $validationErrors += "Param '$paramName' expected '$paramValue' not found"
                }
            }
            if ($allParamsMatch) {
                $isCorrect = $true
                $totalCorrect++
            }
        } else {
            $validationErrors += "Tool name '$($prompt.expected_tool_name)' not found in response"
        }

        $status = if ($isCorrect) { "PASS" } else { "FAIL" }
        $statusColor = if ($isCorrect) { "Green" } else { "Red" }
        Write-Host "  Status: $status" -ForegroundColor $statusColor
        Write-Host "  Latency first-token: $firstTokenLatencyMs ms" -ForegroundColor Gray
        Write-Host "  Throughput: $throughput tok/s" -ForegroundColor Gray
        Write-Host "  Total tokens: $totalTokens (prompt: $promptEvalCount, gen: $evalCount)" -ForegroundColor Gray
        if (-not $isCorrect) {
            Write-Host "  Validation errors: $($validationErrors -join '; ')" -ForegroundColor Yellow
            Write-Host "  Response: $responseText" -ForegroundColor DarkGray
        }

        $totalLatencyMs += $firstTokenLatencyMs
        $totalThroughput += $throughput
        $totalEvalDuration += $duration

        $results += [PSCustomObject]@{
            prompt_id            = $prompt.id
            prompt               = $prompt.prompt
            expected_tool_name   = $prompt.expected_tool_name
            expected_params      = $prompt.expected_params
            response             = $responseText
            is_correct           = $isCorrect
            validation_errors    = $validationErrors
            latency_first_token  = $firstTokenLatencyMs
            throughput_tps       = $throughput
            total_tokens         = $totalTokens
            prompt_tokens        = $promptEvalCount
            generation_tokens    = $evalCount
            duration_seconds     = [math]::Round($duration, 2)
        }
    } catch {
        Write-Err "  Gagal: $($_.Exception.Message)"
        $results += [PSCustomObject]@{
            prompt_id          = $prompt.id
            prompt             = $prompt.prompt
            response           = $null
            is_correct         = $false
            validation_errors  = @("Exception: $($_.Exception.Message)")
            latency_first_token = 0
            throughput_tps     = 0
            total_tokens       = 0
            duration_seconds   = 0
        }
    }
}

# ----------------------------------------------------------------------------
# Aggregate metrics
# ----------------------------------------------------------------------------
$accuracy = if ($results.Count -gt 0) { [math]::Round(($totalCorrect / $results.Count) * 100, 1) } else { 0 }
$avgLatencyMs = if ($results.Count -gt 0) { [math]::Round($totalLatencyMs / $results.Count, 0) } else { 0 }
$avgThroughput = if ($results.Count -gt 0) { [math]::Round($totalThroughput / $results.Count, 2) } else { 0 }

Write-Host ""
Write-Host "================================================================" -ForegroundColor Green
Write-Host " BENCHMARK SUMMARY" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
Write-Host "Model:                  $ModelName"
Write-Host "Hardware:               CPU $((Get-CimInstance Win32_Processor).NumberOfCores) cores, RAM $([math]::Round((Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory / 1GB,1)) GB"
Write-Host "Eval set size:          $($results.Count)"
Write-Host "Function call accuracy: $accuracy%"
Write-Host "Avg latency first-token: $avgLatencyMs ms"
Write-Host "Avg throughput:          $avgThroughput tok/s"
Write-Host "Total duration:          $([math]::Round($totalEvalDuration,1)) seconds"
Write-Host "================================================================" -ForegroundColor Green

# ----------------------------------------------------------------------------
# Save result to JSON
# ----------------------------------------------------------------------------
$resultSummary = [PSCustomObject]@{
    timestamp              = (Get-Date).ToString("o")
    model                  = $ModelName
    hardware               = @{
        cpu_cores = (Get-CimInstance Win32_Processor).NumberOfCores
        ram_gb    = [math]::Round((Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory / 1GB, 1)
    }
    sampling_parameters   = @{
        temperature = 0.3
        num_ctx     = 2048
    }
    metrics               = @{
        function_call_accuracy_pct = $accuracy
        avg_latency_first_token_ms  = $avgLatencyMs
        avg_throughput_tps          = $avgThroughput
        total_duration_seconds      = [math]::Round($totalEvalDuration, 1)
        correct_count               = $totalCorrect
        total_count                 = $results.Count
    }
    per_prompt_results    = $results
} | ConvertTo-Json -Depth 10

$resultSummary | Out-File -FilePath $OutputPath -Encoding utf8
Write-OK "Result disimpan: $OutputPath"
Write-Host ""
Write-Host "Next steps:"
Write-Host "  - Review per-prompt result di $OutputPath"
Write-Host "  - Jika accuracy < 80%, pertimbangkan:"
Write-Host "      1. Tune system prompt di system-prompt.yaml (lalu ollama create ulang)"
Write-Host "      2. LoRA fine-tune dengan dataset Company X (lihat blueprint)"
Write-Host "      3. Kurangi num_ctx kalau latency terlalu tinggi"
Write-Host ""
# ----------------------------------------------------------------------------
# Pause supaya window tidak langsung close
# ----------------------------------------------------------------------------
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host " Benchmark selesai. Tekan Enter untuk menutup window ini." -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Read-Host "Tekan Enter untuk keluar"
