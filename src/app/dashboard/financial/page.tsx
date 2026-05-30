import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card/Card";
import { DollarSign, TrendingUp, CreditCard, Wallet } from "lucide-react";

export default async function FinancialPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user || (user.role !== "ADMIN" && user.role !== "MANAGER")) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-bold mb-2">Acesso Negado</h1>
        <p className="text-muted-foreground">Apenas administradores e gerentes podem acessar o financeiro.</p>
      </div>
    );
  }

  const payments = await prisma.payment.findMany({
    where: { clinicId: user.clinicId },
    include: {
      appointment: {
        include: { patient: true, service: true }
      }
    },
    orderBy: { paymentDate: "desc" }
  });

  // Calculate metrics
  const totalRevenue = payments.reduce((acc, curr) => acc + curr.amount, 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayRevenue = payments
    .filter(p => p.paymentDate && new Date(p.paymentDate) >= today)
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financeiro</h1>
          <p className="text-muted-foreground">Controle de receitas e contas a receber.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <Wallet size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Soma de todos os pagamentos</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Recebido Hoje</CardTitle>
            <TrendingUp size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(todayRevenue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Pagamentos registrados hoje</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inadimplência</CardTitle>
            <DollarSign size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              R$ 0,00
            </div>
            <p className="text-xs text-muted-foreground mt-1">Contas pendentes (em breve)</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Pagamentos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <CreditCard size={32} className="text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">Nenhum pagamento registrado ainda.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                  <tr>
                    <th className="px-6 py-4 font-medium">Data</th>
                    <th className="px-6 py-4 font-medium">Paciente</th>
                    <th className="px-6 py-4 font-medium">Serviço</th>
                    <th className="px-6 py-4 font-medium">Método</th>
                    <th className="px-6 py-4 font-medium text-right">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {payment.paymentDate ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(payment.paymentDate) : '-'}
                      </td>
                      <td className="px-6 py-4 font-medium">{payment.appointment.patient.name}</td>
                      <td className="px-6 py-4 text-muted-foreground">{payment.appointment.service.name}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-muted rounded-md text-xs font-medium border">
                          {payment.method}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-green-600">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(payment.amount)}
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
