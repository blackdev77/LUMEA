import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card/Card";
import { ArrowLeft, User, Phone, Mail, Calendar, Edit2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button/Button";

export default async function PatientDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) redirect("/login");

  const patient = await prisma.patient.findUnique({
    where: { id: params.id, clinicId: user.clinicId },
    include: {
      appointments: {
        include: { service: true, professional: true, appointmentNote: true },
        orderBy: { startTime: "desc" }
      }
    }
  });

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="text-2xl font-bold mb-2">Paciente não encontrado</h1>
        <p className="text-muted-foreground mb-6">O paciente solicitado não existe ou você não tem acesso a ele.</p>
        <Link href="/dashboard/patients" className="text-primary hover:underline flex items-center">
          <ArrowLeft size={16} className="mr-2" /> Voltar para pacientes
        </Link>
      </div>
    );
  }

  const totalAppointments = patient.appointments.length;
  const noShows = patient.appointments.filter(a => a.status === "NO_SHOW").length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/patients" className="p-2 bg-card rounded-full border hover:bg-muted transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Perfil do Paciente</h1>
            <p className="text-muted-foreground">Histórico completo e dados cadastrais.</p>
          </div>
        </div>
        <Button variant="outline"><Edit2 size={16} className="mr-2"/> Editar Cadastro</Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Detalhes do Paciente */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <User size={18} className="mr-2 text-primary" /> Dados Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Nome Completo</p>
                <p className="font-medium text-lg">{patient.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Telefone (WhatsApp)</p>
                <p className="font-medium flex items-center">
                  <Phone size={14} className="mr-2 text-muted-foreground" />
                  {patient.phone || "Não informado"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">E-mail</p>
                <p className="font-medium flex items-center break-all">
                  <Mail size={14} className="mr-2 text-muted-foreground" />
                  {patient.email || "Não informado"}
                </p>
              </div>
              {patient.birthDate && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Data de Nascimento</p>
                  <p className="font-medium">
                    {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(patient.birthDate)}
                  </p>
                </div>
              )}
              {patient.notes && (
                <div className="p-3 bg-muted/50 rounded-md border mt-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Observações Gerais</p>
                  <p className="text-sm">{patient.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                Métricas
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-muted/30 rounded-lg border">
                <div className="text-2xl font-bold">{totalAppointments}</div>
                <p className="text-xs text-muted-foreground mt-1">Consultas</p>
              </div>
              <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
                <div className="text-2xl font-bold">{noShows}</div>
                <p className="text-xs opacity-80 mt-1">Faltas</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Histórico de Agendamentos */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar size={18} className="mr-2 text-primary" /> Histórico de Consultas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {patient.appointments.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  Nenhuma consulta registrada para este paciente.
                </div>
              ) : (
                <div className="divide-y">
                  {patient.appointments.map((apt) => (
                    <div key={apt.id} className="p-4 hover:bg-muted/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium">
                            {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(apt.startTime)}
                          </span>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                            apt.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                            apt.status === 'COMPLETED' ? 'bg-violet-100 text-violet-700' :
                            apt.status === 'CANCELED' ? 'bg-red-100 text-red-700' :
                            apt.status === 'NO_SHOW' ? 'bg-slate-100 text-slate-700' :
                            apt.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {apt.status}
                          </span>
                        </div>
                        <p className="text-sm font-medium">{apt.service.name}</p>
                        <p className="text-xs text-muted-foreground">Profissional: {apt.professional?.name || 'Geral'}</p>
                      </div>
                      <Link href={`/dashboard/appointments/${apt.id}`} className="text-sm text-primary font-medium hover:underline whitespace-nowrap">
                        Ver Detalhes & Prontuário
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
