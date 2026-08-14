import type { Metadata } from "next";
import { Noto_Serif_TC, Noto_Sans_TC } from "next/font/google";
import "./globals.css";
import { brandConfig } from "@/config/site";

const notoSerif = Noto_Serif_TC({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const notoSans = Noto_Sans_TC({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: `${brandConfig.brandName} · ${brandConfig.slogan}`,
  description:
    "晴境莊精品民宿，位於花蓮山海之間。森林景觀套房、山景雙人房、家庭四人房，提供管家服務與景觀浴缸。",
  keywords: "花蓮民宿, 山景民宿, 精品民宿, 霧山村, 壽豐鄉",
  openGraph: {
    title: brandConfig.brandName,
    description: brandConfig.slogan,
    images: [brandConfig.heroImageUrl],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW" className={`${notoSerif.variable} ${notoSans.variable}`}>
      <body className="min-h-screen antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
