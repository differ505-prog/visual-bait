"use client";

import { motion, useReducedMotion } from "framer-motion";
import { brandConfig, designDials } from "@/config/site";
import { ScrollReveal, StaggerReveal } from "./ScrollReveal";
import { Check } from "@phosphor-icons/react/dist/ssr";

export function SectionPricing() {
  const { pricing, primaryColor } = brandConfig;
  const { MOTION_INTENSITY } = designDials;
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion && MOTION_INTENSITY > 3;

  return (
    <section id="pricing" className="w-full py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <ScrollReveal className="mb-16 lg:mb-20 text-center">
          <p
            className="text-xs uppercase tracking-[0.2em] mb-4"
            style={{ color: primaryColor }}
          >
            {pricing.eyebrow}
          </p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl text-white font-light"
            style={{
              fontFamily: "var(--font-serif)",
              letterSpacing: "0.05em",
            }}
          >
            {pricing.headline}
          </h2>
        </ScrollReveal>

    <div className="relative p-8 lg:p-10 border border-white/10">
      <p className="text-white/50 text-xs uppercase tracking-widest mb-3">
        {pricing.plans[0].name}
      </p>
      <div className="mb-8">
        <span className="text-3xl text-white font-light" style={{ fontFamily: "var(--font-serif)", letterSpacing: "0.04em" }}>
          {pricing.plans[0].price}
        </span>
        <span className="text-white/40 text-sm ml-1">{pricing.plans[0].period}</span>
      </div>
      <ul className="flex flex-col gap-3 mb-8">
        {pricing.plans[0].features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-sm text-white/60">
            <Check size={16} weight="light" className="mt-0.5 shrink-0" style={{ color: primaryColor }} />
            {f}
          </li>
        ))}
      </ul>
      <motion.a href="#contact" className="block text-center w-full py-3.5 text-xs tracking-widest uppercase text-white border cursor-pointer transition-all duration-300" style={{ borderColor: "rgba(255,255,255,0.25)" }}
        whileHover={shouldAnimate ? { scale: 1.02, transition: { duration: 0.2 } } : {}}
        whileTap={shouldAnimate ? { scale: 0.98 } : {}}
      >
        {pricing.plans[0].cta}
      </motion.a>
    </div>

    {/* Plan 2 - Highlighted */}
    <div className="relative p-8 lg:p-10 border" style={{ backgroundColor: `${primaryColor}0d`, borderColor: `${primaryColor}40` }}>
      <div className="absolute -top-3 left-8 px-3 py-1 text-[10px] uppercase tracking-widest text-white border" style={{ backgroundColor: primaryColor, borderColor: primaryColor }}>
        推薦
      </div>
      <p className="text-white/50 text-xs uppercase tracking-widest mb-3">
        {pricing.plans[1].name}
      </p>
      <div className="mb-8">
        <span className="text-3xl text-white font-light" style={{ fontFamily: "var(--font-serif)", letterSpacing: "0.04em" }}>
          {pricing.plans[1].price}
        </span>
        <span className="text-white/40 text-sm ml-1">{pricing.plans[1].period}</span>
      </div>
      <ul className="flex flex-col gap-3 mb-8">
        {pricing.plans[1].features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-sm text-white/60">
            <Check size={16} weight="light" className="mt-0.5 shrink-0" style={{ color: primaryColor }} />
            {f}
          </li>
        ))}
      </ul>
      <motion.a href="#contact" className="block text-center w-full py-3.5 text-xs tracking-widest uppercase text-white border cursor-pointer transition-all duration-300" style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
        whileHover={shouldAnimate ? { scale: 1.02, transition: { duration: 0.2 } } : {}}
        whileTap={shouldAnimate ? { scale: 0.98 } : {}}
      >
        {pricing.plans[1].cta}
      </motion.a>
    </div>
      </div>
    </section>
  );
}
