"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card/Card";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";
import { CheckCircle2, AlertTriangle } from "lucide-react";

interface Props {
  company: any;
  user: any;
}

export function SettingsForm({ company, user }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: company.name || "",
    slug: company.slug || "",
    phone: company.phone || "",
    address: company.address || "",
    bio: company.bio || "",
  });

  const [adminData, setAdminData] = useState({
    name: user.name || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/settings", {
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
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center shadow-sm">
          <CheckCircle2 size={20} className="mr-3" />
          {success}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center shadow-sm">
          <AlertTriangle size={20} className="mr-3" />
          {error}
        </div>
      )}

      {/* Dados do Negócio */}
      <Card>
        <CardHeader>
          <CardTitle>Dados do Negócio</CardTitle>
          <CardDescription>Informações públicas que aparecerão na sua página de agendamentos.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Nome da Empresa *"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <div className="space-y-2">
            <label className="text-sm font-medium">Descrição / Bio</label>
            <textarea
              rows={3}
              className="w-full flex rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Fale um pouco sobre o seu negócio..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Telefone Público"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <Input
              label="Endereço"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
          <div className="p-4 bg-muted/50 rounded-lg border">
            <Input
              label="URL Slug do Negócio *"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Seu link de agendamento: <strong>lumea.com/{formData.slug}</strong><br/>
              Aviso: Alterar o slug mudará o seu link público e links antigos deixarão de funcionar.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Dados do Administrador */}
      <Card>
        <CardHeader>
          <CardTitle>Dados do Administrador</CardTitle>
          <CardDescription>Informações da sua conta pessoal.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="E-mail (Apenas leitura)"
            value={user.email}
            disabled
          />
          <Input
            label="Nome do Administrador"
            value={adminData.name}
            onChange={(e) => setAdminData({ ...adminData, name: e.target.value })}
            disabled // Placeholder para futura rota de atualizar perfil
          />
        </CardContent>
      </Card>

      {/* Zona de Perigo */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Zona de Perigo</CardTitle>
          <CardDescription>Ações irreversíveis para a sua conta e negócio.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button type="button" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
            Excluir minha conta permanentemente
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end sticky bottom-6 bg-background/80 p-4 rounded-xl border backdrop-blur-sm shadow-sm z-10">
        <Button type="submit" size="lg" isLoading={isLoading}>
          Salvar Alterações
        </Button>
      </div>
    </form>
  );
}
