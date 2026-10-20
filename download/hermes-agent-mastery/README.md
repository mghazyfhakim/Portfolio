# Hermes Agent Mastery Pack
# Untuk: vibe coding + chat + document writing di Hermes Agent
# Author: AI Engineering Team — Z.ai
# Date: 20 October 2026

> Pack ini berisi konfigurasi untuk mengeluarkan full potensi Hermes Agent Anda: personality (SOUL.md), 4 custom skills untuk coding, panduan setup, strategi pemilihan model, dan workflow konkret untuk vibe coding.

---

## Apa isi pack ini

```
hermes-agent-mastery/
├── SOUL.md                       ← Personality file → copy ke ~/.hermes/SOUL.md
├── skills/                       ← Custom skills → copy ke ~/.hermes/skills/
│   ├── code-review/
│   │   └── SKILL.md               ← Skill: review kode dengan standar ketat
│   ├── typescript-refactor/
│   │   └── SKILL.md               ← Skill: refactor TypeScript (anti-pattern → idiomatic)
│   ├── unit-test-generator/
│   │   └── SKILL.md               ← Skill: generate unit test dari function
│   └── brainstorm-3-options/
│       └── SKILL.md               ← Skill: brainstorm kasih 3 opsi + trade-off
├── SETUP-GUIDE.md                 ← Step-by-step install pack ini di Hermes Agent Anda
├── MODEL-STRATEGY.md              ← Kapan pakai Qwen3.5 4B vs hermes-erp-b2b-id vs cloud
├── VIBE-CODING-WORKFLOW.md        ← Workflow konkret vibe coding di Hermes Agent
└── README.md                      ← Dokumen ini
```

---

## Quick Start (10 menit)

### Step 1 — Copy SOUL.md ke Hermes Agent

```powershell
# Buka PowerShell
# Lokasi default Hermes Agent: ~/.hermes/ = C:\Users\<nama-anda>\.hermes\

# Backup SOUL.md existing (kalau ada)
if (Test-Path "$env:USERPROFILE\.hermes\SOUL.md") {
    Copy-Item "$env:USERPROFILE\.hermes\SOUL.md" "$env:USERPROFILE\.hermes\SOUL.md.backup"
}

# Copy SOUL.md dari pack ini
Copy-Item "E:\hermes-agent-mastery\SOUL.md" "$env:USERPROFILE\.hermes\SOUL.md" -Force
```

### Step 2 — Copy 4 skills ke Hermes Agent

```powershell
# Skills folder (Hermes Agent auto-detect dari ~/.hermes/skills/)
$skillsSource = "E:\hermes-agent-mastery\skills"
$skillsDest = "$env:USERPROFILE\.hermes\skills"

# Buat folder kalau belum ada
if (-not (Test-Path $skillsDest)) { New-Item -ItemType Directory -Path $skillsDest -Force }

# Copy 4 skill folder
Copy-Item "$skillsSource\*" $skillsDest -Recurse -Force

# Verify
Get-ChildItem $skillsDest -Recurse -Filter "SKILL.md" | ForEach-Object { Write-Host "  Skill: $($_.FullName)" }
```

### Step 3 — Restart Hermes Agent

Tutup Hermes Agent desktop (klik kanan icon tray → Quit), lalu buka lagi. Hermes Agent akan load SOUL.md baru + 4 skills baru.

### Step 4 — Test

Buka session baru di Hermes Agent, ketik:

```
/personality
```

Harus muncul personality Anda (bukan default Hermes).

Ketik:

```
/code-review
```

Skill code-review akan loaded, kemudian Anda bisa kasih kode untuk di-review.

Lihat `SETUP-GUIDE.md` untuk detail troubleshooting dan `VIBE-CODING-WORKFLOW.md` untuk workflow lengkap vibe coding.

---

## Apa yang berubah setelah install pack ini

| Aspek | Sebelum | Sesudah |
|---|---|---|
| Personality | Default Hermes Agent (polite, generik) | Pragmatic engineer tone (langsung, teknis, no sycophancy) |
| Code review | Manual prompt "review kode ini" | `/code-review` slash command, otomatis pakai standar ketat |
| Refactor TypeScript | Manual jelaskan pattern | `/typescript-refactor` slash command, otomatis anti-pattern detection |
| Unit test | Manual tulis dari nol | `/unit-test-generator` slash command, generate dari function signature |
| Brainstorming | Model kasih 1 jawaban | `/brainstorm-3-options` slash command, kasih 3 opsi + trade-off |
| Memory | Hermes Agent auto-ingat fakta user | Tetap otomatis + dengan SOUL.md, preferensi Anda jadi default |

---

## Customization

SOUL.md di pack ini punya **placeholder** yang harus Anda isi sendiri. Buka file `SOUL.md` di text editor, cari bagian `[PLACEHOLDER]` dan ganti dengan preferensi Anda.

Atau kirim ke saya jawaban 4 pertanyaan ini, saya buatin SOUL.md yang personalized:

1. **Bahasa utama**: Indonesia / English / mixed?
2. **Stack coding utama**: TypeScript / Python / Go / lainnya?
3. **Output preference**: concise (langsung ke inti) / detailed (penjelasan panjang)?
4. **Hal yang Anda benci dari output model sekarang**: (emoji berlebihan, "sebagai model AI", terlalu polite, dll)

---

## File lebih lanjut

| File | Untuk apa |
|---|---|
| `SOUL.md` | Edit ini untuk personalisasi personality Hermes Agent Anda |
| `skills/*/SKILL.md` | Edit kalau mau tune behavior tiap skill |
| `SETUP-GUIDE.md` | Kalau Step 1-3 di atas ada masalah |
| `MODEL-STRATEGY.md` | Pilih model optimal per use case (Qwen3.5 4B vs Hermes 2 Pro 8B vs Qwen2.5-Coder) |
| `VIBE-CODING-WORKFLOW.md` | Workflow konkret: buka session, panggil skill, iterate dengan kode |

---

## Catatan teknis

- Pack ini di-test untuk Hermes Agent v0.21.5+ (sesuai screenshot Anda)
- SOUL.md format mengikuti official Hermes Agent docs (https://hermes-agent.nousresearch.com/docs/user-guide/features/personality)
- SKILL.md format mengikuti official (https://hermes-agent.nousresearch.com/docs/developer-guide/creating-skills)
- Semua file di-scan prompt-injection oleh Hermes Agent sebelum di-load (security feature built-in)
- Skills yang Anda buat/edit tidak akan pernah di-overwrite oleh `hermes update` (hanya bundled skills yang re-seed)

---

## Cost

| Komponen | Cost |
|---|---|
| Pack ini | Rp 0 |
| Hermes Agent | Rp 0 (open-source) |
| Model default (Qwen3.5 4B) | Rp 0 (kalau pakai model lokal via Ollama) atau tergantung provider Hermes Agent Anda |
| Model `hermes-erp-b2b-id` (Ollama, sudah Anda setup) | Rp 0 + listrik PC ~Rp 150rb/bulan |

**Total: Rp 0 untuk setup. Listrik saja.**

---

## Next steps setelah install

1. Buka `SOUL.md`, edit placeholder dengan style Anda
2. Restart Hermes Agent
3. Test `/code-review` dengan file kode Anda
4. Lihat `VIBE-CODING-WORKFLOW.md` untuk workflow lengkap

Kalau ada masalah, lihat `SETUP-GUIDE.md` troubleshooting section.
