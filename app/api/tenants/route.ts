import { NextRequest, NextResponse } from "next/server";
import { createTenant, listTenants, getTenant } from "@/lib/redis";

export async function GET() {
  try {
    const tenants = await listTenants();
    return NextResponse.json({ tenants });
  } catch (err) {
    console.error("[api/tenants] GET error:", err);
    return NextResponse.json({ error: "讀取失敗" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, ...data } = body;

    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "slug 為必填欄位" }, { status: 400 });
    }

    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
    if (!cleanSlug) {
      return NextResponse.json({ error: "slug 格式無效" }, { status: 400 });
    }

    const existing = await getTenant(cleanSlug);
    if (existing) {
      return NextResponse.json({ error: `民宿 "${cleanSlug}" 已存在，請使用更新功能` }, { status: 409 });
    }

    const tenant = await createTenant(cleanSlug, {
      brandName: data.brandName ?? data.brandName ?? "我的民宿",
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
    });

    return NextResponse.json({ success: true, tenant }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[api/tenants] POST error:", msg);
    if (msg.includes("已存在")) {
      return NextResponse.json({ error: msg }, { status: 409 });
    }
    return NextResponse.json({ error: "建立失敗" }, { status: 500 });
  }
}
