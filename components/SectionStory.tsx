"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useBrandConfig, useDesignDials } from "@/components/TenantProvider";
import { ScrollReveal } from "./ScrollReveal";
import { brandConfig } from "@/config/site";

export function SectionStory() {
  const brand = useBrandConfig();
  const design = useDesignDials();

  const story = {
    eyebrow: brand?.story?.eyebrow || `關於${brand?.brandName || brandConfig.brandName}`,
    headline: brand?.story?.headline || brandConfig.story.headline,
    imageUrl: brand?.story?.imageUrl || brandConfig.story.imageUrl,
  };
  const primaryColor = brand?.primaryColor || brandConfig.primaryColor;
  const MOTION_INTENSITY = design?.MOTION_INTENSITY ?? 7;
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion && MOTION_INTENSITY > 3;

  return (
    <section id="story" className="w-full">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
        {/* Editorial Split: Left text, Right image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Text */}
          <ScrollReveal direction="left">
            <p
              className="text-xs uppercase tracking-[0.2em] mb-5"
              style={{ color: primaryColor }}
            >
              {story.eyebrow}
            </p>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl text-white font-light mb-8 leading-tight"
              style={{
                fontFamily: "var(--font-serif)",
                letterSpacing: "0.04em",
              }}
            >
              {story.headline}
            </h2>

            {/* Decorative line */}
            <div
              className="mt-10 h-px w-16"
              style={{ backgroundColor: `${primaryColor}60` }}
            />
          </ScrollReveal>

          {/* Right: Image with offset frame */}
          <ScrollReveal direction="right" delay={0.15}>
            <div className="relative">
              {/* Outer offset border */}
              <div
                className="absolute -top-4 -right-4 w-full h-full border border-white/10"
                style={{ zIndex: 0 }}
              />
              {/* Main image */}
              <div
                className="relative overflow-hidden"
                style={{
                  zIndex: 1,
                  height: "clamp(300px, 45vh, 480px)",
                  backgroundColor: "#1a1614",
                }}
              >
                {story.imageUrl ? (
                  <motion.img
                    src={story.imageUrl}
                    alt="故事圖片"
                    className="w-full h-full object-cover absolute inset-0 wabi-img"
                    whileHover={shouldAnimate ? { scale: 1.03 } : {}}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as any }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 relative">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.75">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span className="text-white/10 text-[10px] tracking-widest uppercase">
                      示意圖
                    </span>
                  </div>
                )}

                {/* 暗色漸層遮罩 */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 50%, rgba(10,8,6,0.92) 100%)",
                  }}
                />
                {/* 暖色氛圍光暈 */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at 30% 40%, ${primaryColor}18 0%, transparent 55%), radial-gradient(ellipse at 70% 70%, rgba(255,235,200,0.05) 0%, transparent 40%)`,
                  }}
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
