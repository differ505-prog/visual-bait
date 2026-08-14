"use client";

import { motion, useReducedMotion } from "framer-motion";
import { brandConfig, designDials } from "@/config/site";

export function Navigation() {
  const { brandName, primaryColor } = brandConfig;
  const { MOTION_INTENSITY } = designDials;

  // 檢測系統是否偏好減少動畫
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion && MOTION_INTENSITY > 3;

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6"
      initial={shouldAnimate ? { opacity: 0, y: -20 } : false}
      animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 1 }}
      transition={
        shouldAnimate
          ? { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
          : { duration: 0 }
      }
    >
      {/* 品牌 Logo 佔位符 */}
      <div className="text-white text-xl font-light tracking-widest">
        {brandName}
      </div>

      {/* 幽靈按鈕 */}
      <motion.a
        href="#contact"
        className="px-6 py-2 border text-white text-sm tracking-wider uppercase"
        style={{ borderColor: "rgba(255, 255, 255, 0.4)" }}
        whileHover={
          shouldAnimate
            ? {
                borderColor: primaryColor,
                color: primaryColor,
                backgroundColor: `${primaryColor}15`,
                transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
              }
            : {}
        }
        whileTap={shouldAnimate ? { scale: 0.97 } : {}}
      >
        聯絡我們
      </motion.a>
    </motion.nav>
  );
}
