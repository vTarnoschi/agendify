import Link from "next/link";
import { ReactNode } from "react";
import { CalendarCheck } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 sm:p-8">
      <Link 
        href="/" 
        className="flex flex-col items-center gap-3 mb-8 group cursor-pointer hover:opacity-90 transition-opacity"
      >
        <div className="h-12 w-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
          <CalendarCheck className="h-6 w-6" />
        </div>
        <span className="text-xl font-bold tracking-tight text-foreground">
          Agendify
        </span>
      </Link>

      <div className="w-full max-w-[400px]">
        {children}
      </div>
    </div>
  );
}
