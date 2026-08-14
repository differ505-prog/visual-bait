import { NextRequest, NextResponse } from "next/server";
import { storeLead, sendTelegramNotification } from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { innName, name, phone, lineId, email, message } = body;

    // Basic validation
    if (!innName?.trim() || !name?.trim() || !phone?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "民宿名稱、姓名、電話、需求為必填欄位" },
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
      innName: innName.trim(),
      name: name.trim(),
      phone: phone.trim(),
      lineId: lineId?.trim() || undefined,
      email: email?.trim() || undefined,
      message: message.trim(),
      source: "visual-bait" as const,
      createdAt: new Date().toISOString(),
    };

    // Store in Redis
    await storeLead(lead);

    // Send Telegram notification (non-blocking)
    sendTelegramNotification(lead).catch((err) => {
      console.error("[contact] Telegram notification failed:", err);
    });

    return NextResponse.json({ success: true, id: lead.id });
  } catch (err) {
    console.error("[contact] Error:", err);
    return NextResponse.json(
      { error: "伺服器錯誤，請稍後再試" },
      { status: 500 }
    );
  }
}
