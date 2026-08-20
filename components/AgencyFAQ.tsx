"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useDesignDials } from "@/components/TenantProvider";
import { ScrollReveal } from "./ScrollReveal";
import { agencyConfig } from "@/config/agency";
import { Plus, Minus } from "@phosphor-icons/react";

const faqs = [
  {
    q: "你們只做網站，App 也能一起做？",
    a: "網站與原生 App 都在服務範圍，客戶從品牌網站起步，定位穩定後再延伸 App。",
  },
  {
    q: "網站上線後，更新菜單、案例或服務內容怎麼辦？",
    a: "基本方案包含一次免費微調。上線後若需要頻繁更新內容，建議升級至品牌延伸方案，串接內容管理系統，之後可以自行更新。",
  },
  {
    q: "想加入預約、會員、App 或更完整的功能呢？",
    a: "從品牌官網起步確認方向，定位穩定後再逐步延伸功能模組。預約、會員、App 都是獨立的服務項目，可以隨需求啟動。",
  },
  {
    q: "App 開發做到上架程度嗎？要另外找人接手嗎？",
    a: "從 UI/UX 設計到 iOS / Android 上架、App Store / Google Play 審核輔導，全部在服務範圍內。不需要另外找人接手。",
  },
  {
    q: "能在短時間內完成有質感的品牌頁面嗎？",
    a: "從方向確認到視覺提案約 3-5 天，視覺確認後到上線依方案規模約 2-4 週。速度取決於需求複雜度和回覆節奏。",
  },
];

export function AgencyFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const design = useDesignDials();
  const MOTION_INTENSITY = design?.MOTION_INTENSITY ?? 7;
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion && MOTION_INTENSITY > 3;

  return (
    <section id="faq" className="w-full py-24 lg:py-32 border-t border-white/10">
      <div className="max-w-3xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <ScrollReveal className="mb-16 lg:mb-20">
          <p
            className="text-xs uppercase tracking-[0.2em] mb-4"
            style={{ color: agencyConfig.primaryColor }}
          >
            常見問題
          </p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl text-white font-light"
            style={{
              fontFamily: "var(--font-serif)",
              letterSpacing: "0.04em",
            }}
          >
            把常見疑問說清楚
          </h2>
        </ScrollReveal>

        {/* FAQ List */}
        <div className="space-y-0 divide-y divide-white/10">
          {faqs.map((faq, i) => (
            <ScrollReveal key={i} delay={i * 0.05}>
              <div>
                <button
                  className="w-full text-left py-6 flex items-start justify-between gap-4 group"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                >
                  <span
                    className="text-white text-base lg:text-lg group-hover:text-white/80 transition-colors duration-300"
                    style={{ fontFamily: "var(--font-serif)", letterSpacing: "0.03em" }}
                  >
                    {faq.q}
                  </span>
                  <span
                    className="shrink-0 mt-1 transition-colors duration-300"
                    style={{ color: openIndex === i ? agencyConfig.primaryColor : "rgba(255,255,255,0.3)" }}
                  >
                    {openIndex === i ? (
                      <Minus size={18} weight="regular" />
                    ) : (
                      <Plus size={18} weight="regular" />
                    )}
                  </span>
                </button>

                <motion.div
                  initial={false}
                  animate={{
                    height: openIndex === i ? "auto" : 0,
                    opacity: openIndex === i ? 1 : 0,
                  }}
                  transition={{
                    duration: shouldAnimate ? 0.35 : 0,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="overflow-hidden"
                >
                  <p className="text-white/50 text-sm leading-relaxed pb-6 pr-10">
                    {faq.a}
                  </p>
                </motion.div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
