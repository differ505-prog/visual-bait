"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";

export function Navigation() {
  const { brandName, primaryColor } = siteConfig;

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* 品牌 Logo 佔位符 */}
      <div className="text-white text-xl font-light tracking-widest">
        {brandName}
      </div>

      {/* 幽靈按鈕 */}
      <a
        href="#contact"
        className="px-6 py-2 border border-white/40 text-white text-sm tracking-wider hover:border-white hover:bg-white/10 transition-all duration-300"
        style={{
          borderColor: "rgba(255, 255, 255, 0.4)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = primaryColor;
          e.currentTarget.style.color = primaryColor;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.4)";
          e.currentTarget.style.color = "white";
        }}
      >
        聯絡我們
      </a>
    </motion.nav>
  );
}
