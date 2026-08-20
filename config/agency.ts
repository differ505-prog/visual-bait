/**
 * 築時數位 Arrive Studio 品牌設定
 *
 * 品牌調性：編輯型、温暖木質、Editorial Studio
 * Primary Color: #C4A882 (Warm Sand)
 */

export const agencyConfig = {
  /** 公司名稱 */
  brandName: "築時數位",

  /** 公司標語 */
  slogan: "以溫潤而高轉換的品牌網站，把品味變成信任",

  /** 品牌主色調 */
  primaryColor: "#C4A882",

  /** 滿版主視覺背景 */
  heroImageUrl:
    "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2400&auto=format&fit=crop",

  /** 聯絡資訊 */
  email: "hello.arrivestudio@gmail.com",
  line: "https://lin.ee/uh4z4dL",
  phone: "0988-959-922",

  /** 敘事內容 */
  story: {
    eyebrow: "關於築時數位",
    headline: "為生活美學品牌做官網與 App",
    description:
      "從品牌語氣出發，整理出清楚、有優先順序的資訊層次。交付前先確認方向，上線後 90 天內技術問題不另收費。",
    imageUrl:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
  },

  /** 案例作品 */
  caseStudies: [
    {
      id: "summer-rock",
      client: "夏洛克民宿",
      clientEn: "Summer Rock Villa",
      category: "品牌形象官網",
      description:
        "以流暢的頁面導覽與細膩的響應式排版，呈現旅宿空間氣質與在地體驗。",
      price: "NT$ 9,900 起步",
      imageUrl:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1400&auto=format&fit=crop",
      tags: ["民宿", "品牌形象", "RWD"],
      featured: true,
      href: "https://www.arrive-studio.com/",
    },
    {
      id: "qingxi",
      client: "青曦設計",
      clientEn: "Qingxi Design",
      category: "品牌延伸方案",
      description:
        "把繁雜的空間邏輯收攏成俐落門面，兼具藝廊感的作品展示與系統化的服務流程。",
      price: "NT$ 29,900 起",
      imageUrl:
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1400&auto=format&fit=crop",
      tags: ["室內設計", "品牌形象", "多頁網站"],
      featured: false,
      href: "https://www.arrive-studio.com/",
    },
    {
      id: "vibelist",
      client: "VibeList",
      clientEn: "VibeList App",
      category: "App 開發設計",
      description:
        "以禪模式幫助專心完成待辦事項，支援訪客模式直接體驗，資料全程加密，符合 GDPR。",
      price: "自有專案",
      imageUrl:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1400&auto=format&fit=crop",
      tags: ["App", "iOS", "Android", "PWA"],
      featured: false,
      href: "https://www.arrive-studio.com/",
    },
  ],

  /** 服務項目 */
  services: [
    {
      name: "品牌形象官網",
      scope: "品牌介紹與詢問入口整合成清晰、可擴充的頁面",
      features: ["首頁敘事重構", "RWD 響應式頁面", "基礎 SEO"],
    },
    {
      name: "營運資訊整理",
      scope: "服務流程與方案收斂成有條理的內容架構",
      features: ["服務架構梳理", "方案內容排版", "表單與導流優化"],
    },
    {
      name: "數位體驗延伸",
      scope: "預約、會員、資料管理與 AI 功能整合成可擴充系統",
      features: ["後台與權限規劃", "第三方串接", "可擴充技術架構"],
    },
  ],

  /** 交付節奏 */
  workflow: [
    { step: "01", name: "確認方向", desc: "品牌語氣方向書與頁面結構藍圖" },
    { step: "02", name: "內容架構", desc: "完整內容區塊配置圖" },
    { step: "03", name: "視覺設計", desc: "可直接操作的互動原型" },
    { step: "04", name: "開發部署", desc: "上線網站、原始碼、90 天技術支援" },
  ],
} as const;

export type AgencyConfig = typeof agencyConfig;
