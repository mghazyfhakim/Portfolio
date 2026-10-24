import { contactSentence, identity } from "@/data/portfolio";

// KONTAK — 100svh dengan inversi penuh (latar emas, tinta
// hijau). Email sebagai display type; tanpa heading besar dan
// tanpa form (brief: email langsung).
export function Contact() {
  const [user, domain] = identity.email.split("@");

  return (
    <section
      id="kontak"
      aria-labelledby="kontak-title"
      className="on-inverse relative min-h-[100svh] bg-inverse text-inverse-ink flex flex-col justify-between px-(--margin-page) py-8 scroll-mt-0"
    >
      <div className="flex flex-col sm:flex-row justify-between gap-6">
        <h2
          id="kontak-title"
          data-reveal className="max-w-[24ch] text-[clamp(1.25rem,2vw,1.625rem)] font-semibold leading-snug"
        >
          {contactSentence}
        </h2>
        <p data-reveal className="max-w-[26ch] sm:text-right text-[clamp(1.05rem,1.4vw,1.25rem)] leading-snug text-inverse-ink/85">
          Terbuka untuk peran full-stack, back-end, dan AI engineering.
        </p>
      </div>

      <a
        href={`mailto:${identity.email}`}
        data-reveal className="group self-start"
        aria-label={`Kirim email ke ${identity.email}`}
      >
        <span className="block font-display uppercase leading-[0.95] tracking-[-0.01em] text-[clamp(2.6rem,9vw,9.5rem)] text-balance">
          <span className="sm:hidden">
            {user}
            <br />
            @{domain}
          </span>
          <span className="hidden sm:inline">
            {user}@{domain}
          </span>
        </span>
        <span className="mt-2 inline-block text-lg font-semibold underline-offset-8 group-hover:underline">
          {identity.email}
        </span>
      </a>

      <div className="flex flex-col sm:flex-row justify-between gap-6 text-base">
        <div>
          <p className="font-semibold">{identity.phone}</p>
          <p className="text-inverse-ink/80">{identity.city}</p>
        </div>
        <div className="flex flex-col sm:items-end gap-1">
          <a
            href={identity.github.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center font-semibold underline-offset-4 hover:underline focus-visible:underline"
          >
            {identity.github.handle}
          </a>
          <a
            href={identity.linkedin.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center font-semibold underline-offset-4 hover:underline focus-visible:underline"
          >
            {identity.linkedin.handle}
          </a>
        </div>
      </div>
    </section>
  );
}
