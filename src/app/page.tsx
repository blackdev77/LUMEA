import Link from "next/link";
import { Button } from "@/components/ui/Button/Button";
import { Calendar, CheckCircle2, ChevronRight, LayoutDashboard, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar Publica */}
      <nav className="fixed top-0 w-full z-50 glass border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-heading font-bold text-2xl tracking-tighter">LUMEA</div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#recursos" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Recursos</Link>
            <Link href="#precos" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Preços</Link>
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">Entrar</Link>
            <Link href="/register">
              <Button size="sm">Teste Grátis</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:pt-48 md:pb-32 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-blue-400/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="flex flex-col space-y-6 text-center md:text-left">
            <div className="inline-flex items-center space-x-2 bg-muted/50 border rounded-full px-3 py-1 w-fit mx-auto md:mx-0">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-xs font-medium">Nova Experiência em Agendamentos</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-heading tracking-tighter leading-[1.1]">
              O agendamento premium que a sua <span className="text-gradient">clínica merece.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto md:mx-0">
              A plataforma completa para clínicas, salões e consultórios que não abrem mão de uma experiência sofisticada. Receba agendamentos 24/7 e gerencie sua agenda com perfeição.
            </p>
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start pt-4">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full group">
                  Comece Gratuitamente 
                  <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full">
                  Acessar minha conta
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="relative mx-auto w-full max-w-lg md:max-w-none perspective-1000">
            <div className="glass rounded-xl border p-2 shadow-2xl transform md:rotate-y-12 md:rotate-x-12 hover:rotate-0 transition-transform duration-700">
              <div className="bg-card rounded-lg overflow-hidden border">
                <div className="h-8 bg-muted flex items-center px-4 space-x-2 border-b">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="p-4 grid grid-cols-4 gap-4 h-[400px]">
                  <div className="col-span-1 border-r space-y-4">
                    <div className="h-4 w-3/4 bg-muted rounded"></div>
                    <div className="h-4 w-1/2 bg-muted rounded"></div>
                    <div className="h-4 w-2/3 bg-muted rounded"></div>
                  </div>
                  <div className="col-span-3 space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-24 bg-primary/10 rounded-lg border border-primary/20"></div>
                      <div className="h-24 bg-primary/10 rounded-lg border border-primary/20"></div>
                      <div className="h-24 bg-primary/10 rounded-lg border border-primary/20"></div>
                    </div>
                    <div className="h-64 bg-muted/30 rounded-lg border border-dashed flex items-center justify-center text-muted-foreground">
                      <Calendar size={48} className="opacity-20" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="recursos" className="py-24 bg-muted/30 border-t">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold font-heading">Tudo que você precisa em um só lugar</h2>
            <p className="text-muted-foreground">Mais que uma agenda, o LUMEA é o seu parceiro de gestão diária.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-card p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
                <Calendar size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Agenda Inteligente</h3>
              <p className="text-muted-foreground text-sm">Gerencie os horários de múltiplos profissionais e salas sem conflitos. Tudo organizado visualmente.</p>
            </div>
            
            <div className="bg-card p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
                <Zap size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Agendamento 24/7</h3>
              <p className="text-muted-foreground text-sm">Seu paciente agenda pelo link exclusivo da sua clínica a qualquer hora do dia ou da noite.</p>
            </div>

            <div className="bg-card p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Lembretes Automáticos</h3>
              <p className="text-muted-foreground text-sm">Reduza faltas em até 80% com notificações automáticas via WhatsApp e E-mail.</p>
            </div>

            <div className="bg-card p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
                <LayoutDashboard size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Dashboard Financeiro</h3>
              <p className="text-muted-foreground text-sm">Acompanhe seu faturamento diário, repasses de profissionais e crescimento do negócio.</p>
            </div>
          </div>
        </div>
      </section>
      {/* Pricing Section */}
      <section id="precos" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold font-heading">Planos transparentes para a sua clínica</h2>
            <p className="text-muted-foreground">Escolha o plano ideal e eleve a experiência dos seus clientes.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Plano Básico */}
            <div className="bg-card p-8 rounded-3xl border shadow-sm flex flex-col">
              <h3 className="font-bold text-2xl mb-2">Básico</h3>
              <p className="text-muted-foreground mb-6 text-sm">Ideal para profissionais autônomos iniciando.</p>
              <div className="mb-8">
                <span className="text-4xl font-bold font-heading">R$ 49</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center text-sm">
                  <CheckCircle2 size={18} className="text-primary mr-3" /> Agenda Inteligente
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle2 size={18} className="text-primary mr-3" /> Até 100 agendamentos/mês
                </li>
                <li className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle2 size={18} className="mr-3 opacity-50" /> Link de reserva público
                </li>
              </ul>
              <Link href="/register" className="w-full">
                <Button variant="outline" className="w-full h-12 rounded-xl">Começar Básico</Button>
              </Link>
            </div>

            {/* Plano Premium */}
            <div className="bg-card p-8 rounded-3xl border-2 border-primary shadow-xl relative flex flex-col transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Mais Popular
              </div>
              <h3 className="font-bold text-2xl mb-2">Premium</h3>
              <p className="text-muted-foreground mb-6 text-sm">A solução completa para clínicas de alto nível.</p>
              <div className="mb-8">
                <span className="text-4xl font-bold font-heading text-primary">R$ 149</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center text-sm">
                  <CheckCircle2 size={18} className="text-primary mr-3" /> Agendamentos ilimitados
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle2 size={18} className="text-primary mr-3" /> Profissionais ilimitados
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle2 size={18} className="text-primary mr-3" /> Lembretes automáticos (WhatsApp)
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle2 size={18} className="text-primary mr-3" /> Dashboard financeiro completo
                </li>
              </ul>
              <Link href="/register" className="w-full">
                <Button className="w-full h-12 rounded-xl">Teste Grátis por 14 dias</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Público */}
      <footer className="mt-auto py-12 border-t bg-card">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <h2 className="font-heading font-bold text-xl tracking-tighter">LUMEA</h2>
            <p className="text-sm text-muted-foreground">O futuro do agendamento premium.</p>
          </div>
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} LUMEA SaaS. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
