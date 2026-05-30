import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as otplib from "otplib";
import QRCode from "qrcode";

const authenticator = otplib.authenticator;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Generate secret
    const secret = authenticator.generateSecret();
    
    // Generate OTP Auth URL
    const otpauth = authenticator.keyuri(
      user.email,
      "LUMEA Clinics",
      secret
    );

    // Generate QR Code Data URL
    const qrCodeUrl = await QRCode.toDataURL(otpauth);

    // Save secret temporarily (not enabled yet)
    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorSecret: secret },
    });

    return NextResponse.json({ secret, qrCodeUrl });

  } catch (error) {
    console.error("2FA Generate Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
