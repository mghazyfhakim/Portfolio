import { stats } from "@/data/portfolio";
import { StatusBoard } from "./status-board";

// ANGKA — tanpa foto (arah user v2.1): monumen figur raksasa dengan
// efek 3D murni CSS (perspective + rotateX/Y + ekstrusi text-shadow
// berlapis, sisi tajam tanpa blur) berdiri di ground hijau, tile
// angka pendukung muncul dengan kedalaman translateZ. Semua gerak
// hanya hover + reveal; prefers-reduced-motion mematikan semuanya.
export function StatsLive() {
  return (
    <section id="angka" aria-labelledby="angka-title" className="scroll-mt-4">
      <h2 id="angka-title" className="sr-only">
        Angka produksi
      </h2>

      <div className="stat-scene relative flex min-h-[82svh] flex-col items-center justify-center overflow-hidden px-(--margin-page) py-20">
        <p className="absolute top-6 left-(--margin-page) text-[clamp(1.1rem,1.6vw,1.5rem)] font-semibold">
          {stats.heading}
        </p>

        <div data-reveal>
          <div className="stat-monument">
            <p className="stat-3d font-display text-ink text-[clamp(4.5rem,17vw,17rem)] leading-[0.8] tracking-[-0.01em] tabular-nums">
              {stats.figure}
            </p>
          </div>
          <p className="mt-8 max-w-[30ch] text-center text-lg leading-snug sm:text-left">
            {stats.figureSentence}
          </p>
        </div>
      </div>

      <div className="stat-grid px-(--margin-page) mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.supporting.map((s) => (
          <div key={s.caption} data-reveal>
            <div className="stat-tile h-full bg-surface p-6">
              <p className="font-display text-[2.5rem] leading-none tabular-nums">{s.value}</p>
              <p className="mt-2 text-base leading-snug">{s.caption}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="px-(--margin-page)">
        <StatusBoard />
      </div>
    </section>
  );
}
