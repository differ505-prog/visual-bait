import { Redis } from "@upstash/redis";

let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;

  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    console.warn("[contact] Redis env vars not configured");
    return null;
  }

  redis = new Redis({ url, token });
  return redis;
}

interface ContactLead {
  id: string;
  innName: string;
  name: string;
  phone: string;
  lineId?: string;
  email?: string;
  message: string;
  source: "visual-bait";
  createdAt: string;
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
    `🏠 民宿：${lead.innName}`,
    `👤 姓名：${lead.name}`,
    `📞 電話：${lead.phone}`,
    lead.lineId ? `💬 LINE：${lead.lineId}` : null,
    lead.email ? `📧 Email：${lead.email}` : null,
    "",
    `💬 需求：`,
    lead.message.substring(0, 200),
    "",
    `⏰ ${new Date().toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}`,
    "",
    `→ https://arrivestudio.com/studio/hunt`,
  ].filter(Boolean);

  const text = lines.join("\n");

  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });
}

export async function storeLead(lead: ContactLead): Promise<void> {
  const client = getRedis();
  if (!client) {
    console.warn("[contact] Redis unavailable, lead not stored:", lead.id);
    return;
  }

  const key = `arrive-contact-lead:${lead.id}`;
  const now = new Date().toISOString();

  const dataToStore = Object.entries({
    ...lead,
    createdAt: now,
  }).reduce((acc, [k, v]) => {
    if (v !== undefined && v !== null) {
      acc[k] = v;
    }
    return acc;
  }, {} as Record<string, any>);

  await client.hset(key, dataToStore);

  // Add to index for listing
  await client.zadd("arrive-contact-leads-index", {
    score: Date.now(),
    member: lead.id,
  });
}

export async function getLeads(): Promise<ContactLead[]> {
  const client = getRedis();
  if (!client) return [];

  const ids = await client.zrange<string[]>("arrive-contact-leads-index", 0, -1, {
    rev: true,
  });

  if (!ids.length) return [];

  const leads = await Promise.all(
    ids.map((id) => client.hgetall<ContactLead>(`arrive-contact-lead:${id}`))
  );

  return leads.filter(Boolean) as unknown as ContactLead[];
}
