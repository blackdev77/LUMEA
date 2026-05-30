"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/Card/Card";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";
import Link from "next/link";
import { Zap } from "lucide-react";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    clinicName: "",
    slug: "",
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "clinicName") {
      setFormData(prev => ({
        ...prev,
        slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
      }));
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao criar conta.");
      }

      // Auto-login after successful registration
      const loginRes = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (loginRes?.error) {
        router.push("/login"); // fallback
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Brand Section */}
      <div className="hidden lg:flex flex-col justify-center items-start p-16 bg-muted/30 border-r relative overflow-hidden">
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-blue-400/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="z-10 max-w-lg">
          <div className="flex items-center space-x-2 mb-8 text-primary">
            <Zap size={32} />
            <h1 className="font-heading font-bold text-4xl tracking-tighter">LUMEA</h1>
          </div>
          <p className="text-3xl font-heading font-medium leading-tight mb-6">
            Comece a transformar sua clínica agora.
          </p>
          <p className="text-muted-foreground text-lg mb-8">
            Crie sua conta em segundos e tenha acesso a uma plataforma completa de gestão de agendamentos.
          </p>
          <ul className="space-y-4">
            <li className="flex items-center space-x-3 text-sm text-muted-foreground">
              <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">✓</div>
              <span>Agendamento online 24/7 para seus pacientes</span>
            </li>
            <li className="flex items-center space-x-3 text-sm text-muted-foreground">
              <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">✓</div>
              <span>Controle financeiro e relatórios</span>
            </li>
            <li className="flex items-center space-x-3 text-sm text-muted-foreground">
              <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">✓</div>
              <span>Notificações para reduzir faltas</span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Form Section */}
      <div className="flex flex-col justify-center items-center p-4 py-8 md:p-8">
        <div className="w-full max-w-[450px]">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center justify-center space-x-2 mb-8 text-primary">
            <Zap size={28} />
            <h1 className="font-heading font-bold text-3xl tracking-tighter">LUMEA</h1>
          </div>

          <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl">Cadastre sua clínica</CardTitle>
              <CardDescription>Preencha os dados abaixo para criar sua conta grátis.</CardDescription>
            </CardHeader>
            
            <form onSubmit={handleRegister}>
              <CardContent className="px-0 space-y-4">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-md text-sm">
                    {error}
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Nome da Clínica"
                    name="clinicName"
                    placeholder="Clínica XYZ"
                    value={formData.clinicName}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="URL (slug)"
                    name="slug"
                    placeholder="clinica-xyz"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Input
                  label="Seu Nome Completo"
                  name="name"
                  placeholder="João Silva"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                
                <Input
                  label="E-mail Administrativo"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                
                <Input
                  label="Senha"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </CardContent>
              
              <CardFooter className="px-0 flex flex-col space-y-4 pt-4">
                <Button type="submit" fullWidth isLoading={isLoading} size="lg">
                  Criar Conta
                </Button>
                <div className="text-sm text-center text-muted-foreground">
                  Já possui uma conta? <Link href="/login" className="font-medium text-primary hover:underline">Faça login</Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
