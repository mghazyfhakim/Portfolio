import { serviceLog } from "@/data/portfolio";
import { SectionHead } from "./section-head";
import { Reveal } from "./reveal";

/**
 * SHEET 04 — SERVICE LOG.
 * Experience as a maintenance log: date, unit, action, result.
 * Narrow mono date column left, narrative right.
 */
export function ServiceLog() {
  return (
    <section id="sheet-4" aria-labelledby="log-title" className="my-16 sm:my-24">
      <span id="log-title" className="sr-only">
        Service log: experience record
      </span>
      <SectionHead
        sheet="04"
        total={5}
        title="Service Log"
        sub="Maintenance history of the component. Newest first. Entries are appended when something ships, not when something starts."
      />

      <ol className="border-x-2 border-b-2 border-ink">
        {serviceLog.map((entry, i) => (
          <Reveal as="li" key={entry.unit} delay={i * 60}>
            <div
              className={`grid grid-cols-1 md:grid-cols-[130px_1fr_auto] gap-x-6 gap-y-2 px-3 sm:px-4 py-5 ${
                i > 0 ? "border-t-2 border-ink" : ""
              } ${i % 2 ? "bg-form" : "bg-paper"}`}
            >
              <p className="font-data text-xs text-steel pt-1">{entry.date}</p>
              <div>
                <h3 className="font-display font-semibold uppercase text-xl sm:text-2xl leading-tight">
                  {entry.unit}
                </h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-ink max-w-[68ch]">
                  {entry.action}
                </p>
              </div>
              <p className="self-start font-data text-[11px] tracking-wider text-ink border border-ink px-2 py-1 bg-paper whitespace-nowrap">
                {entry.result}
              </p>
            </div>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
