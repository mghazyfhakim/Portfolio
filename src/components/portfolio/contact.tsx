"use client";

import { useEffect, useRef } from "react";
import { identity } from "@/data/portfolio";
import { SectionHead } from "./section-head";
import { Reveal } from "./reveal";

/**
 * SHEET 05 — REQUEST FOR QUOTATION.
 * Giant mailto headline, magnetic inquiry button (fine pointers,
 * motion allowed only), GitHub as secondary channel.
 */
export function Contact() {
  return (
    <section id="sheet-5" aria-labelledby="rfq-title" className="my-16 sm:my-24">
      <span id="rfq-title" className="sr-only">
        Request for quotation: contact
      </span>
      <SectionHead
        sheet="05"
        total={5}
        title="Request for Quotation"
        sub="One component in stock: my time. Lead time on replies is under 24 hours during WIB business days. Field inquiries welcome."
      />

      <Reveal className="mt-8">
        <div className="border-2 border-ink bg-form p-5 sm:p-8">
          <a
            href={`mailto:${identity.email}`}
            className="block font-display font-bold uppercase leading-[0.95] tracking-tight text-[clamp(1.9rem,6.5vw,5.2rem)] break-all hover:bg-ink hover:text-paper focus-visible:bg-ink focus-visible:text-paper transition-colors px-1 -mx-1"
          >
            {identity.email}
          </a>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <MagneticButton href={`mailto:${identity.email}`}>
              SEND INQUIRY
            </MagneticButton>
            <MagneticButton href={identity.github} variant="ghost">
              GITHUB REPOSITORY
            </MagneticButton>
            <span className="ml-auto font-data text-[11px] tracking-wider text-steel">
              RESPONSE {"<"} 24H / {identity.location}
            </span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/**
 * Magnetic button: leans toward the cursor within its bounds.
 * Fine pointers only, disabled under reduced motion — the link
 * itself never changes, so the fallback is the plain link.
 */
function MagneticButton({
  href,
  children,
  variant = "solid",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "ghost";
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy);
      if (dist < r.width) {
        el.style.transform = `translate(${dx * 0.12}px, ${dy * 0.18}px)`;
      } else {
        el.style.transform = "";
      }
    };
    const onLeave = () => {
      el.style.transform = "";
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const base =
    "inline-block font-data text-xs sm:text-sm tracking-[0.14em] px-6 py-3.5 border-2 border-ink transition-transform duration-150 will-change-transform min-h-[44px]";
  const skin =
    variant === "solid"
      ? "bg-signal text-paper hover:bg-ink"
      : "bg-paper text-ink hover:bg-ink hover:text-paper";

  return (
    <a ref={ref} href={href} className={`${base} ${skin}`}>
      {children}
    </a>
  );
}
