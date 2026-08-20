"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useDesignDials } from "@/components/TenantProvider";
import { ScrollReveal } from "./ScrollReveal";
import { agencyConfig } from "@/config/agency";
import { Check, ArrowRight } from "@phosphor-icons/react";

const plans = [
  {
    name: "品牌起步方案",
    badge: "生活品牌首選",
    price: "NT$ 9,900",
    scope: "從零建立品牌門面。已有方向，從這裡開始。",
    cta: "聊聊需求",
    featured: true,
    features: [
      "單頁式品牌 Landing Page",
      "基礎 SEO、OG 與品牌資訊設定",
      "聯絡表單、社群連結與 CTA 導流",
      "部署協助與保固期內一次微調",
    ],
    excluded: ["App UI 設計", "後台會員與複雜營運邏輯"],
  },
  {
    name: "品牌延伸方案",
    badge: "進階合作",
    price: "NT$ 29,900 起",
    scope: "從單頁升級為完整品牌體驗。需要會員、預約或內容管理。",
    cta: "聊聊需求",
    secondary: true,
    features: [
      "起步方案延伸為多頁品牌網站",
      "會員、預約、詢價或內容管理機制",
      "服務流程、案例與方案的完整頁面編排",
      "第三方工具、付款或 AI 功能整合",
      "上線後 30 天技術支援",
    ],
    excluded: [],
  },
  {
    name: "App 與系統客製",
    badge: "含 App 開發設計",
    price: "依需求報價",
    scope: "想把服務延伸成原生或跨平台 App，一路做到上架。",
    cta: "聊聊需求",
    features: [
      "App UI / UX 設計與互動原型",
      "iOS / Android 原生或跨平台 App 開發",
      "App Store / Google Play 上架輔導",
      "後台、會員、權限與資料流程規劃",
      "第三方服務、付款或 AI API 整合",
      "上線後保固與後續迭代支援",
    ],
    excluded: [],
  },
];

export function AgencyPricing() {
  const design = useDesignDials();
  const MOTION_INTENSITY = design?.MOTION_INTENSITY ?? 7;
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion && MOTION_INTENSITY > 3;

  return (
    <section id="pricing" className="w-full py-24 lg:py-32 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <ScrollReveal className="mb-16 lg:mb-20 text-center">
          <p
            className="text-xs uppercase tracking-[0.2em] mb-4"
            style={{ color: agencyConfig.primaryColor }}
          >
            合作方案
          </p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl text-white font-light"
            style={{
              fontFamily: "var(--font-serif)",
              letterSpacing: "0.04em",
            }}
          >
            三種方案，銜接不同的起步點
          </h2>
          <p className="mt-5 text-white/50 text-sm max-w-[44ch] mx-auto">
            每個方案都有明確的交付節點，先從最小版本開始
          </p>
        </ScrollReveal>

        {/* Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 lg:items-stretch">
          {plans.map((plan, i) => (
            <ScrollReveal key={plan.name} delay={i * 0.1}>
              <motion.article
                className="relative flex flex-col h-full border overflow-hidden"
                style={{
                  borderColor: plan.featured ? agencyConfig.primaryColor : "rgba(255,255,255,0.1)",
                  backgroundColor: plan.featured
                    ? `${agencyConfig.primaryColor}08`
                    : "rgba(255,255,255,0.02)",
                  boxShadow: plan.featured ? `0 8px 40px ${agencyConfig.primaryColor}12` : "none",
                }}
                whileHover={shouldAnimate ? { y: -6 } : {}}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                {/* Badge */}
                <div className="p-6 lg:p-7 pb-0">
                  <span
                    className="inline-flex items-center gap-2 border px-3 py-1 text-xs tracking-[0.15em]"
                    style={{
                      backgroundColor: plan.featured ? `${agencyConfig.primaryColor}18` : "rgba(255,255,255,0.05)",
                      borderColor: plan.featured ? `${agencyConfig.primaryColor}40` : "rgba(255,255,255,0.12)",
                      color: plan.featured ? agencyConfig.primaryColor : "rgba(255,255,255,0.5)",
                    }}
                  >
                    {plan.badge}
                  </span>
                </div>

                {/* Name + Price */}
                <div className="p-6 lg:p-7">
                  <h3
                    className="text-2xl text-white mb-5"
                    style={{ fontFamily: "var(--font-serif)", letterSpacing: "0.04em" }}
                  >
                    {plan.name}
                  </h3>

                  {/* Price card */}
                  <div
                    className="p-5 mb-6"
                    style={{
                      backgroundColor: plan.featured ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <p className="text-white/30 text-[10px] tracking-[0.22em] uppercase mb-2">
                      方案價格
                    </p>
                    <p
                      className="text-3xl font-semibold text-white"
                      style={{ fontFamily: "var(--font-serif)", letterSpacing: "0.02em" }}
                    >
                      {plan.price}
                    </p>
                    <p className="mt-3 text-white/50 text-xs leading-relaxed">
                      {plan.scope}
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm text-white/70"
                      >
                        <Check
                          size={15}
                          strokeWidth={2}
                          className="shrink-0 mt-0.5"
                          style={{ color: agencyConfig.primaryColor }}
                        />
                        {feature}
                      </li>
                    ))}
                    {plan.excluded?.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm text-white/20"
                      >
                        <span className="shrink-0 mt-0.5 w-3.5 h-3.5 flex items-center justify-center text-[10px]">—</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="mt-auto p-6 lg:p-7 pt-0">
                  <a
                    href="#contact"
                    className={`flex items-center justify-center gap-2 w-full text-center py-4 text-sm font-semibold transition-all duration-300 border ${
                      plan.secondary
                        ? "text-white/70 hover:bg-white/5 hover:text-white"
                        : "text-white"
                    }`}
                    style={
                      plan.featured
                        ? { backgroundColor: agencyConfig.primaryColor, borderColor: agencyConfig.primaryColor }
                        : { borderColor: "rgba(255,255,255,0.2)" }
                    }
                  >
                    {plan.cta}
                    <ArrowRight size={15} weight="regular" />
                  </a>
                </div>
              </motion.article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
