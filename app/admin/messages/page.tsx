"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { TenantConfig } from "@/lib/redis";
import { Search, Copy, Check, MessageSquare } from "lucide-react";

export default function MessagesPage() {
  const [tenants, setTenants] = useState<TenantConfig[]>([]);
  const [template, setTemplate] = useState("");
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
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
      setTemplate(templateData.template ?? "");
    } catch {
      setTenants([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showToast = (msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2000);
  };

  const copyForTenant = async (tenant: TenantConfig) => {
    const message = template.replace(/\{\{brandName\}\}/g, tenant.brandName);
    try {
      await navigator.clipboard.writeText(message);
      setCopiedSlug(tenant.slug);
      showToast(`已複製 ${tenant.brandName} 的訊息`);
      setTimeout(() => setCopiedSlug(null), 2000);
    } catch {
      showToast("複製失敗，請手動選取文字");
    }
  };

  const filtered = tenants.filter((t) =>
    t.brandName.toLowerCase().includes(query.toLowerCase()) ||
    t.slug.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">訊息工具</h1>
        <p className="text-sm text-gray-500 mt-0.5">點擊民宿名稱，一鍵複製罐頭訊息</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜尋民宿..."
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent shadow-sm"
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-16 text-gray-400 text-sm">載入中...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <MessageSquare size={32} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-400 text-sm">
            {query ? "找不到符合的民宿" : "還沒有民宿，請先新增"}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          {filtered.map((tenant, i) => {
            const isCopied = copiedSlug === tenant.slug;
            return (
              <button
                key={tenant.slug}
                onClick={() => copyForTenant(tenant)}
                className={`
                  w-full flex items-center gap-3 px-5 py-4 text-left transition-colors
                  hover:bg-amber-50 active:bg-amber-100
                  ${i !== filtered.length - 1 ? "border-b border-gray-100" : ""}
                  ${isCopied ? "bg-green-50" : ""}
                `}
              >
                {/* Brand initial */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                  style={{ backgroundColor: tenant.primaryColor || "#8B7355" }}
                >
                  {tenant.brandName.charAt(0)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isCopied ? "text-green-700" : "text-gray-900"}`}>
                    {tenant.brandName}
                  </p>
                  <p className="text-xs text-gray-400">/{tenant.slug}</p>
                </div>

                {/* Status */}
                <div className={`flex items-center gap-1.5 text-sm shrink-0 transition-all ${isCopied ? "text-green-600" : "text-gray-400"}`}>
                  {isCopied ? (
                    <>
                      <Check size={15} strokeWidth={2.5} />
                      <span className="text-xs font-medium">已複製</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span className="text-xs">複製</span>
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm px-5 py-3 rounded-full shadow-lg flex items-center gap-2 animate-fade-in">
          <Check size={15} className="text-green-400" />
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
