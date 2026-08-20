"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useDesignDials } from "@/components/TenantProvider";
import { ScrollReveal } from "./ScrollReveal";
import { agencyConfig } from "@/config/agency";
import { ArrowRight } from "@phosphor-icons/react";

export function AgencyWorkflow() {
  const design = useDesignDials();
  const MOTION_INTENSITY = design?.MOTION_INTENSITY ?? 7;
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion && MOTION_INTENSITY > 3;

  const workflow = agencyConfig.workflow;

  return (
    <section id="workflow" className="w-full py-24 lg:py-32 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <ScrollReveal className="mb-16 lg:mb-20 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p
              className="text-xs uppercase tracking-[0.2em] mb-4"
              style={{ color: agencyConfig.primaryColor }}
            >
              合作流程
            </p>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl text-white font-light max-w-xl"
              style={{
                fontFamily: "var(--font-serif)",
                letterSpacing: "0.04em",
              }}
            >
              四個交付節點，每個階段都有可操作的交付物
            </h2>
          </div>
          <p className="text-white/50 text-sm max-w-[38ch] leading-relaxed">
            每個階段結束時，收到一份交付物，確認後再進下一步
          </p>
        </ScrollReveal>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-white/10">
          {workflow.map((step, i) => (
            <ScrollReveal key={step.step} delay={i * 0.08}>
              <div className="lg:px-8 lg:first:pl-0 lg:last:pr-0">
                {/* Step number */}
                <div className="flex items-baseline gap-4 mb-6">
                  <span
                    className="text-5xl lg:text-6xl font-light text-white/10"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {step.step}
                  </span>
                  <div
                    className="h-px flex-1"
                    style={{ backgroundColor: `${agencyConfig.primaryColor}30` }}
                  />
                </div>

                {/* Step name */}
                <h3
                  className="text-lg text-white mb-3"
                  style={{
                    fontFamily: "var(--font-serif)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {step.name}
                </h3>

                {/* Step description */}
                <p className="text-white/40 text-sm leading-relaxed">
                  {step.desc}
                </p>

                {/* Arrow connector on desktop */}
                {i < workflow.length - 1 && (
                  <div className="hidden lg:block absolute -right-4 top-8">
                    <ArrowRight
                      size={20}
                      className="text-white/20"
                    />
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
