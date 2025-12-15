import { NavLink, Route, Routes } from "react-router-dom";
import BuyersListPage from "./pages/BuyersListPage";
import BuyerDetailPage from "./pages/BuyerDetailPage";
import NewBuyerPage from "./pages/NewBuyerPage";
import SummaryPage from "./pages/SummaryPage";

function TopLink({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "px-4 py-2 rounded-xl text-sm font-medium transition whitespace-nowrap",
          isActive ? "bg-slate-900 text-white shadow-sm" : "text-slate-700 hover:bg-slate-100",
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <header className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Naranjas de la huerta</h1>
              <p className="mt-1 text-sm text-slate-600">Bolsas: 10 (€16) · 20 (€30)</p>
            </div>

            <nav className="flex flex-wrap gap-2 bg-white border border-slate-200 rounded-2xl p-2 shadow-sm">
              <TopLink to="/">Compradores</TopLink>
              <TopLink to="/buyers/new">Nuevo comprador</TopLink>
              <TopLink to="/summary">Resumen</TopLink>
            </nav>
          </div>
        </header>

        <main className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-6">
          <Routes>
            <Route path="/" element={<BuyersListPage />} />
            <Route path="/buyers/new" element={<NewBuyerPage />} />
            <Route path="/buyers/:buyerId" element={<BuyerDetailPage />} />
            <Route path="/summary" element={<SummaryPage />} />
          </Routes>
        </main>

        <footer className="mt-6 text-xs text-slate-500">
          Base de datos compartida (Cloudflare D1). Los cambios son visibles en todos los navegadores.
        </footer>
      </div>
    </div>
  );
}
