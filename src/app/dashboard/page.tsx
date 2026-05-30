import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card/Card";
import { Users, Calendar as CalendarIcon, DollarSign, TrendingUp, CalendarCheck, Zap } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/Button/Button";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { clinic: true },
  });

  if (!user) return null;
  const clinicId = user.clinicId;

  // Real Database Queries
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const appointmentsToday = await prisma.appointment.count({
    where: {
      clinicId,
      date: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
  });

  const totalPatients = await prisma.patient.count({
    where: { clinicId },
  });

  const recentAppointments = await prisma.appointment.findMany({
    where: { clinicId },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { patient: true, service: true },
  });

  // Calculate estimated revenue for today
  const todaysAppointments = await prisma.appointment.findMany({
    where: {
      clinicId,
      date: { gte: todayStart, lte: todayEnd },
      status: { notIn: ["CANCELED", "NO_SHOW"] },
    },
    include: { service: true },
  });

  const estimatedRevenue = todaysAppointments.reduce((acc, curr) => acc + curr.service.price, 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Visão Geral</h1>
        <p className="text-muted-foreground">Acompanhe suas consultas, pacientes e faturamento em tempo real.</p>
      </div>
      
      {appointmentsToday === 0 && totalPatients === 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">👋 Bem-vindo ao LUMEA! Comece por aqui:</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded border border-primary flex items-center justify-center" /> <span className="text-sm font-medium">Cadastre seus profissionais</span> <span className="text-xs text-muted-foreground">(Adicione os profissionais de saúde e suas especialidades)</span></div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded border border-primary flex items-center justify-center" /> <span className="text-sm font-medium">Configure seus horários</span> <span className="text-xs text-muted-foreground">(Defina os dias e horários de funcionamento da clínica)</span></div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded border border-primary flex items-center justify-center" /> <span className="text-sm font-medium">Cadastre seus serviços</span> <span className="text-xs text-muted-foreground">(Consultas, exames ou procedimentos)</span></div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded border border-primary flex items-center justify-center" /> <span className="text-sm font-medium">Ative lembretes</span> <span className="text-xs text-muted-foreground">(Reduza faltas ativando o envio automático via WhatsApp)</span></div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded border border-primary flex items-center justify-center" /> <span className="text-sm font-medium">Compartilhe seu link</span> <span className="text-xs text-muted-foreground">(Envie para seus pacientes agendarem sozinhos)</span></div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Consultas Hoje</CardTitle>
            <CalendarIcon size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointmentsToday}</div>
            <p className="text-xs text-muted-foreground mt-1">Para o dia de hoje</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Pacientes</CardTitle>
            <Users size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPatients}</div>
            <p className="text-xs text-muted-foreground mt-1">Cadastrados na base</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Faturamento Estimado</CardTitle>
            <DollarSign size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(estimatedRevenue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Para hoje</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Comparecimento</CardTitle>
            <TrendingUp size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {appointmentsToday > 0 ? "Aguardando" : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Concluídas / Agendadas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Últimas Consultas</CardTitle>
          </CardHeader>
          <CardContent>
            {recentAppointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                  <CalendarCheck size={24} className="text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">Nenhuma consulta agendada ainda.</p>
                <p className="text-xs text-muted-foreground mt-1 mb-4">Compartilhe seu link público para pacientes agendarem.</p>
                <Link href={`/${user.clinic.slug}`} target="_blank">
                  <Button variant="outline" size="sm">Ver minha página pública</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentAppointments.map(apt => (
                  <div key={apt.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium">{apt.patient.name}</p>
                      <p className="text-xs text-muted-foreground">{apt.service.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(apt.startTime)}
                      </p>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        apt.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                        apt.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Seu Link de Agendamento</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center text-center py-8">
            <div className="p-4 bg-primary/10 text-primary rounded-xl mb-4">
              <Zap size={32} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Pronto para receber pacientes?</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Envie este link no seu WhatsApp ou Instagram para que seus pacientes possam agendar horários sozinhos.
            </p>
            <div className="flex w-full items-center space-x-2">
              <div className="bg-muted px-4 py-2 rounded-md border text-sm font-mono flex-1 text-left truncate">
                lumea.app/{user.clinic.slug}
              </div>
              <Link href={`/${user.clinic.slug}`} target="_blank">
                <Button>Visitar</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
