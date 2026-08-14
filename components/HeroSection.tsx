"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useBrandConfig, useDesignDials } from "@/components/TenantProvider";
import { brandConfig } from "@/config/site";

export function HeroSection() {
  const brand = useBrandConfig();
  const design = useDesignDials();

  const brandName = brand?.brandName || brandConfig.brandName;
  const heroImageUrl = brand?.heroImageUrl || brandConfig.heroImageUrl;
  const primaryColor = brand?.primaryColor || brandConfig.primaryColor;
  const slogan = brand?.slogan || brandConfig.slogan;
  const MOTION_INTENSITY = design?.MOTION_INTENSITY ?? 7;

  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion && MOTION_INTENSITY > 3;

  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", shouldAnimate ? "30%" : "0%"]
  );
  // 修復：拿掉 contentOpacity 消失動畫，只留背景視差
  // 原本 [0, 0.45] 導致內容在第一個滾動就消失
  // 改為讓內容自然靜止，背景以 0.4x 速度落後（視差效果）

  const easeOut = [0.16, 1, 0.3, 1] as const;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldAnimate ? 0.1 : 0,
        delayChildren: shouldAnimate ? 0.3 : 0,
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
      className="relative w-full"
      style={{ minHeight: "100dvh" }}
      id="hero"
    >
      {/* 滿版背景圖 */}
      <motion.div
        className="absolute inset-0"
        style={{ y: shouldAnimate ? backgroundY : 0 }}
        initial={shouldAnimate ? { scale: 1.04 } : false}
        animate={shouldAnimate ? { scale: 1 } : false}
        transition={
          shouldAnimate
            ? { duration: 1.8, ease: easeOut as unknown as "easeOut" }
            : {}
        }
      >
        <Image
          src={heroImageUrl}
          alt=""
          fill
          priority
          quality={85}
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* 暗色漸層遮罩 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.75) 100%)",
        }}
      />

      {/* 暖色氛圍光暈 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 30% 40%, ${primaryColor}18 0%, transparent 55%), radial-gradient(ellipse at 70% 70%, rgba(255,235,200,0.05) 0%, transparent 40%)`,
        }}
      />

      {/* 底部平滑過渡遮罩 */}
      <div
        className="absolute inset-x-0 bottom-0 h-48 pointer-events-none"
        style={{
          background: "linear-gradient(to top, #0a0806 0%, transparent 100%)",
        }}
      />

      {/* 內容區塊 - 左下角不對稱佈局 */}
      <motion.div
        className="relative z-10 flex flex-col justify-end"
        style={{ minHeight: "100dvh" }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-6xl mx-auto w-full px-6 lg:px-12 pb-16 lg:pb-24">
          {/* 左下品牌名稱 + 標語 */}
          <motion.div variants={itemVariants} className="max-w-xl">
            <h1
              className="text-white text-4xl md:text-6xl lg:text-7xl font-light mb-4"
              style={{
                fontFamily: "var(--font-serif)",
                letterSpacing: "0.08em",
                textShadow: "0 4px 40px rgba(0,0,0,0.5)",
              }}
            >
              {brandName}
            </h1>
            <p
              className="text-white/70 text-sm md:text-base lg:text-lg font-light"
              style={{
                letterSpacing: "0.2em",
                textShadow: "0 2px 20px rgba(0,0,0,0.5)",
              }}
            >
              {slogan}
            </p>
          </motion.div>

          {/* CTA + Trust Strip 在同一列 */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-6"
          >
            <motion.a
              href="#rooms"
              className="inline-block px-10 py-3.5 text-sm tracking-widest uppercase text-white border cursor-pointer"
              style={{
                backgroundColor: `${primaryColor}30`,
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                borderColor: "rgba(255,255,255,0.4)",
                boxShadow: "0 8px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)",
              }}
              whileHover={
                shouldAnimate
                  ? {
                      backgroundColor: primaryColor,
                      borderColor: primaryColor,
                      boxShadow:
                        "0 16px 50px rgba(139,115,85,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
                      scale: 1.03,
                      transition: { duration: 0.3, ease: easeOut as unknown as "easeOut" },
                    }
                  : {}
              }
              whileTap={shouldAnimate ? { scale: 0.98 } : {}}
            >
              探索房型
            </motion.a>

            {/* Trust Strip - 打在 CTA 同一行 */}
            <div className="flex items-center gap-5">
              <TrustPill label="花蓮" />
              <TrustPill label="山嵐景觀" />
              <TrustPill label="管家服務" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* 右下角：模板 Badge */}
      <div
        className="absolute bottom-6 right-6 lg:right-10 text-white/35 text-[10px] tracking-widest uppercase hidden md:block px-2.5 py-1 border border-white/10 rounded"
      >
        民宿獲客模板
      </div>
    </section>
  );
}

function TrustPill({ label }: { label: string }) {
  return (
    <span
      className="text-white/50 text-[11px] tracking-wider uppercase"
    >
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">{label}</span>
    </span>
  );
}
