import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { SectionRooms } from "@/components/SectionRooms";
import { SectionFacilities } from "@/components/SectionFacilities";
import { SectionStory } from "@/components/SectionStory";
import { SectionPricing } from "@/components/SectionPricing";
import { SectionContact } from "@/components/SectionContact";
import { FooterCTA, Footer } from "@/components/FooterCTA";
import { TenantProvider } from "@/components/TenantProvider";
import { brandConfig, designDials } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `${brandConfig.brandName} · ${brandConfig.slogan}`,
  description:
    "晴境莊精品民宿，位於花蓮山海之間。森林景觀套房、山景雙人房、家庭四人房，提供管家服務與景觀浴缸。",
  openGraph: {
    title: brandConfig.brandName,
    description: brandConfig.slogan,
    images: [brandConfig.heroImageUrl],
  },
};

export default function DemoPage() {
  return (
    <TenantProvider tenant={null} isDemo={true}>
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
    </TenantProvider>
  );
}
