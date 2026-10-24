"use client";

import { useRef, useState } from "react";
import { components, type Component } from "@/data/portfolio";
import { SectionHead } from "./section-head";
import { Reveal } from "./reveal";

/**
 * SHEET 02 — COMPONENT CATALOG.
 * Projects as spec rows: full-width expandable rows (not cards).
 * Desktop fine-pointer hover shows a floating spec card that
 * follows the cursor. Keyboard + screen reader: real buttons
 * with aria-expanded / aria-controls.
 */
export function Catalog() {
  const [open, setOpen] = useState<number | null>(0);
  const [hover, setHover] = useState<number | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const listRef = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);

  const onMove = (e: React.MouseEvent) => {
    if (raf.current) return;
    const { clientX, clientY } = e;
    raf.current = requestAnimationFrame(() => {
      raf.current = null;
      setPos({ x: clientX, y: clientY });
    });
  };

  return (
    <section id="sheet-2" aria-labelledby="catalog-title" className="my-16 sm:my-24">
      <span id="catalog-title" className="sr-only">
        Component catalog: selected projects
      </span>
      <SectionHead
        sheet="02"
        total={5}
        title="Component Catalog"
        sub="Selected work as stock items. Expand a row for the specification. Statuses are honest: nothing here is labeled in-production that is not."
      />

      <div
        ref={listRef}
        className="border-x-2 border-b-2 border-ink"
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
      >
        {components.map((c, i) => (
          <Row
            key={c.code}
            c={c}
            index={i}
            open={open === i}
            onToggle={() => setOpen(open === i ? null : i)}
            onHover={() => setHover(i)}
          />
        ))}
      </div>

      {/* floating spec card — desktop, fine pointer, motion allowed */}
      <FloatingCard
        visible={hover !== null}
        c={hover !== null ? components[hover] : null}
        x={pos.x}
        y={pos.y}
      />
    </section>
  );
}

function Row({
  c,
  index,
  open,
  onToggle,
  onHover,
}: {
  c: Component;
  index: number;
  open: boolean;
  onToggle: () => void;
  onHover: () => void;
}) {
  const detailId = `row-detail-${index}`;
  return (
    <Reveal as="div" delay={index * 60}>
      <div className={index > 0 ? "border-t-2 border-ink" : ""}>
        <button
          type="button"
          onClick={onToggle}
          onMouseEnter={onHover}
          aria-expanded={open}
          aria-controls={detailId}
          className={`w-full grid grid-cols-[auto_1fr_auto] md:grid-cols-[90px_1fr_110px_140px_32px] items-center gap-x-3 text-left px-3 sm:px-4 py-3.5 transition-colors hover:bg-form focus-visible:bg-form ${
            open ? "bg-form" : "bg-paper"
          }`}
        >
          <span className="font-data text-xs sm:text-sm text-signal-ink">{c.code}</span>
          <span className="min-w-0">
            <span className="block font-display font-semibold uppercase text-lg sm:text-2xl leading-tight text-ink truncate">
              {c.name}
            </span>
            <span className="block md:hidden font-data text-[10px] tracking-wider text-steel mt-0.5">
              {c.category} / {c.year}
            </span>
          </span>
          <span className="hidden md:block font-data text-[11px] tracking-wider text-steel">
            {c.category}
          </span>
          <span className="hidden md:block status-stamp text-ink">{c.status}</span>
          <span
            aria-hidden="true"
            className={`justify-self-end font-data text-lg text-ink transition-transform duration-300 ${
              open ? "rotate-45" : ""
            }`}
          >
            +
          </span>
        </button>

        <div id={detailId} className="row-detail" data-open={open} role="region" aria-label={`${c.name} specification`}>
          <div>
            <div className="px-3 sm:px-4 pb-5 pt-1 grid grid-cols-1 md:grid-cols-12 gap-4 bg-form">
              <p className="md:col-span-7 text-[15px] leading-relaxed text-ink max-w-[64ch]">
                {c.description}
              </p>
              <div className="md:col-span-5 space-y-3">
                <div>
                  <p className="font-data text-[10px] tracking-[0.18em] text-steel mb-1.5">
                    MATERIALS / STACK
                  </p>
                  <ul className="flex flex-wrap gap-1.5">
                    {c.stack.map((s) => (
                      <li
                        key={s}
                        className="font-data text-[11px] border border-ink px-2 py-0.5 bg-paper"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-data text-[10px] tracking-[0.18em] text-steel mb-1">
                    MEASURED RESULT
                  </p>
                  <p className="font-data text-xs text-ink">{c.measured}</p>
                </div>
                <p className="font-data text-[10px] tracking-wider text-steel">
                  YEAR {c.year}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function FloatingCard({
  visible,
  c,
  x,
  y,
}: {
  visible: boolean;
  c: Component | null;
  x: number;
  y: number;
}) {
  if (!c) return null;
  return (
    <div
      aria-hidden="true"
      className="hidden md:block fixed z-40 pointer-events-none transition-opacity duration-150"
      style={{
        left: x + 18,
        top: y + 18,
        opacity: visible ? 1 : 0,
      }}
    >
      <div className="w-56 border-2 border-ink bg-paper shadow-[6px_6px_0_0_#17191c]">
        <div className="bg-ink text-paper px-2.5 py-1 font-data text-[10px] tracking-wider flex justify-between">
          <span>{c.code}</span>
          <span>{c.year}</span>
        </div>
        <div className="p-3">
          <p className="font-display font-semibold uppercase text-xl leading-tight">
            {c.name}
          </p>
          <p className="font-data text-[10px] tracking-wider text-steel mt-1">
            {c.category}
          </p>
          <p className="font-data text-[10px] mt-2 text-signal-ink">{c.status}</p>
        </div>
      </div>
    </div>
  );
}
