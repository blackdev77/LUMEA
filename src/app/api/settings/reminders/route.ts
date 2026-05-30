import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Apenas administradores podem gerenciar lembretes." }, { status: 403 });
    }

    const body = await req.json();
    const { isActive, minutesBefore, template } = body;

    const notificationSetting = await prisma.notificationSetting.upsert({
      where: { clinicId: user.clinicId },
      update: {
        isActive,
        minutesBefore,
        template,
      },
      create: {
        clinicId: user.clinicId,
        isActive,
        minutesBefore,
        template,
      }
    });

    return NextResponse.json({ success: true, notificationSetting });

  } catch (error: any) {
    console.error("Update Notification Settings Error:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro ao atualizar as configurações de lembretes." },
      { status: 500 }
    );
  }
}
