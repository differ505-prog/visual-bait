"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";

export function HeroSection() {
  const { brandName, heroImageUrl, primaryColor, slogan } = siteConfig;

  return (
    <section className="relative w-full min-h-[100dvh] flex items-center justify-center overflow-hidden">
      {/* 滿版背景圖 */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImageUrl})` }}
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* 暗色漸層遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

      {/* 內容區塊 */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">
        {/* 品牌名稱 */}
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-white mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {brandName}
        </motion.h1>

        {/* 裝飾線 */}
        <motion.div
          className="w-16 h-px mb-6"
          style={{ backgroundColor: primaryColor }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* 標語 */}
        <motion.p
          className="text-xl md:text-2xl lg:text-3xl text-white/90 font-light tracking-wide max-w-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {slogan}
        </motion.p>

        {/* 聯絡按鈕 */}
        <motion.a
          href="#contact"
          className="mt-12 px-8 py-3 border border-white/60 text-white text-sm tracking-widest uppercase hover:border-white hover:bg-white/10 transition-all duration-300"
          style={{
            borderColor: "rgba(255, 255, 255, 0.6)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{
            borderColor: primaryColor,
            backgroundColor: `${primaryColor}20`,
            scale: 1.02,
          }}
        >
          聯絡我們
        </motion.a>
      </div>

      {/* 底部漸層淡出 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />
    </section>
  );
}
