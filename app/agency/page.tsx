import { Navigation } from "@/components/Navigation";
import { AgencyHero } from "@/components/AgencyHero";
import { AgencyServices } from "@/components/AgencyServices";
import { SectionAgencyShowcase } from "@/components/SectionAgencyShowcase";
import { AgencyWorkflow } from "@/components/AgencyWorkflow";
import { AgencyPricing } from "@/components/AgencyPricing";
import { AgencyFAQ } from "@/components/AgencyFAQ";
import { AgencyCTA } from "@/components/AgencyCTA";
import { TenantProvider } from "@/components/TenantProvider";
import { agencyConfig } from "@/config/agency";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `${agencyConfig.brandName} · ${agencyConfig.slogan}`,
  description:
    "築時數位，為生活美學品牌做官網與 App。從品牌語氣出發，整理出清楚、有優先順序的資訊層次。交付前先確認方向，上線後 90 天內技術問題不另收費。",
  openGraph: {
    title: agencyConfig.brandName,
    description: agencyConfig.slogan,
    images: [agencyConfig.heroImageUrl],
  },
};

export default function AgencyPage() {
  return (
    <TenantProvider tenant={null} isDemo={false} tenantType="agency">
      <main className="relative w-full overflow-x-hidden bg-[#0a0806]">
        <Navigation tenantType="agency" />
        <AgencyHero />
        <AgencyServices />
        <SectionAgencyShowcase />
        <AgencyWorkflow />
        <AgencyPricing />
        <AgencyFAQ />
        <AgencyCTA />
        <AgencyFooter />
      </main>
    </TenantProvider>
  );
}

function AgencyFooter() {
  return (
    <footer className="w-full py-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-white/25 text-xs tracking-wider">
          &copy; {new Date().getFullYear()} {agencyConfig.brandName}. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <a
            href={agencyConfig.line}
            target="_blank"
            rel="noreferrer"
            className="text-white/25 text-xs tracking-wider hover:text-white/60 transition-colors duration-300"
          >
            LINE 官方帳號
          </a>
          <a
            href={`mailto:${agencyConfig.email}`}
            className="text-white/25 text-xs tracking-wider hover:text-white/60 transition-colors duration-300"
          >
            {agencyConfig.email}
          </a>
        </div>
      </div>
    </footer>
  );
}
