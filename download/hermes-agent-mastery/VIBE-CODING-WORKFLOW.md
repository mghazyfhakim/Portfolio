# Vibe Coding Workflow — Hermes Agent

> Workflow konkret untuk vibe coding di Hermes Agent. Pakai SOUL.md + 4 skills yang sudah di-install. Estimasi 30 menit untuk first session.

---

## Apa itu "Vibe Coding"?

Vibe coding = iterative, exploratory, ngalir. Bukan "spec → design → implement" yang rigid. Pattern:

```
Anda: "Saya mau bikin function untuk..."
Model: kasih 1 versi
Anda: "ubah bagian X jadi..."
Model: update
Anda: "tambah error handling untuk Y"
Model: update
Anda: "review hasilnya"
Model: review dengan format severity
Anda: "generate unit test"
Model: test ready
Anda: "commit message apa yang bagus?"
Model: kasih 3 opsi conventional commit
```

**Kunci**: jangan over-plan. Mulai dari intent kasar, biarkan model bantu refine.

---

## Pre-flight Setup (sebelum mulai)

### A. Pastikan Hermes Agent ter-config dengan pack ini

Sebelum mulai vibe coding, pastikan:
- ✅ SOUL.md ter-install di `~/.hermes/SOUL.md`
- ✅ 4 skills ter-install di `~/.hermes/skills/`
- ✅ Hermes Agent sudah restart (load config baru)
- ✅ Test `/skills` di session baru → 4 skill muncul

Kalau belum, lihat `SETUP-GUIDE.md` dulu.

### B. Pilih model

| Skenario | Model | RAM |
|---|---|---|
| Vibe coding sederhana (script < 100 line) | Qwen3.5 4B (default) | 2.5 GB |
| Vibe coding serius (project, refactoring) | qwen2.5-coder:7b (kalau sudah di-pull) | 4.5 GB |
| Vibe coding + function call ERP | hermes-erp-b2b-id | 5 GB |

Switch model via UI Hermes Agent (klik nama model di status bar) atau via CLI `hermes chat --provider ... --model ...`.

### C. Setup project context (opsional tapi recommended)

Untuk vibe coding yang kontekstual, kasih Hermes Agent info tentang project Anda. Buat file `AGENTS.md` di root project Anda:

```powershell
# Misal project Anda di E:\my-erp
$projectDir = "E:\my-erp"

# Buat AGENTS.md
@"
# Project: My ERP B2B

## Stack
- Frontend: Next.js 14 App Router, TypeScript, Tailwind, shadcn/ui
- Backend: Hono on Cloudflare Workers, TypeScript
- Database: PostgreSQL (Neon free-tier), Prisma ORM
- AI: Hermes 2 Pro 8B via Ollama localhost:11434

## Convention
- File naming: kebab-case (user-service.ts, not UserService.ts)
- Function naming: camelCase
- Type naming: PascalCase
- Test framework: jest
- Commit style: conventional commits (feat:, fix:, refactor:, docs:, test:)

## Directory structure
- src/app/ — Next.js App Router pages
- src/api/ — Hono API routes
- src/lib/ — shared utilities
- src/db/ — Prisma schema + migrations
- src/tests/ — jest tests

## Do NOT
- Jangan pakai 'any' di TypeScript
- Jangan pakai 'export default' untuk function (pakai named export)
- Jangan commit .env file
- Jangan push langsung ke main, harus lewat PR

## Local development
- npm run dev — start dev server
- npm test — run jest
- npm run lint — run eslint
- npm run typecheck — run tsc
"@ | Set-Content "$projectDir\AGENTS.md"
```

Hermes Agent auto-load `AGENTS.md` dari working directory (kalau Anda buka Hermes Agent dari dalam folder project ini). Skill context-aware otomatis.

---

## Workflow 1: Vibe Coding dari Nol (Function Baru)

### Step 1: Mulai session baru dengan intent kasar

```
Bikin function untuk hitung PPN Indonesia 11%, support untuk harga inklusif dan eksklusif PPN.
```

Jangan over-spec. Biarkan model explore.

### Step 2: Lihat response pertama, iterate

Model akan kasih 1 versi. Kalau ada yang kurang:

```
Tambahin validasi untuk input negative — throw error kalau price < 0.
```

Atau:

```
Ubah signature jadi object parameter supaya gampang extend: { price, ppnRate?, isInclusive? }
```

### Step 3: Panggil skill code-review untuk cek hasil

```
/code-review

[paste kode yang sudah di-iterate tadi]
```

Skill akan analisa dengan format severity 🔴/🟡/🟢 + diff fix.

### Step 4: Apply fix, lalu generate test

Setelah Anda apply fix dari review:

```
/unit-test-generator

[paste kode final]
```

Skill akan generate jest test dengan critical path + edge case.

### Step 5: Simpan ke file

```
Bisa tolong kasih commit message conventional untuk perubahan ini?
```

Model kasih 3 opsi. Anda pilih, copy ke git commit.

---

## Workflow 2: Vibe Refactor (Kode Existing)

### Step 1: Load skill typescript-refactor

```
/typescript-refactor
```

Skill akan loaded. Sekarang model tahu target: idiomatic TypeScript modern.

### Step 2: Paste kode yang mau di-refactor

```
[paste kode TypeScript lama]
```

### Step 3: Lihat diff, iterate

Model kasih diff. Kalau ada yang kurang sesuai:

```
Bagus, tapi bagian error handling masih pakai if-else panjang. Pakai switch case atau discriminated union?
```

Atau:

```
Untuk type User, saya prefer zod schema daripada interface. Bisa ubah?
```

### Step 4: Verifikasi dengan code-review

```
/code-review

[paste hasil refactor]
```

Pastikan tidak ada regression dari refactor.

### Step 5: Generate test untuk verifikasi behavior

```
/unit-test-generator

[paste hasil refactor final]
```

Run test, pastikan pass. Kalau fail, ada behavior change — klarifikasi dengan model.

---

## Workflow 3: Vibe Debugging

### Step 1: Jelaskan masalah dengan context

```
Saya punya error di Next.js API route: "TypeError: Cannot read property 'id' of undefined"
File: src/api/users/route.ts line 45

Kode:
[paste kode]

Stack trace:
[paste stack trace]
```

### Step 2: Biarkan model analisa + kasih hypothesis

Model harus kasih:
- 1-3 hypothesis penyebab (ranked by likelihood)
- Setiap hypothesis: cara verify + cara fix

### Step 3: Test hypothesis dengan model

```
Hypothesis #1 (request body belum parsed): saya sudah pakai await request.json() di line 40. Bukan ini.
```

Model akan iterate ke hypothesis berikutnya.

### Step 4: Setelah nemu root cause, kasih fix

```
Ok, hypothesis #2 benar — user dari JWT null kalau token expired. Fix bagaimana?
```

Model kasih diff fix + saran test case untuk reproduce.

---

## Workflow 4: Brainstorming Arsitektur

### Step 1: Panggil skill brainstorm-3-options

```
/brainstorm-3-options

Mau pilih job queue untuk ERP. Volume 500 job/hari, latency acceptable 30-60 detik. Budget Rp 0.
```

### Step 2: Model kasih 3 opsi + rekomendasi

Anda baca, pahami trade-off.

### Step 3: Tanya follow-up kalau perlu

```
Untuk Opsi B (PostgreSQL + pg-boss), kalau saya pakai Neon free-tier (0.5GB), apakah cukup untuk 500 job/hari?
```

Model kasih estimasi (e.g., "1 job = ~200 byte di DB, 500 job/hari = 100KB/hari, 3MB/bulan — cukup").

### Step 4: Decision

```
Ok, saya pilih Opsi B. Bikinin starter code-nya.
```

Model kasih implementasi initial.

---

## Tips: Habit yang bikin vibe coding optimal

### A. Pakai sessions untuk project berbeda

Di Hermes Agent, buat session per project:
- Session "vibe-coding-erp" → untuk project ERP
- Session "vibe-coding-website" → untuk website
- Session "brainstorm-architecture" → untuk decision making

Hermes Agent persistent memory akan ingat context per session. Switch antar session lebih efisien daripada jelasin ulang.

### B. Pakai "Pinned" untuk session penting

Klik kanan session → Pin. Session pinned tetap di atas, gampang akses.

### C. Pakai Artifacts untuk file output

Hermes Agent punya "Artifacts" tab di sidebar. Model bisa generate file (kode, markdown, json) dan masukin ke artifacts. Anda bisa download/review tanpa copy-paste ke editor.

### D. Pakai scheduled jobs untuk rutinitas

Misal: setiap pagi 9, Hermes Agent auto-review PR yang masuk:
```
Help me review PRs dari semalam, kasih summary critical issues
```

Setup via Hermes Agent scheduled jobs UI.

### E. Tidak perlu semua prompt pakai skill

Skill dipanggil saat butuh struktur. Untuk chat biasa, cukup prompt natural:
```
Bagaimana cara pakai useEffect di React 19? Beda dengan React 18?
```

Tidak perlu `/typescript-refactor` untuk pertanyaan konsep. Skill untuk task specific.

### F. Iterate, jangan spec

Vibe coding = ngalir. Jangan:
```
Buatkan function X dengan signature Y, return Z, handle error E1, E2, E3, dengan test T1, T2, T3...
```

Lebih baik:
```
Bikin function untuk X
```

Lalu iterate. Model akan kasih 1 versi, Anda refine. Lebih cepat dan lebih natural.

### G. Pakai `~/.hermes/memory` untuk context persistent

Hermes Agent punya persistent memory system. Anda bisa:
```
Remember: Saya prefer pakai functional programming pattern, hindari class.
Remember: Project ERP saya pakai multi-tenant dengan RLS Postgres.
```

Hermes Agent akan ingat ini antar session. Tidak perlu ulangin.

---

## Contoh Vibe Coding Session (15 menit, full workflow)

Berikut contoh konkret vibe coding session di Hermes Agent:

```
[Session: vibe-coding-erp]

Anda: Bikin function untuk hitung total invoice termasuk PPN dan discount.

Model: Berikut function-nya:
```typescript
function calculateInvoiceTotal(items: InvoiceItem[], ppnRate: number, discount: number): number {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const afterDiscount = subtotal - discount
  const ppn = afterDiscount * ppnRate
  return afterDiscount + ppn
}
```

Anda: Tambahin validasi untuk discount > subtotal. Throw error.

Model: Updated:
```typescript
function calculateInvoiceTotal(items: InvoiceItem[], ppnRate: number, discount: number): number {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  if (discount > subtotal) {
    throw new Error(`Discount (${discount}) cannot exceed subtotal (${subtotal})`)
  }
  const afterDiscount = subtotal - discount
  const ppn = afterDiscount * ppnRate
  return afterDiscount + ppn
}
```

Anda: /code-review

[ paste function di atas ]

Model (via skill):
## Code Review: calculateInvoiceTotal

🔴 Line 5: Subtotal bisa negative kalau item.price atau quantity negative
Fix:
```diff
+ if (items.some(item => item.price < 0 || item.quantity < 0)) {
+   throw new Error('Item price and quantity must be non-negative')
+ }
```

🟡 Line 4: `reduce` tanpa initial value bisa error kalau items empty
Fix:
```diff
- const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
+ const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
+ if (items.length === 0) return 0
```

🟢 Naming: `ppnRate` bisa lebih descriptive jadi `ppnRatePercent` (0.11) atau `ppnRateFraction` (0.11). Tergantung convention.

Summary: 1 critical, 1 warning, 1 nitpick. Fix 🔴 dulu.

Anda: Apply fix 🔴 dan 🟡. Skip nitpick.

[paste kode updated]

Anda: /unit-test-generator

[paste kode updated]

Model (via skill):
```typescript
import { calculateInvoiceTotal } from './invoice'

describe('calculateInvoiceTotal', () => {
  // Critical path
  it('should return correct total for valid invoice', () => {
    const items = [
      { price: 100, quantity: 2 },
      { price: 50, quantity: 1 },
    ]
    expect(calculateInvoiceTotal(items, 0.11, 10)).toBe(272.5)
  })

  it('should return 0 when items array is empty', () => {
    expect(calculateInvoiceTotal([], 0.11, 0)).toBe(0)
  })

  // Edge case
  it('should handle zero discount', () => {
    const items = [{ price: 100, quantity: 1 }]
    expect(calculateInvoiceTotal(items, 0.11, 0)).toBe(111)
  })

  // Error case
  it('should throw when discount exceeds subtotal', () => {
    const items = [{ price: 100, quantity: 1 }]
    expect(() => calculateInvoiceTotal(items, 0.11, 200)).toThrow('cannot exceed subtotal')
  })

  it('should throw when item price is negative', () => {
    const items = [{ price: -50, quantity: 1 }]
    expect(() => calculateInvoiceTotal(items, 0.11, 0)).toThrow('must be non-negative')
  })
})
```

Anda: Kasih conventional commit message untuk ini.

Model:
```
feat(invoice): add calculateInvoiceTotal with PPN and discount validation

- Calculate subtotal from items, apply discount, add PPN
- Validate discount doesn't exceed subtotal
- Validate items don't have negative price or quantity
- Handle empty items array (return 0)
```

Anda: [copy, paste ke git commit, push]

[Session selesai]
```

**Total: 6 turn, 15 menit. Function siap production dengan test.**

---

## Common Pitfalls

### Pitfall 1: Over-spec dari awal

❌ Jangan:
```
Buat function calculateInvoiceTotal(items: InvoiceItem[], ppnRate: number, discount: number) yang return number, validate discount > subtotal throw error, validate items non-empty, dengan test 5 case (positive, negative, zero, edge1, edge2), commit message "feat:..."
```

✅ Lakukan:
```
Bikin function untuk hitung total invoice dengan PPN dan discount
```

Lalu iterate. Lebih cepat.

### Pitfall 2: Takut pakai slash command

Skill ada supaya dipakai. Kalau Anda mau review kode, ketik `/code-review` lalu paste kode. Jangan: "tolong review kode ini dengan format severity critical/warning/nitpick dan kasih diff fix" — itu tanpa skill, output gak konsisten.

### Pitfall 3: Lupa pakai persistent memory

Kalau Anda kasih tahu model "I prefer TypeScript strict mode, no any" di session A, kasih lagi di session B supaya ingat. Atau pakai `Remember:` prefix supaya persistent:
```
Remember: I prefer TypeScript strict mode, no any unless explicitly justified.
```

Hermes Agent save ke persistent memory, apply ke semua session berikutnya.

### Pitfall 4: Vibe coding tanpa context file (AGENTS.md)

Tanpa AGENTS.md di project folder, Hermes Agent tidak tahu convention Anda. Setiap prompt mesti jelasin ulang. Buat AGENTS.md di root project, work sekalinya, benefit terus.

---

## Next Steps

Setelah Anda nyaman dengan workflow di atas, explore lebih lanjut:

1. **Custom skill sendiri** — kalau Anda sering lakuin task berulang (e.g., "convert OpenAPI spec ke TypeScript client"), buat skill sendiri. Pakai format `SKILL.md` (lihat `skills/*/SKILL.md` di pack ini sebagai contoh).

2. **MCP integration** — Hermes Agent support Model Context Protocol. Bisa connect ke external tools (Linear, Jira, Notion, Postgres, dll). Untuk ERP nanti, MCP Postgres supaya Hermes bisa query DB langsung.

3. **Messaging gateway** — connect Hermes Agent ke Telegram/Discord. Anda bisa vibe coding dari HP kalau sedang tidak di laptop.

4. **Bot mode** — buat "bot" dengan personality + skill set sendiri. Misal: "Code Reviewer Bot" yang hanya aktif untuk review PR.

Lihat dokumentasi resmi: https://hermes-agent.nousresearch.com/docs
