"use client";

import {
  WifiHigh,
  Car,
  Coffee,
  SunHorizon,
  Bathtub,
  CookingPot,
  Snowflake,
  Fire,
} from "@phosphor-icons/react";
import { useBrandConfig } from "@/components/TenantProvider";
import { ScrollReveal, StaggerReveal } from "./ScrollReveal";
import { brandConfig } from "@/config/site";

const iconMap: Record<string, React.ComponentType<{ size?: number; weight?: "light" | "regular" | "bold" }>> = {
  WifiHigh,
  Car,
  Coffee,
  SunHorizon,
  Bathtub,
  CookingPot,
  Snowflake,
  Fire,
};

export function SectionFacilities() {
  const brand = useBrandConfig();
  const facilities = brand?.facilities?.length ? brand.facilities : brandConfig.facilities;
  const primaryColor = brand?.primaryColor || brandConfig.primaryColor;

  return (
    <section id="amenities" className="w-full py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <ScrollReveal className="mb-16 lg:mb-20">
          <p className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: primaryColor }}>
            空間設施
          </p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl text-white font-light max-w-xl"
            style={{ fontFamily: "var(--font-serif)", letterSpacing: "0.05em" }}
          >
            住進來，不需要帶什麼
          </h2>
        </ScrollReveal>

        {/* Facilities Grid - 4-col on desktop */}
        <StaggerReveal className="grid grid-cols-2 md:grid-cols-4 gap-1 bg-white/10">
          {facilities.map((facility, i) => {
            const Icon = iconMap[facility.icon] || Coffee;
            return (
              <div
                key={facility.id}
                className="bg-black p-8 lg:p-10 flex flex-col items-start gap-4 group hover:bg-white/5 transition-colors duration-500"
              >
                <div
                  className="transition-transform duration-500 group-hover:scale-110"
                  style={{ color: primaryColor }}
                >
                  <Icon size={28} weight="light" />
                </div>
                <span className="text-white/70 text-sm tracking-wide">
                  {facility.name}
                </span>
              </div>
            );
          })}
        </StaggerReveal>
      </div>
    </section>
  );
}
