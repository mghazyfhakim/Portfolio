import { envelope, envelopePlot } from "@/data/portfolio";
import { SectionHead } from "./section-head";
import { Reveal } from "./reveal";

/**
 * SHEET 03 — OPERATING ENVELOPE.
 * Capability table + a pressure/temperature style envelope plot.
 * Two asymmetric columns (7/5): neighbours never repeat layout.
 */
export function Envelope() {
  const W = 320;
  const H = 240;
  const px = (x: number) => x * (W - 40) + 20;
  const py = (y: number) => (1 - y) * (H - 40) + 20;

  const poly = envelopePlot.polygon
    .split(" ")
    .map((p) => {
      const [x, y] = p.split(",").map(Number);
      return `${px(x)},${py(y)}`;
    })
    .join(" ");

  return (
    <section id="sheet-3" aria-labelledby="envelope-title" className="my-16 sm:my-24">
      <span id="envelope-title" className="sr-only">
        Operating envelope: capabilities
      </span>
      <SectionHead
        sheet="03"
        total={5}
        title="Operating Envelope"
        sub="Where this component performs. Ratings are measured, not aspirational: every value below traces back to a shipped artifact."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mt-6">
        {/* spec table */}
        <Reveal className="lg:col-span-7">
          <table className="w-full border-collapse border-2 border-ink text-left">
            <caption className="sr-only">
              Capability domains with materials and measured rating
            </caption>
            <thead>
              <tr className="bg-ink text-paper">
                <th scope="col" className="px-3 py-2 font-data text-[11px] tracking-wider font-medium">
                  DOMAIN
                </th>
                <th scope="col" className="px-3 py-2 font-data text-[11px] tracking-wider font-medium">
                  MATERIAL
                </th>
                <th scope="col" className="px-3 py-2 font-data text-[11px] tracking-wider font-medium text-right">
                  RATING
                </th>
              </tr>
            </thead>
            <tbody>
              {envelope.map((row, i) => (
                <tr
                  key={row.domain}
                  className={`border-t-2 border-ink ${i % 2 ? "bg-form" : "bg-paper"}`}
                >
                  <th scope="row" className="px-3 py-3 font-display font-semibold uppercase text-base sm:text-lg align-top">
                    {row.domain}
                    <span className="block mt-1 font-body font-normal text-sm text-steel normal-case">
                      {row.note}
                    </span>
                  </th>
                  <td className="px-3 py-3 font-data text-xs text-ink align-top">
                    {row.material}
                  </td>
                  <td className="px-3 py-3 align-top text-right">
                    <span className="status-stamp inline-block text-signal-ink">
                      {row.rating}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>

        {/* envelope plot */}
        <Reveal className="lg:col-span-5" delay={120}>
          <figure className="border-2 border-ink bg-form p-4 h-full flex flex-col justify-between gap-4">
            <figcaption className="font-data text-[10px] tracking-[0.18em] text-steel">
              FIG. 1 / CERTIFIED OPERATING ENVELOPE
            </figcaption>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full h-auto"
              role="img"
              aria-label={`Operating envelope plot. Horizontal axis: ${envelopePlot.xLabel}. Vertical axis: ${envelopePlot.yLabel}. Certified domains inside the envelope: ${envelopePlot.points.map((p) => p.label).join(", ")}.`}
            >
              {/* axes */}
              <line x1="20" y1={H - 20} x2={W - 8} y2={H - 20} stroke="#17191c" strokeWidth="2" />
              <line x1="20" y1={H - 20} x2="20" y2="8" stroke="#17191c" strokeWidth="2" />
              {/* envelope */}
              <polygon points={poly} fill="#e4470b" fillOpacity="0.14" stroke="#e4470b" strokeWidth="2" />
              {/* domain points */}
              {envelopePlot.points.map((p) => (
                <g key={p.label}>
                  <circle cx={px(p.x)} cy={py(p.y)} r="4.5" fill="#17191c" />
                  <text
                    x={px(p.x) + 8}
                    y={py(p.y) - 8}
                    fontFamily="var(--font-plex-mono)"
                    fontSize="9.5"
                    letterSpacing="1"
                    fill="#17191c"
                  >
                    {p.label}
                  </text>
                </g>
              ))}
            </svg>
            <div className="flex justify-between font-data text-[10px] tracking-wider text-steel">
              <span>0</span>
              <span>{envelopePlot.xLabel}</span>
            </div>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
