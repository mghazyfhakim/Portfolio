import { PinnedHero } from "@/components/portfolio/pinned-hero";
import { AboutRun } from "@/components/portfolio/about-run";
import { WorkPlates } from "@/components/portfolio/work-plates";
import { ProofBand } from "@/components/portfolio/proof-band";
import { StatsLive } from "@/components/portfolio/stats-live";
import { Contact } from "@/components/portfolio/contact";
import { Footer } from "@/components/portfolio/footer";
import { MotionRoot } from "@/components/portfolio/motion-root";

export default function Home() {
  return (
    <>
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:top-3 focus:left-3 focus:bg-accent focus:text-accent-ink focus:px-4 focus:py-3 focus:font-semibold"
      >
        Lewati ke konten
      </a>

      <MotionRoot />

      <main id="konten">
        <PinnedHero />
        <AboutRun />
        <WorkPlates />
        <ProofBand />
        <StatsLive />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
