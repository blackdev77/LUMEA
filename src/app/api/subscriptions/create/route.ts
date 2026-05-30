import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MercadoPagoConfig, PreApproval } from "mercadopago";

// Inicializa Mercado Pago
// process.env.MP_ACCESS_TOKEN must be set
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN || 'TEST-dummy-token-replace-me',
  options: { timeout: 5000, idempotencyKey: 'abc' } // Idempotency can be dynamic per request
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cardTokenId, payerEmail } = await req.json();

    if (!cardTokenId) {
      return NextResponse.json({ error: "Token de cartão é obrigatório." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Apenas administradores podem gerenciar assinaturas." }, { status: 403 });
    }

    // 1. Verificar se a clínica já tem assinatura
    let subscription = await prisma.subscription.findUnique({
      where: { clinicId: user.clinicId }
    });

    if (subscription?.status === "ACTIVE") {
      return NextResponse.json({ error: "Você já possui uma assinatura ativa." }, { status: 400 });
    }

    // 2. Criar a assinatura no Mercado Pago (PreApproval)
    // Documentação Oficial: Assinaturas sem plano associado (com cartão tokenizado no frontend)
    const preApproval = new PreApproval(client);
    const mpSubscription = await preApproval.create({
      body: {
        reason: "LUMEA Clinics - Plano PRO",
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: 99.90,
          currency_id: "BRL"
        },
        back_url: "https://lumea.app/dashboard/settings/billing",
        payer_email: payerEmail || user.email,
        card_token_id: cardTokenId,
        status: "authorized"
      }
    });

    // 3. Salvar no nosso banco de dados
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    if (subscription) {
      subscription = await prisma.subscription.update({
        where: { clinicId: user.clinicId },
        data: {
          mpSubscriptionId: mpSubscription.id,
          mpPayerId: mpSubscription.payer_id?.toString(),
          status: "ACTIVE", // Or 'PENDING' depending on MP webhook
          price: 99.90,
          nextBillingDate: nextMonth,
          lastPaymentDate: new Date(),
        }
      });
    } else {
      subscription = await prisma.subscription.create({
        data: {
          clinicId: user.clinicId,
          mpSubscriptionId: mpSubscription.id,
          mpPayerId: mpSubscription.payer_id?.toString(),
          status: "ACTIVE",
          price: 99.90,
          nextBillingDate: nextMonth,
          lastPaymentDate: new Date(),
        }
      });
    }

    return NextResponse.json({ success: true, subscription });

  } catch (error: any) {
    console.error("MP Subscription Error:", error);
    return NextResponse.json(
      { error: "Erro ao processar assinatura no Mercado Pago." },
      { status: 500 }
    );
  }
}
