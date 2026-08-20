import { Redis } from "@upstash/redis";

const TEMPLATE_KEY = "message-template";

const UPDATED_TEMPLATE = `{{brandName}} 您好 🌿

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

👉 您的專屬頁面：https://visual-bait.vercel.app/{{slug}}

如果有興趣，歡迎回覆這則訊息，我再進一步說明給您 😊`;

async function main() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    console.error("Missing KV env vars");
    process.exit(1);
  }

  const redis = new Redis({ url, token });
  const current = await redis.get<string>(TEMPLATE_KEY);
  console.log("Current template:\n", current);
  console.log("\nUpdating...");
  await redis.set(TEMPLATE_KEY, UPDATED_TEMPLATE);
  console.log("Done ✓");
}

main();
