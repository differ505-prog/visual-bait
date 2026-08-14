import type { Metadata } from "next";
import Link from "next/link";

type Props = {
  searchParams: Promise<{ slug?: string }>;
};

export const metadata: Metadata = {
  title: "此頁面已過期",
};

export default async function ExpiredPage({ searchParams }: Props) {
  const { slug } = await searchParams;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: "#0a0806" }}
    >
      {/* Decorative gradient orb */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-10 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(139,115,85,0.4) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="relative text-center max-w-md">
        {/* Icon */}
        <div className="mb-8">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="0.75"
            className="mx-auto"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>

        <p
          className="text-xs uppercase tracking-[0.25em] mb-4"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          {slug ? `「${slug}」` : ""} 已過期
        </p>

        <h1
          className="text-3xl md:text-4xl text-white font-light mb-6"
          style={{
            fontFamily: "var(--font-serif, serif)",
            letterSpacing: "0.05em",
          }}
        >
          此頁面已停止服務
        </h1>

        <p
          className="text-sm leading-relaxed mb-10"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          感謝使用。若有需要重新啟用服務，請聯繫建置單位。
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="https://line.ee/uh4z4dL"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs tracking-widest uppercase text-white"
            style={{
              backgroundColor: "#06C755",
              borderRadius: "9999px",
            }}
          >
            聯絡建置單位
          </a>
          <a
            href="/demo"
            className="inline-flex items-center justify-center px-6 py-3 text-xs tracking-widest uppercase text-white border"
            style={{
              borderColor: "rgba(255,255,255,0.15)",
              borderRadius: "9999px",
            }}
          >
            觀看展示
          </a>
        </div>
      </div>

      {/* Footer */}
      <p
        className="absolute bottom-6 text-[10px] tracking-widest"
        style={{ color: "rgba(255,255,255,0.15)" }}
      >
        民宿獲客模板 · 築時數位
      </p>
    </div>
  );
}
