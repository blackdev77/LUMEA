import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppointmentNoteForm } from "@/components/appointments/AppointmentNoteForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card/Card";
import { ArrowLeft, Calendar, Clock, User, Phone, Mail } from "lucide-react";
import Link from "next/link";

export default async function AppointmentDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) redirect("/login");

  const appointment = await prisma.appointment.findUnique({
    where: { id: params.id, clinicId: user.clinicId },
    include: {
      patient: true,
      service: true,
      professional: true,
      appointmentNote: true,
    }
  });

  if (!appointment) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="text-2xl font-bold mb-2">Consulta não encontrada</h1>
        <p className="text-muted-foreground mb-6">A consulta solicitada não existe ou você não tem acesso a ela.</p>
        <Link href="/dashboard/appointments" className="text-primary hover:underline flex items-center">
          <ArrowLeft size={16} className="mr-2" /> Voltar para agendamentos
        </Link>
      </div>
    );
  }

  // Apenas PROFISSIONAL ou ADMIN podem editar o prontuário
  const canEditNote = user.role === "PROFESSIONAL" || user.role === "ADMIN";

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex items-center space-x-4 mb-8">
        <Link href="/dashboard/appointments" className="p-2 bg-card rounded-full border hover:bg-muted transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Detalhes do Atendimento</h1>
          <p className="text-muted-foreground">Informações da consulta e prontuário do paciente.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Detalhes do Agendamento */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Calendar size={18} className="mr-2 text-primary" /> Agendamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Status</p>
                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
                    appointment.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                    appointment.status === 'COMPLETED' ? 'bg-violet-100 text-violet-700' :
                    appointment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                  {appointment.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Data e Hora</p>
                <div className="flex items-center font-medium">
                  <Clock size={16} className="mr-2 text-muted-foreground" />
                  {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(appointment.startTime)}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Serviço</p>
                <p className="font-medium">{appointment.service.name}</p>
                <p className="text-sm text-muted-foreground">Duração: {appointment.service.duration} min</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Profissional</p>
                <p className="font-medium">{appointment.professional?.name || "Não definido"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <User size={18} className="mr-2 text-primary" /> Paciente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Nome</p>
                <p className="font-medium">{appointment.patient.name}</p>
              </div>
              {appointment.patient.phone && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Telefone</p>
                  <p className="font-medium flex items-center">
                    <Phone size={14} className="mr-2 text-muted-foreground" />
                    {appointment.patient.phone}
                  </p>
                </div>
              )}
              {appointment.patient.email && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">E-mail</p>
                  <p className="font-medium flex items-center break-all">
                    <Mail size={14} className="mr-2 text-muted-foreground" />
                    {appointment.patient.email}
                  </p>
                </div>
              )}
              <Link href={`/dashboard/patients/${appointment.patientId}`} className="text-sm text-primary hover:underline mt-2 inline-block">
                Ver histórico completo
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Prontuário Leve */}
        <div className="md:col-span-2">
          <AppointmentNoteForm 
            appointmentId={appointment.id} 
            initialContent={appointment.appointmentNote?.content || ""}
            isReadOnly={!canEditNote}
          />
        </div>
      </div>
    </div>
  );
}
