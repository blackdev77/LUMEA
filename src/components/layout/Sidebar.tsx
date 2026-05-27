"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, Users, Settings, LogOut, Zap } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  user: any;
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Visão Geral", icon: LayoutDashboard },
    { href: "/dashboard/appointments", label: "Agendamentos", icon: Calendar },
    { href: "/dashboard/customers", label: "Clientes", icon: Users },
    { href: "/dashboard/settings", label: "Configurações", icon: Settings },
  ];

  return (
    <aside className="w-64 border-r bg-card flex flex-col h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b text-primary space-x-2">
        <Zap size={24} />
        <span className="font-heading font-bold text-xl tracking-tighter">LUMEA</span>
      </div>
      
      <div className="flex-1 py-6 px-4 space-y-1">
        <div className="px-2 mb-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Menu Principal
        </div>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon size={18} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
      
      <div className="p-4 border-t">
        <div className="flex items-center space-x-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium leading-none">{user?.name}</span>
            <span className="text-xs text-muted-foreground mt-1 truncate w-32">{user?.email}</span>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={18} />
          <span>Sair da conta</span>
        </button>
      </div>
    </aside>
  );
}
