"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";
import { Card, CardContent } from "@/components/ui/Card/Card";
import { Calendar as CalendarIcon, Clock, CheckCircle2 } from "lucide-react";

export function BookingWidget({ company }: { company: any }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
  });

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, companyId: company.id }),
      });
      
      if (res.ok) {
        setSuccess(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="text-center p-8 border-green-200 bg-green-50/50">
        <div className="flex justify-center mb-4 text-green-500">
          <CheckCircle2 size={48} />
        </div>
        <h3 className="text-2xl font-bold text-green-700 mb-2">Agendamento Confirmado!</h3>
        <p className="text-green-600/80 mb-6">
          Seu horário foi reservado com sucesso. Te esperamos!
        </p>
        <Button variant="outline" onClick={() => window.location.reload()} className="bg-white">
          Fazer novo agendamento
        </Button>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-xl">
      <CardContent className="p-8">
        <form onSubmit={handleBook} className="space-y-6">
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CalendarIcon size={20} className="text-primary" />
              Escolha o horário
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Input 
                type="date" 
                label="Data" 
                required 
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
              <Input 
                type="time" 
                label="Horário" 
                required 
                value={formData.time}
                onChange={e => setFormData({...formData, time: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-semibold">Seus dados</h3>
            <Input 
              label="Nome Completo" 
              placeholder="João Silva" 
              required 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="E-mail" 
                type="email" 
                placeholder="seu@email.com" 
                required 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
              <Input 
                label="WhatsApp" 
                placeholder="(11) 99999-9999" 
                required 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>

          <Button type="submit" size="lg" fullWidth isLoading={loading} className="mt-4">
            Confirmar Agendamento
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
