import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { PageTransition } from "@/components/layout/PageTransition";
import { Bell, Lock } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { clinic: { include: { subscription: true } } }
  });

  const clinic = user?.clinic;
  let isBlocked = false;
  let daysLeft = 14;

  if (clinic) {
    const trialDays = 14;
    const now = new Date();
    const trialEnd = new Date(new Date(clinic.createdAt).getTime() + trialDays * 24 * 60 * 60 * 1000);
    daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 3600 * 24));
    
    if (daysLeft <= 0 && clinic.subscription?.status !== "ACTIVE") {
      isBlocked = true;
    }
  }

  return (
    <div className="min-h-screen bg-muted/20 flex">
      <Sidebar user={session.user} />
      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b bg-card flex items-center justify-between px-8">
          <div className="font-medium">
            Bem-vindo(a), {session.user.name || "Usuário"} 👋
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-card"></span>
            </button>
          </div>
        </header>
        <div className="flex-1 p-8 overflow-y-auto relative">
          {isBlocked && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 shadow-lg border border-red-200 text-red-600">
                <Lock size={40} />
              </div>
              <h2 className="text-3xl font-bold font-heading mb-4">Acesso Bloqueado</h2>
              <p className="text-muted-foreground text-lg max-w-lg mb-8">
                O seu período de teste expirou ou há uma pendência na sua assinatura. 
                Por favor, regularize sua situação para continuar usando a plataforma.
              </p>
              <a href="/dashboard/settings" className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-md hover:bg-primary/90 transition-colors">
                Regularizar Assinatura
              </a>
            </div>
          )}
          <div className={isBlocked ? "pointer-events-none opacity-20" : "h-full"}>
            <PageTransition>
              {children}
            </PageTransition>
          </div>
        </div>
      </main>
    </div>
  );
}
