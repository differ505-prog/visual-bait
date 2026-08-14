/**
 * Visual Bait - 民宿獲客模板設定檔
 *
 * 只需修改以下變數即可改變整個網站的品牌調性
 * 所有 UI 程式碼都會自動讀取這裡的值
 */

// ============================================
// 品牌核心設定
// ============================================
export const brandConfig = {
  /** 民宿品牌名稱 */
  brandName: "晴境莊",

  /** 滿版主視覺背景相片 (建議使用高畫質的景觀/室內設計圖片) */
  heroImageUrl: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=2000&auto=format&fit=crop",

  /** 品牌主色調 (Hex Code) - 應用於按鈕、重點裝飾 */
  primaryColor: "#8B7355",

  /** 充滿氛圍的主打標語 */
  slogan: "在山海之間，遇見回家的感覺",
} as const;

// ============================================
// 設計參數 (Design Dials)
// 根據 design-taste-frontend skill
// ============================================
export const designDials = {
  /**
   * DESIGN_VARIANCE: 1 = 完美對稱, 10 = 前衛藝術
   * - 5-6: 極簡/乾淨
   * - 7-8: 精品民宿/品牌
   * - 9-10: 創意機構
   */
  VARIANCE: 7,

  /**
   * MOTION_INTENSITY: 1 = 靜態, 10 = 電影級動畫
   * - 3-4: 極簡/安靜
   * - 5-6: 精品民宿
   * - 7-8: 創意機構
   */
  MOTION_INTENSITY: 6,

  /**
   * VISUAL_DENSITY: 1 = 藝廊留白, 10 = 儀表板密集
   * - 2-3: 極簡/精品
   * - 4-5: 一般商業
   */
  DENSITY: 3,
} as const;

// 向後兼容：導出 siteConfig
export const siteConfig = brandConfig;

export type BrandConfig = typeof brandConfig;
export type DesignDials = typeof designDials;
