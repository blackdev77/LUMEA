import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
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

    const body = await req.json();
    const { name, slug, phone, address, bio, settings } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: "Nome e URL Slug são obrigatórios." }, { status: 400 });
    }

    // Verifica se o slug já está em uso por OUTRA empresa
    const existingCompany = await prisma.company.findUnique({ where: { slug } });
    if (existingCompany && existingCompany.id !== user.companyId) {
      return NextResponse.json({ error: "A URL Slug escolhida já está em uso." }, { status: 400 });
    }

    const company = await prisma.company.update({
      where: { id: user.companyId },
      data: {
        name,
        slug,
        phone,
        address,
        bio,
        settings: settings || {}
      }
    });

    return NextResponse.json({ success: true, company });

  } catch (error: any) {
    console.error("Update Settings Error:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro ao atualizar as configurações." },
      { status: 500 }
    );
  }
}
