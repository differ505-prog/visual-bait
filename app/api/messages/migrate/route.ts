import { NextResponse } from "next/server";

export async function POST() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    return NextResponse.json({ error: "KV not configured" }, { status: 500 });
  }

  const { Redis } = await import("@upstash/redis");
  const redis = new Redis({ url, token });

  const current = await redis.get<string>("message-template");
  if (!current) {
    return NextResponse.json({ error: "No template found" }, { status: 404 });
  }

  const updated = current.replace(
    "👉 您的專屬頁面：https://visual-bait.vercel.app/{{slug}}",
    "👉 您的專屬頁面：{{url}}"
  );

  await redis.set("message-template", updated);

  return NextResponse.json({
    success: true,
    updated,
    hadUrl: current !== updated,
  });
}
