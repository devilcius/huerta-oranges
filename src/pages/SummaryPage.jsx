import { useMemo } from "react";
import { useBuyers } from "../state/useBuyers";
import { computeSummary } from "../domain/summary";

function SummaryCard({ label, value, footer }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-2 text-3xl font-semibold text-slate-900">
        {value}
      </div>
      {footer ? (
        <div className="mt-2 text-sm text-slate-600">{footer}</div>
      ) : null}
    </div>
  );
}

export default function SummaryPage() {
  const { buyers, isLoading, loadError } = useBuyers();

  const summary = useMemo(
    () => computeSummary(buyers),
    [buyers]
  );

  if (loadError) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800 text-sm">
        Error al cargar resumen: {String(loadError.message ?? loadError)}
      </div>
    );
  }

  if (isLoading && buyers.length === 0) {
    return <div className="text-slate-600">Cargando…</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          Resumen
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Resumen de naranjas reservadas y pagos
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          label="Total kilos reservados"
          value={`${summary.totalKilos} kg`}
          footer="Basado en todos los compradores"
        />

        <SummaryCard
          label="Total pagado"
          value={`${summary.totalPaid} €`}
          footer="Pagos ya realizados"
        />

        <SummaryCard
          label="Total por pagar"
          value={`${summary.totalToBePaid} €`}
          footer="Pagos pendientes"
        />
      </div>
    </div>
  );
}
