import { stackBand, stackSentence } from "@/data/portfolio";

// TEKNOLOGI — band penuh satu warna dengan satu baris nama
// yang terpotong kedua tepi viewport, bergerak pelan ke kiri.
// Berhenti total di prefers-reduced-motion.
export function ProofBand() {
  const track = [...stackBand, ...stackBand];

  return (
    <section id="teknologi" aria-labelledby="teknologi-title" className="scroll-mt-4">
      <h2 id="teknologi-title" className="sr-only">
        Teknologi
      </h2>

      <ul className="sr-only">
        {stackBand.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>

      <div className="bg-accent text-accent-ink overflow-hidden py-8 sm:py-10" aria-hidden="true">
        <div className="marquee-track">
          {track.map((name, i) => (
            <span key={`${name}-${i}`} className="flex items-center whitespace-nowrap">
              <span className="font-display uppercase text-[clamp(2.6rem,8vw,7rem)] leading-none tracking-[-0.01em] px-6">
                {name}
              </span>
              <span
                className="inline-block rounded-full bg-accent-ink shrink-0"
                style={{ width: "0.33em", height: "0.33em", fontSize: "clamp(2.6rem,8vw,7rem)" }}
              />
            </span>
          ))}
        </div>
      </div>

      <p data-reveal className="px-(--margin-page) pt-6 text-lg leading-snug max-w-[46ch]">{stackSentence}</p>
    </section>
  );
}
