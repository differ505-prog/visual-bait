import { NextRequest, NextResponse } from "next/server";
import { getTenant, updateTenant, deleteTenant } from "@/lib/redis";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const tenant = await getTenant(slug);
    if (!tenant) {
      return NextResponse.json({ error: "民宿不存在" }, { status: 404 });
    }
    return NextResponse.json({ tenant });
  } catch (err) {
    console.error("[api/tenants/[slug]] GET error:", err);
    return NextResponse.json({ error: "讀取失敗" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const { ...data } = body;

    console.log(`[api/tenants/[slug]] PUT /${slug}`, {
      heroImageUrl: data.heroImageUrl ?? "(未提供)",
      brandName: data.brandName ?? "(未提供)",
      keys: Object.keys(data),
    });

    // Merge with existing tenant so missing fields keep their values
    const existing = await getTenant(slug);
    if (!existing) {
      return NextResponse.json({ error: "民宿不存在" }, { status: 404 });
    }

    console.log(`[api/tenants/[slug]] existing heroImageUrl:`, existing.heroImageUrl ?? "(空)");

    // Fields the admin form sends as "only if filled"
    const merged = {
      ...existing,
      ...data,
      // Always preserve these even if empty string was sent
      rooms: data.rooms ?? existing.rooms,
      facilities: data.facilities ?? existing.facilities,
      story: data.story ?? existing.story,
      pricing: existing.pricing,
    };

    console.log(`[api/tenants/[slug]] merged heroImageUrl:`, merged.heroImageUrl ?? "(空)");

    const tenant = await updateTenant(slug, merged);

    console.log(`[api/tenants/[slug]] saved heroImageUrl:`, tenant.heroImageUrl ?? "(空)");

    return NextResponse.json({ success: true, tenant });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[api/tenants/[slug]] PUT error:", msg);
    if (msg.includes("不存在")) {
      return NextResponse.json({ error: msg }, { status: 404 });
    }
    return NextResponse.json({ error: "更新失敗" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await deleteTenant(slug);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/tenants/[slug]] DELETE error:", err);
    return NextResponse.json({ error: "刪除失敗" }, { status: 500 });
  }
}
