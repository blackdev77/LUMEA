import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const appointmentId = params.id;
    const { action } = await req.json(); // 'CONFIRM' or 'CANCEL'

    if (!['CONFIRM', 'CANCEL'].includes(action)) {
      return NextResponse.json({ error: "Ação inválida." }, { status: 400 });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      return NextResponse.json({ error: "Consulta não encontrada." }, { status: 404 });
    }

    const newStatus = action === 'CONFIRM' ? 'CONFIRMED' : 'CANCELED';

    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: newStatus },
    });

    return NextResponse.json({ success: true, status: newStatus });

  } catch (error: any) {
    console.error("Confirm Appointment Error:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro ao atualizar a consulta." },
      { status: 500 }
    );
  }
}
