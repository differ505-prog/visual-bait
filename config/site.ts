/**
 * Visual Bait - 民宿獲客模板設定檔
 *
 * 只需修改以下 4 個變數即可改變整個網站的品牌調性
 * 所有 UI 程式碼都會自動讀取這裡的值
 */

export const siteConfig = {
  /** 民宿品牌名稱 */
  brandName: "晴境莊",

  /** 滿版主視覺背景相片 (建議使用高畫質的景觀/室內設計圖片) */
  heroImageUrl: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=2000&auto=format&fit=crop",

  /** 品牌主色調 (Hex Code) - 應用於按鈕、重點裝飾 */
  primaryColor: "#8B7355",

  /** 充滿氛圍的主打標語 */
  slogan: "在山海之間，遇見回家的感覺",
} as const;

export type SiteConfig = typeof siteConfig;
