"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useBrandConfig, useDesignDials } from "@/components/TenantProvider";
import { ScrollReveal, StaggerReveal } from "./ScrollReveal";
import { Users, Ruler } from "@phosphor-icons/react";
import { brandConfig } from "@/config/site";

export function SectionRooms() {
  const brand = useBrandConfig();
  const design = useDesignDials();

  const rooms = brandConfig.rooms.map((defaultRoom, index) => {
    // If brand.rooms exists, find the corresponding room by ID, or just map by index if IDs don't match exactly
    const customRoom = brand?.rooms?.find(r => r.id === defaultRoom.id) || brand?.rooms?.[index];
    
    return {
      ...defaultRoom,
      ...customRoom,
      name: customRoom?.name || defaultRoom.name,
      description: customRoom?.description || defaultRoom.description,
      size: customRoom?.size || defaultRoom.size,
      capacity: customRoom?.capacity || defaultRoom.capacity,
      tag: customRoom?.tag || defaultRoom.tag,
      imageUrl: customRoom?.imageUrl || defaultRoom.imageUrl,
    };
  });
  const primaryColor = brand?.primaryColor || brandConfig.primaryColor;
  const MOTION_INTENSITY = design?.MOTION_INTENSITY ?? 7;

  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = prefersReducedMotion ? false : MOTION_INTENSITY > 3;

  return (
    <section id="rooms" className="w-full py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <ScrollReveal className="mb-16 lg:mb-20">
          <p
            className="text-xs uppercase tracking-[0.2em] mb-4"
            style={{ color: primaryColor }}
          >
            房型介紹
          </p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl text-white font-light"
            style={{
              fontFamily: "var(--font-serif)",
              letterSpacing: "0.05em",
            }}
          >
            三種風景，三種節奏
          </h2>
        </ScrollReveal>

        {/* Editorial Grid - asymmetric 3+2 layout */}
        <StaggerReveal className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {rooms.slice(0, 3).map((room, i) => (
            <RoomCard
              key={room.id}
              room={room}
              primaryColor={primaryColor}
              className={i === 0 ? "lg:col-span-3 lg:row-span-2" : "lg:col-span-2"}
              large={i === 0}
              index={i}
              shouldAnimate={shouldAnimate}
            />
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}

interface RoomCardProps {
  room: {
    id: string;
    name: string;
    description: string;
    capacity: number;
    size: string;
    imageUrl: string;
    tag: string;
  };
  primaryColor: string;
  className?: string;
  large?: boolean;
  index: number;
  shouldAnimate: boolean;
}

function RoomCard({
  room,
  primaryColor,
  className = "",
  large = false,
  index,
  shouldAnimate,
}: RoomCardProps) {
  return (
    <motion.article
      className={`group relative overflow-hidden ${className}`}
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: shouldAnimate ? 0.7 : 0,
            delay: shouldAnimate ? index * 0.12 : 0,
            ease: [0.16, 1, 0.3, 1] as const,
          },
        },
      }}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden"
        style={{
          height: large
            ? "clamp(320px, 55vh, 520px)"
            : "clamp(220px, 30vh, 340px)",
          backgroundColor: "#1a1614",
        }}
      >
        {room.imageUrl ? (
          <motion.img
            src={room.imageUrl}
            alt={room.name}
            className="w-full h-full object-cover wabi-img absolute inset-0"
            initial={shouldAnimate ? { scale: 1.06 } : false}
            animate={{ scale: 1 }}
            whileHover={shouldAnimate ? { scale: 1.04 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 relative">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span className="text-white/10 text-[10px] tracking-widest uppercase">
              示意圖
            </span>
          </div>
        )}

        {/* 暗色漸層遮罩 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 50%, rgba(10,8,6,0.92) 100%)",
          }}
        />
        {/* 暖色氛圍光暈 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 30% 40%, ${primaryColor}18 0%, transparent 55%), radial-gradient(ellipse at 70% 70%, rgba(255,235,200,0.05) 0%, transparent 40%)`,
          }}
        />

        {/* Tag */}
        <span
          className="absolute top-4 left-4 text-[10px] tracking-[0.18em] uppercase px-3 py-1.5 text-white border"
          style={{
            backgroundColor: `${primaryColor}40`,
            borderColor: "rgba(255,255,255,0.3)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          {room.tag}
        </span>
      </div>

      {/* Content */}
      <div
        className="p-6 lg:p-7"
        style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
      >
        <h3
          className="text-xl text-white mb-2"
          style={{
            fontFamily: "var(--font-serif)",
            letterSpacing: "0.06em",
          }}
        >
          {room.name}
        </h3>

        <p className="text-white/50 text-sm leading-relaxed mb-4 line-clamp-2">
          {room.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-5 text-white/40 text-xs mb-5">
          <span className="flex items-center gap-1.5">
            <Users size={14} weight="light" />
            {room.capacity} 人
          </span>
          <span className="flex items-center gap-1.5">
            <Ruler size={14} weight="light" />
            {room.size}
          </span>
        </div>

        {/* CTA */}
        <a
          href="#contact"
          className="inline-flex items-center gap-2 text-xs tracking-widest uppercase transition-all duration-300 group-hover:gap-3"
          style={{ color: primaryColor }}
        >
          了解詳情
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </motion.article>
  );
}
