"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button/Button";
import { NewAppointmentModal } from "./NewAppointmentModal";

interface Props {
  customers: any[];
  services: any[];
}

export function NewAppointmentButton({ customers, services }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>+ Novo Agendamento</Button>
      <NewAppointmentModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        customers={customers}
        services={services}
      />
    </>
  );
}
