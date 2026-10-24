"use client";

import { useEffect, useState } from "react";
import type { WorkPlate } from "@/data/portfolio";

// Baris judul pelat sebagai overlay sticky (blueprint: "the row
// never moves, scrolling reads like turning plates in a book").
// Baris menempel di 50% viewport di atas semua pelat sehingga
// tidak pernah tertutup; isinya bertukar mengikuti pelat aktif.
export function PlateRowOverlay({ plates }: { plates: WorkPlate[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-plate]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = nodes.indexOf(entry.target as HTMLElement);
            if (idx >= 0) setActive(idx);
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );
    for (const n of nodes) io.observe(n);
    return () => io.disconnect();
  }, []);

  const plate = plates[active];

  return (
    <div
      className="sticky top-[calc(50vh-45px)] z-30 h-0 pointer-events-none"
      aria-hidden="false"
    >
      <div className="bg-[#0a140d]/75 px-(--margin-page) py-4 sm:py-5">
        <div className="flex flex-col gap-1.5 sm:grid sm:grid-cols-[10rem_1fr_auto] sm:items-baseline sm:gap-6">
          <h3 className="order-1 font-display uppercase text-ink text-[clamp(1.375rem,2vw,1.875rem)] leading-none tracking-[-0.01em] sm:order-2">
            {plate.title}
          </h3>
          <div className="order-2 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 sm:contents">
            <p key={`y-${active}`} className="order-1 text-sm text-muted leading-none sm:order-none">
              {plate.year}
            </p>
            <p
              key={`f-${active}`}
              className="text-sm text-ink leading-none sm:order-none sm:text-right"
            >
              {plate.fact}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
