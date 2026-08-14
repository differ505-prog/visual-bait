import { NextRequest, NextResponse } from "next/server";
import { storeLead, sendTelegramNotification } from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Tenant slug comes from middleware (x-tenant-slug header)
    // Fallback to 'demo' for /demo page submissions
    const slug = req.headers.get("x-tenant-slug") ?? "demo";
    const { name, phone, lineId, email, message } = body;

    // Ensure inputs are strings and trim them
    const safeName = String(name || "").trim();
    const safePhone = String(phone || "").trim();
    const safeMessage = String(message || "").trim();
    const safeLineId = lineId ? String(lineId).trim() : undefined;
    const safeEmail = email ? String(email).trim() : undefined;

    // Basic validation
    if (!safeName || !safePhone || !safeMessage) {
      console.warn("[contact] Validation failed: missing required fields");
      return NextResponse.json(
        { error: "姓名、電話、需求為必填欄位" },
        { status: 400 }
      );
    }

    // Honeypot check
    if (body.website) {
      // Silently reject bots
      return NextResponse.json({ success: true });
    }

    const lead = {
      id: `lead-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      slug,
      tenantName: slug === "demo" ? "晴境莊（展示）" : slug,
      name: safeName,
      phone: safePhone,
      lineId: safeLineId,
      email: safeEmail,
      message: safeMessage,
      source: `visual-bait:${slug}`,
      createdAt: new Date().toISOString(),
    };

    // Store in Redis (scoped by tenant)
    await storeLead(lead);

    // Send Telegram notification
    try {
      await sendTelegramNotification(lead);
    } catch (err) {
      console.error("[contact] Telegram notification failed:", err);
    }

    return NextResponse.json({ success: true, id: lead.id });
  } catch (err) {
    console.error("[contact] Error:", err);
    return NextResponse.json(
      { error: "伺服器錯誤，請稍後再試" },
      { status: 500 }
    );
  }
}
