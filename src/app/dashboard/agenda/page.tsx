import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card/Card";

export default function AgendaPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Agenda</h1>
        <p className="text-muted-foreground">Visualize os horários e disponibilidade.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Calendário</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">O componente de calendário completo será exibido aqui.</p>
        </CardContent>
      </Card>
    </div>
  );
}
