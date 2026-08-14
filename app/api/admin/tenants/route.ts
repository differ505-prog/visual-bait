import { NextRequest, NextResponse } from "next/server";
import { listTenants, createTenant } from "@/lib/redis";

export async function GET() {
  try {
    const tenants = await listTenants();
    return NextResponse.json({ tenants });
  } catch (err) {
    console.error("[admin/tenants GET]", err);
    return NextResponse.json({ error: "取得民宿列表失敗" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, ...data } = body;

    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "slug 為必填欄位" }, { status: 400 });
    }

    // Normalize slug
    const normalizedSlug = slug
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    if (!normalizedSlug) {
      return NextResponse.json({ error: "slug 格式無效" }, { status: 400 });
    }

    const tenant = await createTenant(normalizedSlug, data);
    return NextResponse.json({ tenant }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "建立民宿失敗";
    const status = msg.includes("已存在") ? 409 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
