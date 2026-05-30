import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LogOut, Activity, Users, Settings } from "lucide-react";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "SUPERADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 font-bold text-xl tracking-wider">
          LUMEA <span className="text-primary ml-2 text-sm uppercase">Admin</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center px-4 py-3 rounded-lg bg-slate-800 text-white font-medium">
            <Activity size={18} className="mr-3" /> Visão Geral
          </Link>
          <Link href="/admin/clinics" className="flex items-center px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white font-medium transition-colors">
            <Users size={18} className="mr-3" /> Clínicas (Tenants)
          </Link>
          <Link href="/admin/settings" className="flex items-center px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white font-medium transition-colors">
            <Settings size={18} className="mr-3" /> Configurações
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <Link href="/api/auth/signout" className="flex items-center px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors">
            <LogOut size={18} className="mr-3" /> Sair
          </Link>
        </div>
      </aside>
      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b bg-white flex items-center justify-between px-8">
          <div className="font-medium text-slate-600">
            Painel do Administrador Global
          </div>
          <div className="flex items-center space-x-4 text-sm font-medium">
            {session.user.email}
          </div>
        </header>
        <div className="flex-1 p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
