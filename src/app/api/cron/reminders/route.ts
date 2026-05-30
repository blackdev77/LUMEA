import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// This endpoint should be protected by a Vercel Cron Secret in production
export async function GET(req: Request) {
  try {
    // 1. Fetch all active notification settings
    const settings = await prisma.notificationSetting.findMany({
      where: { isActive: true },
      include: { clinic: true }
    });

    let messagesSent = 0;

    for (const setting of settings) {
      // Calculate target time window (e.g., appointments happening in exactly `minutesBefore` minutes)
      const now = new Date();
      const targetTimeStart = new Date(now.getTime() + (setting.minutesBefore * 60000));
      // Give a 15 min window for the cron precision
      const targetTimeEnd = new Date(targetTimeStart.getTime() + (15 * 60000));

      const upcomingAppointments = await prisma.appointment.findMany({
        where: {
          clinicId: setting.clinicId,
          status: { in: ["CONFIRMED", "PENDING"] },
          startTime: {
            gte: targetTimeStart,
            lte: targetTimeEnd
          }
        },
        include: {
          patient: true,
          service: true,
          clinic: true,
        }
      });

      for (const apt of upcomingAppointments) {
        if (!apt.patient.phone) continue;

        // Replace placeholders in template
        // Example template: "Olá {nome_paciente}, lembrete da sua consulta de {nome_servico} na {nome_clinica} amanhã às {horario}. Link: {link}"
        const formattedTime = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(apt.startTime);
        
        let message = setting.template
          .replace(/{nome_paciente}/g, apt.patient.name)
          .replace(/{nome_servico}/g, apt.service.name)
          .replace(/{nome_clinica}/g, apt.clinic.name)
          .replace(/{horario}/g, formattedTime)
          .replace(/{link}/g, `https://lumea.app/${apt.clinic.slug}/confirm/${apt.id}`); // Fake domain for now

        // TODO: Integrate with WhatsApp API (Z-API, UltraMSG, Evolution API)
        console.log(`[WhatsApp Mock to ${apt.patient.phone}]: ${message}`);
        
        messagesSent++;
      }
    }

    return NextResponse.json({ success: true, messagesSent });

  } catch (error: any) {
    console.error("Cron Reminder Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
