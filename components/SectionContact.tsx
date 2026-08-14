"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { brandConfig, designDials } from "@/config/site";
import { ScrollReveal } from "./ScrollReveal";
import { PaperPlaneTilt, Phone, Envelope, MapPin } from "@phosphor-icons/react";

type FormState = "idle" | "submitting" | "success" | "error";

interface FormData {
  name: string;
  phone: string;
  email: string;
  message: string;
}

export function SectionContact() {
  const { primaryColor, phone, email, address } = brandConfig;
  const { MOTION_INTENSITY } = designDials;
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion && MOTION_INTENSITY > 3;

  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [formState, setFormState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.name.trim()) newErrors.name = "請填寫姓名";
    if (!formData.phone.trim()) newErrors.phone = "請填寫電話";
    else if (!/^[0-9\-\s\+]{8,}$/.test(formData.phone))
      newErrors.phone = "電話格式有誤";
    if (!formData.email.trim()) newErrors.email = "請填寫 email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "email 格式有誤";
    if (!formData.message.trim()) newErrors.message = "請填寫需求";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setFormState("submitting");

    // Simulate submission
    await new Promise((r) => setTimeout(r, 1500));
    setFormState("success");
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left: Info */}
          <ScrollReveal direction="left">
            <p
              className="text-xs uppercase tracking-[0.2em] mb-4"
              style={{ color: primaryColor }}
            >
              聯絡我們
            </p>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl text-white font-light mb-6 leading-tight"
              style={{
                fontFamily: "var(--font-serif)",
                letterSpacing: "0.05em",
              }}
            >
              聊聊你的需求
            </h2>
            <p className="text-white/50 text-base leading-relaxed max-w-[42ch] mb-12">
              不確定哪個方案適合？留下聯絡方式，我們會在一個工作日內回覆，根據你的民宿規模與風格推薦最合適的方案。
            </p>

            {/* Contact details */}
            <div className="flex flex-col gap-5">
              <ContactItem
                icon={<Phone size={18} weight="light" />}
                label="電話"
                value={phone}
                primaryColor={primaryColor}
              />
              <ContactItem
                icon={<Envelope size={18} weight="light" />}
                label="Email"
                value={email}
                primaryColor={primaryColor}
              />
              <ContactItem
                icon={<MapPin size={18} weight="light" />}
                label="地址"
                value={address}
                primaryColor={primaryColor}
              />
            </div>
          </ScrollReveal>

          {/* Right: Form */}
          <ScrollReveal direction="right" delay={0.1}>
            {formState === "success" ? (
              <motion.div
                className="flex flex-col items-center justify-center text-center p-12 border border-white/10"
                style={{
                  backgroundColor: `${primaryColor}0d`,
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
                  <PaperPlaneTilt size={48} weight="light" />
                </div>
                <h3
                  className="text-xl text-white mb-2"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  已收到你的訊息
                </h3>
                <p className="text-white/50 text-sm">
                  我們會在 1 個工作日內聯繫你，請留意手機或 email。
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Name */}
                <FormField
                  label="姓名"
                  name="name"
                  placeholder="王小明"
                  value={formData.name}
                  error={errors.name}
                  onChange={handleChange}
                  primaryColor={primaryColor}
                />

                {/* Phone */}
                <FormField
                  label="聯絡電話"
                  name="phone"
                  placeholder="0912-345-678"
                  value={formData.phone}
                  error={errors.phone}
                  onChange={handleChange}
                  primaryColor={primaryColor}
                />

                {/* Email */}
                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  error={errors.email}
                  onChange={handleChange}
                  primaryColor={primaryColor}
                />

                {/* Message */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-widest text-white/40">
                    你的需求
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="民宿地點、房型數量、想要的風格..."
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full bg-transparent border px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none resize-none transition-colors duration-300 ${
                      errors.message ? "border-red-400/60" : "border-white/15 focus:border-white/40"
                    }`}
                  />
                  {errors.message && (
                    <p className="text-red-400/80 text-xs">{errors.message}</p>
                  )}
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  className="mt-2 py-4 text-xs tracking-widest uppercase text-white cursor-pointer flex items-center justify-center gap-2 transition-all duration-300"
                  style={{ backgroundColor: primaryColor }}
                  disabled={formState === "submitting"}
                  whileHover={shouldAnimate ? { scale: 1.02 } : {}}
                  whileTap={shouldAnimate ? { scale: 0.98 } : {}}
                >
                  {formState === "submitting" ? (
                    <>
                      <span className="animate-pulse">傳送中...</span>
                    </>
                  ) : (
                    <>
                      送出諮詢
                      <PaperPlaneTilt size={16} weight="regular" />
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
  primaryColor,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  primaryColor: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs uppercase tracking-widest text-white/40">
        {label}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full bg-transparent border px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none transition-colors duration-300 ${
          error ? "border-red-400/60" : "border-white/15 focus:border-white/40"
        }`}
      />
      {error && <p className="text-red-400/80 text-xs">{error}</p>}
    </div>
  );
}

function ContactItem({
  icon,
  label,
  value,
  primaryColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  primaryColor: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div style={{ color: primaryColor }}>{icon}</div>
      <div>
        <p className="text-white/30 text-[11px] uppercase tracking-widest mb-0.5">
          {label}
        </p>
        <p className="text-white/80 text-sm">{value}</p>
      </div>
    </div>
  );
}
