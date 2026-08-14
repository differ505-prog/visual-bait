import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getTenant } from "@/lib/redis";
import { TenantProvider } from "@/components/TenantProvider";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { SectionRooms } from "@/components/SectionRooms";
import { SectionFacilities } from "@/components/SectionFacilities";
import { SectionStory } from "@/components/SectionStory";
import { SectionPricing } from "@/components/SectionPricing";
import { SectionContact } from "@/components/SectionContact";
import { FooterCTA, Footer } from "@/components/FooterCTA";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ tenant: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tenant: slug } = await params;
  const tenant = await getTenant(slug);

  if (!tenant) {
    return { title: "找不到頁面" };
  }

  return {
    title: `${tenant.brandName} · ${tenant.slogan}`,
    description: `${tenant.brandName}，${tenant.slogan}`,
    openGraph: {
      title: tenant.brandName,
      description: tenant.slogan,
      images: tenant.heroImageUrl ? [tenant.heroImageUrl] : [],
    },
  };
}

export default async function TenantPage({ params }: Props) {
  const { tenant: slug } = await params;

  // Read tenant slug injected by middleware
  const headersList = await headers();
  const tenantSlug = headersList.get("x-tenant-slug") ?? slug;
  const tenant = await getTenant(tenantSlug);

  if (!tenant) {
    notFound();
  }

  return (
    <TenantProvider tenant={tenant}>
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
