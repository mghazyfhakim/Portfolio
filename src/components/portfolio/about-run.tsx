import { portraits } from "@/data/portfolio";

// TENTANG — pin kedua: "DEVELOPER." menahan bingkai sementara
// empat pelat peran lewat bergantian kiri/kanan (4:5): logo brand
// dan foto kampus menggantikan foto arsip (arah user, v2.1).
export function AboutRun() {
  return (
    <section id="tentang" aria-label="Tentang" className="relative scroll-mt-4 pb-[100svh]">
      <div className="sticky top-0 z-20 h-[100svh] pointer-events-none flex items-center justify-center">
        <h2 className="font-display uppercase text-ink whitespace-nowrap leading-[0.86] tracking-[-0.01em] text-[clamp(2.6rem,17vw,11.25rem)]">
          DEVELOPER.
        </h2>
      </div>

      <div className="relative -mt-[100svh] pt-[38svh] pb-[28svh]">
        {portraits.map((p) => (
          <div key={p.name} data-reveal className="min-h-[85svh] flex items-center">
            <figure
              className={`w-[72vw] sm:w-[min(28vw,26rem)] ${
                p.side === "left" ? "mr-auto ml-(--margin-page)" : "ml-auto mr-(--margin-page)"
              }`}
            >
              <div className="tinted aspect-[4/5] overflow-hidden">
                <img
                  src={p.src}
                  alt={p.alt}
                  width={p.width}
                  height={p.height}
                  loading="lazy"
                  decoding="async"
                  style={p.zoom ? { transform: `scale(${p.zoom})` } : undefined}
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="mt-3 max-w-[280px]">
                <p className="text-lg font-semibold leading-tight">{p.name}</p>
                <p className="text-sm text-muted leading-snug">{p.role}</p>
                <p className="mt-1.5 text-base leading-snug">{p.sentence}</p>
              </figcaption>
            </figure>
          </div>
        ))}
      </div>
    </section>
  );
}
