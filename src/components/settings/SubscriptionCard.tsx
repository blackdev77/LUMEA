"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card/Card";
import { Button } from "@/components/ui/Button/Button";
import { CreditCard, CheckCircle2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

interface SubscriptionCardProps {
  subscription: any;
  clinic: any;
}

export function SubscriptionCard({ subscription, clinic }: SubscriptionCardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/subscriptions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          cardTokenId: "dummy_token_123", // In a real app, this comes from Mercado Pago UI
          payerEmail: "dummy@email.com" 
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao processar assinatura.");
      }

      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isActive = subscription?.status === "ACTIVE";
  
  // Trial logic
  const trialDays = 14;
  const trialEnd = new Date(new Date(clinic.createdAt).getTime() + trialDays * 24 * 60 * 60 * 1000);
  const now = new Date();
  const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 3600 * 24));
  const isTrial = !isActive && daysLeft > 0;
  const isBlocked = !isActive && daysLeft <= 0;

  return (
    <Card className={isBlocked ? "border-red-500" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Plano e Assinatura</CardTitle>
            <CardDescription>Gerencie sua assinatura da plataforma LUMEA.</CardDescription>
          </div>
          {isActive ? (
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase rounded-full flex items-center">
              <CheckCircle2 size={14} className="mr-1" /> Ativo
            </span>
          ) : isTrial ? (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase rounded-full">
              Teste Grátis ({daysLeft} dias)
            </span>
          ) : (
            <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold uppercase rounded-full flex items-center">
              <AlertTriangle size={14} className="mr-1" /> Bloqueado
            </span>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm flex items-center">
            <AlertTriangle size={16} className="mr-2" />
            {error}
          </div>
        )}

        <div className="p-6 bg-muted/30 rounded-xl border flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold mb-1">Plano Premium</h3>
            <p className="text-muted-foreground text-sm">
              Acesso completo a todas as ferramentas, agendamentos ilimitados e envio automático de lembretes.
            </p>
          </div>
          <div className="text-right whitespace-nowrap">
            <div className="text-3xl font-heading font-bold text-primary">R$ 149<span className="text-lg text-muted-foreground font-normal">/mês</span></div>
          </div>
        </div>

        {isActive ? (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Próxima cobrança:</span>
              <span className="font-medium">
                {subscription.nextBillingDate 
                  ? new Intl.DateTimeFormat('pt-BR').format(new Date(subscription.nextBillingDate)) 
                  : "N/A"}
              </span>
            </div>
            <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
              Cancelar Assinatura
            </Button>
          </div>
        ) : (
          <div className="pt-4 border-t space-y-4">
            {isBlocked && (
              <p className="text-sm text-red-600 font-medium">
                Seu período de teste expirou. Assine agora para continuar usando a plataforma.
              </p>
            )}
            <Button onClick={handleSubscribe} isLoading={isLoading} className="w-full h-12 text-lg">
              <CreditCard size={20} className="mr-2" /> Assinar Agora
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Pagamento seguro processado via Mercado Pago. Cancele quando quiser.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
