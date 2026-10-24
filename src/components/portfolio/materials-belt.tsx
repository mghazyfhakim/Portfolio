import { materials } from "@/data/portfolio";

/**
 * MATERIAL BELT — one slow marquee of supplied materials.
 * Pause on hover; static under reduced motion (CSS handles both).
 */
export function MaterialsBelt() {
  const row = (ariaHidden: boolean) => (
    <ul
      aria-hidden={ariaHidden || undefined}
      className="flex shrink-0 items-center"
    >
      {materials.map((m) => (
        <li
          key={m}
          className="flex items-center whitespace-nowrap font-display font-semibold uppercase tracking-wide text-2xl sm:text-3xl text-ink"
        >
          <span className="px-5">{m}</span>
          <span className="text-signal font-data text-lg" aria-hidden="true">
            /
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <section
      aria-label="Materials supplied: technical skills list"
      className="my-16 sm:my-24 border-y-2 border-ink bg-form overflow-hidden"
    >
      <div className="marquee-track flex w-max animate-marquee py-3">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
