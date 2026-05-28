"use client";

import Link from "next/link";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { ChevronsUpDown, LogOut, Settings, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { user, isLoaded } = useUser();

  if (!isLoaded || !user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex items-center gap-2 p-2 rounded-lg animate-pulse">
            <div className="h-8 w-8 rounded-lg bg-muted shrink-0" />
            <div className="grow flex flex-col justify-center space-y-1.5 min-w-0">
              <div className="h-3.5 w-24 bg-muted rounded-md" />
              <div className="h-2.5 w-36 bg-muted rounded-md" />
            </div>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  const name =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
    user.username ||
    "Usuário";
  const email = user.primaryEmailAddress?.emailAddress || "";
  const avatar = user.imageUrl;
  const parts = name.split(" ").filter(Boolean);
  const initials =
    parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {user.hasImage && <AvatarImage src={avatar} alt={name} />}
                <AvatarFallback className="rounded-lg bg-primary text-primary-foreground font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{name}</span>
                <span className="truncate text-xs">{email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {user.hasImage && <AvatarImage src={avatar} alt={name} />}
                  <AvatarFallback className="rounded-lg bg-primary text-primary-foreground font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{name}</span>
                  <span className="truncate text-xs">{email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link
                href="/dashboard/account"
                className="flex items-center w-full"
              >
                <User className="mr-2 h-4 w-4" />
                Minha Conta
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link
                href="/dashboard/settings"
                className="flex items-center w-full"
              >
                <Settings className="mr-2 h-4 w-4" />
                Configurações do Negócio
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <SignOutButton redirectUrl="/sign-in">
              <DropdownMenuItem className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </SignOutButton>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
