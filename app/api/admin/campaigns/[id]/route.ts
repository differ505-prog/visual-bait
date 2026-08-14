import { NextRequest, NextResponse } from "next/server";
import { updateCampaign, deleteCampaign } from "@/lib/redis";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await req.json();
    const campaign = await updateCampaign(id, body);
    return NextResponse.json({ campaign });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "更新推廣活動失敗";
    const status = msg.includes("not found") ? 404 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await deleteCampaign(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[admin/campaign DELETE]", err);
    return NextResponse.json({ error: "刪除推廣活動失敗" }, { status: 500 });
  }
}
