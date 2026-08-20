"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { TenantConfig } from "@/lib/redis";
import { Search, Copy, Check, MessageSquare, Edit3, Eye, Camera, ChevronDown } from "lucide-react";
import html2canvas from "html2canvas";

const TEMPLATE_KEY = "message-template";

const DEFAULT_TEMPLATE = `{{brandName}} 您好 🌿

我是築時數位的顧問，看到貴民宿的資料，覺得非常有特色！

想邀請您了解一下我們的服務——
幫您製作一個專屬的一頁式網站，包含房型、設施、故事、聯絡表單，讓客人更容易找到並預訂住房。

✅ 電腦、手機畫面都好看
✅ 無需技術背景，我幫您全部搞定
✅ 曝光更多新客人，減少電話諘詢

{% if slogan %}「{{slogan}}」——這句話很打動我，很想讓更多人看到。
{% endif %}
{% if phone %}📞 {{phone}}{% endif %}
{% if line %}💬 LINE：{{line}}{% endif %}
{% if email %}📧 {{email}}{% endif %}

👉 您的專屬頁面：{{url}}

如果有興趣，歡迎回覆這則訊息，我再進一步說明給您 😊`;

function buildUrl(slug: string): string {
  return `https://visual-bait.vercel.app/${slug}`;
}

function renderTemplate(template: string, tenant: TenantConfig): string {
  let out = template;

  out = out.replace(/\{\{brandName\}\}/g, tenant.brandName);
  out = out.replace(/\{\{slogan\}\}/g, tenant.slogan ?? "");
  out = out.replace(/\{\{phone\}\}/g, tenant.phone ?? "");
  out = out.replace(/\{\{line\}\}/g, tenant.line ?? "");
  out = out.replace(/\{\{email\}\}/g, tenant.email ?? "");
  out = out.replace(/\{\{url\}\}/g, buildUrl(tenant.slug));
  out = out.replace(/\{\{id\}\}/g, tenant.slug);

  out = out.replace(/\{%\s*if\s+(\w+)\s*%\}([\s\S]*?)\{%\s*endif\s*%\}/g, (_, field, content) => {
    const val = (tenant as unknown as Record<string, string>)[field];
    return val ? content.trim() : "";
  });

  return out.trim();
}

const VARIABLES = [
  { token: "{{brandName}}", label: "民宿名稱" },
  { token: "{{slogan}}", label: "標語" },
  { token: "{{phone}}", label: "電話" },
  { token: "{{line}}", label: "LINE" },
  { token: "{{email}}", label: "Email" },
  { token: "{{url}}", label: "頁面網址" },
  { token: "{{id}}", label: "民宿 ID (網址後綴)" },
];

export default function MessagesPage() {
  const [tenants, setTenants] = useState<TenantConfig[]>([]);
  const [template, setTemplate] = useState("");
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<TenantConfig | null>(null);
  const [activeTab, setActiveTab] = useState<"preview" | "edit">("preview");
  const [localTemplate, setLocalTemplate] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [screenshotting, setScreenshotting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [tenantsRes, templateRes] = await Promise.all([
        fetch("/api/tenants"),
        fetch("/api/messages"),
      ]);
      const [tenantsData, templateData] = await Promise.all([
        tenantsRes.json(),
        templateRes.json(),
      ]);
      setTenants(tenantsData.tenants ?? []);
      const tpl = templateData.template ?? DEFAULT_TEMPLATE;
      setTemplate(tpl);
      setLocalTemplate(tpl);
      if (tenantsData.tenants?.length && !selected) {
        setSelected(tenantsData.tenants[0]);
      }
    } catch {
      setTenants([]);
    } finally {
      setLoading(false);
    }
  }, [selected]);

  useEffect(() => {
    fetchData();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!showDropdown) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showDropdown]);

  const showToast = (msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2000);
  };

  const copyForTenant = async (tenant: TenantConfig) => {
    const message = renderTemplate(localTemplate, tenant);
    try {
      await navigator.clipboard.writeText(message);
      setCopiedSlug(tenant.slug);
      showToast(`已複製 ${tenant.brandName} 的訊息`);
      setTimeout(() => setCopiedSlug(null), 2000);
    } catch {
      showToast("複製失敗");
    }
  };

  const saveTemplate = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/messages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template: localTemplate }),
      });
      if (!res.ok) throw new Error();
      setTemplate(localTemplate);
      showToast("範本已儲存");
    } catch {
      showToast("儲存失敗");
    } finally {
      setSaving(false);
    }
  };

  const filtered = tenants.filter(
    (t) =>
      t.brandName.toLowerCase().includes(query.toLowerCase()) ||
      t.slug.toLowerCase().includes(query.toLowerCase())
  );

  const preview = selected ? renderTemplate(localTemplate, selected) : "";

  const copyHighlighted = () => {
    if (!selected) return;
    copyForTenant(selected);
  };

  const takeScreenshot = async () => {
    if (!selected) return;
    setScreenshotting(true);
    setShowDropdown(false);
    try {
      const target = document.getElementById(`site-preview-${selected.slug}`);
      if (!target) throw new Error("Preview element not found");
      const canvas = await html2canvas(target, {
        useCORS: true,
        allowTaint: false,
      });
      const link = document.createElement("a");
      link.download = `${selected.slug}-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      showToast(`已下載 ${selected.brandName} 截圖`);
    } catch {
      showToast("截圖失敗，請稍後再試");
    } finally {
      setScreenshotting(false);
    }
  };

  const copyWithScreenshot = async () => {
    if (!selected) return;
    setScreenshotting(true);
    setShowDropdown(false);
    try {
      const target = document.getElementById(`site-preview-${selected.slug}`);
      if (!target) throw new Error("Preview element not found");
      const canvas = await html2canvas(target, {
        useCORS: true,
        allowTaint: false,
      });
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("blob failed"))), "image/png");
      });
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
        new ClipboardItem({ "text/plain": new Blob([renderTemplate(localTemplate, selected)], { type: "text/plain" }) }),
      ] as ClipboardItem[]);
      setCopiedSlug(selected.slug);
      showToast(`已複製訊息 + 截圖`);
      setTimeout(() => setCopiedSlug(null), 2000);
    } catch {
      showToast("截圖失敗，請稍後再試");
    } finally {
      setScreenshotting(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Left panel — tenant list */}
      <div className="w-72 border-r border-gray-200 flex flex-col bg-gray-50">
        <div className="p-4 border-b border-gray-200 bg-white">
          <h1 className="text-base font-bold text-gray-900 mb-0.5">訊息工具</h1>
          <p className="text-xs text-gray-400">點擊民宿，一鍵複製罐頭訊息</p>
        </div>

        <div className="px-3 pt-3 pb-2">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜尋民宿..."
              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-1">
          {loading ? (
            <p className="text-center text-xs text-gray-400 pt-8">載入中...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-xs text-gray-400 pt-8">
              {query ? "找不到符合的民宿" : "還沒有民宿"}
            </p>
          ) : (
            filtered.map((tenant) => {
              const isSelected = selected?.slug === tenant.slug;
              const isCopied = copiedSlug === tenant.slug;
              return (
                <button
                  key={tenant.slug}
                  onClick={() => setSelected(tenant)}
                  className={`
                    w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all
                    ${isSelected ? "bg-white shadow-sm ring-2 ring-amber-400" : "hover:bg-white hover:shadow-sm"}
                  `}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ backgroundColor: tenant.primaryColor || "#8B7355" }}
                  >
                    {tenant.brandName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isCopied ? "text-green-600" : "text-gray-900"}`}>
                      {tenant.brandName}
                    </p>
                    <p className="text-xs text-gray-400 truncate">/{tenant.slug}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); copyForTenant(tenant); }}
                    className="shrink-0 p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                    title="複製訊息"
                  >
                    {isCopied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  </button>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right panel — preview / edit */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        {/* Tab bar */}
        <div className="flex items-center gap-1 px-5 pt-4 pb-0 bg-white border-b border-gray-200">
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
              activeTab === "preview"
                ? "border-amber-500 text-amber-700 bg-amber-50"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Eye size={14} />
            預覽訊息
          </button>
          <button
            onClick={() => setActiveTab("edit")}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
              activeTab === "edit"
                ? "border-amber-500 text-amber-700 bg-amber-50"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Edit3 size={14} />
            編輯範本
          </button>

          {/* Tenant badge */}
          {selected && (
            <div className="ml-auto flex items-center gap-2 pl-4 border-l border-gray-200">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                style={{ backgroundColor: selected.primaryColor || "#8B7355" }}
              >
                {selected.brandName.charAt(0)}
              </div>
              <span className="text-xs text-gray-600 font-medium">{selected.brandName}</span>
            </div>
          )}
        </div>

        {/* Preview tab */}
        {activeTab === "preview" && (
          <div className="flex-1 overflow-y-auto p-6">
            {selected ? (
              <div className="max-w-xl mx-auto space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                      style={{ backgroundColor: selected.primaryColor || "#8B7355" }}
                    >
                      {selected.brandName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{selected.brandName}</p>
                      <p className="text-xs text-gray-400">/{selected.slug}</p>
                    </div>
                  </div>
                  {/* Action buttons with dropdown */}
                  <div className="relative flex items-center gap-2" ref={dropdownRef}>
                    <button
                      onClick={copyHighlighted}
                      className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
                    >
                      {copiedSlug === selected.slug ? <Check size={14} /> : <Copy size={14} />}
                      {copiedSlug === selected.slug ? "已複製" : "複製訊息"}
                    </button>

                    <div className="relative">
                      <button
                        onClick={() => setShowDropdown((v) => !v)}
                        disabled={screenshotting}
                        className="flex items-center gap-1 px-2.5 py-2 bg-white hover:bg-gray-50 text-gray-600 text-sm border border-gray-200 rounded-xl transition-colors shadow-sm disabled:opacity-50"
                        title="更多操作"
                      >
                        {screenshotting ? (
                          <span className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin block" />
                        ) : (
                          <Camera size={14} />
                        )}
                        <ChevronDown size={12} />
                      </button>

                      {showDropdown && (
                        <div className="absolute right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden w-52">
                          <button
                            onClick={takeScreenshot}
                            disabled={screenshotting}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                          >
                            <Camera size={14} className="text-gray-400" />
                            下載網站截圖
                          </button>
                          <div className="border-t border-gray-100" />
                          <button
                            onClick={copyWithScreenshot}
                            disabled={screenshotting}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                          >
                            <Copy size={14} className="text-gray-400" />
                            複製訊息 + 圖片
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-mono">
                    {preview}
                  </pre>
                </div>

                {/* Hidden site preview for html2canvas */}
                <div
                  id={`site-preview-${selected.slug}`}
                  style={{
                    position: "fixed",
                    left: "-9999px",
                    top: 0,
                    width: "375px",
                    height: "812px",
                    backgroundColor: "#0a0806",
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                    overflow: "hidden",
                    display: "block",
                  }}
                >
                  {/* Fake Safari Address Bar */}
                  <div style={{ background: "#f8f8f8", borderBottom: "1px solid #e0e0e0", padding: "12px 16px 8px", textAlign: "center", position: "relative", zIndex: 50 }}>
                     <div style={{ background: "#e8e8e8", borderRadius: 8, padding: "8px", fontSize: 13, color: "#333", display: "inline-block", width: "100%", boxSizing: "border-box" }}>
                        <span style={{ fontSize: 11, color: "#888", marginRight: 6 }}>🔒</span>
                        <span>visual-bait.vercel.app/{selected.slug}</span>
                     </div>
                  </div>

                  <div style={{ position: "relative", width: "375px", height: "720px", overflow: "hidden" }}>
                    {/* Hero Image */}
                    {selected.heroImageUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={selected.heroImageUrl} crossOrigin="anonymous" style={{ position: "absolute", top: 0, left: 0, width: "375px", height: "720px", objectFit: "cover", display: "block" }} alt="hero" />
                    ) : (
                      <div style={{ position: "absolute", top: 0, left: 0, width: "375px", height: "720px", background: `linear-gradient(135deg, ${selected.primaryColor || "#8B7355"}22, #c4a88244)` }} />
                    )}

                    {/* Mask matching actual HeroSection */}
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 50%, rgba(10,8,6,0.92) 100%)" }} />
                    
                    {/* Bottom fade mask */}
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "300px", background: "linear-gradient(to top, #0a0806 0%, transparent 100%)" }} />
                    
                    {/* Fake Transparent Navigation */}
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 20 }}>
                       <div style={{ color: "white", fontSize: 20, fontWeight: 300, fontFamily: "var(--font-serif), serif", letterSpacing: "2px" }}>
                         {selected.brandName}
                       </div>
                       {/* Hamburger Menu Icon */}
                       <div style={{ width: 24, height: 2, background: "white", position: "relative" }}>
                         <div style={{ width: 24, height: 2, background: "white", position: "absolute", top: -6 }} />
                         <div style={{ width: 24, height: 2, background: "white", position: "absolute", top: 6 }} />
                       </div>
                    </div>

                    {/* Text content replicating HeroSection */}
                    <div style={{ position: "absolute", bottom: 40, left: 24, right: 24, zIndex: 10 }}>
                       <div
                         style={{
                           color: "white",
                           fontSize: "36px",
                           fontWeight: 300,
                           marginBottom: "16px",
                           fontFamily: "var(--font-serif), serif",
                           letterSpacing: "0.08em",
                           textShadow: "0 4px 40px rgba(0,0,0,0.5)",
                           lineHeight: 1.2
                         }}
                       >
                         {selected.brandName}
                       </div>
                       {selected.slogan && (
                         <div
                           style={{
                             color: "rgba(255,255,255,0.7)",
                             fontSize: "14px",
                             fontWeight: 300,
                             letterSpacing: "0.2em",
                             textShadow: "0 2px 20px rgba(0,0,0,0.5)",
                             marginBottom: "40px"
                           }}
                         >
                           {selected.slogan}
                         </div>
                       )}

                       {/* CTA Button */}
                       <div
                         style={{
                           display: "inline-block",
                           padding: "12px 32px",
                           fontSize: "13px",
                           letterSpacing: "0.1em",
                           textTransform: "uppercase",
                           color: "white",
                           border: "1px solid rgba(255,255,255,0.4)",
                           backgroundColor: `${selected.primaryColor || "#8B7355"}40`,
                         }}
                       >
                         探索房型
                       </div>
                    </div>
                  </div>
                </div>

                <p className="text-center text-xs text-gray-400">
                  訊息已自動帶入「{selected.brandName}」的專屬資料
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <MessageSquare size={36} className="mb-3" />
                <p className="text-sm">從左側選擇一個民宿</p>
              </div>
            )}
          </div>
        )}

        {/* Edit tab */}
        {activeTab === "edit" && (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-xl mx-auto space-y-4">
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">訊息範本</span>
                  <button
                    onClick={saveTemplate}
                    disabled={saving}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors"
                  >
                    <Check size={12} />
                    {saving ? "儲存中..." : "儲存範本"}
                  </button>
                </div>
                <textarea
                  value={localTemplate}
                  onChange={(e) => setLocalTemplate(e.target.value)}
                  className="w-full h-80 p-4 text-sm font-mono text-gray-700 resize-none focus:outline-none leading-relaxed"
                  spellCheck={false}
                />
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-500 mb-2">可用變數</p>
                <div className="flex flex-wrap gap-2">
                  {VARIABLES.map((v) => (
                    <button
                      key={v.token}
                      onClick={() => {
                        const ta = document.querySelector("textarea") as HTMLTextAreaElement | null;
                        if (!ta) return;
                        const s = ta.selectionStart;
                        const e = ta.selectionEnd;
                        const newVal = localTemplate.slice(0, s) + v.token + localTemplate.slice(e);
                        setLocalTemplate(newVal);
                        ta.focus();
                        setTimeout(() => {
                          ta.selectionStart = ta.selectionEnd = s + v.token.length;
                        }, 0);
                      }}
                      className="inline-flex flex-col px-3 py-1.5 rounded-lg border border-gray-200 hover:border-amber-400 hover:bg-amber-50 text-left transition-colors"
                    >
                      <span className="text-xs font-mono text-amber-600">{v.token}</span>
                      <span className="text-xs text-gray-400">{v.label}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 mb-2">條件區塊</p>
                  <p className="text-xs text-gray-400 font-mono">
                    {"{% if field %}...{% endif %}"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    欄位有值才顯示，空白則自動隱藏
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm px-5 py-3 rounded-full shadow-lg flex items-center gap-2 animate-fade-in">
          <Check size={14} className="text-green-400" />
          {toast}
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translate(-50%, 8px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
