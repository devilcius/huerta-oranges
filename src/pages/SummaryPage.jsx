import { useMemo, useState } from "react";
import { useBuyers } from "../state/useBuyers";
import { computeSummary } from "../domain/summary";
import { dangerButtonClass } from "../ui/ui";

function SummaryCard({ label, value, footer, accent = false }) {
  return (
    <div
      className={[
        "rounded-2xl border p-5 shadow-sm",
        accent
          ? "border-brand-200 bg-brand-50"
          : "border-slate-200 bg-white",
      ].join(" ")}
    >
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
  const { buyers, isLoading, loadError, clearAllBuyers } = useBuyers();
  const [isClearing, setIsClearing] = useState(false);

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
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          Resumen
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Resumen de naranjas reservadas y estado de los pagos
        </p>
      </div>

      {/* Totales generales */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          label="Total kilos reservados"
          value={`${summary.totalKilos} kg`}
          footer="Basado en todos los compradores"
          accent
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
      {/* Desglose de tipos de bolsa */}
      <div>
        <h3 className="text-lg font-semibold tracking-tight">
          Desglose por tipo de bolsa
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Cantidad de bolsas reservadas según su tamaño
        </p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SummaryCard
            label="Bolsas de 10 kg"
            value={`${summary.total10kgBags} bolsas`}
            footer="Cantidad de bolsas de 10 kg reservadas"
          />

          <SummaryCard
            label="Bolsas de 20 kg"
            value={`${summary.total20kgBags} bolsas`}
            footer="Cantidad de bolsas de 20 kg reservadas"
          />
        </div>
      </div>

      {/* Desglose de pagos */}
      <div>
        <h3 className="text-lg font-semibold tracking-tight">
          Desglose de pagos realizados
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Según el método de pago utilizado
        </p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SummaryCard
            label="Pagado por Bizum"
            value={`${summary.totalPaidBizum} €`}
            footer="Importe cobrado mediante Bizum"
          />

          <SummaryCard
            label="Pagado en efectivo"
            value={`${summary.totalPaidCash} €`}
            footer="Importe cobrado en metálico"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Zona peligrosa
          </h3>
          <p className="text-xs text-slate-500">
            Vacía toda la base de datos de compradores.
          </p>
        </div>
        <button
          type="button"
          className={dangerButtonClass}
          disabled={isClearing}
          onClick={async () => {
            const confirmed = window.confirm(
              "¿Seguro que quieres borrar TODOS los compradores? Esta acción no se puede deshacer."
            );
            if (!confirmed) return;
            setIsClearing(true);
            try {
              await clearAllBuyers();
            } catch (error) {
              window.alert(
                `No se pudo vaciar la base de datos: ${String(error?.message ?? error)}`
              );
            } finally {
              setIsClearing(false);
            }
          }}
        >
          Vaciar base de datos
        </button>
      </div>
    </div>
  );
}
