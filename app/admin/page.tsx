"use client";

import { useState, useEffect, useCallback } from "react";
import { TenantConfig } from "@/lib/redis";
import { Plus, ExternalLink, Trash2, Edit2, X, Check, RefreshCw } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────
interface Room {
  id: string;
  name: string;
  description: string;
  capacity: number;
  size: string;
  imageUrl: string;
  tag: string;
}

interface Facility {
  id: string;
  name: string;
  icon: string;
}

interface TenantForm {
  slug: string;
  brandName: string;
  heroImageUrl: string;
  primaryColor: string;
  slogan: string;
  phone: string;
  email: string;
  line: string;
  address: string;
  rooms: Room[];
  facilities: Facility[];
  storyEyebrow: string;
  storyHeadline: string;
  storyImageUrl: string;
  pricingEyebrow: string;
  pricingHeadline: string;
  active: boolean;
  telegramBotToken: string;
  telegramChatId: string;
}

const emptyForm = (): TenantForm => ({
  slug: "",
  brandName: "",
  heroImageUrl: "",
  primaryColor: "#8B7355",
  slogan: "",
  phone: "",
  email: "",
  line: "",
  address: "",
  rooms: [],
  facilities: [],
  storyEyebrow: "",
  storyHeadline: "",
  storyImageUrl: "",
  pricingEyebrow: "",
  pricingHeadline: "",
  active: true,
  telegramBotToken: "",
  telegramChatId: "",
});

// ─── Room Editor ─────────────────────────────────────────────────────
function RoomEditor({
  rooms,
  onChange,
}: {
  rooms: Room[];
  onChange: (rooms: Room[]) => void;
}) {
  const addRoom = () =>
    onChange([
      ...rooms,
      {
        id: `room-${Date.now()}`,
        name: "",
        description: "",
        capacity: 2,
        size: "",
        imageUrl: "",
        tag: "",
      },
    ]);

  const updateRoom = (i: number, patch: Partial<Room>) => {
    const next = [...rooms];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  };

  const removeRoom = (i: number) => onChange(rooms.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">房型</label>
        <button
          type="button"
          onClick={addRoom}
          className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          + 新增房型
        </button>
      </div>
      {rooms.map((room, i) => (
        <div key={room.id} className="border border-gray-200 rounded-lg p-4 space-y-2 bg-gray-50">
          <div className="flex items-start gap-2">
            <div className="flex-1 grid grid-cols-2 gap-2">
              <Field label="房型名稱" value={room.name} onChange={(v) => updateRoom(i, { name: v })} placeholder="如：山景雙人房" />
              <Field label="容納人數" value={String(room.capacity)} onChange={(v) => updateRoom(i, { capacity: Number(v) })} placeholder="2" type="number" />
              <Field label="坪數" value={room.size} onChange={(v) => updateRoom(i, { size: v })} placeholder="15坪" />
              <Field label="標籤" value={room.tag} onChange={(v) => updateRoom(i, { tag: v })} placeholder="熱銷" />
            </div>
            <button
              type="button"
              onClick={() => removeRoom(i)}
              className="mt-5 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={15} />
            </button>
          </div>
          <textarea
            value={room.description}
            onChange={(e) => updateRoom(i, { description: e.target.value })}
            placeholder="房型描述"
            rows={2}
            className="w-full text-sm text-gray-900 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none bg-white"
          />
          <Field label="圖片網址" value={room.imageUrl} onChange={(v) => updateRoom(i, { imageUrl: v })} placeholder="https://..." />
        </div>
      ))}
      {rooms.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-4">尚無房型，點擊上方新增</p>
      )}
    </div>
  );
}

// ─── Facility Editor ─────────────────────────────────────────────────
function FacilityEditor({
  facilities,
  onChange,
}: {
  facilities: Facility[];
  onChange: (facilities: Facility[]) => void;
}) {
  const addFacility = () =>
    onChange([...facilities, { id: `f-${Date.now()}`, name: "", icon: "Star" }]);

  const updateFacility = (i: number, patch: Partial<Facility>) => {
    const next = [...facilities];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  };

  const removeFacility = (i: number) => onChange(facilities.filter((_, idx) => idx !== i));

  const iconOptions = ["WifiHigh","Car","Coffee","SunHorizon","Bathtub","CookingPot","Snowflake","Fire","PawPrint","Waves","Mountain","Tree","Flower2","Sun","Moon","ShieldCheck","Lock","Eye","Heart","Star"];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">設施服務</label>
        <button
          type="button"
          onClick={addFacility}
          className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          + 新增設施
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {facilities.map((f, i) => (
          <div key={f.id} className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
            <span className="text-xs text-gray-400 flex-shrink-0">#{i + 1}</span>
            <input
              value={f.name}
              onChange={(e) => updateFacility(i, { name: e.target.value })}
              placeholder="設施名稱"
              className="flex-1 text-sm text-gray-900 bg-white focus:outline-none"
            />
            <select
              value={f.icon}
              onChange={(e) => updateFacility(i, { icon: e.target.value })}
              className="text-xs border border-gray-200 rounded px-1 py-0.5 bg-white"
            >
              {iconOptions.map((ic) => (
                <option key={ic} value={ic}>{ic}</option>
              ))}
            </select>
            <button type="button" onClick={() => removeFacility(i)} className="text-gray-400 hover:text-red-500">
              <X size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Field Component ────────────────────────────────────────────────
function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  rows,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  rows?: number;
}) {
  const id = label;
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      {rows ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full text-sm text-gray-900 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none bg-white"
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full text-sm text-gray-900 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
        />
      )}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────
export default function AdminPage() {
  const [tenants, setTenants] = useState<TenantConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [form, setForm] = useState<TenantForm>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  const fetchTenants = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tenants");
      const data = await res.json();
      setTenants(data.tenants ?? []);
    } catch {
      setTenants([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const openCreate = () => {
    setForm(emptyForm());
    setEditingSlug(null);
    setShowForm(true);
  };

  const openEdit = (t: TenantConfig) => {
    setForm({
      slug: t.slug,
      brandName: t.brandName,
      heroImageUrl: t.heroImageUrl,
      primaryColor: t.primaryColor,
      slogan: t.slogan,
      phone: t.phone,
      email: t.email,
      line: t.line,
      address: t.address,
      rooms: t.rooms,
      facilities: t.facilities,
      storyEyebrow: t.story?.eyebrow ?? "",
      storyHeadline: t.story?.headline ?? "",
      storyImageUrl: t.story?.imageUrl ?? "",
      pricingEyebrow: t.pricing?.eyebrow ?? "",
      pricingHeadline: t.pricing?.headline ?? "",
      active: t.active,
      telegramBotToken: t.telegramBotToken ?? "",
      telegramChatId: t.telegramChatId ?? "",
    });
    setEditingSlug(t.slug);
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {};

      // Only include fields with actual values — empty fields use template defaults
      if (form.brandName) payload.brandName = form.brandName;
      if (form.heroImageUrl) payload.heroImageUrl = form.heroImageUrl;
      if (form.primaryColor) payload.primaryColor = form.primaryColor;
      if (form.slogan) payload.slogan = form.slogan;
      if (form.phone) payload.phone = form.phone;
      if (form.email) payload.email = form.email;
      if (form.line) payload.line = form.line;
      if (form.address) payload.address = form.address;
      if (form.rooms.length > 0) payload.rooms = form.rooms;
      if (form.facilities.length > 0) payload.facilities = form.facilities;
      if (form.storyEyebrow || form.storyHeadline || form.storyImageUrl) {
        payload.story = {
          eyebrow: form.storyEyebrow,
          headline: form.storyHeadline,
          imageUrl: form.storyImageUrl,
        };
      }
      if (form.telegramBotToken) payload.telegramBotToken = form.telegramBotToken;
      if (form.telegramChatId) payload.telegramChatId = form.telegramChatId;
      payload.active = form.active;

      let res: Response;
      if (editingSlug) {
        res = await fetch(`/api/tenants/${editingSlug}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload }),
        });
      } else {
        res = await fetch("/api/tenants", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug: form.slug, ...payload }),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        showMessage("error", data.error ?? "儲存失敗");
      } else {
        showMessage("success", editingSlug ? "民宿已更新" : "民宿已建立");
        setShowForm(false);
        fetchTenants();
      }
    } catch {
      showMessage("error", "網路錯誤，請稍後再試");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm(`確定要刪除民宿「${slug}」嗎？此操作無法復原。`)) return;
    setDeletingSlug(slug);
    try {
      const res = await fetch(`/api/tenants/${slug}`, { method: "DELETE" });
      if (res.ok) {
        showMessage("success", "已刪除");
        fetchTenants();
      } else {
        showMessage("error", "刪除失敗");
      }
    } catch {
      showMessage("error", "網路錯誤");
    } finally {
      setDeletingSlug(null);
    }
  };

  const setField = (key: keyof TenantForm) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-gray-900">民宿管理</h1>
          <p className="text-sm text-gray-500 mt-0.5">建立與管理你的民宿網站</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchTenants}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <RefreshCw size={14} />
            重新整理
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <Plus size={15} />
            新增民宿
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {message.text}
        </div>
      )}

      {/* Tenant list */}
      {loading ? (
        <div className="text-center py-16 text-gray-400 text-sm">載入中...</div>
      ) : tenants.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl">
          <p className="text-gray-400 mb-4">還沒有民宿，點擊右上角新增第一個</p>
          <button onClick={openCreate} className="text-sm text-amber-600 hover:text-amber-700 font-medium">
            + 新增民宿
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {tenants.map((t) => (
            <div key={t.slug} className="bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-4 shadow-sm">
              {/* Hero thumbnail */}
              <div
                className="w-24 h-16 rounded-lg bg-gray-100 bg-cover bg-center shrink-0"
                style={{ backgroundImage: t.heroImageUrl ? `url(${t.heroImageUrl})` : undefined }}
              />
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">{t.brandName}</h3>
                  {!t.active && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 border border-gray-200">
                      已停用
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mb-0.5">
                  /{t.slug} · {t.slogan || "尚無標語"}
                </p>
                <p className="text-xs text-gray-400">
                  {t.rooms.length} 房型 · {t.facilities.length} 設施
                </p>
              </div>
              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <a
                  href={`/${t.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                  title="查看網站"
                >
                  <ExternalLink size={15} />
                </a>
                <button
                  onClick={() => openEdit(t)}
                  className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  title="編輯"
                >
                  <Edit2 size={15} />
                </button>
                <button
                  onClick={() => handleDelete(t.slug)}
                  disabled={deletingSlug === t.slug}
                  className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                  title="刪除"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 pb-8 overflow-y-auto bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[calc(100vh-4rem)]">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <h2 className="text-base font-semibold text-gray-900">
                {editingSlug ? `編輯民宿：${editingSlug}` : "新增民宿"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-8">

              {/* Basic Info */}
              <section>
                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  基本資訊
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Field label="民宿代碼（URL）" value={form.slug} onChange={setField("slug")} placeholder="my-inn" />
                    <p className="text-xs text-gray-400 mt-1">英文或數字，不可重複</p>
                  </div>
                  <Field label="民宿名稱" value={form.brandName} onChange={setField("brandName")} placeholder="晴境莊" />
                  <Field label="主視覺圖片網址" value={form.heroImageUrl} onChange={setField("heroImageUrl")} placeholder="https://..." />
                  <Field label="品牌主色調" value={form.primaryColor} onChange={setField("primaryColor")} placeholder="#8B7355" />
                  <div className="col-span-2">
                    <Field label="主打標語" value={form.slogan} onChange={setField("slogan")} placeholder="在山海之間，遇見回家的感覺" />
                  </div>
                </div>
              </section>

              {/* Contact */}
              <section>
                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  聯絡方式
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="電話" value={form.phone} onChange={setField("phone")} placeholder="0912-345-678" />
                  <Field label="Email" value={form.email} onChange={setField("email")} placeholder="hello@example.com" />
                  <Field label="LINE 連結" value={form.line} onChange={setField("line")} placeholder="https://line.me/..." />
                  <Field label="地址" value={form.address} onChange={setField("address")} placeholder="宜蘭縣礁溪鄉..." />
                </div>
              </section>

              {/* Rooms */}
              <section>
                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  房型設定
                </h3>
                <RoomEditor rooms={form.rooms} onChange={(rooms) => setForm((f) => ({ ...f, rooms }))} />
              </section>

              {/* Facilities */}
              <section>
                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  設施服務
                </h3>
                <FacilityEditor facilities={form.facilities} onChange={(facilities) => setForm((f) => ({ ...f, facilities }))} />
              </section>

              {/* Story */}
              <section>
                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  品牌故事
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="小標題" value={form.storyEyebrow} onChange={setField("storyEyebrow")} placeholder="關於晴境莊" />
                  <Field label="大標題" value={form.storyHeadline} onChange={setField("storyHeadline")} placeholder="把在城市裡丟掉的，安靜還給你" />
                  <div className="col-span-2">
                    <Field label="故事圖片網址" value={form.storyImageUrl} onChange={setField("storyImageUrl")} placeholder="https://..." />
                  </div>
                </div>
              </section>

              {/* Telegram */}
              <section>
                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Telegram 通知設定
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Field label="Bot Token" value={form.telegramBotToken} onChange={setField("telegramBotToken")} placeholder="8947491342:AAH..." />
                    <p className="text-xs text-gray-400 mt-1">向 @BotFather 取得</p>
                  </div>
                  <div>
                    <Field label="Chat ID" value={form.telegramChatId} onChange={setField("telegramChatId")} placeholder="-1001234567890" />
                    <p className="text-xs text-gray-400 mt-1">向 @userinfobot 取得</p>
                  </div>
                </div>
              </section>

              {/* Active toggle */}
              <section>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => setForm((f) => ({ ...f, active: !f.active }))}
                    className={`relative w-10 h-5 rounded-full transition-colors ${form.active ? "bg-amber-500" : "bg-gray-300"}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.active ? "translate-x-5" : "translate-x-0.5"}`} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">啟用民宿網站</span>
                </label>
              </section>
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                disabled={saving || (!editingSlug && !form.slug)}
                className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors shadow-sm"
              >
                {saving ? <><RefreshCw size={14} className="animate-spin" /> 儲存中...</> : <><Check size={14} /> {editingSlug ? "儲存變更" : "建立民宿"}</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
