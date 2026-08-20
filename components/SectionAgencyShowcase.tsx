"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useDesignDials } from "@/components/TenantProvider";
import { ScrollReveal, StaggerReveal } from "./ScrollReveal";
import { agencyConfig } from "@/config/agency";
import { ArrowUpRight } from "@phosphor-icons/react";

export function SectionAgencyShowcase() {
  const design = useDesignDials();
  const MOTION_INTENSITY = design?.MOTION_INTENSITY ?? 7;
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion && MOTION_INTENSITY > 3;

  const cases = agencyConfig.caseStudies;
  const featured = cases[0];
  const secondary = cases.slice(1);

  return (
    <section id="agency" className="w-full py-24 lg:py-32 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <ScrollReveal className="mb-16 lg:mb-20">
          <p
            className="text-xs uppercase tracking-[0.2em] mb-4"
            style={{ color: agencyConfig.primaryColor }}
          >
            實際作品
          </p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl text-white font-light max-w-xl"
            style={{
              fontFamily: "var(--font-serif)",
              letterSpacing: "0.05em",
            }}
          >
            作品說話，比說明更具體
          </h2>
        </ScrollReveal>

        {/* Bento Grid: 1 featured + 2 secondary */}
        <StaggerReveal className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Featured Case - spans 3 cols */}
          <motion.a
            href={featured.href}
            target="_blank"
            rel="noreferrer"
            className="group block lg:col-span-3 relative overflow-hidden"
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: shouldAnimate ? 0.7 : 0,
                  delay: shouldAnimate ? 0 : 0,
                  ease: [0.16, 1, 0.3, 1] as const,
                },
              },
            }}
          >
            <div
              className="relative overflow-hidden"
              style={{ height: "clamp(360px, 50vh, 520px)" }}
            >
              <motion.img
                src={featured.imageUrl}
                alt={featured.client}
                className="w-full h-full object-cover absolute inset-0"
                initial={shouldAnimate ? { scale: 1.05 } : false}
                animate={{ scale: 1 }}
                whileHover={shouldAnimate ? { scale: 1.03 } : {}}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
              />

              {/* Overlays */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.2) 50%, rgba(10,8,6,0.85) 100%)",
                }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at 30% 40%, ${agencyConfig.primaryColor}20 0%, transparent 55%)`,
                }}
              />

              {/* Category tag */}
              <span
                className="absolute top-5 left-5 text-[10px] tracking-[0.18em] uppercase px-3 py-1.5 text-white border"
                style={{
                  backgroundColor: `${agencyConfig.primaryColor}40`,
                  borderColor: "rgba(255,255,255,0.3)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                }}
              >
                {featured.category}
              </span>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="text-[10px] tracking-[0.22em] uppercase"
                    style={{ color: `${agencyConfig.primaryColor}cc` }}
                  >
                    {featured.price}
                  </span>
                </div>
                <h3
                  className="text-2xl lg:text-3xl text-white mb-2"
                  style={{
                    fontFamily: "var(--font-serif)",
                    letterSpacing: "0.06em",
                  }}
                >
                  {featured.client}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed max-w-[40ch] mb-4">
                  {featured.description}
                </p>
                <div className="flex items-center gap-2 text-sm" style={{ color: agencyConfig.primaryColor }}>
                  <span className="tracking-wider uppercase text-xs">看實際網站</span>
                  <ArrowUpRight size={16} weight="regular" />
                </div>
              </div>
            </div>
          </motion.a>

          {/* Secondary Cases - stacked, 2 cols */}
          <div className="lg:col-span-2 flex flex-col gap-6 lg:gap-8">
            {secondary.map((c, i) => (
              <motion.a
                key={c.id}
                href={c.href}
                target="_blank"
                rel="noreferrer"
                className="group block relative overflow-hidden"
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: shouldAnimate ? 0.7 : 0,
                      delay: shouldAnimate ? (i + 1) * 0.12 : 0,
                      ease: [0.16, 1, 0.3, 1] as const,
                    },
                  },
                }}
              >
                <div
                  className="relative overflow-hidden"
                  style={{ height: "clamp(200px, 25vh, 300px)" }}
                >
                  <motion.img
                    src={c.imageUrl}
                    alt={c.client}
                    className="w-full h-full object-cover absolute inset-0"
                    initial={shouldAnimate ? { scale: 1.05 } : false}
                    animate={{ scale: 1 }}
                    whileHover={shouldAnimate ? { scale: 1.04 } : {}}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
                  />

                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.2) 50%, rgba(10,8,6,0.88) 100%)",
                    }}
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `radial-gradient(ellipse at 30% 40%, ${agencyConfig.primaryColor}18 0%, transparent 55%)`,
                    }}
                  />

                  {/* Category */}
                  <span
                    className="absolute top-4 left-4 text-[10px] tracking-[0.18em] uppercase px-2.5 py-1 text-white border"
                    style={{
                      backgroundColor: `${agencyConfig.primaryColor}35`,
                      borderColor: "rgba(255,255,255,0.25)",
                      backdropFilter: "blur(6px)",
                      WebkitBackdropFilter: "blur(6px)",
                    }}
                  >
                    {c.category}
                  </span>

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <p
                      className="text-lg text-white mb-1"
                      style={{ fontFamily: "var(--font-serif)", letterSpacing: "0.05em" }}
                    >
                      {c.client}
                    </p>
                    <p className="text-white/50 text-xs leading-relaxed line-clamp-2 mb-3">
                      {c.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs" style={{ color: agencyConfig.primaryColor }}>
                      <span className="tracking-wider uppercase">看實際網站</span>
                      <ArrowUpRight size={14} weight="regular" />
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </StaggerReveal>

        {/* Workflow Strip */}
        <ScrollReveal delay={0.15} className="mt-20 lg:mt-24 pt-12 border-t border-white/10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {agencyConfig.workflow.map((step, i) => (
              <div key={step.step}>
                <p
                  className="text-4xl lg:text-5xl text-white/10 font-light mb-3"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {step.step}
                </p>
                <h4
                  className="text-white text-sm mb-2"
                  style={{ fontFamily: "var(--font-serif)", letterSpacing: "0.04em" }}
                >
                  {step.name}
                </h4>
                <p className="text-white/40 text-xs leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
