import { NextRequest, NextResponse } from "next/server";
import { getTenant, updateTenant, deleteTenant, setCustomDomain } from "@/lib/redis";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    const tenant = await getTenant(slug);
    if (!tenant) return NextResponse.json({ error: "民宿不存在" }, { status: 404 });
    return NextResponse.json({ tenant });
  } catch (err) {
    console.error("[admin/tenant GET]", err);
    return NextResponse.json({ error: "取得民宿失敗" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    const body = await req.json();

    // If custom domain is provided, update the domain mapping
    if (body.customDomain) {
      await setCustomDomain(body.customDomain, slug);
    }

    const tenant = await updateTenant(slug, body);
    return NextResponse.json({ tenant });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "更新民宿失敗";
    const status = msg.includes("不存在") ? 404 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    await deleteTenant(slug);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[admin/tenant DELETE]", err);
    return NextResponse.json({ error: "刪除民宿失敗" }, { status: 500 });
  }
}
