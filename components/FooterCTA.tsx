"use client";

import { motion, useReducedMotion } from "framer-motion";
import { brandConfig, designDials, acquisitionConfig } from "@/config/site";
import { ScrollReveal } from "./ScrollReveal";
import { ArrowRight } from "@phosphor-icons/react";

export function FooterCTA() {
  const { brandName, primaryColor } = brandConfig;
  const { acquisitionConfig: acq } = { acquisitionConfig };
  const { MOTION_INTENSITY } = designDials;
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion && MOTION_INTENSITY > 3;

  return (
    <section
      className="w-full py-24 lg:py-32 border-t border-white/10"
    >
      <div className="max-w-5xl mx-auto px-6 lg:px-12 text-center">
        <ScrollReveal>
          <p
            className="text-xs uppercase tracking-[0.2em] mb-5"
            style={{ color: primaryColor }}
          >
            {acquisitionConfig.templateBadge}
          </p>
          <h2
            className="text-3xl md:text-5xl lg:text-6xl text-white font-light mb-6 leading-tight"
            style={{
              fontFamily: "var(--font-serif)",
              letterSpacing: "0.04em",
            }}
          >
            用一個網站<br className="hidden md:block" />
            讓客人自己走進來
          </h2>
          <p className="text-white/50 text-base leading-relaxed max-w-[50ch] mx-auto mb-12">
            建立專業形象，提升官網轉換率。歡迎來聊，取得你的專屬網站方案
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              href="#contact"
              className="px-10 py-4 text-xs tracking-widest uppercase text-white flex items-center gap-2 cursor-pointer"
              style={{
                backgroundColor: primaryColor,
                boxShadow: `0 8px 40px ${primaryColor}30`,
              }}
              whileHover={
                shouldAnimate
                  ? {
                      scale: 1.03,
                      boxShadow: `0 16px 50px ${primaryColor}45`,
                      transition: { duration: 0.25 },
                    }
                  : {}
              }
              whileTap={shouldAnimate ? { scale: 0.98 } : {}}
            >
              {acquisitionConfig.primaryCTA}
              <ArrowRight size={16} weight="regular" />
            </motion.a>

            <a
              href="#rooms"
              className="px-10 py-4 text-xs tracking-widest uppercase text-white/60 border border-white/20 hover:border-white/40 hover:text-white transition-colors duration-300"
            >
              查看功能展示
            </a>
          </div>
        </ScrollReveal>

        {/* Tech Stack */}
        <ScrollReveal delay={0.15} className="mt-16 pt-12 border-t border-white/10">
          <p className="text-white/20 text-[10px] uppercase tracking-[0.2em] mb-6">
            技術棧
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {acquisitionConfig.techStack.map((tech) => (
              <span
                key={tech}
                className="text-white/30 text-xs tracking-wider px-3 py-1.5 border border-white/10"
              >
                {tech}
              </span>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export function Footer() {
  const { brandName, email, line } = brandConfig;

  return (
    <footer className="w-full py-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-white/25 text-xs tracking-wider">
          {acquisitionConfig.copyright}
        </p>
        <div className="flex items-center gap-6">
          <a
            href={line}
            target="_blank"
            rel="noreferrer"
            className="text-white/25 text-xs tracking-wider hover:text-white/60 transition-colors duration-300"
          >
            LINE 官方帳號
          </a>
          <a
            href={`mailto:${email}`}
            className="text-white/25 text-xs tracking-wider hover:text-white/60 transition-colors duration-300"
          >
            {email}
          </a>
        </div>
      </div>
    </footer>
  );
}
