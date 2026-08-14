"use client";

import { useState, useEffect, useCallback } from "react";
import { Campaign } from "@/lib/redis";
import { Plus, RefreshCw, Trash2, X, Check, Link2, Copy } from "lucide-react";


export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // Form state
  const [formSlug, setFormSlug] = useState("");
  const [formName, setFormName] = useState("");
  const [formExpiresAt, setFormExpiresAt] = useState("");

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      const res = await window.fetch("/api/campaigns");
      const data = await res.json();
      setCampaigns(data.campaigns ?? []);
    } catch {
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCampaigns(); }, [fetchCampaigns]);

  const showMsg = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleCreate = async () => {
    if (!formSlug || !formName) {
      showMsg("error", "民宿代碼與活動名稱為必填");
      return;
    }
    setSaving(true);
    try {
      const res = await window.fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: formSlug, name: formName, expiresAt: formExpiresAt }),
      });
      const data = await res.json();
      if (!res.ok) {
        showMsg("error", data.error ?? "建立失敗");
      } else {
        showMsg("success", "活動已建立");
        setShowForm(false);
        setFormSlug(""); setFormName(""); setFormExpiresAt("");
        fetchCampaigns();
      }
    } catch {
      showMsg("error", "網路錯誤");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("確定刪除此活動？")) return;
    setDeletingId(id);
    try {
      await window.fetch(`/api/campaigns?id=${id}`, { method: "DELETE" });
      showMsg("success", "已刪除");
      fetchCampaigns();
    } catch {
      showMsg("error", "刪除失敗");
    } finally {
      setDeletingId(null);
    }
  };

  const copyLink = (id: string) => {
    const url = `${baseUrl}/?source=${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-gray-900">廣告活動</h1>
          <p className="text-sm text-gray-500 mt-0.5">建立追蹤連結，量化廣告成效</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchCampaigns} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <RefreshCw size={14} />
            重新整理
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <Plus size={15} />
            新增活動
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {message.text}
        </div>
      )}

      {/* Usage guide */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-8">
        <h3 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
          <Link2 size={14} />
          如何使用追蹤連結
        </h3>
        <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
          <li>建立一個活動，複製「追蹤連結」</li>
          <li>把連結放入 Google / Facebook / IG 廣告的點擊目標 URL</li>
          <li>客戶點擊廣告後進入網站，系統自動記錄他的來源</li>
          <li>在「客戶名單」頁可看到每個客戶來自哪個廣告活動</li>
        </ol>
      </div>

      {/* Campaigns list */}
      {loading ? (
        <div className="text-center py-16 text-gray-400 text-sm">載入中...</div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl">
          <p className="text-gray-400 mb-2">還沒有廣告活動</p>
          <p className="text-xs text-gray-400">建立活動可追蹤每個廣告來源的客戶</p>
        </div>
      ) : (
        <div className="space-y-3">
          {campaigns.map((c) => {
            const trackingUrl = `${baseUrl}/?source=${c.id}`;
            return (
              <div key={c.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{c.name}</h3>
                      {!c.active && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 border border-gray-200">已停用</span>
                      )}
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                        /{c.slug}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-3 font-mono">{c.id}</p>

                    {/* Tracking URL */}
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 truncate font-mono">
                        {trackingUrl}
                      </code>
                      <button
                        onClick={() => copyLink(c.id)}
                        className="p-2 text-gray-400 hover:text-amber-600 rounded-lg hover:bg-amber-50 transition-colors shrink-0"
                        title="複製連結"
                      >
                        {copied === c.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-2xl font-bold text-gray-900">{c.leadCount}</div>
                    <div className="text-xs text-gray-400">名單數</div>
                    <button
                      onClick={() => handleDelete(c.id)}
                      disabled={deletingId === c.id}
                      className="mt-2 text-xs text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={13} className="inline mr-1" />
                      刪除
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">新增廣告活動</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">民宿代碼</label>
                <input
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  placeholder="my-inn"
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">活動名稱</label>
                <input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="2026夏季-Google廣告"
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">結束日期（選填）</label>
                <input
                  type="date"
                  value={formExpiresAt}
                  onChange={(e) => setFormExpiresAt(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-600">取消</button>
              <button
                onClick={handleCreate}
                disabled={saving}
                className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
              >
                {saving ? <><RefreshCw size={14} className="animate-spin" /> 建立中...</> : <><Check size={14} /> 建立活動</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
