import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card/Card";
import { Building2, Users, DollarSign, Activity } from "lucide-react";

export default async function AdminDashboardPage() {
  const totalClinics = await prisma.clinic.count();
  const totalUsers = await prisma.user.count();
  const totalAppointments = await prisma.appointment.count();
  const activeSubscriptions = await prisma.subscription.count({
    where: { status: "ACTIVE" }
  });

  const mrpQuery = await prisma.subscription.aggregate({
    _sum: { price: true },
    where: { status: "ACTIVE" }
  });
  
  const mrr = mrpQuery._sum.price || 0;

  const recentClinics = await prisma.clinic.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { subscription: true }
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Visão Geral</h1>
        <p className="text-slate-500">Métricas e informações globais da plataforma LUMEA.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">MRR (Receita Recorrente)</CardTitle>
            <DollarSign size={16} className="text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(mrr)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Clínicas Ativas (Assinantes)</CardTitle>
            <Building2 size={16} className="text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{activeSubscriptions} <span className="text-sm font-normal text-slate-500">/ {totalClinics}</span></div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Usuários Totais</CardTitle>
            <Users size={16} className="text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total de Agendamentos</CardTitle>
            <Activity size={16} className="text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{totalAppointments}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Clínicas Recentes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium">Nome</th>
                  <th className="px-6 py-4 font-medium">Slug</th>
                  <th className="px-6 py-4 font-medium">Cadastro em</th>
                  <th className="px-6 py-4 font-medium text-right">Status Assinatura</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentClinics.map((clinic) => (
                  <tr key={clinic.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{clinic.name}</td>
                    <td className="px-6 py-4 text-slate-500">{clinic.slug}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(clinic.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-2 py-1 text-[10px] uppercase font-bold rounded-full ${
                        clinic.subscription?.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                        clinic.subscription?.status === 'CANCELED' ? 'bg-red-100 text-red-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {clinic.subscription?.status || 'TRIAL'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
