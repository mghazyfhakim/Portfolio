# Model Strategy — Pilih Model Optimal per Use Case

> Laptop Anda 12GB RAM single-channel. Tidak bisa jalanin semua model bersamaan. Strategi: pilih model per use case, switch saat perlu.

---

## Model yang Anda punya sekarang

| Model | Lokasi | RAM | Strength | Cost |
|---|---|---|---|---|
| **Qwen3.5 4B** | Hermes Agent default (Nous Portal atau Ollama) | 2.5 GB | General chat, lightweight, cepat | Rp 0 (kalau Ollama) atau pakai quota Nous Portal |
| **hermes-erp-b2b-id** | Ollama localhost:11434 (sudah Anda setup, 100% accuracy function call) | 5 GB | Function call ERP, JSON output, structured | Rp 0 (listrik PC) |
| **(Opsional) qwen2.5-coder:7b** | Ollama (perlu pull: `ollama pull qwen2.5-coder:7b`) | 4.5 GB | Coding khusus, lebih bagus dari Qwen3.5 4B untuk code | Rp 0 (listrik PC) |
| **(Opsional) cloud model** (Claude, GPT-4o, dll via Nous Portal) | Cloud API | 0 (cloud) | Best quality, butuh internet, terkadang berbayar | Tergantung provider |

---

## Decision Matrix — Use Case vs Model

| Use Case | Model Rekomendasi | Alasan |
|---|---|---|
| Chat umum sehari-hari | **Qwen3.5 4B** (default Hermes Agent) | Ringan, cepat, hemat RAM sisain untuk browser |
| Brainstorming ide | **Qwen3.5 4B** | Cukup untuk generate ideas, hemat RAM |
| Document writing (email, laporan) | **Qwen3.5 4B** | Bahasa natural bukan strength coding model |
| Vibe coding (iterative, eksploratif) | **qwen2.5-coder:7b** (pull dulu) | Spesialis coding, lebih akurat dari Qwen3.5 4B |
| Vibe coding (kalau qwen2.5-coder belum di-pull) | **Qwen3.5 4B** dengan skill `/typescript-refactor` + `/code-review` | Cukup + skill kami boost kualitas |
| Code review | **qwen2.5-coder:7b** atau **Qwen3.5 4B** + skill `/code-review` | Skill kami ensure format, model bebas |
| Generate unit test | **qwen2.5-coder:7b** (lebih baik untuk syntax) | Code generation spesifik |
| Function call ERP / structured JSON output | **hermes-erp-b2b-id** | Sudah 100% accuracy di benchmark kita |
| Architecture decision | **Qwen3.5 4B** + skill `/brainstorm-3-options` | Skill kasih struktur, model cukup general |
| Refactor kode kompleks | **qwen2.5-coder:7b** | Paham pattern coding lebih dalam |
| Long document (>5000 token context) | **Qwen3.5 4B** atau cloud model | Hermes-erp-b2b-id num_ctx 2048, Qwen3.5 4B context lebih panjang |

---

## Switching Strategy (RAM-aware)

Laptop Anda 12GB. Tidak bisa jalanin semua model bareng. Pakai pola ini:

### Skenario A: Sehari-hari (chat + docs + brainstorming)

```
Hermes Agent UI: open
Qwen3.5 4B: active (model default Hermes Agent)
Ollama: idle, hermes-erp-b2b-id unloaded (free 5GB RAM)

RAM usage: 2.5GB (Qwen) + 0.2GB (Ollama idle) + 4GB (Windows+browser) = 6.7GB
Sisain: 5.3GB untuk IDE, document editor, etc.
```

**Action**: Unload Hermes model kalau tidak dipakai:
```powershell
ollama stop hermes-erp-b2b-id
```

### Skenario B: Vibe coding serius (kalau qwen2.5-coder sudah di-pull)

```
Hermes Agent UI: open
qwen2.5-coder:7b: active via Ollama provider di Hermes Agent
Qwen3.5 4B: tidak dipakai
hermes-erp-b2b-id: unloaded

RAM usage: 4.5GB (qwen2.5-coder) + 0.2GB (Ollama overhead) + 4GB (Windows+IDE) = 8.7GB
Sisain: 3.3GB (cukup untuk 1-2 tab browser)
```

**Action**: Stop Qwen3.5 4B (otomatis kalau pakai Ollama provider), load qwen2.5-coder.

### Skenario C: Function call ERP

```
Hermes Agent UI: open
hermes-erp-b2b-id: active via Ollama provider
Qwen3.5 4B: tidak dipakai
qwen2.5-coder: unloaded

RAM usage: 5GB (hermes-erp-b2b-id) + 0.2GB (Ollama overhead) + 4GB (Windows+IDE) = 9.2GB
Sisain: 2.8GB (limit browser tab)
```

**Action**: Switch Hermes Agent provider ke Ollama, pilih model `hermes-erp-b2b-id`.

### Skenario D: RAM sangat terbatas (kalau lagi buka banyak app)

```
Hermes Agent UI: open
Qwen3.5 4B: active (paling ringan)
Ollama service: stopped (kalau perlu ekstra RAM)

RAM usage: 2.5GB (Qwen) + 0GB (Ollama stopped) + 4GB (Windows+browser) = 6.5GB
Sisain: 5.5GB (longgar untuk IDE + VM + Docker kalau perlu)
```

**Action**: Stop Ollama service:
```powershell
# Stop service
Get-Process ollama* | Stop-Process -Force
# Start lagi kalau perlu
ollama serve
```

---

## Cara Switch Provider di Hermes Agent

Hermes Agent desktop punya UI untuk switch model. Cara cepat:

### Via UI (recommended)

1. Buka Hermes Agent
2. Di status bar (kanan bawah), ada nama model aktif (e.g., "Qwen3.5 4B")
3. Klik → muncul dropdown model list
4. Pilih model yang mau (kalau dari Ollama, harus terdaftar dulu)

### Via CLI (kalau pakai terminal)

```powershell
# Switch ke model Ollama (hermes-erp-b2b-id)
hermes chat --provider ollama --model hermes-erp-b2b-id

# Switch ke Qwen3.5 4B (kalau provider = Nous Portal)
hermes chat --provider nous --model qwen3.5:4b

# Lihat provider yang tersedia
hermes model
```

### Via config file (persistent)

Edit `~/.hermes/config.yaml`:
```yaml
# Contoh: set default provider ke Ollama
default_provider: ollama
default_model: hermes-erp-b2b-id
```

Setelah edit config, restart Hermes Agent.

---

## (Opsional) Pull qwen2.5-coder:7b untuk coding lebih baik

Kalau Anda serius vibe coding, qwen2.5-coder:7b jauh lebih bagus dari Qwen3.5 4B untuk code generation.

**Cara install** (butuh ~4.5GB disk + 5 menit download):

```powershell
# Pull model dari Ollama registry
ollama pull qwen2.5-coder:7b

# Verify
ollama list
# Harus muncul: qwen2.5-coder:7b (4.5 GB)

# Test
ollama run qwen2.5-coder:7b
>>> buatkan function TypeScript untuk hitung PPN 11%
# Harus output kode TypeScript valid
>>> /bye
```

Setelah install, Anda bisa switch ke qwen2.5-coder di Hermes Agent (via provider Ollama, model `qwen2.5-coder:7b`).

**Trade-off**:
- ✅ Kualitas coding naik ~30% vs Qwen3.5 4B
- ✅ Paham syntax + library lebih luas
- ❌ RAM naik: 2.5GB → 4.5GB (kurang 2GB untuk app lain)
- ❌ Cold start: 15-30 detik saat pertama load

---

## (Opsional) Cloud model untuk quality max

Kalau Anda butuh quality tertinggi (e.g., debugging kompleks, architecture design enterprise), pakai cloud model via Nous Portal subscription.

**Trade-off**:
- ✅ Quality paling tinggi (Claude Sonnet, GPT-4o, Gemini Pro)
- ✅ Context window besar (200k+ token)
- ❌ Berbayar (~$20/bulan untuk Nous Portal)
- ❌ Butuh internet
- ❌ Privacy: data dikirim ke cloud

Hanya untuk skenario kritis. Untuk 80% use case sehari-hari, Qwen3.5 4B + hermes-erp-b2b-id + qwen2.5-coder cukup.

---

## Decision Tree — Cara cepat pilih model

```
Anda mau ngapain?
│
├─ Chat umum / brainstorming / dokumen
│  └─ Pakai Qwen3.5 4B (default, hemat RAM)
│
├─ Coding (vibe, refactor, review, test)
│  ├─ Kalau qwen2.5-coder:7b sudah di-pull
│  │  └─ Pakai qwen2.5-coder:7b
│  └─ Kalau belum
│     └─ Pakai Qwen3.5 4B + skill /typescript-refactor, /code-review, /unit-test-generator
│
├─ Function call ERP / structured JSON
│  └─ Pakai hermes-erp-b2b-id (sudah 100% accuracy)
│
├─ Long document (>5000 token context)
│  └─ Pakai Qwen3.5 4B atau cloud model (kalau context >8k)
│
└─ Quality max (debugging kompleks, enterprise arch)
   └─ Pakai cloud model via Nous Portal (bayar)
```

---

## Tracking penggunaan model (opsional, untuk self-awareness)

Saya rekomendasi track model mana yang Anda paling sering pakai, supaya tahu pattern Anda.

Buka file `~/.hermes/model-usage.md` (buat sendiri), isi setiap akhir minggu:

```markdown
# Model Usage Log

## Week of 2026-10-20

| Model | Use case | Frequency | Satisfaction (1-5) |
|---|---|---|---|
| Qwen3.5 4B | Chat umum | 50x | 4 |
| Qwen3.5 4B + skills | Coding | 20x | 3 (Qwen kurang kuat untuk coding) |
| hermes-erp-b2b-id | Function call ERP | 5x | 5 (100% accuracy) |

## Insight minggu ini:
- Qwen3.5 4B kurang untuk coding kompleks → pertimbangkan pull qwen2.5-coder:7b
- hermes-erp-b2b-id stable, no issue
```

Setelah 1 bulan, Anda akan tahu model mana yang worth upgrade/keep/drop.
