import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card/Card";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CalendarView } from "@/components/agenda/CalendarView";
import { NewAppointmentButton } from "@/components/appointments/NewAppointmentButton";

export default async function AgendaPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return null;

  // Buscar todos os agendamentos da clínica
  const appointmentsData = await prisma.appointment.findMany({
    where: { clinicId: user.clinicId },
    include: { patient: true, service: true },
  });

  // Buscar dados para o formulário de novo agendamento
  const patients = await prisma.patient.findMany({ where: { clinicId: user.clinicId } });
  const services = await prisma.service.findMany({ where: { clinicId: user.clinicId } });

  // Formatar para o react-big-calendar
  const formattedAppointments = appointmentsData.map(apt => ({
    id: apt.id,
    title: `${apt.patient.name} - ${apt.service.name}`,
    start: apt.startTime,
    end: apt.endTime,
    status: apt.status,
    patientName: apt.patient.name,
    serviceName: apt.service.name,
  }));

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agenda</h1>
          <p className="text-muted-foreground">Visualize e gerencie os horários da sua clínica.</p>
        </div>
        <NewAppointmentButton patients={patients} services={services} />
      </div>
      
      <CalendarView initialAppointments={formattedAppointments} />
    </div>
  );
}
