// Shot tambahan: plate TULT (potret #1) + plate SIREKAS karya persis + mobile.
const { chromium } = require("playwright");
const OUT = "/home/z/my-project/download/portfolio-v21-evidence";

(async () => {
  const browser = await chromium.launch();

  // Desktop: cari elemen img tult-portrait & plate sirekas secara langsung
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(800);

  await page.evaluate(() => {
    const img = document.querySelector('img[src="/media/tult-portrait.jpg"]');
    if (img) {
      const y = img.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, y - window.innerHeight * 0.28);
    }
  });
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/extra-desktop-tult.png` });

  await page.evaluate(() => {
    const img = document.querySelector('img[src="/media/logo-puma.png"]');
    if (img) {
      const y = img.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, y - window.innerHeight * 0.28);
    }
  });
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/extra-desktop-puma-portrait.png` });

  await page.evaluate(() => {
    const img = document.querySelector('img[src="/media/logo-sirekas-wide.png"]');
    if (img) {
      const y = img.closest("article").getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, y);
    }
  });
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/extra-desktop-plate-sirekas.png` });
  await page.close();

  // Mobile: monumen 3D + band teknologi
  const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await m.goto("http://localhost:3000", { waitUntil: "networkidle", timeout: 60000 });
  await m.waitForTimeout(800);
  await m.evaluate(() => {
    const el = document.querySelector("#angka");
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY + window.innerHeight * 0.05);
  });
  await m.waitForTimeout(900);
  await m.screenshot({ path: `${OUT}/extra-mobile-angka-3d.png` });
  await m.evaluate(() => {
    const el = document.querySelector("#teknologi");
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY + window.innerHeight * 0.1);
  });
  await m.waitForTimeout(900);
  await m.screenshot({ path: `${OUT}/extra-mobile-teknologi.png` });
  await m.close();

  await browser.close();
  console.log("extra shots done");
})();
