import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gray-100">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6">Agendify</h1>
        {children}
      </div>
    </div>
  );
}
