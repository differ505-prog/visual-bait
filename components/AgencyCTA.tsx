"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useDesignDials } from "@/components/TenantProvider";
import { ScrollReveal } from "./ScrollReveal";
import { agencyConfig } from "@/config/agency";
import { ArrowRight, TelegramLogo } from "@phosphor-icons/react";

export function AgencyCTA() {
  const design = useDesignDials();
  const MOTION_INTENSITY = design?.MOTION_INTENSITY ?? 7;
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion && MOTION_INTENSITY > 3;

  return (
    <section id="contact" className="w-full py-24 lg:py-32 border-t border-white/10">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
        <ScrollReveal>
          <h2
            className="text-3xl md:text-5xl lg:text-6xl text-white font-light mb-6 leading-tight"
            style={{
              fontFamily: "var(--font-serif)",
              letterSpacing: "0.04em",
            }}
          >
            讓品牌從網站到 App 更安定、更有質感
            <br />
            現在開始
          </h2>
          <p className="text-white/50 text-base leading-relaxed max-w-[46ch] mx-auto mb-12">
            無論剛起步、想改版、或想把服務延伸成 App，從一個想法開始聊。1-2 個工作天內回覆。
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <motion.a
              href={agencyConfig.line}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-10 py-4 text-xs tracking-widest uppercase text-white"
              style={{
                backgroundColor: "#06C755",
                boxShadow: "0 8px 40px rgba(6,199,85,0.2)",
              }}
              whileHover={shouldAnimate ? { scale: 1.03, boxShadow: "0 16px 50px rgba(6,199,85,0.35)" } : {}}
              whileTap={shouldAnimate ? { scale: 0.98 } : {}}
            >
              <TelegramLogo size={16} weight="regular" />
              加 LINE 聊聊需求
            </motion.a>

            <motion.a
              href="#agency"
              className="px-10 py-4 text-xs tracking-widest uppercase text-white/60 border border-white/20 hover:border-white/40 hover:text-white transition-all duration-300"
              whileTap={shouldAnimate ? { scale: 0.98 } : {}}
            >
              看看實際作品
            </motion.a>
          </div>

          {/* LINE QR */}
          <div className="mt-12 inline-block">
            <a
              href={agencyConfig.line}
              target="_blank"
              rel="noreferrer"
              className="block p-4 border transition-colors duration-300"
              style={{
                backgroundColor: "rgba(255,255,255,0.03)",
                borderColor: "rgba(255,255,255,0.1)",
              }}
            >
              <img
                src="/line-qr.png"
                alt="築時數位 LINE 官方帳號 QR Code"
                width={140}
                height={140}
                className="mx-auto h-auto w-[120px] lg:w-[140px]"
              />
              <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-white/25">
                掃描加入
              </p>
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
