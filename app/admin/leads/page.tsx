"use client";

import { useState, useEffect, useCallback } from "react";
import { ContactLead } from "@/lib/redis";
import { RefreshCw, Phone, MessageCircle, Mail, Globe } from "lucide-react";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "剛剛";
  if (mins < 60) return `${mins} 分鐘前`;
  if (hours < 24) return `${hours} 小時前`;
  return `${days} 天前`;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<ContactLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/leads");
      const data = await res.json();
      setLeads(data.leads ?? []);
    } catch {
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const filtered = leads.filter((l) => {
    const matchSlug = filter === "all" || l.slug === filter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      l.name.toLowerCase().includes(q) ||
      l.phone.includes(q) ||
      l.message.toLowerCase().includes(q) ||
      l.tenantName?.toLowerCase().includes(q);
    return matchSlug && matchSearch;
  });

  const slugs = [...new Set(leads.map((l) => l.slug))];
  const total = leads.length;
  const today = leads.filter(
    (l) => new Date(l.createdAt).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-gray-900">客戶名單</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            共 {total} 筆，今天新增 {today} 筆
          </p>
        </div>
        <button
          onClick={fetchLeads}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <RefreshCw size={14} />
          重新整理
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          <option value="all">全部民宿</option>
          {slugs.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input
          type="search"
          placeholder="搜尋姓名、電話、需求..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-16 text-gray-400 text-sm">載入中...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl">
          <p className="text-gray-400">尚無客戶名單</p>
          <p className="text-xs text-gray-400 mt-1">當客戶填寫表單後，資料會出現在這裡</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide w-32">民宿</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">姓名</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">聯絡方式</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">需求</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide w-28">來源</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide w-24">時間</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((lead) => (
                <tr key={lead.id} className="hover:bg-amber-50/30 transition-colors">
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                      /{lead.slug}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="font-medium text-gray-900">{lead.name}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Phone size={12} className="text-gray-400" />
                        <a href={`tel:${lead.phone}`} className="hover:text-amber-600 transition-colors">
                          {lead.phone}
                        </a>
                      </div>
                      {lead.lineId && (
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <MessageCircle size={12} className="text-gray-400" />
                          <span>{lead.lineId}</span>
                        </div>
                      )}
                      {lead.email && (
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Mail size={12} className="text-gray-400" />
                          <span className="text-xs">{lead.email}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-gray-600 text-xs leading-relaxed max-w-xs truncate" title={lead.message}>
                      {lead.message}
                    </p>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <Globe size={11} className="text-gray-400" />
                      <span className="text-xs text-gray-500 font-mono">{lead.source}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-gray-400 text-xs">
                    <div>{timeAgo(lead.createdAt)}</div>
                    <div className="text-gray-300">
                      {new Date(lead.createdAt).toLocaleDateString("zh-TW")}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
