import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { clinicId, name, email, phone, date, time } = data;

    if (!clinicId || !name || !date || !time) {
      return NextResponse.json({ error: "Campos obrigatórios faltando." }, { status: 400 });
    }

    // Convert date + time string to DateTime
    // e.g. date: "2023-10-15", time: "14:30"
    const startDateTime = new Date(`${date}T${time}:00`);
    
    // Find or create patient
    let patient = await prisma.patient.findFirst({
      where: {
        clinicId,
        OR: [
          { email: email || undefined },
          { phone: phone || undefined }
        ]
      }
    });

    if (!patient) {
      patient = await prisma.patient.create({
        data: {
          clinicId,
          name,
          email,
          phone
        }
      });
    }

    // In a real app we'd let them choose a service.
    // For this MVP, let's grab the first service or create a default one.
    let service = await prisma.service.findFirst({ where: { clinicId } });
    if (!service) {
      service = await prisma.service.create({
        data: {
          clinicId,
          name: "Consulta Padrão",
          duration: 60,
          price: 150.00
        }
      });
    }

    // In a real app we'd let them choose a professional.
    // For this MVP, let's grab the first professional or create a default one.
    let professional = await prisma.professional.findFirst({ where: { clinicId } });
    if (!professional) {
      professional = await prisma.professional.create({
        data: {
          clinicId,
          name: "Profissional Padrão",
          specialty: "Clínico Geral",
          bio: "Profissional de atendimento da clínica."
        }
      });
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        clinicId,
        patientId: patient.id,
        serviceId: service.id,
        professionalId: professional.id,
        date: startDateTime, // Prisma Date logic
        startTime: startDateTime,
        endTime: new Date(startDateTime.getTime() + service.duration * 60000),
        status: "PENDING"
      }
    });

    return NextResponse.json({ success: true, appointment });

  } catch (error: any) {
    console.error("Booking API Error:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro ao agendar. Tente novamente." },
      { status: 500 }
    );
  }
}
