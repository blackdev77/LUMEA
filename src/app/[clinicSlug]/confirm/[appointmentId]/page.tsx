"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button/Button";
import { CheckCircle, XCircle } from "lucide-react";

export default function AppointmentConfirmPage({ params }: { params: { clinicSlug: string, appointmentId: string } }) {
  const [status, setStatus] = useState<"IDLE" | "LOADING" | "CONFIRMED" | "CANCELED" | "ERROR">("IDLE");

  const handleAction = async (action: 'CONFIRM' | 'CANCEL') => {
    try {
      setStatus("LOADING");
      const res = await fetch(`/api/appointments/${params.appointmentId}/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) throw new Error("Erro");
      
      setStatus(action === 'CONFIRM' ? "CONFIRMED" : "CANCELED");
    } catch (error) {
      setStatus("ERROR");
    }
  };

  if (status === "CONFIRMED") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full flex flex-col items-center">
          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Presença Confirmada!</h1>
          <p className="text-muted-foreground">Sua consulta está garantida. Te esperamos na clínica!</p>
        </div>
      </div>
    );
  }

  if (status === "CANCELED") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full flex flex-col items-center">
          <XCircle className="w-16 h-16 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Consulta Cancelada</h1>
          <p className="text-muted-foreground">Sua consulta foi cancelada. Entre em contato se precisar reagendar.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <h1 className="text-2xl font-bold mb-2">Confirmar Consulta</h1>
        <p className="text-muted-foreground mb-8">Por favor, confirme se você comparecerá à sua consulta agendada.</p>
        
        <div className="flex flex-col gap-4">
          <Button 
            className="w-full h-12 text-lg bg-green-600 hover:bg-green-700" 
            onClick={() => handleAction('CONFIRM')}
            disabled={status === "LOADING"}
          >
            Sim, eu comparecerei
          </Button>
          <Button 
            variant="outline" 
            className="w-full h-12 text-lg text-red-600 border-red-200 hover:bg-red-50" 
            onClick={() => handleAction('CANCEL')}
            disabled={status === "LOADING"}
          >
            Não poderei ir
          </Button>
        </div>
        {status === "ERROR" && <p className="text-red-500 mt-4 text-sm">Ocorreu um erro. Tente novamente.</p>}
      </div>
    </div>
  );
}
