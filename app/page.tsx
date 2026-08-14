import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { SectionRooms } from "@/components/SectionRooms";
import { SectionFacilities } from "@/components/SectionFacilities";
import { SectionStory } from "@/components/SectionStory";
import { SectionPricing } from "@/components/SectionPricing";
import { SectionContact } from "@/components/SectionContact";
import { FooterCTA, Footer } from "@/components/FooterCTA";

export default function Home() {
  return (
    <main className="relative w-full overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <SectionRooms />
      <SectionFacilities />
      <SectionStory />
      <SectionPricing />
      <SectionContact />
      <FooterCTA />
      <Footer />
    </main>
  );
}
