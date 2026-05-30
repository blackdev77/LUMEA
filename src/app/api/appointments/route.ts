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
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    const { patientId, serviceId, date, time, notes } = await req.json();

    if (!patientId || !serviceId || !date || !time) {
      return NextResponse.json({ error: "Campos obrigatórios faltando." }, { status: 400 });
    }

    const startDateTime = new Date(`${date}T${time}:00`);
    const service = await prisma.service.findFirst({ 
      where: { id: serviceId, clinicId: user.clinicId } 
    });

    if (!service) {
      return NextResponse.json({ error: "Serviço não encontrado ou acesso negado." }, { status: 404 });
    }

    const patient = await prisma.patient.findFirst({
      where: { id: patientId, clinicId: user.clinicId }
    });

    if (!patient) {
      return NextResponse.json({ error: "Paciente não encontrado ou acesso negado." }, { status: 404 });
    }

    let professional = await prisma.professional.findFirst({ where: { clinicId: user.clinicId } });
    if (!professional) {
      professional = await prisma.professional.create({
        data: {
          clinicId: user.clinicId,
          name: "Profissional Padrão",
          specialty: "Geral",
        }
      });
    }

    const appointment = await prisma.appointment.create({
      data: {
        clinicId: user.clinicId,
        patientId,
        serviceId,
        professionalId: professional.id,
        date: startDateTime,
        startTime: startDateTime,
        endTime: new Date(startDateTime.getTime() + service.duration * 60000),
        status: "CONFIRMED", // Created from dashboard, so it's confirmed
        notes
      }
    });

    return NextResponse.json({ success: true, appointment });

  } catch (error: any) {
    console.error("Create Appointment Error:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro ao criar agendamento." },
      { status: 500 }
    );
  }
}
