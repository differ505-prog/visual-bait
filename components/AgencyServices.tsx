"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useDesignDials } from "@/components/TenantProvider";
import { ScrollReveal, StaggerReveal } from "./ScrollReveal";
import { agencyConfig } from "@/config/agency";
import { ArrowUpRight } from "@phosphor-icons/react";

export function AgencyServices() {
  const design = useDesignDials();
  const MOTION_INTENSITY = design?.MOTION_INTENSITY ?? 7;
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion && MOTION_INTENSITY > 3;

  const services = agencyConfig.services;

  return (
    <section id="services" className="w-full py-24 lg:py-32 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <ScrollReveal className="mb-16 lg:mb-20">
          <p
            className="text-xs uppercase tracking-[0.2em] mb-4"
            style={{ color: agencyConfig.primaryColor }}
          >
            核心服務
          </p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl text-white font-light max-w-2xl"
            style={{
              fontFamily: "var(--font-serif)",
              letterSpacing: "0.04em",
              lineHeight: 1.2,
            }}
          >
            網站、App、數位體驗，一個團隊做到底
          </h2>
          <p className="mt-6 text-white/50 text-base max-w-[48ch] leading-relaxed">
            每項服務獨立啟動，隨品牌成長延伸。先確認方向再動手，上線後 90 天內，小改版不另收費。
          </p>
        </ScrollReveal>

        {/* Services Grid */}
        <StaggerReveal className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
          {services.map((service, i) => (
            <motion.div
              key={service.name}
              className="bg-black p-8 lg:p-10 flex flex-col group hover:bg-white/[0.03] transition-colors duration-500"
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: shouldAnimate ? 0.7 : 0,
                    delay: shouldAnimate ? i * 0.1 : 0,
                    ease: [0.16, 1, 0.3, 1] as const,
                  },
                },
              }}
            >
              {/* Index */}
              <span
                className="text-[10px] uppercase tracking-[0.22em] mb-6"
                style={{ color: `${agencyConfig.primaryColor}60` }}
              >
                0{i + 1}
              </span>

              {/* Name */}
              <h3
                className="text-xl lg:text-2xl text-white mb-4"
                style={{
                  fontFamily: "var(--font-serif)",
                  letterSpacing: "0.04em",
                }}
              >
                {service.name}
              </h3>

              {/* Scope */}
              <p className="text-white/50 text-sm leading-relaxed mb-6 flex-1">
                {service.scope}
              </p>

              {/* Features */}
              <ul className="space-y-2 mb-8">
                {service.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-white/40 text-sm">
                    <span
                      className="w-1 h-1 rounded-full shrink-0"
                      style={{ backgroundColor: agencyConfig.primaryColor }}
                    />
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-xs tracking-wider uppercase transition-all duration-300 group-hover:gap-3"
                style={{ color: agencyConfig.primaryColor }}
              >
                聊聊需求
                <ArrowUpRight size={14} weight="regular" />
              </a>
            </motion.div>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
