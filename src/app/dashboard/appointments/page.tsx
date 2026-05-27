import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card/Card";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button/Button";

export default async function AppointmentsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return null;

  const appointments = await prisma.appointment.findMany({
    where: { companyId: user.companyId },
    orderBy: { startTime: "asc" },
    include: { customer: true, service: true, professional: true },
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agendamentos</h1>
          <p className="text-muted-foreground">Gerencie a agenda da sua clínica.</p>
        </div>
        <Button>+ Novo Agendamento</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {appointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
                <Calendar size={32} className="text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Nenhum agendamento encontrado</h3>
              <p className="text-muted-foreground max-w-sm mb-6">
                Você ainda não tem nenhum agendamento marcado. Os agendamentos feitos pelos seus clientes aparecerão aqui.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                  <tr>
                    <th className="px-6 py-4 font-medium">Data / Hora</th>
                    <th className="px-6 py-4 font-medium">Cliente</th>
                    <th className="px-6 py-4 font-medium">Serviço</th>
                    <th className="px-6 py-4 font-medium">Profissional</th>
                    <th className="px-6 py-4 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(apt.startTime)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{apt.customer.name}</div>
                        <div className="text-xs text-muted-foreground">{apt.customer.phone || apt.customer.email || 'Sem contato'}</div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{apt.service.name}</td>
                      <td className="px-6 py-4 text-muted-foreground">{apt.professional?.name || 'Geral'}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
                          apt.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                          apt.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {apt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
