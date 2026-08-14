"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { brandConfig, designDials } from "@/config/site";

export function HeroSection() {
  const { brandName, heroImageUrl, primaryColor, slogan } = brandConfig;
  const { MOTION_INTENSITY } = designDials;

  // 檢測系統是否偏好減少動畫
  const prefersReducedMotion = useReducedMotion();

  // 滾動進度 (用於視差效果)
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], ["0%", "20%"]);

  // 動畫參數：根據系統偏好調整
  const shouldAnimate = !prefersReducedMotion && MOTION_INTENSITY > 3;

  // 統一的過渡曲線
  const easeOut = [0.16, 1, 0.3, 1] as const;

  // 動畫變體
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldAnimate ? 0.15 : 0,
        delayChildren: shouldAnimate ? 0.3 : 0,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldAnimate ? 30 : 0 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldAnimate ? 0.8 : 0,
        ease: easeOut as unknown as "easeOut",
      },
    },
  };

  const imageVariants = {
    hidden: { scale: shouldAnimate ? 1.08 : 1, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: shouldAnimate ? 1.4 : 0,
        ease: easeOut as unknown as "easeOut",
      },
    },
  };

  const dividerVariants = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: {
      scaleX: 1,
      opacity: 1,
      transition: {
        duration: shouldAnimate ? 0.6 : 0,
        delay: shouldAnimate ? 0.6 : 0,
        ease: easeOut as unknown as "easeOut",
      },
    },
  };

  return (
    <section className="relative w-full min-h-[100dvh] flex items-center justify-center overflow-hidden">
      {/* 滿版背景圖 (視差效果) */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroImageUrl})`,
          y: shouldAnimate ? backgroundY : 0,
        }}
        variants={imageVariants}
        initial="hidden"
        animate="visible"
      />

      {/* 暗色漸層遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

      {/* 內容區塊 (視差 + 滾動淡出) */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto"
        style={{
          opacity: shouldAnimate ? contentOpacity : 1,
          y: shouldAnimate ? contentY : 0,
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 品牌名稱 */}
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-white mb-6"
          variants={itemVariants}
        >
          {brandName}
        </motion.h1>

        {/* 裝飾線 */}
        <motion.div
          className="w-16 h-px mb-6"
          style={{ backgroundColor: primaryColor }}
          variants={dividerVariants}
        />

        {/* 標語 */}
        <motion.p
          className="text-xl md:text-2xl lg:text-3xl text-white/90 font-light tracking-wide max-w-xl"
          variants={itemVariants}
        >
          {slogan}
        </motion.p>

        {/* 聯絡按鈕 */}
        <motion.div variants={itemVariants} className="mt-12">
          <motion.a
            href="#contact"
            className="inline-block px-8 py-3 border text-white text-sm tracking-widest uppercase"
            style={{ borderColor: "rgba(255, 255, 255, 0.6)" }}
            whileHover={
              shouldAnimate
                ? {
                    borderColor: primaryColor,
                    backgroundColor: `${primaryColor}20`,
                    scale: 1.02,
                    transition: { duration: 0.3, ease: easeOut as unknown as "easeOut" },
                  }
                : {}
            }
            whileTap={shouldAnimate ? { scale: 0.98 } : {}}
          >
            聯絡我們
          </motion.a>
        </motion.div>
      </motion.div>

      {/* 底部漸層淡出 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />
    </section>
  );
}
