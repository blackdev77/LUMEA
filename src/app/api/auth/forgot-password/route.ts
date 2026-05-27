import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "E-mail é obrigatório." }, { status: 400 });
    }

    // Procura o usuário
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      // TODO: Implementar lógica real de geração de token e envio de e-mail (Resend/SendGrid)
      // await sendPasswordResetEmail(user.email, token);
      console.log(`[Forgot Password] E-mail de recuperação simulado para: ${user.email}`);
    }

    // Mesmo se o usuário não for encontrado, retornamos sucesso por segurança (preventing email enumeration)
    return NextResponse.json({ success: true, message: "E-mail processado." });
    
  } catch (error: any) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro ao processar sua solicitação." },
      { status: 500 }
    );
  }
}
