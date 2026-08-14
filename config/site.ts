/**
 * Visual Bait - 民宿獲客模板設定檔
 *
 * 只需修改以下變數即可改變整個網站的品牌調性
 * 所有 UI 程式碼都會自動讀取這裡的值
 *
 * 品牌調性設定指引：
 * - 精品民宿：primaryColor 選用暖棕/米金色系
 * - 現代簡約：primaryColor 選用炭灰/深藍色系
 * - 森林系：primaryColor 選用苔綠/大地色系
 */

// ============================================
// 品牌核心設定
// ============================================
export const brandConfig = {
  /** 民宿品牌名稱 */
  brandName: "晴境莊",

  /** 滿版主視覺背景相片 (建議使用高畫質的景觀/室內設計圖片) */
  heroImageUrl:
    "https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=2000&auto=format&fit=crop",

  /** 品牌主色調 (Hex Code) - 應用於按鈕、重點裝飾 */
  primaryColor: "#8B7355",

  /** 充滿氛圍的主打標語 */
  slogan: "在山海之間，遇見回家的感覺",

  /** 聯絡電話 */
  phone: "0900-123-456",

  /** 電子郵件 */
  email: "hello@qingjing.com",

  /** LINE 連結 */
  line: "https://line.me/ti/p/~qingjing",

  /** 民宿地址 */
  address: "花蓮縣壽豐鄉霧山村霧山巷88號",

  /** 房型資料 */
  rooms: [
    {
      id: "forest",
      name: "森林景觀套房",
      description:
        "推開窗，晨霧在林間緩緩流動。25 坪大空間，獨立陽台直面中央山脈，衛浴分離，King Size 大床標配。",
      capacity: 2,
      size: "25坪",
      imageUrl:
        "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1200&auto=format&fit=crop",
      tag: "景觀首選",
    },
    {
      id: "mountain",
      name: "山景雙人房",
      description:
        "小而精緻的山景雙人房。落地玻璃將峽谷風光引入室內，浴缸臨窗而設，泡澡同時坐擁無遮蔽天際線。",
      capacity: 2,
      size: "15坪",
      imageUrl:
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200&auto=format&fit=crop",
      tag: "景觀首選",
    },
    {
      id: "family",
      name: "家庭四人房",
      description:
        "兩間臥房分層獨立，共享 30 坪客廳與景觀陽台。二代同堂或兩組家庭出遊，保有各自隱私又共享天倫。",
      capacity: 4,
      size: "30坪",
      imageUrl:
        "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1200&auto=format&fit=crop",
      tag: "家庭首選",
    },
  ],

  /** 空間設施 */
  facilities: [
    { id: "wifi", name: "高速 Wi-Fi", icon: "WifiHigh" },
    { id: "parking", name: "免費停車", icon: "Car" },
    { id: "breakfast", name: "特色早餐", icon: "Coffee" },
    { id: "view", name: "景觀陽台", icon: "SunHorizon" },
    { id: "bathtub", name: "景觀浴缸", icon: "Bathtub" },
    { id: "kitchen", name: "開放廚房", icon: "CookingPot" },
    { id: "ac", name: "冷氣空調", icon: "Snowflake" },
    { id: "bbq", name: "烤肉區", icon: "Fire" },
  ],

  /** 敘事內容（Story Section） */
  story: {
    eyebrow: "關於晴境莊",
    headline: "我們不只是在山裡蓋了一棟房子",
    body: "而是把在城市裡丟掉的，安靜還給你。七年前第一次來到這片山谷，我們就決定了——不做成一個「景點」，而是一個「讓人想回來的地方」。每一間房的格局，都是我們親身住過才決定的；每一樣家具，都是反复更換後留下來的。",
    imageUrl:
      "https://images.unsplash.com/photo-1555636222-cae831e670b3?q=80&w=1200&auto=format&fit=crop",
  },

  /** 預約方案 */
  pricing: {
    eyebrow: "彈性預約方案",
    headline: "根據你的需求，選擇最適合的合作方式",
    plans: [
      {
        id: "monthly",
        name: "月租方案",
        price: "NT$28,000",
        period: "/月起",
        features: [
          "含水電瓦斯",
          "管家定期清潔",
          "室內備品替換",
          "突發狀況 24h 支援",
        ],
        cta: "諮詢月租",
      },
      {
        id: "project",
        name: "專案合作",
        price: "專案報價",
        period: "",
        features: [
          "客製化房型組合",
          "餐食方案自由搭配",
          "活動策劃整合",
          "長期合約另有優惠",
        ],
        cta: "取得報價",
        highlight: true,
      },
    ],
  },
} as const;

// ============================================
// 設計參數 (Design Dials)
// 根據 design-taste-frontend skill
// ============================================
export const designDials = {
  /**
   * DESIGN_VARIANCE: 1 = 完美對稱, 10 = 前衛藝術
   * 精品民宿 landing → 8 (editorial asymmetric)
   */
  VARIANCE: 8,

  /**
   * MOTION_INTENSITY: 1 = 靜態, 10 = 電影級動畫
   * 展示頁需有動態張力 → 7
   */
  MOTION_INTENSITY: 7,

  /**
   * VISUAL_DENSITY: 1 = 藝廊留白, 10 = 儀表板密集
   * 精品民宿 → 3-4，保持高檔次
   */
  DENSITY: 3,
} as const;

// ============================================
// 獲客模板專用設定
// ============================================
export const acquisitionConfig = {
  /** 模板展示標題（替換品牌名稱顯示） */
  templateBadge: "民宿獲客模板展示",

  /** 號召用語 */
  primaryCTA: "免費取得網站方案",
  secondaryCTA: "了解模板功能",

  /** 底部版權 */
  copyright: "© 2024 築時數位 · 民宿網站方案",

  /** 技術棧展示（模板特色） */
  techStack: ["Next.js", "Framer Motion", "Tailwind CSS", "TypeScript"],
} as const;

// 向後兼容：導出 siteConfig
export const siteConfig = brandConfig;

export type BrandConfig = typeof brandConfig;
export type DesignDials = typeof designDials;
export type AcquisitionConfig = typeof acquisitionConfig;
