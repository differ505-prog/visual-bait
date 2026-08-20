import { Redis } from "@upstash/redis";

let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;

  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    console.warn("[redis] KV env vars not configured");
    return null;
  }

  redis = new Redis({ url, token });
  return redis;
}

// ============================================================
// Types
// ============================================================

// ─── Tenant Tracking Status ─────────────────────────────────────────
export type TenantTrackingStatus = "idle" | "active" | "followup" | "dormant" | "disabled";

export interface TenantConfig {
  slug: string;
  brandName: string;
  heroImageUrl: string;
  primaryColor: string;
  slogan: string;
  phone: string;
  email: string;
  line: string;
  address: string;
  rooms: Array<{
    id: string;
    name: string;
    description: string;
    capacity: number;
    size: string;
    imageUrl: string;
    tag: string;
  }>;
  facilities: Array<{ id: string; name: string; icon: string }>;
  story: {
    eyebrow: string;
    headline: string;
    imageUrl: string;
  };
  pricing: {
    eyebrow: string;
    headline: string;
    plans: Array<{
      id: string;
      name: string;
      price: string;
      period: string;
      features: string[];
      cta: string;
      highlight?: boolean;
    }>;
  };
  designDials: {
    VARIANCE: number;
    MOTION_INTENSITY: number;
    DENSITY: number;
  };
  acquisitionConfig?: {
    templateBadge: string;
    primaryCTA: string;
    secondaryCTA: string;
    copyright: string;
    techStack: string[];
  };
  telegramBotToken?: string;
  telegramChatId?: string;
  expiresAt: string; // ISO date string, empty = never expires
  active: boolean;
  createdAt: string;
  // ─── Tracking fields ────────────────────────────
  sentAt?: string;         // ISO, when admin marked as "sent"
  lastLeadAt?: string;     // ISO, last lead received
  status?: TenantTrackingStatus;
  resetOnReply?: boolean;  // true = reset timer on new lead; false = don't reset
}

export interface Campaign {
  id: string;
  slug: string;
  name: string;
  expiresAt: string;
  active: boolean;
  createdAt: string;
  leadCount: number;
}

export interface ContactLead {
  id: string;
  slug: string;
  tenantName: string;
  name: string;
  phone: string;
  lineId?: string;
  email?: string;
  message: string;
  source: string;
  createdAt: string;
}

// ============================================================
// Tenant CRUD
// ============================================================

export async function getTenant(slug: string): Promise<TenantConfig | null> {
  const client = getRedis();
  if (!client) return null;
  const data = await client.hgetall(`tenant:${slug}`) as unknown as TenantConfig | null;
  return data && Object.keys(data).length > 0 ? data : null;
}

export async function listTenants(): Promise<TenantConfig[]> {
  const client = getRedis();
  if (!client) return [];
  const slugs = await client.zrange<string[]>("tenant-index", 0, -1, { rev: true });
  if (!slugs.length) return [];
  const tenants = await Promise.all(slugs.map((s) => getTenant(s)));
  return tenants.filter((t): t is TenantConfig => t !== null);
}

export async function createTenant(slug: string, data: Partial<TenantConfig>): Promise<TenantConfig> {
  const client = getRedis();
  if (!client) throw new Error("Redis unavailable");

  const existing = await getTenant(slug);
  if (existing) throw new Error(`Tenant "${slug}" 已存在`);

  const now = new Date().toISOString();
  const tenant: TenantConfig = {
    slug,
    brandName: data.brandName ?? "我的民宿",
    heroImageUrl: data.heroImageUrl ?? "",
    primaryColor: data.primaryColor ?? "#8B7355",
    slogan: data.slogan ?? "",
    phone: data.phone ?? "",
    email: data.email ?? "",
    line: data.line ?? "",
    address: data.address ?? "",
    rooms: data.rooms ?? [],
    facilities: data.facilities ?? [],
    story: data.story ?? { eyebrow: "", headline: "", imageUrl: "" },
    pricing: data.pricing ?? { eyebrow: "", headline: "", plans: [] },
    designDials: data.designDials ?? { VARIANCE: 8, MOTION_INTENSITY: 7, DENSITY: 3 },
    acquisitionConfig: data.acquisitionConfig,
    telegramBotToken: data.telegramBotToken,
    telegramChatId: data.telegramChatId,
    expiresAt: data.expiresAt ?? "",
    active: data.active ?? true,
    createdAt: now,
  };

  const dataToStore = Object.entries(tenant).reduce((acc, [k, v]) => {
    if (v !== undefined) acc[k] = v;
    return acc;
  }, {} as Record<string, unknown>);

  await client.hset(`tenant:${slug}`, dataToStore);
  await client.zadd("tenant-index", { score: Date.now(), member: slug });
  return tenant;
}

export async function updateTenant(slug: string, data: Partial<TenantConfig>): Promise<TenantConfig> {
  const client = getRedis();
  if (!client) throw new Error("Redis unavailable");

  const existing = await getTenant(slug);
  if (!existing) throw new Error(`Tenant "${slug}" 不存在`);

  const updated = { ...existing, ...data, slug };
  
  const dataToStore = Object.entries(updated).reduce((acc, [k, v]) => {
    if (v !== undefined) acc[k] = v;
    return acc;
  }, {} as Record<string, unknown>);

  console.log(`[redis] updateTenant /${slug}: heroImageUrl =`, updated.heroImageUrl ?? "(空)");

  await client.hset(`tenant:${slug}`, dataToStore);
  return updated;
}

export async function deleteTenant(slug: string): Promise<void> {
  const client = getRedis();
  if (!client) throw new Error("Redis unavailable");
  await client.del(`tenant:${slug}`);
  await client.zrem("tenant-index", slug);
}

export async function setCustomDomain(domain: string, slug: string): Promise<void> {
  const client = getRedis();
  if (!client) return;
  await client.set(`domain-map:${domain.toLowerCase()}`, slug);
}

export async function getTenantByDomain(domain: string): Promise<TenantConfig | null> {
  const client = getRedis();
  if (!client) return null;
  const slug = await client.get<string>(`domain-map:${domain.toLowerCase()}`);
  if (!slug) return null;
  return getTenant(slug);
}

// ============================================================
// Campaign CRUD
// ============================================================

export async function createCampaign(slug: string, name: string, expiresAt: string): Promise<Campaign> {
  const client = getRedis();
  if (!client) throw new Error("Redis unavailable");

  const id = `camp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const now = new Date().toISOString();
  const campaign: Campaign = {
    id, slug, name, expiresAt,
    active: true,
    createdAt: now,
    leadCount: 0,
  };

  await client.hset(`campaign:${id}`, campaign as unknown as Record<string, unknown>);
  await client.zadd("campaign-index", { score: Date.now(), member: id });
  return campaign;
}

export async function listCampaigns(): Promise<Campaign[]> {
  const client = getRedis();
  if (!client) return [];
  const ids = await client.zrange<string[]>("campaign-index", 0, -1, { rev: true });
  if (!ids.length) return [];
  const campaigns = await Promise.all(
    ids.map((id) => client.hgetall(`campaign:${id}`) as unknown as Campaign)
  );
  return campaigns.filter((c): c is Campaign => c !== null && Object.keys(c).length > 0);
}

export async function updateCampaign(id: string, data: Partial<Campaign>): Promise<Campaign> {
  const client = getRedis();
  if (!client) throw new Error("Redis unavailable");
  const existing = await client.hgetall(`campaign:${id}`) as unknown as Campaign;
  if (!existing || Object.keys(existing).length === 0) throw new Error(`Campaign "${id}" not found`);
  const updated = { ...existing, ...data };
  await client.hset(`campaign:${id}`, updated as unknown as Record<string, unknown>);
  return updated;
}

export async function deleteCampaign(id: string): Promise<void> {
  const client = getRedis();
  if (!client) throw new Error("Redis unavailable");
  await client.del(`campaign:${id}`);
  await client.zrem("campaign-index", id);
}

// ============================================================
// Leads (scoped by tenant slug)
// ============================================================

export async function storeLead(lead: ContactLead): Promise<void> {
  const client = getRedis();
  if (!client) {
    console.warn("[contact] Redis unavailable, lead not stored:", lead.id);
    return;
  }

  const key = `lead:${lead.slug}:${lead.id}`;
  const now = new Date().toISOString();

  const dataToStore = Object.entries({
    ...lead,
    createdAt: now,
  }).reduce((acc, [k, v]) => {
    if (v !== undefined && v !== null) {
      acc[k] = v;
    }
    return acc;
  }, {} as Record<string, unknown>);

  try {
    await client.hset(key, dataToStore);
    await client.zadd(`lead-index:${lead.slug}`, { score: Date.now(), member: lead.id });

    // ─── Update tenant lastLeadAt ────────────────────────────────────
    const tenant = await client.hgetall(`tenant:${lead.slug}`) as unknown as { sentAt?: string; lastLeadAt?: string; resetOnReply?: boolean; status?: TenantTrackingStatus } | null;
    if (tenant && Object.keys(tenant).length > 0) {
      const shouldReset = tenant.resetOnReply !== false; // default true
      const updates: Record<string, unknown> = { lastLeadAt: now };

      if (shouldReset && tenant.sentAt) {
        // Reset sentAt to now — fresh 7-day window
        updates.sentAt = now;
        updates.status = "active";
      }

      await client.hset(`tenant:${lead.slug}`, updates);
    }

    // Update campaign lead count if linked
    if (lead.source && lead.source.startsWith("camp-")) {
      const campaign = await client.hgetall(`campaign:${lead.source}`) as unknown as Campaign;
      if (campaign && Object.keys(campaign).length > 0) {
        await client.hset(`campaign:${lead.source}`, {
          ...campaign,
          leadCount: (campaign.leadCount ?? 0) + 1,
        } as unknown as Record<string, unknown>);
      }
    }
    console.log("[contact] Stored lead:", lead.id, "for tenant:", lead.slug);
  } catch (error) {
    console.error("[contact] Failed to store lead:", error);
    throw error;
  }
}

export async function getLeadsBySlug(slug: string): Promise<ContactLead[]> {
  const client = getRedis();
  if (!client) return [];
  const ids = await client.zrange<string[]>(`lead-index:${slug}`, 0, -1, { rev: true });
  if (!ids.length) return [];
  const leads = await Promise.all(
    ids.map((id) => client.hgetall(`lead:${slug}:${id}`) as unknown as ContactLead)
  );
  return leads.filter(Boolean) as unknown as ContactLead[];
}

export async function getLeads(): Promise<ContactLead[]> {
  const client = getRedis();
  if (!client) return [];
  const slugs = await client.zrange<string[]>("tenant-index", 0, -1);
  const allLeads = await Promise.all(slugs.map((s) => getLeadsBySlug(s)));
  return allLeads.flat().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// ─── Tenant Tracking Helpers ───────────────────────────────────────────

const TRACKING_THRESHOLD_DAYS = 7;

export function getTenantTrackingStatus(tenant: {
  sentAt?: string;
  lastLeadAt?: string;
  status?: TenantTrackingStatus;
}): {
  computedStatus: TenantTrackingStatus;
  daysSinceSent: number;
  daysSinceLead: number;
  isOverdue: boolean;
} {
  const { status: manualStatus, sentAt, lastLeadAt } = tenant;

  // Manual overrides take precedence
  if (manualStatus === "disabled") {
    return { computedStatus: "disabled", daysSinceSent: 0, daysSinceLead: 0, isOverdue: false };
  }
  if (manualStatus === "dormant") {
    return { computedStatus: "dormant", daysSinceSent: 0, daysSinceLead: 0, isOverdue: false };
  }

  if (!sentAt) {
    return { computedStatus: "idle", daysSinceSent: 0, daysSinceLead: 0, isOverdue: false };
  }

  const now = Date.now();
  const sentMs = new Date(sentAt).getTime();
  const daysSinceSent = Math.floor((now - sentMs) / (1000 * 60 * 60 * 24));

  const daysSinceLead = lastLeadAt
    ? Math.floor((now - new Date(lastLeadAt).getTime()) / (1000 * 60 * 60 * 24))
    : daysSinceSent;

  const isOverdue = daysSinceLead >= TRACKING_THRESHOLD_DAYS;

  return {
    computedStatus: isOverdue ? "followup" : "active",
    daysSinceSent,
    daysSinceLead,
    isOverdue,
  };
}

// ─── Legacy compatibility ─────────────────────────────────────────────

export { storeLead as storeLegacyLead, getLeads as getLegacyLeads };

function escapeHtml(unsafe: string): string {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendTelegramNotification(lead: ContactLead): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn("[contact] Telegram env vars not configured");
    return;
  }

  const lines = [
    "🆕 新諮詢",
    "",
    `🏠 民宿：${escapeHtml(lead.tenantName)}`,
    `👤 姓名：${escapeHtml(lead.name)}`,
    `📞 電話：${escapeHtml(lead.phone)}`,
    lead.lineId ? `💬 LINE：${escapeHtml(lead.lineId)}` : null,
    lead.email ? `📧 Email：${escapeHtml(lead.email)}` : null,
    "",
    `💬 需求：`,
    escapeHtml(lead.message).substring(0, 500),
    "",
    `⏰ ${new Date().toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}`,
    "",
    `→ https://arrivestudio.com/studio/hunt`,
  ].filter(Boolean);

  const text = lines.join("\n");

  const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("[contact] Telegram API Error:", data);
  } else {
    console.log("[contact] Telegram Success:", data);
  }
}
