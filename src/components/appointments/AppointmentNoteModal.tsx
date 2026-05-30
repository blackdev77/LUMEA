"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button/Button";
import { toast } from "react-hot-toast";

interface AppointmentNoteModalProps {
  appointmentId: string;
  initialContent?: string;
  onClose: () => void;
  onSaved: () => void;
}

export function AppointmentNoteModal({ appointmentId, initialContent = "", onClose, onSaved }: AppointmentNoteModalProps) {
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId, content }),
      });

      if (!res.ok) throw new Error("Erro ao salvar prontuário");
      
      toast.success("Prontuário salvo com sucesso!");
      onSaved();
    } catch (error) {
      toast.error("Ocorreu um erro ao salvar o prontuário.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Prontuário da Consulta</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">&times;</button>
        </div>
        
        <div className="flex-1 overflow-y-auto mb-4">
          <textarea
            className="w-full h-64 p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            placeholder="Digite as anotações clínicas, evolução do paciente, medicamentos prescritos..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        
        <div className="flex justify-end gap-3 pt-4 border-t mt-auto">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave} disabled={loading || !content.trim()}>
            {loading ? "Salvando..." : "Salvar Prontuário"}
          </Button>
        </div>
      </div>
    </div>
  );
}
