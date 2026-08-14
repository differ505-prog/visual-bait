import { NextRequest, NextResponse } from "next/server";
import { createCampaign, listCampaigns, updateCampaign, deleteCampaign } from "@/lib/redis";

export async function GET() {
  try {
    const campaigns = await listCampaigns();
    return NextResponse.json({ campaigns });
  } catch (err) {
    console.error("[api/campaigns] GET error:", err);
    return NextResponse.json({ error: "讀取失敗" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, name, expiresAt } = body;

    if (!slug || !name) {
      return NextResponse.json({ error: "slug 與 name 為必填欄位" }, { status: 400 });
    }

    const campaign = await createCampaign(slug, name, expiresAt ?? "");
    return NextResponse.json({ success: true, campaign }, { status: 201 });
  } catch (err) {
    console.error("[api/campaigns] POST error:", err);
    return NextResponse.json({ error: "建立失敗" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: "id 為必填欄位" }, { status: 400 });
    }

    const campaign = await updateCampaign(id, data);
    return NextResponse.json({ success: true, campaign });
  } catch (err) {
    console.error("[api/campaigns] PATCH error:", err);
    return NextResponse.json({ error: "更新失敗" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id 為必填欄位" }, { status: 400 });
    }

    await deleteCampaign(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/campaigns] DELETE error:", err);
    return NextResponse.json({ error: "刪除失敗" }, { status: 500 });
  }
}
