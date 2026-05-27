import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { companyName, slug, name, email, password } = await req.json();

    if (!companyName || !slug || !name || !email || !password) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "A senha deve ter no mínimo 6 caracteres." }, { status: 400 });
    }

    // Check if email is already in use
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Este e-mail já está cadastrado." }, { status: 400 });
    }

    // Check if slug is already in use
    const existingCompany = await prisma.company.findUnique({
      where: { slug },
    });

    if (existingCompany) {
      return NextResponse.json({ error: "Esta URL (slug) já está em uso por outra empresa." }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Company and User in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: {
          name: companyName,
          slug,
        },
      });

      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "ADMIN",
          companyId: company.id,
        },
      });

      return { company, user };
    });

    return NextResponse.json({ 
      success: true, 
      user: { id: result.user.id, email: result.user.email },
      company: { id: result.company.id, slug: result.company.slug }
    });

  } catch (error: any) {
    console.error("Register API Error:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro ao processar sua solicitação." },
      { status: 500 }
    );
  }
}
