"use client";

import { motion, useReducedMotion } from "framer-motion";
import { brandConfig, designDials } from "@/config/site";
import { ScrollReveal } from "./ScrollReveal";

export function SectionStory() {
  const { story, primaryColor } = brandConfig;
  const { MOTION_INTENSITY } = designDials;
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
            <p className="text-white/55 text-base leading-relaxed max-w-[48ch]">
              {story.body}
            </p>

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
              <div className="relative overflow-hidden" style={{ zIndex: 1 }}>
                <motion.img
                  src={story.imageUrl}
                  alt="晴境莊內部空間"
                  className="w-full object-cover"
                  style={{ height: "clamp(300px, 45vh, 480px)" }}
                  loading="lazy"
                  whileHover={shouldAnimate ? { scale: 1.03 } : {}}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
