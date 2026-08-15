"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useBrandConfig, useDesignDials } from "@/components/TenantProvider";
import { ScrollReveal } from "./ScrollReveal";
import { brandConfig } from "@/config/site";
import { Envelope, TelegramLogo } from "@phosphor-icons/react";

type FormState = "idle" | "submitting" | "success" | "error";

interface FormData {
  name: string;
  phone: string;
  lineId: string;
  email: string;
  message: string;
  website: string; // honeypot
}

export function SectionContact() {
  const brand = useBrandConfig();
  const design = useDesignDials();

  const primaryColor = brand?.primaryColor || brandConfig.primaryColor;
  const email = brand?.email || brandConfig.email;
  const line = brand?.line || brandConfig.line;
  const MOTION_INTENSITY = design?.MOTION_INTENSITY ?? 7;
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion && MOTION_INTENSITY > 3;

  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    lineId: "",
    email: "",
    message: "",
    website: "",
  });
  const [formState, setFormState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.name.trim()) newErrors.name = "請填寫姓名";
    if (!formData.phone.trim()) newErrors.phone = "請填寫聯絡電話";
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "email 格式有誤";
    if (!formData.message.trim()) newErrors.message = "請填寫需求";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setFormState("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "送出失敗");
      }

      setFormState("success");
      setFeedbackMessage("已收到你的訊息，我們會在 1-2 個工作天內回覆你");
    } catch (err) {
      setFormState("error");
      setFeedbackMessage(err instanceof Error ? err.message : "送出失敗，請稍後再試");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <section id="contact" className="w-full py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-16 lg:gap-20">
          {/* Left: Info */}
          <ScrollReveal direction="left">
            <h2
              className="text-3xl md:text-4xl lg:text-5xl text-white font-light mb-6 leading-tight"
              style={{
                fontFamily: "var(--font-serif)",
                letterSpacing: "0.05em",
              }}
            >
              想讓民宿官網真正能接單，從這裡開始
            </h2>
            <p className="text-white/50 text-base leading-relaxed max-w-[44ch] mb-10">
              把現況或需求丟過來，聊聊就知道方向。我們會在 1-2 個工作天內回覆你，提供初步建議
            </p>

            {/* LINE block */}
            <div
              className="p-6"
              style={{ backgroundColor: `${primaryColor}10`, border: `1px solid ${primaryColor}30` }}
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-xs">
                  <p className="inline-flex items-center gap-2 text-sm font-medium text-white/50 mb-3">
                    <TelegramLogo size={16} strokeWidth={1.5} />
                    LINE 官方帳號
                  </p>
                  <p
                    className="text-xl text-white mb-3"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    想更快開始，直接加 LINE
                  </p>
                  <p className="text-white/50 text-sm leading-relaxed">
                    評估需求方向，確認合作節奏
                  </p>
                  <div className="mt-5">
                <a
                  href={line}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white px-6 py-3 border transition hover:brightness-110"
                  style={{ borderColor: "#06C755" }}
                >
                  加 LINE 聊聊需求
                  <TelegramLogo size={16} strokeWidth={1.5} />
                </a>
                  </div>
                </div>

                <a
                  href={line}
                  target="_blank"
                  rel="noreferrer"
                  className="mx-auto block w-full max-w-[180px] p-4 text-center transition border"
                  style={{ backgroundColor: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" }}
                >
                  <img
                    src="/line-qr.png"
                    alt="築時數位 LINE 官方帳號 QR Code"
                    width={180}
                    height={180}
                    className="mx-auto h-auto w-full"
                  />
                  <p className="mt-3 text-[10px] uppercase tracking-[0.22em] text-white/30">
                    掃描加入
                  </p>
                </a>
              </div>
            </div>

            {/* Phone + Email */}
            <div className="mt-6 flex flex-col gap-3">
              <a
                href="tel:0988959922"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 transition hover:text-white"
                style={{ color: primaryColor }}
              >
                0988-959-922
                <span className="text-white/20 text-xs font-normal">（也可直接致電）</span>
              </a>
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 transition hover:text-white"
              >
                {email}
                <Envelope size={16} strokeWidth={1.5} />
              </a>
            </div>
          </ScrollReveal>

          {/* Right: Form */}
          <ScrollReveal direction="right" delay={0.1}>
            {formState === "success" ? (
              <motion.div
                className="flex flex-col items-center justify-center text-center p-12 border"
                style={{
                  backgroundColor: `${primaryColor}10`,
                  borderColor: `${primaryColor}30`,
                }}
                initial={shouldAnimate ? { opacity: 0, scale: 0.96 } : false}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <div
                  className="text-4xl mb-4"
                  style={{ color: primaryColor }}
                >
                  ✓
                </div>
                <h3
                  className="text-xl text-white mb-2"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {feedbackMessage}
                </h3>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-5 p-8"
                style={{
                  backgroundColor: `${primaryColor}0d`,
                  border: `1px solid ${primaryColor}20`,
                }}
              >
                <FormField
                  label="姓名"
                  name="name"
                  placeholder="請輸入你的姓名"
                  value={formData.name}
                  error={errors.name}
                  onChange={handleChange}
                  required
                />

                <FormField
                  label="聯絡電話"
                  name="phone"
                  placeholder="0912-345-678"
                  value={formData.phone}
                  error={errors.phone}
                  onChange={handleChange}
                  required
                />

                <FormField
                  label="LINE ID"
                  name="lineId"
                  placeholder="@your.line.id"
                  value={formData.lineId}
                  error={errors.lineId}
                  onChange={handleChange}
                />

                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="you@company.com"
                  value={formData.email}
                  error={errors.email}
                  onChange={handleChange}
                />

                {/* Honeypot - hidden from real users */}
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                  className="absolute -left-[9999px] w-px h-px"
                  aria-hidden="true"
                />

                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-widest text-white/40">
                    需求描述 <span className="text-red-400/50">*</span>
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    placeholder="請描述你的民宿現況與需求"
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full border px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none resize-none transition-colors duration-300 ${
                      errors.message
                        ? "border-red-400/60 bg-white/5"
                        : "border-white/15 focus:border-white/40 bg-white/5"
                    }`}
                  />
                  {errors.message && (
                    <p className="text-red-400/80 text-xs">{errors.message}</p>
                  )}
                </div>

                {formState === "error" && feedbackMessage ? (
                  <p
                    className="px-4 py-3 text-sm border border-red-400/30 text-red-400"
                    role="alert"
                  >
                    {feedbackMessage}
                  </p>
                ) : null}

                <motion.button
                  type="submit"
                  className="mt-2 py-4 text-sm font-semibold text-white border cursor-pointer flex items-center justify-center gap-2 transition-all duration-300"
                  style={{ backgroundColor: primaryColor }}
                  disabled={formState === "submitting"}
                  whileHover={shouldAnimate ? { scale: 1.02 } : {}}
                  whileTap={shouldAnimate ? { scale: 0.98 } : {}}
                >
                  {formState === "submitting" ? (
                    <>
                      <span className="animate-pulse">送出中...</span>
                    </>
                  ) : (
                    <>
                      送出需求
                      →
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

function FormField({
  label,
  name,
  type = "text",
  placeholder,
  value,
  error,
  onChange,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs uppercase tracking-widest text-white/40">
        {label} {required && <span className="text-red-400/50">*</span>}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full border px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none transition-colors duration-300 bg-white/5 ${
          error ? "border-red-400/60" : "border-white/15 focus:border-white/40"
        }`}
      />
      {error && <p className="text-red-400/80 text-xs">{error}</p>}
    </div>
  );
}
