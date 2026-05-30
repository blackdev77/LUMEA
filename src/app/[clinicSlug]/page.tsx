import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { BookingWidget } from "@/components/booking/BookingWidget";

export default async function ClinicBookingPage(props: { params: Promise<{ clinicSlug: string }> }) {
  const params = await props.params;
  const clinicSlug = params.clinicSlug;

  const clinic = await prisma.clinic.findUnique({
    where: { slug: clinicSlug },
  });

  if (!clinic) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-muted/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-card rounded-full mx-auto border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
            <span className="text-3xl font-heading font-bold text-primary">
              {clinic.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{clinic.name}</h1>
          <p className="text-muted-foreground">Agende seu horário de forma rápida e fácil.</p>
        </div>

        <BookingWidget clinic={clinic} />
        
        <div className="text-center mt-12 text-sm text-muted-foreground">
          Powered by <span className="font-bold">LUMEA</span>
        </div>
      </div>
    </div>
  );
}
