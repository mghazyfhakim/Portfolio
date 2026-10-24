// Optimasi media: PNG besar -> JPEG/WebP ringan, cap width 1920.
// Dijalankan sekali; hasil menimpa file asli di public/media (kecuali credits.json & screenshot kecil).
import sharp from "sharp";
import { readdir } from "node:fs/promises";
import path from "node:path";

const DIR = "/home/z/my-project/public/media";
const SKIP = new Set(["credits.json", "pajak-portrait.png", "pajak-wide.png"]);

const files = (await readdir(DIR)).filter((f) => /\.(png|jpg|jpeg)$/i.test(f) && !SKIP.has(f));

for (const f of files) {
  const src = path.join(DIR, f);
  const out = path.join(DIR, f.replace(/\.png$/i, ".jpg"));
  const img = sharp(src);
  const meta = await img.metadata();
  const width = Math.min(meta.width ?? 1920, 1920);
  await img
    .resize({ width, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(out + ".tmp");
  // rapikan nama: .tmp -> final
  const { rename, unlink } = await import("node:fs/promises");
  await rename(out + ".tmp", out);
  if (out !== src) await unlink(src);
  const after = await sharp(out).metadata();
  console.log(`${f} -> ${path.basename(out)} ${after.width}x${after.height}`);
}
console.log("done");
