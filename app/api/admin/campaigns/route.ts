import { NextRequest, NextResponse } from "next/server";
import { listCampaigns, createCampaign, getTenant } from "@/lib/redis";

export async function GET() {
  try {
    const campaigns = await listCampaigns();
    return NextResponse.json({ campaigns });
  } catch (err) {
    console.error("[admin/campaigns GET]", err);
    return NextResponse.json({ error: "取得推廣活動失敗" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, name, expiresAt } = body;

    if (!slug || !name || !expiresAt) {
      return NextResponse.json(
        { error: "slug、name、expiresAt 為必填欄位" },
        { status: 400 }
      );
    }

    const tenant = await getTenant(slug);
    if (!tenant) {
      return NextResponse.json({ error: `民宿 "${slug}" 不存在` }, { status: 404 });
    }

    const campaign = await createCampaign(slug, name, expiresAt);
    return NextResponse.json({ campaign }, { status: 201 });
  } catch (err) {
    console.error("[admin/campaigns POST]", err);
    return NextResponse.json({ error: "建立推廣活動失敗" }, { status: 500 });
  }
}
