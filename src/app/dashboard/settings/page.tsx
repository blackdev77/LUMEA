import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SettingsForm } from "@/components/settings/SettingsForm";
import { SubscriptionCard } from "@/components/settings/SubscriptionCard";
import { RemindersConfigCard } from "@/components/settings/RemindersConfigCard";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({ 
    where: { email: session.user.email },
    include: { 
      clinic: { 
        include: { 
          subscription: true,
          notificationSetting: true 
        } 
      } 
    }
  });
  
  if (!user || !user.clinic) {
    redirect("/login");
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">Gerencie as preferências da sua conta e da sua clínica.</p>
        </div>
      </div>

      <SubscriptionCard subscription={user.clinic.subscription} clinic={user.clinic} />
      <RemindersConfigCard settings={user.clinic.notificationSetting} />
      <SettingsForm clinic={user.clinic} user={user} />
    </div>
  );
}
