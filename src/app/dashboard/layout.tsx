import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-5">
        <h2 className="text-xl font-bold mb-4">Agendify</h2>
        <nav>
          <ul>
            <li>
              <a
                href="/dashboard"
                className="block p-2 hover:bg-gray-700 rounded"
              >
                Início
              </a>
            </li>
            <li>
              <a
                href="/dashboard/bookings"
                className="block p-2 hover:bg-gray-700 rounded"
              >
                Agendamentos
              </a>
            </li>
            <li>
              <a
                href="/dashboard/profile"
                className="block p-2 hover:bg-gray-700 rounded"
              >
                Perfil
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 p-5 bg-gray-100">
        {children} {/* Renderiza o conteúdo da página atual */}
      </main>
    </div>
  );
}
