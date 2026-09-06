import { CtaSection } from "@/components/landing/cta-section";
import { FeatureGrid } from "@/components/landing/feature-grid";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNav } from "@/components/landing/landing-nav";
import { StatStrip } from "@/components/landing/stat-strip";

// Public marketing landing for Resolvd.
export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      <LandingNav />
      <main className="flex-1">
        <Hero />
        <StatStrip />
        <FeatureGrid />
        <HowItWorks />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}
