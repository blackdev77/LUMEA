import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { clinicName, slug, name, email, password } = await req.json();

    if (!clinicName || !slug || !name || !email || !password) {
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
    const existingClinic = await prisma.clinic.findUnique({
      where: { slug },
    });

    if (existingClinic) {
      return NextResponse.json({ error: "Esta URL (slug) já está em uso por outra empresa." }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Clinic and User in a transaction
    const result = await prisma.$transaction(async (tx: any) => {
      const clinic = await tx.clinic.create({
        data: {
          name: clinicName,
          slug,
        },
      });

      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "ADMIN",
          clinicId: clinic.id,
        },
      });

      return { clinic, user };
    });

    return NextResponse.json({ 
      success: true, 
      user: { id: result.user.id, email: result.user.email },
      clinic: { id: result.clinic.id, slug: result.clinic.slug }
    });

  } catch (error: any) {
    console.error("Register API Error:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro ao processar sua solicitação." },
      { status: 500 }
    );
  }
}
