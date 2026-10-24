"use client";

import { useEffect, useState } from "react";
import { identity, revisions } from "@/data/portfolio";

/**
 * REVISION BLOCK — the footer IS the revision table of the drawing,
 * plus a live WIB clock (renders a placeholder pre-mount to avoid
 * hydration mismatch). Sticky footer: parent is min-h-screen flex-col,
 * this sits with mt-auto.
 */
export function RevisionBlock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: identity.timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="mt-auto border-t-2 border-ink bg-ink text-paper">
      <div className="px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* revision table */}
        <div className="lg:col-span-8">
          <table className="w-full border-collapse text-left">
            <caption className="font-data text-[10px] tracking-[0.18em] text-paper/60 pb-2">
              REVISIONS
            </caption>
            <thead>
              <tr className="border-y border-paper/30">
                <th scope="col" className="py-1.5 pr-4 font-data text-[10px] tracking-wider font-medium">
                  REV
                </th>
                <th scope="col" className="py-1.5 pr-4 font-data text-[10px] tracking-wider font-medium">
                  DATE
                </th>
                <th scope="col" className="py-1.5 pr-4 font-data text-[10px] tracking-wider font-medium">
                  DESCRIPTION
                </th>
                <th scope="col" className="py-1.5 font-data text-[10px] tracking-wider font-medium">
                  BY
                </th>
              </tr>
            </thead>
            <tbody>
              {revisions.map((r) => (
                <tr key={r.rev} className="border-b border-paper/20">
                  <td className="py-2 pr-4 font-data text-xs text-caution">{r.rev}</td>
                  <td className="py-2 pr-4 font-data text-xs">{r.date}</td>
                  <td className="py-2 pr-4 font-data text-xs">{r.description}</td>
                  <td className="py-2 font-data text-xs">{r.by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* meta */}
        <div className="lg:col-span-4 flex lg:flex-col justify-between gap-4 font-data text-xs">
          <div className="space-y-1.5">
            <p className="text-paper/60">LOCAL TIME (WIB)</p>
            <p className="text-2xl tabular-nums" suppressHydrationWarning>
              {time ?? "--:--:--"}
            </p>
            <p className="text-paper/60">{identity.location} / 6.2° S 106.8° E</p>
          </div>
          <div className="space-y-1.5 lg:text-right">
            <p className="text-paper/60">
              © 2026 {identity.shortName}. DRAWN, NOT TEMPLATED.
            </p>
            <p>
              <a
                href={`mailto:${identity.email}`}
                className="underline underline-offset-4 decoration-signal hover:text-caution"
              >
                {identity.email}
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
