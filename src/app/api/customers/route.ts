import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    const { name, email, phone, notes } = await req.json();

    if (!name || !phone) {
      return NextResponse.json({ error: "Nome e Telefone são obrigatórios." }, { status: 400 });
    }

    const customer = await prisma.customer.create({
      data: {
        companyId: user.companyId,
        name,
        email: email || null,
        phone,
      }
    });

    return NextResponse.json({ success: true, customer });

  } catch (error: any) {
    console.error("Create Customer Error:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro ao criar o cliente." },
      { status: 500 }
    );
  }
}
