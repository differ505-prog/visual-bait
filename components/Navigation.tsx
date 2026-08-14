"use client";

import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { brandConfig, designDials } from "@/config/site";
import { useState, useEffect } from "react";
import { List, X } from "@phosphor-icons/react";

const navItems = [
  { label: "房型介紹", href: "#rooms" },
  { label: "空間設施", href: "#amenities" },
  { label: "故事理念", href: "#story" },
  { label: "合作方案", href: "#pricing" },
];

export function Navigation() {
  const { brandName, primaryColor } = brandConfig;
  const { MOTION_INTENSITY } = designDials;
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion && MOTION_INTENSITY > 3;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-12 py-4 transition-all duration-500"
        style={{
          backgroundColor: isScrolled
            ? "rgba(10, 8, 6, 0.85)"
            : "transparent",
          backdropFilter: isScrolled ? "blur(16px) saturate(180%)" : "none",
          WebkitBackdropFilter: isScrolled
            ? "blur(16px) saturate(180%)"
            : "none",
          borderBottom: isScrolled
            ? "1px solid rgba(255,255,255,0.06)"
            : "1px solid transparent",
        }}
        initial={shouldAnimate ? { opacity: 0, y: -16 } : false}
        animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
        transition={
          shouldAnimate
            ? { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
            : {}
        }
      >
        {/* Logo */}
        <a
          href="#"
          className="text-white text-lg font-serif tracking-widest"
        >
          {brandName}
        </a>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-10">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="relative text-white/70 text-sm tracking-wider uppercase transition-colors duration-300 group"
              onMouseEnter={() => setHoveredItem(item.label)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {item.label}
              <span
                className="absolute -bottom-1 left-0 h-px transition-all duration-300"
                style={{
                  width: hoveredItem === item.label ? "100%" : "0%",
                  backgroundColor:
                    hoveredItem === item.label ? primaryColor : "transparent",
                }}
              />
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <motion.a
            href="#contact"
            className="px-5 py-2 text-xs tracking-wider uppercase text-white border transition-all duration-300"
            style={{
              borderColor: "rgba(255,255,255,0.3)",
              backgroundColor: "transparent",
            }}
            whileHover={
              shouldAnimate
                ? {
                    borderColor: primaryColor,
                    backgroundColor: `${primaryColor}22`,
                    transition: { duration: 0.25 },
                  }
                : {}
            }
            whileTap={shouldAnimate ? { scale: 0.97 } : {}}
          >
            免費諮詢
          </motion.a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 text-white/80"
          onClick={() => setMobileOpen(true)}
          aria-label="開啟選單"
        >
          <List size={22} weight="light" />
        </button>
      </motion.nav>

      {/* Mobile Overlay Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex flex-col"
            style={{ backgroundColor: "rgba(10, 8, 6, 0.97)" }}
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex justify-between items-center px-6 py-4">
              <span className="text-white font-serif tracking-widest">
                {brandName}
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-white/70"
                aria-label="關閉選單"
              >
                <X size={22} weight="light" />
              </button>
            </div>

            <nav className="flex flex-col px-6 pt-12 gap-8">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  className="text-white text-2xl font-serif tracking-wider"
                  style={{ fontFamily: "var(--font-serif)" }}
                  onClick={() => setMobileOpen(false)}
                  initial={shouldAnimate ? { opacity: 0, x: 20 } : false}
                  animate={
                    shouldAnimate ? { opacity: 1, x: 0 } : {}
                  }
                  transition={
                    shouldAnimate
                      ? {
                          duration: 0.5,
                          delay: 0.1 + i * 0.06,
                          ease: [0.16, 1, 0.3, 1],
                        }
                      : {}
                  }
                >
                  {item.label}
                </motion.a>
              ))}
            </nav>

            <div className="mt-auto px-6 pb-12">
              <a
                href="#contact"
                className="block text-center w-full py-4 text-xs tracking-widest uppercase text-white border"
                style={{ borderColor: "rgba(255,255,255,0.3)" }}
                onClick={() => setMobileOpen(false)}
              >
                免費諮詢
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
