"use client";

import { useState } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Card } from "@/components/ui/Card/Card";

const locales = {
  "pt-BR": ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface Appointment {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: string;
  patientName: string;
  serviceName: string;
}

interface CalendarViewProps {
  initialAppointments: Appointment[];
}

export function CalendarView({ initialAppointments }: CalendarViewProps) {
  const [view, setView] = useState<any>(Views.WEEK);
  const [date, setDate] = useState(new Date());

  const eventStyleGetter = (event: Appointment) => {
    let backgroundColor = "#3b82f6"; // blue-500 default
    
    switch(event.status) {
      case "CONFIRMED": backgroundColor = "#22c55e"; break; // green-500
      case "PENDING": backgroundColor = "#eab308"; break; // yellow-500
      case "CANCELED": backgroundColor = "#ef4444"; break; // red-500
      case "NO_SHOW": backgroundColor = "#64748b"; break; // slate-500
      case "COMPLETED": backgroundColor = "#8b5cf6"; break; // violet-500
    }

    return {
      style: {
        backgroundColor,
        borderRadius: "4px",
        opacity: 0.9,
        color: "white",
        border: "0",
        display: "block",
        fontSize: "12px",
        fontWeight: "bold",
        padding: "2px 4px"
      }
    };
  };

  return (
    <Card className="p-4 h-[700px]">
      <Calendar
        localizer={localizer}
        events={initialAppointments}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        view={view}
        onView={setView}
        date={date}
        onNavigate={setDate}
        culture="pt-BR"
        messages={{
          next: "Próximo",
          previous: "Anterior",
          today: "Hoje",
          month: "Mês",
          week: "Semana",
          day: "Dia",
          agenda: "Agenda",
          date: "Data",
          time: "Hora",
          event: "Evento",
          noEventsInRange: "Não há agendamentos neste período.",
        }}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={(event) => {
          // Future implementation: Open modal with appointment details
          console.log("Selected event:", event);
        }}
      />
    </Card>
  );
}
