"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/Card/Card";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";
import Link from "next/link";
import { Zap } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Ocorreu um erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Brand Section */}
      <div className="hidden lg:flex flex-col justify-center items-start p-16 bg-muted/30 border-r relative overflow-hidden">
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="z-10 max-w-lg">
          <div className="flex items-center space-x-2 mb-8 text-primary">
            <Zap size={32} />
            <h1 className="font-heading font-bold text-4xl tracking-tighter">LUMEA</h1>
          </div>
          <p className="text-3xl font-heading font-medium leading-tight mb-6">
            A gestão premium que a sua clínica merece.
          </p>
          <p className="text-muted-foreground text-lg">
            Acesse sua conta para gerenciar seus agendamentos, clientes e faturamento em um só lugar.
          </p>
        </div>
      </div>
      
      {/* Form Section */}
      <div className="flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-[400px]">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center justify-center space-x-2 mb-8 text-primary">
            <Zap size={28} />
            <h1 className="font-heading font-bold text-3xl tracking-tighter">LUMEA</h1>
          </div>

          <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl">Acesse sua conta</CardTitle>
              <CardDescription>Insira suas credenciais para continuar.</CardDescription>
            </CardHeader>
            
            <form onSubmit={handleLogin}>
              <CardContent className="px-0 space-y-4">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-md text-sm">
                    {error}
                  </div>
                )}
                
                <Input
                  label="E-mail"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                
                <div className="space-y-1">
                  <Input
                    label="Senha"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div className="flex justify-end">
                    <Link href="/forgot-password" className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
                      Esqueci minha senha
                    </Link>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="px-0 flex flex-col space-y-4">
                <Button type="submit" fullWidth isLoading={isLoading} size="lg">
                  Entrar
                </Button>
                <div className="text-sm text-center text-muted-foreground">
                  Não tem uma conta? <Link href="/register" className="font-medium text-primary hover:underline">Cadastre sua clínica</Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
