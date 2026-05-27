"use client";

import { ReactNode } from "react";

import { AppSidebar } from "~/components/app-sidebar";
import { ThemeToggle } from "~/components/theme-toggle";
import { ThemeFlavorToggle } from "~/components/theme-flavor-toggle";


import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "~/components/ui/sidebar";

export default function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 lg:px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
          </div>
          <div className="flex items-center gap-2">
            <ThemeFlavorToggle />
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
