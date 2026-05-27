import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table/Table";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NewCustomerButton } from "@/components/customers/NewCustomerModal";
import { Button } from "@/components/ui/Button/Button";
import { Edit2, Trash2 } from "lucide-react";

export default async function CustomersPage() {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({ where: { email: session?.user?.email as string } });
  
  const customers = await prisma.customer.findMany({
    where: { companyId: user?.companyId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">Gerencie a base de clientes do seu negócio.</p>
        </div>
        <NewCustomerButton />
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
              {customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Nenhum cliente cadastrado.
                  </TableCell>
                </TableRow>
              ) : (
                customers.map(customer => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.email || "-"}</TableCell>
                    <TableCell>{customer.phone || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <Edit2 size={14} className="text-muted-foreground" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-red-200 hover:bg-red-50">
                          <Trash2 size={14} className="text-red-500" />
                        </Button>
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
