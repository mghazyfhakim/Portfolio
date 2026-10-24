// Verifikasi visual portfolio v2.2 — tahap Playwright CLI dari pipeline.
// Ambil screenshot tiap seksi (desktop + mobile) dan kumpulkan console error.
// Update v2.2: AI Engineer plate (no zoom), StatusBoard polling+refresh+countdown,
//              Footer 3D "Ghazy" (no image).
const { chromium } = require("playwright");
const fs = require("fs");

const BASE = "http://localhost:3000";
const OUT = "/home/z/my-project/download/portfolio-v22-evidence";
fs.mkdirSync(OUT, { recursive: true });

const SHOTS = [
  { name: "01-hero-fold", y: 0 },
  { name: "02-hero-panel-puma", y: 1200 },
  { name: "03-about-pin-developer", sel: "#tentang" },
  { name: "04-about-plate-puma-se", sel: "#tentang", scroll: 2.1 },
  { name: "05-about-plate-tult", sel: "#tentang", scroll: 3.15 },
  { name: "06-about-plate-puma-ai", sel: "#tentang", scroll: 4.2 },
  { name: "07-about-plate-sirekas", sel: "#tentang", scroll: 5.2 },
  { name: "08-karya-puma", sel: "#karya", scroll: 1.5 },
  { name: "09-karya-chat", sel: "#karya", scroll: 2.5 },
  { name: "10-karya-weavory", sel: "#karya", scroll: 3.5 },
  { name: "11-karya-sirekas", sel: "#karya", scroll: 4.5 },
  { name: "12-karya-sirampak-gedungsate", sel: "#karya", scroll: 5.5 },
  { name: "13-teknologi-band", sel: "#teknologi" },
  { name: "14-teknologi-breakdown", sel: "#teknologi", scroll: 0.55 },
  { name: "15-angka-3d", sel: "#angka" },
  { name: "16-angka-tiles", sel: "#angka", scroll: 0.85 },
  { name: "17-status-board-fresh", sel: "h3:has-text('Status produksi saat ini')" },
  { name: "18-status-board-polling", sel: "h3:has-text('Status produksi saat ini')", wait: 3000 },
  { name: "19-kontak", sel: "#kontak" },
  { name: "20-footer-3d-ghazy", sel: "footer" },
];

(async () => {
  const browser = await chromium.launch();
  const errors = [];

  for (const [tag, viewport] of [
    ["desktop", { width: 1440, height: 900 }],
    ["mobile", { width: 390, height: 844 }],
  ]) {
    const page = await browser.newPage({ viewport });
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(`[${tag}] console: ${m.text()}`);
    });
    page.on("pageerror", (e) => errors.push(`[${tag}] pageerror: ${e.message}`));
    page.on("requestfailed", (r) =>
      errors.push(`[${tag}] requestfailed: ${r.url()} ${r.failure()?.errorText}`)
    );

    await page.goto(BASE, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(1200);

    for (const s of SHOTS) {
      if (s.sel) {
        await page.evaluate(
          ({ sel, ratio }) => {
            // Support "tag:has-text('...')" pseudo for text-based lookup
            const m = sel.match(/^(h[1-6]|button|a|p|div):has-text\((.+)\)$/);
            let el = null;
            if (m) {
              const tag = m[1];
              const text = m[2].replace(/^'|'$/g, "");
              const candidates = Array.from(document.querySelectorAll(tag));
              el = candidates.find((n) => n.textContent?.includes(text)) ?? null;
            } else {
              el = document.querySelector(sel);
            }
            if (!el) return;
            const y = el.getBoundingClientRect().top + window.scrollY;
            window.scrollTo(0, y + (ratio ?? 0) * window.innerHeight);
          },
          { sel: s.sel, ratio: s.scroll ?? 0 }
        );
      } else {
        await page.evaluate((y) => window.scrollTo(0, y), s.y);
      }
      await page.waitForTimeout(s.wait ?? 900);
      await page.screenshot({ path: `${OUT}/${tag}-${s.name}.png` });
    }

    // Test: klik tombol "Periksa ulang" untuk pastikan polling manual jalan.
    const refreshBtn = page.locator('button[aria-label="Periksa ulang sekarang"]');
    if (await refreshBtn.count()) {
      await refreshBtn.first().click().catch(() => {});
      await page.waitForTimeout(1500);
      await page.screenshot({ path: `${OUT}/${tag}-21-status-after-refresh.png` });
    }

    // Test: hover footer 3D untuk pastikan transform jalan.
    const footerMon = page.locator(".footer-monument");
    if (await footerMon.count()) {
      await footerMon.first().hover().catch(() => {});
      await page.waitForTimeout(800);
      await page.screenshot({ path: `${OUT}/${tag}-22-footer-3d-hover.png` });
    }

    await page.close();
  }

  await browser.close();
  fs.writeFileSync(`${OUT}/console-errors.json`, JSON.stringify(errors, null, 2));
  console.log("SHOTS:", fs.readdirSync(OUT).filter((f) => f.endsWith(".png")).length);
  console.log("ERRORS:", errors.length);
  for (const e of errors.slice(0, 12)) console.log(" -", e);
})();
