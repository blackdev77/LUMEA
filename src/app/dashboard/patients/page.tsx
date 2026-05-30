import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table/Table";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NewPatientButton } from "@/components/patients/NewPatientModal";
import { Button } from "@/components/ui/Button/Button";
import { Edit2, Trash2 } from "lucide-react";
import Link from "next/link";

export default async function PatientsPage() {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({ where: { email: session?.user?.email as string } });
  
  const patients = await prisma.patient.findMany({
    where: { clinicId: user?.clinicId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pacientes</h1>
          <p className="text-muted-foreground">Gerencie a base de pacientes da sua clínica.</p>
        </div>
        <NewPatientButton />
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Nenhum paciente cadastrado.
                  </TableCell>
                </TableRow>
              ) : (
                patients.map(patient => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell>{patient.email || "-"}</TableCell>
                    <TableCell>{patient.phone || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Link href={`/dashboard/patients/${patient.id}`}>
                          <Button variant="outline" size="sm" className="text-primary border-primary/20 hover:bg-primary/10">
                            Ver Perfil
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
