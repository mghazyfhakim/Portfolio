import { heroPanels, identity } from "@/data/portfolio";
import { ChatFragment } from "./chat-fragment";

// HERO — pinned-poster: nama menahan bingkai (sticky, z-20),
// lima panel sistem produksi lewat di bawahnya (alur normal,
// ditarik ke belakang lapisan judul lewat margin negatif).
// Tidak ada scroll-hijack; semua gerak berasal dari scroll asli.
export function PinnedHero() {
  return (
    <section aria-label="Pengantar" className="relative">
      {/* lapisan pinned */}
      <div className="sticky top-0 z-20 h-[100svh] pointer-events-none">
        <div className="absolute inset-0 flex items-start justify-center pt-[4.5rem] sm:items-center sm:pt-0">
          <h1
            className="font-display uppercase text-ink text-center whitespace-nowrap leading-[0.86] tracking-[-0.01em] text-[clamp(2.4rem,15vw,10rem)] sm:text-[clamp(2.4rem,9.5vw,10rem)]"
            style={{ textWrap: "nowrap" }}
          >
            GHAZY FAWAZ
            <br className="sm:hidden" />
            <span className="sm:inline"> </span>
            HAKIM
            <span className="sr-only"> — Software Engineer, Bandung</span>
          </h1>
        </div>

        <header className="absolute top-0 inset-x-0 flex items-start justify-between px-(--margin-page) pt-5">
          <p className="pointer-events-auto text-base font-semibold">Ghazy Fawaz Hakim</p>
          <nav aria-label="Navigasi utama" className="pointer-events-auto flex gap-6">
            <a href="#karya" className="inline-flex min-h-11 items-center text-base font-semibold hover:text-muted focus-visible:text-muted">
              Karya
            </a>
            <a href="#kontak" className="inline-flex min-h-11 items-center text-base font-semibold hover:text-muted focus-visible:text-muted">
              Kontak
            </a>
          </nav>
        </header>

        {/* kalimat penyangga di kiri-bawah, aksi di kanan-bawah */}
        <div className="absolute bottom-0 inset-x-0 flex items-end justify-between gap-4 px-(--margin-page) pb-6">
          <p className="max-w-[26ch] text-base font-semibold leading-snug sm:text-base">{identity.supporting}</p>
          <a
            href={`mailto:${identity.email}`}
            className="pointer-events-auto inline-flex min-h-11 shrink-0 items-center justify-center bg-accent px-5 py-3 text-base font-semibold text-accent-ink transition-[transform,opacity,background-color] duration-200 hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 sm:px-6 sm:text-base"
          >
            Email Ghazy
          </a>
        </div>
      </div>

      {/* panel yang lewat di bawah judul — dimulai di belakang
          lapisan pinned sejak scroll nol */}
      <div className="relative -mt-[100svh]">
        {heroPanels.map((panel) => (
          <div key={panel.src} className="h-[100svh] flex items-center justify-center px-4">
            <div className="tinted w-[min(37vw,30rem)] max-w-[calc(100%-2rem)] aspect-[2/3] overflow-hidden">
              {panel.src === "chat-fragment" ? (
                <ChatFragment />
              ) : (
                <img
                  src={panel.src}
                  alt={panel.alt}
                  width={panel.width}
                  height={panel.height}
                  loading={panel.eager ? "eager" : "lazy"}
                  fetchPriority={panel.eager ? "high" : undefined}
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
