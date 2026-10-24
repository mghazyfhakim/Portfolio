import { SheetFrame } from "@/components/portfolio/sheet-frame";
import { Hero } from "@/components/portfolio/hero";
import { MaterialsBelt } from "@/components/portfolio/materials-belt";
import { Catalog } from "@/components/portfolio/catalog";
import { Envelope } from "@/components/portfolio/envelope";
import { ServiceLog } from "@/components/portfolio/service-log";
import { Contact } from "@/components/portfolio/contact";
import { RevisionBlock } from "@/components/portfolio/revision-block";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col px-4 sm:px-8 pt-5 sm:pt-8 pb-4">
      <a
        href="#sheet-1"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:top-3 focus:left-3 focus:bg-ink focus:text-paper focus:px-3 focus:py-2 focus:font-data focus:text-xs"
      >
        Skip to content
      </a>

      <SheetFrame />

      <main className="w-full">
        <Hero />
        <MaterialsBelt />
        <Catalog />
        <Envelope />
        <ServiceLog />
        <Contact />
      </main>

      <RevisionBlock />
    </div>
  );
}
