"use client";

import { Home, Settings, Users, CalendarCheck } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";

import { NavUser } from "~/components/nav-user";
import { NavMain } from "~/components/nav-main";
import { useRole } from "~/hooks/use-role";

// Menu items.
const data = {
  items: [
    {
      title: "Visão Geral",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Clientes",
      url: "/dashboard/clients",
      icon: Users,
      providerOnly: true,
    },
    {
      title: "Configurações",
      url: "/dashboard/settings",
      icon: Settings,
    },
  ],
};

export function AppSidebar() {
  const { role: clerkRole } = useRole();
  const role = clerkRole || "provider"; // Fallback para provider evita flicker durante carregamento do Clerk nas rotas do dashboard

  // Filtra os itens: se for providerOnly, o usuário deve ser provider
  const filteredItems = data.items.filter((item) => {
    if (item.providerOnly) {
      return role === "provider";
    }
    return true;
  });

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <CalendarCheck className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Agendify</span>
                  {/* <span className="truncate text-xs">Enterprise</span> */}
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
