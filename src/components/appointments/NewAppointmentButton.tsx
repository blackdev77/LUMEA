"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button/Button";
import { NewAppointmentModal } from "./NewAppointmentModal";

interface Props {
  patients: any[];
  services: any[];
}

export function NewAppointmentButton({ patients, services }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>+ Novo Agendamento</Button>
      <NewAppointmentModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        patients={patients}
        services={services}
      />
    </>
  );
}
