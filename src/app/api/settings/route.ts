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
    const { name, slug, phone, address, settings } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: "Nome e URL Slug são obrigatórios." }, { status: 400 });
    }

    // Verifica se o slug já está em uso por OUTRA clínica
    const existingClinic = await prisma.clinic.findUnique({ where: { slug } });
    if (existingClinic && existingClinic.id !== user.clinicId) {
      return NextResponse.json({ error: "A URL Slug escolhida já está em uso." }, { status: 400 });
    }

    const clinic = await prisma.clinic.update({
      where: { id: user.clinicId },
      data: {
        name,
        slug,
        phone,
        address,
        settings: settings || {}
      }
    });

    return NextResponse.json({ success: true, clinic });

  } catch (error: any) {
    console.error("Update Settings Error:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro ao atualizar as configurações." },
      { status: 500 }
    );
  }
}
