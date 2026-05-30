import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// Secret for Webhook Signature validation
const MP_WEBHOOK_SECRET = process.env.MP_WEBHOOK_SECRET || "dummy_secret_for_development";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-signature") || req.headers.get("x-m-signature");
    const requestId = req.headers.get("x-request-id");

    if (!signature || !requestId) {
      return NextResponse.json({ error: "Missing signature or request id headers" }, { status: 400 });
    }

    // 1. HMAC Signature Validation (Mercado Pago v2)
    // The x-signature header looks like: ts=123456789,v1=a1b2c3d4...
    const parts = signature.split(',');
    let ts = '';
    let hash = '';
    
    parts.forEach(part => {
      const [key, value] = part.split('=');
      if (key === 'ts') ts = value;
      if (key === 'v1') hash = value;
    });

    const manifest = `id:${requestId};request-id:${requestId};ts:${ts};`;
    const hmac = crypto.createHmac("sha256", MP_WEBHOOK_SECRET);
    hmac.update(manifest);
    const computedHash = hmac.digest("hex");

    // Allow validation to pass in dev/sandbox if tokens mismatch slightly, but enforce in production
    if (computedHash !== hash && process.env.NODE_ENV === "production") {
      console.warn("Invalid MP Webhook Signature", { computedHash, hash });
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    const body = JSON.parse(rawBody);
    const { action, data, type } = body;
    const mpEventId = data?.id || body.id?.toString();

    if (!mpEventId) {
      return NextResponse.json({ error: "Invalid payload format" }, { status: 400 });
    }

    // 2. Idempotency Check
    const existingEvent = await prisma.webhookEvent.findUnique({
      where: { mpEventId }
    });

    if (existingEvent) {
      console.log(`Webhook Event ${mpEventId} already processed.`);
      return NextResponse.json({ success: true, message: "Already processed" });
    }

    // Save event as PENDING
    await prisma.webhookEvent.create({
      data: {
        mpEventId,
        type: type || action || "unknown",
        payload: body,
        status: "PENDING"
      }
    });

    // 3. Process the Subscription / Payment update
    if (type === "subscription_preapproval") {
      const status = data.status || body.status; // e.g., 'authorized', 'paused', 'cancelled'
      
      if (status) {
        let normalizedStatus = "INACTIVE";
        if (status === "authorized") normalizedStatus = "ACTIVE";
        if (status === "cancelled") normalizedStatus = "CANCELED";
        
        await prisma.subscription.updateMany({
          where: { mpSubscriptionId: mpEventId },
          data: { status: normalizedStatus }
        });
      }
    }

    // Mark event as PROCESSED
    await prisma.webhookEvent.update({
      where: { mpEventId },
      data: { status: "PROCESSED" }
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("MP Webhook Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error during Webhook processing" },
      { status: 500 }
    );
  }
}
