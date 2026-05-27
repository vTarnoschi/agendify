"use client";

import { useEffect, useState } from "react";
import { Paintbrush, Sparkles } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export function ThemeFlavorToggle() {
  const [flavor, setFlavor] = useState<"classic" | "midnight">("classic");

  useEffect(() => {
    // Carregar preferência inicial
    const saved = localStorage.getItem("theme-flavor") as "classic" | "midnight";
    if (saved === "midnight") {
      setFlavor("midnight");
      document.documentElement.setAttribute("data-theme", "midnight");
    }
  }, []);

  const changeFlavor = (newFlavor: "classic" | "midnight") => {
    setFlavor(newFlavor);
    localStorage.setItem("theme-flavor", newFlavor);
    if (newFlavor === "midnight") {
      document.documentElement.setAttribute("data-theme", "midnight");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative group">
          <Paintbrush className="h-[1.2rem] w-[1.2rem] transition-all group-hover:opacity-0" />
          <Sparkles className="absolute h-[1.2rem] w-[1.2rem] opacity-0 transition-all group-hover:opacity-100 text-primary" />
          <span className="sr-only">Toggle UI Flavor</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => changeFlavor("classic")}
          className={flavor === "classic" ? "font-bold bg-accent" : ""}
        >
          Agendify Classic
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => changeFlavor("midnight")}
          className={flavor === "midnight" ? "font-bold bg-accent text-primary" : ""}
        >
          Midnight Orange (Novo)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
