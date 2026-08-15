"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useBrandConfig, useDesignDials } from "@/components/TenantProvider";
import { ScrollReveal } from "./ScrollReveal";
import { ArrowRight, Check, X } from "lucide-react";

export function SectionPricing() {
  const brand = useBrandConfig();
  const design = useDesignDials();

  const pricing = brand?.pricing ?? { eyebrow: "", headline: "", plans: [] };
  const primaryColor = brand?.primaryColor ?? "#8B7355";
  const MOTION_INTENSITY = design?.MOTION_INTENSITY ?? 7;
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion && MOTION_INTENSITY > 3;

  const plans = [
    {
      name: "基本方案",
      badge: "從零開始",
      price: "NT$ 9,900",
      scope: "已有方向，但不確定從哪開始。我們從零開始把官網架好。",
      cta: "聊聊需求",
      featured: true,
      features: [
        { label: "單頁品牌網站，完整呈現民宿調性", included: true },
        { label: "基礎 SEO 與 Google 搜尋優化", included: true },
        { label: "聯絡表單、訂房導流、社群連結", included: true },
        { label: "部署上線與保固期一次免費調整", included: true },
        { label: "省力模組（自助 check-in、早餐點餐等）", included: false },
        { label: "PMS 後台串接", included: false },
      ],
    },
    {
      name: "進階方案",
      badge: "完整品牌",
      price: "NT$ 29,900 起",
      scope: "想把官網做成真正能接單的工具，而非只是美美的參考頁。",
      cta: "取得報價",
      secondary: true,
      features: [
        { label: "基本方案全部內容，延伸為多頁網站", included: true },
        { label: "線上訂房、房型展示或內容管理系統", included: true },
        { label: "房型、設施與在地體驗完整呈現", included: true },
        { label: "第三方工具、訊息通知或金流整合", included: true },
        { label: "上線後技術支援與迭代建議", included: true },
        { label: "PMS 後台串接與自動化流程", included: false },
      ],
    },
    {
      name: "省力模組開發",
      badge: "減少重複勞動",
      price: "依需求報價",
      scope: "讓民宿主人每天少回 20 條 LINE。自動化重複環節，把時間留給真正重要的事。",
      cta: "評估需求",
      features: [
        { label: "LINE 早餐點餐模組 UI / UX 設計", included: true },
        { label: "自助 check-in 介面（平板 / LINE 入口）", included: true },
        { label: "自動化通知系統（入住提醒、退房感謝等）", included: true },
        { label: "後台資料總覽（每日訂單一目了然）", included: true },
        { label: "與現有官網或系統串接整合", included: true },
        { label: "上線後技術支援與迭代建議", included: true },
      ],
    },
  ];

  return (
    <section id="pricing" className="w-full py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <ScrollReveal className="mb-16 lg:mb-20 text-center">
          <p className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: primaryColor }}>
            合作方案
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-white font-light" style={{ fontFamily: "var(--font-serif)", letterSpacing: "0.05em" }}>
            根據你的民宿型態，找到剛好合適的方案
          </h2>
          <p className="mt-5 text-white/50 text-base max-w-[52ch] mx-auto">
            從基本官網到完整品牌網站，配合省力模組，讓民宿日常自動化
          </p>
        </ScrollReveal>

        {/* Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 lg:items-stretch">
          {plans.map((plan, i) => (
            <ScrollReveal key={plan.name} delay={i * 0.1}>
              <motion.article
                className="relative flex flex-col h-full border overflow-hidden"
                style={{
                  borderColor: plan.featured ? primaryColor : "rgba(255,255,255,0.1)",
                  backgroundColor: plan.featured
                    ? `${primaryColor}0a`
                    : "rgba(255,255,255,0.02)",
                  boxShadow: plan.featured
                    ? `0 8px 40px ${primaryColor}15`
                    : "none",
                }}
                whileHover={shouldAnimate ? { y: -6 } : {}}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                {/* Badge */}
                <div className="p-6 lg:p-7 pb-0">
                  <span
                    className="inline-flex items-center gap-2 border px-3 py-1 text-xs font-semibold tracking-[0.18em]"
                    style={{
                      backgroundColor: plan.featured
                        ? `${primaryColor}15`
                        : "rgba(255,255,255,0.05)",
                      borderColor: plan.featured
                        ? `${primaryColor}40`
                        : "rgba(255,255,255,0.12)",
                      color: plan.featured ? primaryColor : "rgba(255,255,255,0.5)",
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
                      backgroundColor: plan.featured
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <p className="text-white/40 text-xs tracking-widest uppercase mb-2">
                      方案價格
                    </p>
                    <p
                      className="text-3xl font-semibold text-white"
                      style={{ fontFamily: "var(--font-serif)", letterSpacing: "0.02em" }}
                    >
                      {plan.price}
                    </p>
                    <p className="mt-3 text-white/50 text-xs leading-6">
                      {plan.scope}
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature.label}
                        className="flex items-start gap-3 text-sm"
                        style={{
                          color: feature.included
                            ? "rgba(255,255,255,0.7)"
                            : "rgba(255,255,255,0.25)",
                        }}
                      >
                        <span className="shrink-0 mt-0.5">
                          {feature.included ? (
                            <Check size={15} strokeWidth={2} style={{ color: primaryColor }} />
                          ) : (
                            <X size={15} strokeWidth={1.5} className="text-white/20" />
                          )}
                        </span>
                        {feature.label}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="mt-auto p-6 lg:p-7 pt-0">
                  <a
                    href="#contact"
                    className={`block w-full text-center py-4 text-sm font-semibold transition-all duration-300 border ${
                      plan.secondary
                        ? "text-white/70 hover:bg-white/5 hover:text-white"
                        : "text-white"
                    }`}
                    style={
                      plan.featured
                        ? { backgroundColor: primaryColor }
                        : plan.secondary
                        ? { borderColor: "rgba(255,255,255,0.2)" }
                        : {}
                    }
                  >
                    {plan.cta}
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
