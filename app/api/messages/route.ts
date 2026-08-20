import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const TEMPLATE_KEY = "message-template";

const DEFAULT_TEMPLATE = `{{brandName}} 您好 🌿

我是築時數位的顧問，看到貴民宿的資料，覺得非常有特色！

想邀請您了解一下我們的服務——
幫您製作一個專屬的一頁式網站，包含房型、設施、故事、聯絡表單，讓客人更容易找到並預訂住房。

✅ 電腦、手機畫面都好看
✅ 無需技術背景，我幫您全部搞定
✅ 曝光更多新客人，減少電話諮詢

{% if slogan %}「{{slogan}}」——這句話很打動我，很想讓更多人看到。
{% endif %}
{% if phone %}📞 {{phone}}{% endif %}
{% if line %}💬 LINE：{{line}}{% endif %}
{% if email %}📧 {{email}}{% endif %}

👉 您的專屬頁面：{{url}}

如果有興趣，歡迎回覆這則訊息，我再進一步說明給您 😊`;

function createRedis(): Redis | null {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

async function ensureTemplate(): Promise<string> {
  const redis = createRedis();
  if (!redis) return DEFAULT_TEMPLATE;

  try {
    const existing = await redis.get<string>(TEMPLATE_KEY);
    if (existing) return existing;
    await redis.set(TEMPLATE_KEY, DEFAULT_TEMPLATE);
    return DEFAULT_TEMPLATE;
  } catch {
    return DEFAULT_TEMPLATE;
  }
}

export async function GET() {
  try {
    const template = await ensureTemplate();
    return NextResponse.json({ template });
  } catch (error) {
    console.error("[api/messages] GET error:", error);
    return NextResponse.json({ error: "讀取失敗" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { template } = await req.json();
    if (!template || typeof template !== "string") {
      return NextResponse.json({ error: "訊息內容不能為空" }, { status: 400 });
    }

    const redis = createRedis();
    if (redis) {
      await redis.set(TEMPLATE_KEY, template);
    }

    return NextResponse.json({ success: true, template });
  } catch (error) {
    console.error("[api/messages] PUT error:", error);
    return NextResponse.json({ error: "儲存失敗" }, { status: 500 });
  }
}
