"use client";

import { useEffect, useRef } from "react";
import { identity } from "@/data/portfolio";

/**
 * SHEET 01 — TITLE BLOCK.
 * The hero IS the title block of an engineering drawing: part name,
 * designation, material, scale, rev, date, drawn/checked by — with
 * an exploded mechanical-seal section on the right whose layers
 * separate as you scroll (CSS var --explode, 0..1).
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const explodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    let raf: number | null = null;

    const update = () => {
      raf = null;
      const el = sectionRef.current;
      const target = explodeRef.current;
      if (!el || !target) return;
      const rect = el.getBoundingClientRect();
      // 0 while the block is fresh on screen, 1 once it is half scrolled past
      const progress = Math.min(
        1,
        Math.max(0, -rect.top / (rect.height * 0.6))
      );
      target.style.setProperty("--explode", String(0.25 + progress * 0.75));
    };

    const onScroll = () => {
      if (raf === null) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="sheet-1"
      ref={sectionRef}
      aria-labelledby="part-name"
      className="min-h-[92svh] flex items-stretch pt-6 sm:pt-10"
    >
      <div className="w-full grid grid-cols-1 md:grid-cols-12 border-2 border-ink bg-paper">
        {/* PART NAME cell */}
        <div className="md:col-span-8 border-b-2 md:border-r-2 border-ink p-4 sm:p-6 flex flex-col justify-between min-h-[42svh]">
          <p className="plot-fade font-data text-[11px] sm:text-xs tracking-[0.18em] text-steel">
            PART NAME
          </p>
          <div>
            <h1
              id="part-name"
              className="plot-fade font-display font-bold uppercase leading-[0.92] tracking-tight text-[clamp(3.2rem,10.5vw,8.5rem)]"
              style={{ animationDelay: "0.15s" }}
            >
              {identity.partName}
            </h1>
            <p
              className="plot-fade mt-4 max-w-[58ch] text-[15px] sm:text-lg text-ink"
              style={{ animationDelay: "0.35s" }}
            >
              {identity.heroStatement}
            </p>
          </div>
        </div>

        {/* SEAL SECTION cell (exploded view) */}
        <div className="md:col-span-4 md:row-span-3 border-b-2 md:border-b-0 border-ink p-3 sm:p-4 flex items-center justify-center relative min-h-[300px] md:min-h-0">
          <SealSection svgRef={explodeRef} />
          <span
            aria-hidden="true"
            className="stamp absolute top-3 right-3 select-none font-data text-[10px] tracking-widest text-signal border-2 border-signal rounded-full px-2.5 py-1.5"
          >
            QC PASSED
          </span>
        </div>

        {/* meta cells row 1 */}
        <MetaCell
          label="DESIGNATION"
          value={identity.designation}
          className="md:col-span-3 border-b-2 md:border-r-2 border-ink"
          delay="0.45s"
        />
        <MetaCell
          label="MATERIAL"
          value={identity.material}
          className="md:col-span-3 border-b-2 md:border-r-2 border-ink"
          delay="0.5s"
        />
        <MetaCell
          label="ORG"
          value={identity.org}
          className="md:col-span-2 border-b-2 border-ink"
          delay="0.55s"
        />

        {/* meta cells row 2 */}
        <MetaCell
          label="SCALE"
          value={identity.scale}
          className="md:col-span-3 border-b-2 md:border-b-0 md:border-r-2 border-ink"
          delay="0.6s"
        />
        <MetaCell
          label="REV"
          value={identity.revision}
          className="md:col-span-3 border-b-2 md:border-b-0 md:border-r-2 border-ink"
          delay="0.65s"
        />
        <MetaCell
          label="DATE"
          value={identity.issueDate}
          className="md:col-span-2 border-b-2 md:border-b-0 border-ink"
          delay="0.7s"
        />

        {/* drawn / checked */}
        <div
          className="plot-fade md:col-span-12 border-t-2 border-ink p-4 sm:p-6 flex flex-wrap items-end justify-between gap-3"
          style={{ animationDelay: "0.75s" }}
        >
          <div className="font-data text-[11px] sm:text-xs tracking-wider text-steel space-y-1">
            <p>
              <span className="text-ink">DRAWN BY</span> {identity.drawnBy}
            </p>
            <p>
              <span className="text-ink">CHECKED BY</span> {identity.checkedBy}
            </p>
          </div>
          <p className="font-data text-[11px] sm:text-xs tracking-wider text-steel">
            {identity.location}
          </p>
        </div>
      </div>
    </section>
  );
}

function MetaCell({
  label,
  value,
  className = "",
  delay = "0s",
}: {
  label: string;
  value: string;
  className?: string;
  delay?: string;
}) {
  return (
    <div
      className={`plot-fade p-3 sm:p-4 min-w-0 ${className}`}
      style={{ animationDelay: delay }}
    >
      <p className="font-data text-[10px] tracking-[0.18em] text-steel">{label}</p>
      <p className="mt-1 font-data text-xs sm:text-sm text-ink break-words">
        {value}
      </p>
    </div>
  );
}

/**
 * Simplified mechanical-seal section, three layers, exploded on scroll.
 * Assembly order is a real sequence, so numbered leaders are content.
 */
function SealSection({ svgRef }: { svgRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div ref={svgRef} className="w-full max-w-[320px]" role="img"
      aria-label="Exploded section of a mechanical seal in three labelled layers: carbon face for agent systems, elastomer for web engineering, spring and backing for industrial B2B."
    >
      <svg viewBox="0 0 320 340" className="w-full h-auto" fill="none">
        <defs>
          <pattern id="hatch" width="7" height="7" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="7" stroke="#17191c" strokeWidth="1.1" />
          </pattern>
        </defs>

        {/* leader + label positioned for the full travel range (drift ±28px) */}
        {/* 01 carbon face — hatched disc */}
        <g className="seal-layer" style={{ "--drift": "-28px" } as React.CSSProperties}>
          <g className="plot-fade" style={{ animationDelay: "0.5s" }} fontFamily="var(--font-plex-mono)" fontSize="10" letterSpacing="1">
            <text x="30" y="14" fill="#17191c">01 CARBON FACE</text>
            <path className="plot-line" pathLength={1} d="M30 22 L84 22" stroke="#17191c" strokeWidth="1.4" />
            <text x="30" y="102" fill="#5f6468">AGENT SYSTEMS</text>
          </g>
          <g className="plot-fade" style={{ animationDelay: "0.25s" }}>
            <rect x="86" y="70" width="150" height="24" fill="url(#hatch)" stroke="#17191c" strokeWidth="2" />
            <line x1="86" y1="70" x2="106" y2="58" stroke="#17191c" strokeWidth="2" />
            <line x1="236" y1="70" x2="216" y2="58" stroke="#17191c" strokeWidth="2" />
            <rect x="106" y="46" width="110" height="12" fill="#e9eae6" stroke="#17191c" strokeWidth="2" />
          </g>
        </g>

        {/* 02 elastomer O-ring (the signal accent — the living part) */}
        <g className="seal-layer" style={{ "--drift": "0px" } as React.CSSProperties}>
          <g className="plot-fade" style={{ animationDelay: "0.55s" }} fontFamily="var(--font-plex-mono)" fontSize="10" letterSpacing="1">
            <path className="plot-line" pathLength={1} d="M200 168 L292 168" stroke="#17191c" strokeWidth="1.4" />
            <text x="210" y="150" fill="#17191c">02 ELASTOMER</text>
            <text x="210" y="188" fill="#5f6468">WEB ENGINEERING</text>
          </g>
          <g className="plot-fade" style={{ animationDelay: "0.4s" }}>
            <circle cx="161" cy="168" r="34" fill="#e4470b" stroke="#17191c" strokeWidth="2" />
            <circle cx="161" cy="168" r="14" fill="#e9eae6" stroke="#17191c" strokeWidth="2" />
          </g>
        </g>

        {/* 03 spring + backing */}
        <g className="seal-layer" style={{ "--drift": "28px" } as React.CSSProperties}>
          <g className="plot-fade" style={{ animationDelay: "0.6s" }} fontFamily="var(--font-plex-mono)" fontSize="10" letterSpacing="1">
            <text x="30" y="212" fill="#17191c">03 SPRING + BACKING</text>
            <text x="30" y="226" fill="#5f6468">INDUSTRIAL B2B</text>
            <path className="plot-line" pathLength={1} d="M30 236 L84 236" stroke="#17191c" strokeWidth="1.4" />
          </g>
          <g className="plot-fade" style={{ animationDelay: "0.55s" }}>
            <path
              className="plot-line"
              pathLength={1}
              d="M96 254 L116 238 L136 254 L156 238 L176 254 L196 238 L216 254 L236 238"
              stroke="#17191c"
              strokeWidth="2.4"
            />
            <rect x="96" y="284" width="130" height="24" fill="url(#hatch)" stroke="#17191c" strokeWidth="2" />
          </g>
        </g>
      </svg>
    </div>
  );
}
