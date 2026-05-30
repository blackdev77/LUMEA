"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card/Card";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";
import { CheckCircle2, AlertTriangle, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";

interface RemindersConfigCardProps {
  settings: any;
}

export function RemindersConfigCard({ settings }: RemindersConfigCardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    isActive: settings?.isActive ?? true,
    minutesBefore: settings?.minutesBefore ?? 1440, // default 24h
    template: settings?.template || "Olá {nome_paciente}, lembrete da sua consulta de {nome_servico} na {nome_clinica} amanhã às {horario}. Link: {link}",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/settings/reminders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao salvar configurações.");
      }

      setSuccess("Configurações salvas com sucesso!");
      router.refresh();
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare size={20} className="mr-2 text-primary" />
          Lembretes Automáticos (WhatsApp)
        </CardTitle>
        <CardDescription>
          Configure os lembretes enviados automaticamente para os pacientes.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {success && (
            <div className="p-3 bg-green-50 text-green-700 border border-green-200 rounded-md text-sm flex items-center">
              <CheckCircle2 size={16} className="mr-2" />
              {success}
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm flex items-center">
              <AlertTriangle size={16} className="mr-2" />
              {error}
            </div>
          )}

          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="isActive"
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            />
            <label htmlFor="isActive" className="font-medium text-sm cursor-pointer">
              Ativar envio automático de lembretes
            </label>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tempo de antecedência</label>
            <select
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={formData.minutesBefore}
              onChange={(e) => setFormData({ ...formData, minutesBefore: parseInt(e.target.value) })}
              disabled={!formData.isActive}
            >
              <option value={120}>2 horas antes</option>
              <option value={1440}>24 horas antes (1 dia)</option>
              <option value={2880}>48 horas antes (2 dias)</option>
              <option value={10080}>1 semana antes</option>
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <label className="text-sm font-medium">Template da Mensagem</label>
              <span className="text-xs text-muted-foreground">Variáveis disponíveis: {'{nome_paciente}, {nome_servico}, {nome_clinica}, {horario}, {link}'}</span>
            </div>
            <textarea
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground"
              value={formData.template}
              onChange={(e) => setFormData({ ...formData, template: e.target.value })}
              disabled={!formData.isActive}
              required
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" isLoading={isLoading} disabled={!formData.isActive && settings?.isActive === formData.isActive}>
              Salvar Configurações
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
