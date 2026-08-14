import { NextRequest, NextResponse } from "next/server";
import { getLeads, getLeadsBySlug } from "@/lib/redis";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    const leads = slug ? await getLeadsBySlug(slug) : await getLeads();
    return NextResponse.json({ leads });
  } catch (err) {
    console.error("[api/admin/leads] GET error:", err);
    return NextResponse.json({ error: "讀取失敗" }, { status: 500 });
  }
}
