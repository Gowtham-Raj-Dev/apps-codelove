import Hero from "@/components/sections/Hero";
import TrustStrip from "@/components/sections/TrustStrip";
import FeaturedApps from "@/components/sections/FeaturedApps";
import CategoryExplorer from "@/components/sections/CategoryExplorer";
import WhySection from "@/components/sections/WhySection";
import ShowcaseSection from "@/components/sections/ShowcaseSection";
import LatestRelease from "@/components/sections/LatestRelease";
import CtaSection from "@/components/sections/CtaSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <FeaturedApps />
      <CategoryExplorer />
      <WhySection />
      <ShowcaseSection />
      <LatestRelease />
      <CtaSection />
    </>
  );
}
