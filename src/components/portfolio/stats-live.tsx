import { stats } from "@/data/portfolio";
import { StatusBoard } from "./status-board";

// ANGKA — satu foto full-bleed dengan figur raksasa di tepi
// bawah-kiri (seperti judul film pada bingkai), angka pendukung
// di ground, lalu papan status live.
export function StatsLive() {
  return (
    <section id="angka" aria-labelledby="angka-title" className="scroll-mt-4">
      <h2 id="angka-title" className="sr-only">
        Angka produksi
      </h2>

      <figure className="relative h-[88svh] w-full overflow-hidden">
        <img
          src={stats.photo}
          alt={stats.photoAlt}
          width={stats.width}
          height={stats.height}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover grayscale"
        />
        <div className="absolute inset-x-0 bottom-0 h-[38%] bg-[#0a140d]/78" aria-hidden="true" />

        <p className="absolute top-6 left-(--margin-page) text-[clamp(1.1rem,1.6vw,1.5rem)] font-semibold">
          {stats.heading}
        </p>

        <figcaption className="absolute bottom-6 inset-x-(--margin-page) flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <p className="font-display text-ink text-[clamp(4.5rem,17vw,17rem)] leading-[0.8] tracking-[-0.01em] tabular-nums">
            {stats.figure}
          </p>
          <p className="max-w-[26ch] text-lg leading-snug sm:text-right">{stats.figureSentence}</p>
        </figcaption>
      </figure>

      <div className="px-(--margin-page) mt-12 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
        {stats.supporting.map((s) => (
          <div key={s.caption} data-reveal className="flex items-baseline gap-5">
            <p className="font-display text-[2.5rem] leading-none tabular-nums">{s.value}</p>
            <p className="text-base leading-snug max-w-[38ch]">{s.caption}</p>
          </div>
        ))}
      </div>

      <div className="px-(--margin-page)">
        <StatusBoard />
      </div>
    </section>
  );
}
