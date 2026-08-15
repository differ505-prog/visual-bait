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
            住進來，可以享受
          </h2>
        </ScrollReveal>

        {/* Facilities Grid - 4-col on desktop with visual rhythm */}
        <StaggerReveal className="grid grid-cols-2 md:grid-cols-4 gap-px bg-black/30">
          {facilities.map((facility, i) => {
            const Icon = iconMap[facility.icon] || Coffee;
            const isEven = i % 2 === 1;
            return (
              <div
                key={facility.id}
                className="p-8 lg:p-10 flex flex-col items-start gap-4 group transition-colors duration-500"
                style={{
                  backgroundColor: isEven ? `${primaryColor}0a` : "rgba(0,0,0,0.6)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.05)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = isEven ? `${primaryColor}0a` : "rgba(0,0,0,0.6)";
                }}
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
