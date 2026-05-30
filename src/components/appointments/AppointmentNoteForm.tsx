"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card/Card";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

interface Props {
  appointmentId: string;
  initialContent?: string;
  isReadOnly?: boolean;
}

export function AppointmentNoteForm({ appointmentId, initialContent = "", isReadOnly = false }: Props) {
  const router = useRouter();
  const [content, setContent] = useState(initialContent);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;
    
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId, content }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao salvar prontuário.");
      }

      setSuccess("Prontuário salvo com sucesso!");
      router.refresh();
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prontuário / Anotações da Consulta</CardTitle>
        <CardDescription>Registro clínico do atendimento. Visível apenas para profissionais da clínica.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-md flex items-center text-sm">
              <CheckCircle2 size={16} className="mr-2" />
              {success}
            </div>
          )}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center text-sm">
              <AlertTriangle size={16} className="mr-2" />
              {error}
            </div>
          )}

          <textarea
            className="w-full flex min-h-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Evolução clínica, observações, queixas..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isReadOnly}
            required
          />

          {!isReadOnly && (
            <div className="flex justify-end">
              <Button type="submit" isLoading={isLoading}>
                Salvar Prontuário
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
