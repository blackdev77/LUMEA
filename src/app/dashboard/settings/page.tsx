import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SettingsForm } from "@/components/settings/SettingsForm";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({ 
    where: { email: session.user.email },
    include: { company: true }
  });
  
  if (!user || !user.company) {
    redirect("/login");
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">Gerencie as preferências da sua conta e do seu negócio.</p>
        </div>
      </div>

      <SettingsForm company={user.company} user={user} />
    </div>
  );
}
