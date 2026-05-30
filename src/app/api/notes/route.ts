import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { professional: true }
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    const professionalId = user.professional?.id;
    if (!professionalId && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Apenas profissionais podem adicionar prontuários." }, { status: 403 });
    }

    const { appointmentId, content } = await req.json();

    if (!appointmentId || !content) {
      return NextResponse.json({ error: "Consulta e conteúdo são obrigatórios." }, { status: 400 });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment || appointment.clinicId !== user.clinicId) {
      return NextResponse.json({ error: "Consulta não encontrada ou acesso negado." }, { status: 404 });
    }

    // Upsert the note
    const note = await prisma.appointmentNote.upsert({
      where: { appointmentId },
      update: { content },
      create: {
        appointmentId,
        professionalId: professionalId || appointment.professionalId, // fallback to appointment's professional if admin
        content,
      }
    });

    // Optionally update appointment status to COMPLETED if not already
    if (appointment.status !== "COMPLETED") {
      await prisma.appointment.update({
        where: { id: appointmentId },
        data: { status: "COMPLETED" }
      });
    }

    return NextResponse.json({ success: true, note });

  } catch (error: any) {
    console.error("Appointment Note Error:", error);
    return NextResponse.json(
      { error: "Erro ao salvar prontuário." },
      { status: 500 }
    );
  }
}
