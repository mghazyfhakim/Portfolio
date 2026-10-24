import { Reveal } from "./reveal";

/**
 * Section heading built as a datasheet table header band:
 * filled ink band, paper text. The sheet number is real
 * sequence information (a drawing set is a numbered set),
 * not an eyebrow decoration.
 */
export function SectionHead({
  sheet,
  total,
  title,
  sub,
}: {
  sheet: string;
  total: number;
  title: string;
  sub?: string;
}) {
  return (
    <Reveal>
      <div className="border-2 border-ink">
        <div className="flex items-stretch border-b-2 border-ink bg-ink text-paper">
          <span className="px-3 py-1.5 font-data text-[11px] tracking-wider border-r-2 border-paper/40 flex items-center">
            SHEET {sheet}/{total}
          </span>
          <h2 className="px-3 py-1 font-display font-semibold text-2xl sm:text-3xl tracking-wide uppercase">
            {title}
          </h2>
        </div>
        {sub ? (
          <p className="px-3 py-2.5 bg-form text-steel text-sm sm:text-[15px] max-w-[72ch]">
            {sub}
          </p>
        ) : null}
      </div>
    </Reveal>
  );
}
