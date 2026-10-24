import { footerMenu, identity, photoCredits } from "@/data/portfolio";

// FOOTER — split satu viewport: foto kiri (crop rapat), menu
// besar di kanan, blok kontak + kredit lisensi foto arsip.
export function Footer() {
  return (
    <footer className="grid grid-cols-1 lg:grid-cols-2 min-h-[100svh]">
      <div className="tinted relative h-[50svh] lg:h-auto overflow-hidden">
        <img
          src="/media/asian-sealing-product-industrial-gasket.jpg"
          alt="Aneka gasket dan oil seal industri, crop rapat"
          width={1920}
          height={1080}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      <div className="bg-surface flex flex-col px-(--margin-page) py-8">
        <p className="text-base font-semibold">Ghazy Fawaz Hakim</p>

        <nav data-reveal aria-label="Menu footer" className="mt-10">
          <ul className="space-y-4">
            {footerMenu.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="inline-block font-display uppercase text-ink text-[clamp(1.6rem,2.6vw,2.5rem)] leading-none tracking-[-0.01em] transition-[transform,color] duration-200 hover:translate-x-3 hover:text-muted focus-visible:text-muted"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div data-reveal className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-8 text-base">
          <div>
            <p className="font-semibold">Kontak</p>
            <a
              href={`mailto:${identity.email}`}
              className="inline-flex min-h-11 items-center underline-offset-4 hover:underline focus-visible:underline"
            >
              {identity.email}
            </a>
            <p className="mt-1">{identity.phone}</p>
            <p>{identity.city}</p>
          </div>
          <div className="sm:text-right">
            <p className="font-semibold">Sosial</p>
            <a
              href={identity.github.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center underline-offset-4 hover:underline focus-visible:underline"
            >
              {identity.github.handle}
            </a>
            <a
              href={identity.linkedin.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center underline-offset-4 hover:underline focus-visible:underline"
            >
              {identity.linkedin.handle}
            </a>
          </div>
        </div>

        <div className="mt-auto pt-14">
          <p className="text-sm text-muted leading-relaxed">
            © 2026 Muhammad Ghazy Fawaz Hakim. Foto arsip adalah milik pemiliknya masing-masing dan
            tidak dijadikan karya Ghazy:{" "}
            {photoCredits.map((c, i) => (
              <span key={c.source}>
                <a
                  href={c.source}
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-2 hover:text-ink focus-visible:text-ink"
                >
                  “{c.title}” oleh {c.author}
                </a>{" "}
                ({c.licenceUrl ? (
                  <a href={c.licenceUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-ink focus-visible:text-ink">
                    {c.licence}
                  </a>
                ) : (
                  c.licence
                )}
                ){i < photoCredits.length - 1 ? ", " : "."}
              </span>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
