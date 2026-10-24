"use client";

import { useEffect, useRef, useState } from "react";
import { sheetMeta } from "@/data/portfolio";

const SHEET_IDS = ["sheet-1", "sheet-2", "sheet-3", "sheet-4", "sheet-5"];

/**
 * Fixed ISO-5457 style drawing frame: 2px ink border, edge ticks,
 * doc code on the right edge, live sheet number bottom-left, and
 * the CAD crosshair overlay with an mm coordinate readout.
 * Crosshair runs only on fine pointers without reduced motion.
 */
export function SheetFrame() {
  const [sheet, setSheet] = useState(1);
  const [cross, setCross] = useState<{ on: boolean; x: number; y: number }>({
    on: false,
    x: 0,
    y: 0,
  });
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;

    // active sheet tracking (state map — nearest-to-top visible section wins)
    const sections = SHEET_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el)
    );
    const visible = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          visible.set(e.target.id, e.isIntersecting);
        }
        for (let i = 0; i < SHEET_IDS.length; i++) {
          if (visible.get(SHEET_IDS[i])) {
            setSheet(i + 1);
            break;
          }
        }
      },
      { rootMargin: "-35% 0px -35% 0px" }
    );
    sections.forEach((s) => io.observe(s));

    // crosshair overlay
    let enabled = fine && !reduced;
    const onMove = (ev: MouseEvent) => {
      if (!enabled) return;
      const { clientX, clientY } = ev;
      if (raf.current) return;
      raf.current = requestAnimationFrame(() => {
        raf.current = null;
        setCross({ on: true, x: clientX, y: clientY });
      });
    };
    const onLeave = () => setCross((c) => ({ ...c, on: false }));
    const mqChange = () => {
      enabled = window.matchMedia("(pointer: fine)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.matchMedia("(pointer: fine)").addEventListener("change", mqChange);

    return () => {
      io.disconnect();
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.matchMedia("(pointer: fine)").removeEventListener("change", mqChange);
    };
  }, []);

  // px -> mm at 96dpi
  const mmX = cross.on ? ((cross.x / 96) * 25.4).toFixed(1) : "0.0";
  const mmY = cross.on ? ((cross.y / 96) * 25.4).toFixed(1) : "0.0";

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50">
      {/* frame */}
      <div className="absolute inset-2 sm:inset-3 border-2 border-ink" />
      {/* mid-edge ticks */}
      <div className="absolute left-1/2 top-1 -translate-x-1/2 h-3 w-px bg-ink" />
      <div className="absolute left-1/2 bottom-1 -translate-x-1/2 h-3 w-px bg-ink" />
      <div className="absolute top-1/2 left-1 -translate-y-1/2 w-3 h-px bg-ink" />
      <div className="absolute top-1/2 right-1 -translate-y-1/2 w-3 h-px bg-ink" />

      {/* doc code, right edge (desktop only) */}
      <span className="hidden md:block absolute right-5 top-1/2 -translate-y-1/2 rotate-90 origin-right font-data text-[10px] tracking-[0.25em] text-steel whitespace-nowrap">
        {sheetMeta.docCode} / SCALE 1:1 / REV A
      </span>

      {/* sheet indicator, bottom-left */}
      <span className="absolute left-5 bottom-[18px] font-data text-[11px] tracking-wider text-steel">
        SHEET {String(sheet).padStart(2, "0")}/{sheetMeta.totalSheets}
      </span>

      {/* coordinate readout, bottom-right */}
      <span
        className={`absolute right-5 bottom-[18px] font-data text-[11px] tracking-wider text-signal-ink transition-opacity duration-200 ${
          cross.on ? "opacity-100" : "opacity-0"
        }`}
      >
        X {mmX} / Y {mmY} mm
      </span>

      {/* crosshair lines */}
      <div
        className={`absolute inset-x-0 h-px bg-signal transition-opacity duration-150 ${
          cross.on ? "opacity-20" : "opacity-0"
        }`}
        style={{ top: cross.y }}
      />
      <div
        className={`absolute inset-y-0 w-px bg-signal transition-opacity duration-150 ${
          cross.on ? "opacity-20" : "opacity-0"
        }`}
        style={{ left: cross.x }}
      />
    </div>
  );
}
