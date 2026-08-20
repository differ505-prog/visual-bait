"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useDesignDials } from "@/components/TenantProvider";
import { agencyConfig } from "@/config/agency";

export function AgencyHero() {
  const design = useDesignDials();
  const MOTION_INTENSITY = design?.MOTION_INTENSITY ?? 7;
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion && MOTION_INTENSITY > 3;

  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", shouldAnimate ? "25%" : "0%"]
  );

  const easeOut = [0.16, 1, 0.3, 1] as const;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldAnimate ? 0.1 : 0,
        delayChildren: shouldAnimate ? 0.2 : 0,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldAnimate ? 20 : 0 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldAnimate ? 0.8 : 0,
        ease: easeOut as unknown as "easeOut",
      },
    },
  };

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: "100dvh" }}
      id="hero"
    >
      {/* Background Image */}
      <motion.div
        className="absolute inset-0"
        style={{ y: shouldAnimate ? backgroundY : 0 }}
        initial={shouldAnimate ? { scale: 1.05 } : false}
        animate={shouldAnimate ? { scale: 1 } : false}
        transition={{ duration: 1.8, ease: easeOut as unknown as "easeOut" }}
      >
        <Image
          src={agencyConfig.heroImageUrl}
          alt=""
          fill
          priority
          quality={85}
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, rgba(10,8,6,0.9) 100%)",
        }}
      />

      {/* Warm atmosphere glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 25% 45%, ${agencyConfig.primaryColor}20 0%, transparent 50%), radial-gradient(ellipse at 75% 65%, rgba(255,240,200,0.04) 0%, transparent 40%)`,
        }}
      />

      {/* Bottom smooth transition */}
      <div
        className="absolute inset-x-0 bottom-0 h-[40vh] pointer-events-none z-0"
        style={{
          background: "linear-gradient(to top, #0a0806 0%, transparent 100%)",
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col justify-end"
        style={{ minHeight: "100dvh" }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-6xl mx-auto w-full px-6 lg:px-12 pb-16 lg:pb-24">
          {/* Studio label */}
          <motion.div variants={itemVariants} className="mb-8">
            <span
              className="text-[10px] uppercase tracking-[0.25em] text-white/40 border border-white/20 px-4 py-2"
            >
              Editorial · Web · App Studio
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div variants={itemVariants} className="max-w-3xl">
            <h1
              className="text-white text-4xl md:text-6xl lg:text-7xl font-light mb-6"
              style={{
                fontFamily: "var(--font-serif)",
                letterSpacing: "0.06em",
                textShadow: "0 4px 40px rgba(0,0,0,0.5)",
              }}
            >
              {agencyConfig.brandName}
            </h1>
            <p
              className="text-white/60 text-base md:text-lg lg:text-xl font-light max-w-[52ch]"
              style={{
                letterSpacing: "0.04em",
                textShadow: "0 2px 20px rgba(0,0,0,0.5)",
                lineHeight: 1.8,
              }}
            >
              {agencyConfig.slogan}
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div variants={itemVariants} className="mt-12 flex flex-wrap gap-4">
            <motion.a
              href="#services"
              className="inline-block px-10 py-4 text-xs tracking-widest uppercase text-white"
              style={{
                backgroundColor: agencyConfig.primaryColor,
                boxShadow: `0 8px 40px ${agencyConfig.primaryColor}30`,
              }}
              whileHover={
                shouldAnimate
                  ? {
                      scale: 1.03,
                      boxShadow: `0 16px 50px ${agencyConfig.primaryColor}45`,
                      transition: { duration: 0.3, ease: easeOut as unknown as "easeOut" },
                    }
                  : {}
              }
              whileTap={shouldAnimate ? { scale: 0.98 } : {}}
            >
              看看實際作品
            </motion.a>
            <motion.a
              href="#contact"
              className="inline-block px-10 py-4 text-xs tracking-widest uppercase text-white/70 border border-white/30 hover:border-white/60 hover:text-white transition-all duration-300"
              whileTap={shouldAnimate ? { scale: 0.98 } : {}}
            >
              聊聊你的需求
            </motion.a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
