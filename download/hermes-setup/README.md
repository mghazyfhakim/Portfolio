# Hermes-2-Pro-Llama-3-8B — Setup & Benchmark untuk ERP B2B Indonesia

> Paket setup Hermes untuk function call ERP B2B — dirancang untuk hardware minim (CPU 16GB, Windows), zero-cost, dengan eval set dan benchmark bawaan.

**Author:** AI Engineering Team — Z.ai
**Date:** 20 October 2026
**Target:** Windows 10/11 · CPU 16GB RAM · Ollama · Hermes-2-Pro-Llama-3-8B (Q4_K_M)

---

## Isi Paket

```
hermes-setup/
├── Modelfile            ← Konfigurasi Ollama: quantization, sampling, system prompt
├── system-prompt.yaml   ← Source-of-truth system prompt (untuk versioning & A/B testing)
├── tool-registry.json   ← JSON Schema untuk 5 tool awal (get_inventory, create_quote, search_product, get_invoice, list_customers)
├── setup.ps1            ← Script PowerShell: install Ollama + pull model + create custom model + test baseline
├── benchmark.ps1        ← Script PowerShell: ukur latency, throughput, function call accuracy
├── eval-set.json        ← 10 prompt B2B Indonesia dengan ground truth (expected tool call)
└── README.md            ← Dokumen ini
```

---

## Quick Start (3 langkah)

### 1. Buka PowerShell di folder `hermes-setup/`

Klik kanan di folder `hermes-setup/` → **Open in Terminal** (Windows 11) atau **Open PowerShell window here** (Windows 10 + Shift+Right Click).

### 2. Jalankan setup

```powershell
.\setup.ps1
```

Script akan otomatis:
- Cek hardware (RAM, CPU cores, disk space)
- Download & install Ollama (jika belum ada)
- Start Ollama service di `http://localhost:11434`
- Pull model `noussphere/hermes-2-pro-llama-3-8b` (~5GB, 5-15 menit tergantung internet)
- Create custom model `hermes-erp-b2b-id` dari Modelfile (dengan system prompt ERP B2B Indonesia)
- Test baseline function call

**Expected output akhir:**

```
[OK]   Model noussphere/hermes-2-pro-llama-3-8b berhasil di-download
[OK]   Custom model hermes-erp-b2b-id berhasil dibuat
[STEP] Step 5: Test baseline function call
  Test prompt: 'Cek stok produk SKU-001'
[OK]   Response diterima:
  {"name": "get_inventory", "parameters": {"product_sku": "SKU-001"}}
[OK]   Test PASS - Hermes memanggil get_inventory dengan benar

================================================================
 SETUP SELESAI
================================================================
```

### 3. Jalankan benchmark untuk ukur kualitas

```powershell
.\benchmark.ps1
```

Script akan menjalankan 10 prompt dari `eval-set.json`, ukur:
- **Function call accuracy (%)** — berapa dari 10 prompt yang menghasilkan tool call yang benar
- **Latency first-token (ms)** — berapa lama sampai token pertama muncul
- **Throughput (tok/s)** — kecepatan generation setelah first-token

Hasil disimpan ke `benchmark-result.json` untuk tracking history.

**Target metrik (CPU 16GB):**

| Metrik | Target | Komentar |
|---|---|---|
| Function call accuracy | ≥ 80% | Below = perlu tune system prompt atau LoRA fine-tune |
| Latency first-token | < 4000 ms | 4 detik acceptable untuk B2B non-real-time |
| Throughput | ≥ 6 tok/s | Cukup untuk skenario async; sync perlu ≥ 10 tok/s |

---

## Cara Pakai Hermes di Aplikasi

Setelah setup, Hermes jalan di `http://localhost:11434`. Panggil dari aplikasi (Next.js, Hono, dsb.) via:

### Contoh: cURL

```bash
curl http://localhost:11434/api/chat -d '{
  "model": "hermes-erp-b2b-id",
  "messages": [
    {"role": "user", "content": "Cek stok produk SKU-001"}
  ],
  "stream": false,
  "options": {
    "temperature": 0.3,
    "num_ctx": 8192
  }
}'
```

### Contoh: JavaScript (Node.js / Next.js API route)

```javascript
const response = await fetch('http://localhost:11434/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'hermes-erp-b2b-id',
    messages: [{ role: 'user', content: userPrompt }],
    stream: false,
    options: { temperature: 0.3, num_ctx: 8192 }
  })
})
const data = await response.json()
const hermesResponse = data.message.content

// Parse tool call dari response (kalau ada)
const toolCallMatch = hermesResponse.match(/\{"name":\s*"(\w+)",\s*"parameters":\s*(\{.*?\})\}/)
if (toolCallMatch) {
  const toolName = toolCallMatch[1]
  const params = JSON.parse(toolCallMatch[2])
  // TODO: execute tool di ERP
  console.log(`Hermes want to call: ${toolName} with`, params)
}
```

---

## Modelfile — Penjelasan Parameter

| Parameter | Value | Alasan |
|---|---|---|
| `FROM` | `noussphere/hermes-2-pro-llama-3-8b` | Quantization Q4_K_M built-in dari Ollama, ~5GB disk |
| `temperature` | `0.3` | Rendah untuk deterministic function call, tetap ada ruang kreatif untuk fallback chat |
| `top_p` | `0.9` | Moderate — tidak terlalu narrow (0.1) supaya tidak rigid, tidak terlalu lebar (0.9) supaya tidak hallucinate |
| `top_k` | `40` | Default Hermes — batasi vocabulary sampling |
| `repeat_penalty` | `1.1` | Cegah loop tanpa over-penalize JSON yang repetitif |
| `num_ctx` | `8192` | Sweet spot untuk function call. Lebih besar = RAM naik. Lebih kecil = tool schema tidak muat |
| `num_thread` | `6` | Physical cores (BUKAN logical). Default untuk i5 12th gen 6P cores |
| `num_batch` | `512` | Token per batch. Lebih besar = throughput naik tapi RAM naik |
| `num_gpu` | `0` | CPU only (sesuai hardware target) |
| `low_vram` | `true` | Ollama tidak pre-allocate besar-besaran |

### Tuning `num_thread` untuk CPU lain

Cek physical cores via PowerShell:

```powershell
(Get-CimInstance Win32_Processor).NumberOfCores
```

Sesuaikan di Modelfile:

| CPU | Physical cores | `num_thread` |
|---|---|---|
| Intel i5 12th gen | 6 P-cores | 6 (default) |
| Intel i7 12th gen | 8 P + 4 E | 8 (pakai P-cores saja, E-cores menurunkan throughput) |
| Intel i5 13th/14th gen | 6 P + 4 E | 6 |
| AMD Ryzen 5 5600 | 6 | 6 |
| AMD Ryzen 7 5800X | 8 | 8 |
| AMD Ryzen 9 5900X | 12 | 12 |

Setelah edit Modelfile, re-create custom model:

```powershell
ollama rm hermes-erp-b2b-id
ollama create hermes-erp-b2b-id -f .\Modelfile
```

---

## Troubleshooting

### 1. "Ollama lambat" / throughput < 6 tok/s

**Kemungkinan penyebab:**

- `num_thread` terlalu tinggi (pakai logical cores) — cek Task Manager → Performance → CPU, lihat "Cores" vs "Logical processors". Set `num_thread` = "Cores" saja.
- RAM penuh — tutup aplikasi lain (browser dengan banyak tab, IDE, dsb.).
- `num_ctx` terlalu besar — turunkan ke `4096` di Modelfile (kurangi context window, tapi tool schema mungkin tidak muat).
- Disk penuh — Ollama butuh disk space untuk swap.

**Cek:**

```powershell
# Cek RAM usage Ollama
Get-Process ollama* | Select-Object Name, @{N='RAM_MB';E={[math]::Round($_.WorkingSet64/1MB)}}
```

### 2. "Function call accuracy rendah" (< 80%)

**Kemungkinan penyebab:**

- System prompt tidak cukup spesifik untuk use case Anda — edit `system-prompt.yaml`, lalu re-create model.
- Prompt user ambigu — tambahkan contoh lagi di system prompt.
- Temperature terlalu tinggi — turunkan ke `0.1` atau `0.2`.
- Perlu LoRA fine-tune — kalau accuracy stuck di 60-70%, pertimbangkan fine-tune dengan 500-1500 contoh (instruction, function_call) dari domain Anda.

**Validasi:**

```powershell
.\benchmark.ps1
# Buka benchmark-result.json, lihat per-prompt result, cari yang FAIL
```

### 3. "Hermes hallucinate parameter"

Misal user bilang "SKU-001" tapi Hermes balas `"product_sku": "SKU-002"`.

**Kemungkinan penyebab:**

- `temperature` terlalu tinggi → turunkan ke `0.1`.
- Context penuh → turunkan `num_ctx` atau gunakan conversation ring buffer.
- Model tidak familiar dengan format SKU → tambah example di system prompt.

**Mitigasi engineering:**

Jangan percaya output Hermes 100%. Selalu validasi dengan JSON Schema (pakai `zod` di TypeScript atau `pydantic` di Python). Kalau validation gagal, reject dan minta user konfirmasi.

### 4. "Ollama tidak bisa start di port 11434"

```powershell
# Cek apakah port dipakai
netstat -ano | findstr :11434

# Kill process yang pegang port (ganti PID dengan yang muncul di atas)
taskkill /PID <PID> /F

# Start ulang
ollama serve
```

### 5. "Model tidak bisa di-pull" (network issue)

```powershell
# Cek koneksi ke ollama registry
Test-NetConnection -ComputerName registry.ollama.ai -Port 443

# Kalau perlu proxy, set environment variable
$env:HTTP_PROXY = "http://proxy-anda:port"
$env:HTTPS_PROXY = "http://proxy-anda:port"

# Lalu pull ulang
ollama pull noussphere/hermes-2-pro-llama-3-8b
```

### 6. "RAM tidak cukup" (Ollama crash dengan error "out of memory")

- Tutup aplikasi lain (browser, IDE, Docker Desktop kalau tidak dipakai).
- Turunkan `num_ctx` ke `4096` di Modelfile.
- Untuk ekstrem, pakai quantization lebih agresif (Q3_K_M ~3.5GB) — edit Modelfile: `FROM noussphere/hermes-2-pro-llama-3-8b:Q3_K_M`. Tapi accuracy function call akan turun ~5-8%.

### 7. PowerShell Execution Policy error

```powershell
# Error: "cannot be loaded because running scripts is disabled on this system"
# Solusi: jalankan sebagai Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Atau, jalankan script dengan bypass policy sekali:
powershell -ExecutionPolicy Bypass -File .\setup.ps1
```

---

## Upgrade Path (kalau hardware berkembang)

### Skenario A: Beli GPU consumer (RTX 3060 12GB ~Rp 4-5jt seken)

```dockerfile
# Modelfile GPU
FROM noussphere/hermes-2-pro-llama-3-8b:Q4_K_M
PARAMETER num_gpu 99      # offload semua layer ke GPU
PARAMETER num_thread 2    # CPU hanya untuk prompt pre-processing
PARAMETER num_batch 1024   # batch lebih besar karena GPU cepat
```

Expected: throughput naik dari 6 tok/s ke 40-60 tok/s. Latency first-token turun dari 3000ms ke ~500ms.

### Skenario B: Pindah ke Hermes-3-Llama-3.1-8B (kalau mau upgrade model)

Edit Modelfile:

```dockerfile
FROM hermes3:8b
# Sisanya sama, tapi sesuaikan num_ctx ke 16384 (Hermes-3 support context lebih panjang)
PARAMETER num_ctx 16384
```

Lalu:

```powershell
ollama rm hermes-erp-b2b-id
ollama create hermes-erp-b2b-id -f .\Modelfile
.\benchmark.ps1
```

### Skenario C: LoRA fine-tune untuk domain B2B Indonesia

Karena Hermes-2-Pro-8B sudah trained dengan banyak function call dataset, fine-tune hanya perlu jika:
- Accuracy benchmark < 80% setelah tuning system prompt
- Ada banyak edge case domain spesifik Company X yang tidak general

Pipeline fine-tune:

1. Kumpulkan 500-1500 pasang `(instruction, function_call)` dari log operasional Company X
2. Format ke JSONL sesuai format NousResearch
3. Training: 3 epoch, LoRA rank 16, GPU cloud spot (~Rp 30rb/jam × 6 jam = Rp 180rb one-time)
4. Convert LoRA adapter ke GGUF, merge ke base model
5. Import ke Ollama, benchmark ulang

Detail pipeline fine-tune ada di blueprint (`Hermes_B2B_ERP_Website_Blueprint.pdf` Chapter 5.5).

---

## FAQ

**Q: Kenapa pakai Ollama, bukan llama.cpp langsung?**
A: Ollama = wrapper di atas llama.cpp dengan API server dan model management yang mudah. Frugal: tidak ada overhead serius (HTTP layer ~2-5% throughput). Lebih penting: Ollama auto-pull model, auto-format Modelfile, dan support OpenAI-compatible API. Kalau butuh throughput ekstrem (40+ tok/s di CPU), bisa langsung pakai llama.cpp HTTP server.

**Q: Kenapa Q4_K_M, bukan Q8 (akurasi lebih tinggi)?**
A: Q8 butuh ~8GB RAM (vs Q4_K_M ~5GB). Di 16GB RAM, Q8 akan competing dengan OS dan aplikasi lain → memory pressure tinggi → throughput turun. Q4_K_M adalah sweet spot: accuracy function call turun hanya ~3-5% vs FP16, tapi RAM turun 75%. Untuk B2B non-real-time, trade-off ini sangat worth it.

**Q: Bisakah Hermes jalan di laptop 8GB RAM?**
A: Bisa, tapi sangat marginal. Pakai Q3_K_M (~3.5GB), num_ctx 4096, num_batch 256. Expected throughput 3-5 tok/s. Lebih baik pakai cloud GPU spot instance untuk latency-sensitive task.

**Q: Berapa biaya operasional bulanan?**
A: Rp 0 (gratis). Hanya listrik PC ~Rp 100-150rb/bulan jika 24/7. Tanpa API cost, tanpa subscription. Inilah kenapa setup ini disebut "zero-cost".

**Q: Bisakah custom tool ditambah?**
A: Ya. Edit `tool-registry.json`, tambahkan tool baru dengan JSON Schema. Update `system-prompt.yaml` di bagian "TOOL YANG TERSEDIA" dan "CONTOH". Lalu re-create model:

```powershell
ollama rm hermes-erp-b2b-id
ollama create hermes-erp-b2b-id -f .\Modelfile
```

Re-run benchmark untuk pastikan tool baru di-recognize Hermes.

---

## Version History

| Version | Date | Changes |
|---|---|---|
| 1.0.0 | 2026-10-20 | Initial setup: 5 tool awal (get_inventory, create_quote, search_product, get_invoice, list_customers). System prompt Bahasa Indonesia. 10 prompt eval set. |

---

## Lisensi & Disclaimer

- **Hermes-2-Pro-Llama-3-8B** — open weights dari NousResearch, lisensi komersial-friendly (lihat: https://huggingface.co/NousResearch/Hermes-2-Pro-Llama-3-8B)
- **Ollama** — MIT license
- **Tool registry & eval set di paket ini** — bebas dipakai & dimodifikasi untuk keperluan Company X

Setup ini disusun dengan prinsip frugal: hardware minim, biaya nol, kualitas tetap akurat untuk skenario ERP B2B non-real-time. Untuk skenario real-time (chatbot customer-facing), pertimbangkan upgrade ke GPU consumer atau cloud GPU spot.
