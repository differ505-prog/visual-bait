"use client";

import { motion, useReducedMotion, MotionValue } from "framer-motion";
import { useRef } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
  once?: boolean;
  amount?: number;
}

const easeOut = [0.16, 1, 0.3, 1] as const;

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  once = true,
  amount = 0.15,
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  const initial = prefersReducedMotion
    ? { opacity: 1 }
    : {
        opacity: 0,
        y: direction === "up" ? 28 : 0,
        x: direction === "left" ? -28 : direction === "right" ? 28 : 0,
      };

  const whileInView = prefersReducedMotion
    ? { opacity: 1 }
    : {
        opacity: 1,
        y: 0,
        x: 0,
      };

  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={whileInView}
      viewport={{ once, amount }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.7,
        delay: prefersReducedMotion ? 0 : delay,
        ease: easeOut as unknown as "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}

// Stagger container for grid items
interface StaggerRevealProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerReveal({
  children,
  className = "",
  staggerDelay = 0.08,
}: StaggerRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: prefersReducedMotion ? 0 : staggerDelay,
            delayChildren: prefersReducedMotion ? 0 : 0.1,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut as unknown as "easeOut" },
  },
};
