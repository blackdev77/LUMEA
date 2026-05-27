"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/Card/Card";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";
import Link from "next/link";
import { Zap, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Ocorreu um erro ao enviar o e-mail.");
      }

      setSuccess(true);
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
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="z-10 max-w-lg">
          <div className="flex items-center space-x-2 mb-8 text-primary">
            <Zap size={32} />
            <h1 className="font-heading font-bold text-4xl tracking-tighter">LUMEA</h1>
          </div>
          <p className="text-3xl font-heading font-medium leading-tight mb-6">
            A gestão premium que o seu negócio merece.
          </p>
          <p className="text-muted-foreground text-lg">
            Recupere o acesso à sua conta e continue oferecendo a melhor experiência.
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
              <CardTitle className="text-2xl">Esqueceu sua senha?</CardTitle>
              <CardDescription>Insira seu e-mail para receber um link de redefinição.</CardDescription>
            </CardHeader>
            
            {success ? (
              <CardContent className="px-0">
                <div className="p-6 bg-green-500/10 border border-green-500/20 text-green-700 rounded-xl flex flex-col items-center text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-600">
                    <CheckCircle2 size={24} />
                  </div>
                  <p className="font-medium">
                    Se este e-mail estiver cadastrado, você receberá um link em instantes.
                  </p>
                </div>
                <div className="mt-8 text-center">
                  <Link href="/login">
                    <Button variant="outline" className="w-full">Voltar ao login</Button>
                  </Link>
                </div>
              </CardContent>
            ) : (
              <form onSubmit={handleSubmit}>
                <CardContent className="px-0 space-y-4">
                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-md text-sm">
                      {error}
                    </div>
                  )}
                  
                  <Input
                    label="E-mail cadastrado"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </CardContent>
                
                <CardFooter className="px-0 flex flex-col space-y-4">
                  <Button type="submit" fullWidth isLoading={isLoading} size="lg">
                    Enviar link de recuperação
                  </Button>
                  <div className="text-sm text-center text-muted-foreground">
                    <Link href="/login" className="font-medium text-primary hover:underline">Voltar ao login</Link>
                  </div>
                </CardFooter>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
