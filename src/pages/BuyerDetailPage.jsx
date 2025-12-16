import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useBuyers } from "../state/useBuyers";
import { buttonClass, dangerButtonClass, inputClass, secondaryButtonClass } from "../ui/ui";

function StatusPill({ ok, labelOk, labelNo }) {
  return (
    <span
      className={[
        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
        ok ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-600 border-slate-200",
      ].join(" ")}
    >
      {ok ? labelOk : labelNo}
    </span>
  );
}

export default function BuyerDetailPage() {
  const { buyerId } = useParams();
  const navigate = useNavigate();
  const { buyersById, updateBuyer, removeBuyer, refresh, isLoading, loadError } = useBuyers();

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buyer = useMemo(() => buyersById.get(buyerId), [buyersById, buyerId]);

  const [buyerName, setBuyerName] = useState("");
  const [bagsOfTen, setBagsOfTen] = useState(0);
  const [bagsOfTwenty, setBagsOfTwenty] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!buyer) return;
    setBuyerName(buyer.buyerName ?? "");
    setBagsOfTen(Number(buyer.bagsOfTen ?? 0));
    setBagsOfTwenty(Number(buyer.bagsOfTwenty ?? 0));
  }, [buyer]);

  if (loadError) {
    return (
      <div className="space-y-3">
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800 text-sm">
          Error al cargar: {String(loadError.message ?? loadError)}
        </div>
        <Link className="text-sm text-slate-700 hover:underline" to="/">
          Volver a la lista
        </Link>
      </div>
    );
  }

  if (!buyer) {
    return (
      <div className="space-y-2">
        <p className="text-slate-700">{isLoading ? "Cargando…" : "Comprador no encontrado."}</p>
        <Link className="text-sm text-slate-700 hover:underline" to="/">
          Volver a la lista
        </Link>
      </div>
    );
  }

  const totalPrice = Number(bagsOfTen) * 16 + Number(bagsOfTwenty) * 30;

  async function saveEdits() {
    setIsSaving(true);
    try {
      await updateBuyer(buyer.id, {
        buyerName: buyerName.trim(),
        bagsOfTen: Number(bagsOfTen) || 0,
        bagsOfTwenty: Number(bagsOfTwenty) || 0,
      });
    } finally {
      setIsSaving(false);
    }
  }

  const hasUnsavedChanges =
    buyerName !== (buyer.buyerName ?? "") ||
    Number(bagsOfTen) !== Number(buyer.bagsOfTen ?? 0) ||
    Number(bagsOfTwenty) !== Number(buyer.bagsOfTwenty ?? 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">{buyer.buyerName || "(no name)"}</h2>
          <div className="mt-2 flex gap-2">
            <StatusPill ok={buyer.orangesPicked} labelOk="Recogido" labelNo="No recogido" />
            <StatusPill ok={buyer.orangesPaid} labelOk="Pagado" labelNo="No pagado" />
          </div>
        </div>

        <Link className="text-sm text-slate-700 hover:underline" to="/">
          Volver a la lista
        </Link>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">Bolsas de 10</div>
          <div className="mt-1 text-2xl font-semibold">{bagsOfTen}</div>
          <div className="mt-1 text-sm text-slate-600">€16 cada una</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">Bolsas de 20</div>
          <div className="mt-1 text-2xl font-semibold">{bagsOfTwenty}</div>
          <div className="mt-1 text-sm text-slate-600">€30 cada una</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-900 p-4 text-white">
          <div className="text-xs font-semibold uppercase tracking-wide text-white/70">Total</div>
          <div className="mt-1 text-2xl font-semibold">€{totalPrice}</div>
          <div className="mt-1 text-sm text-white/70">Calculado a partir del número de bolsas</div>
        </div>
      </div>

      {/* Edit card */}
      <div className="rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-4">
        <div className="text-sm font-semibold text-slate-900">Detalles del pedido</div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-1">
            <label className="block text-sm font-medium text-slate-700">Nombre del comprador</label>
            <input value={buyerName} onChange={(e) => setBuyerName(e.target.value)} className={`${inputClass} mt-1`} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Bolsas de 10 (€16)</label>
            <input
              type="number"
              min="0"
              value={bagsOfTen}
              onChange={(e) => setBagsOfTen(e.target.value)}
              className={`${inputClass} mt-1`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Bolsas de 20 (€30)</label>
            <input
              type="number"
              min="0"
              value={bagsOfTwenty}
              onChange={(e) => setBagsOfTwenty(e.target.value)}
              className={`${inputClass} mt-1`}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex gap-4">
            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300"
                checked={buyer.orangesPicked}
                onChange={(e) => updateBuyer(buyer.id, { orangesPicked: e.target.checked })}
              />
              Naranjas recogidas
            </label>

            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300"
                checked={buyer.orangesPaid}
                onChange={(e) => updateBuyer(buyer.id, { orangesPaid: e.target.checked })}
              />
              Naranjas pagadas
            </label>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              className={secondaryButtonClass}
              onClick={() => {
                setBuyerName(buyer.buyerName ?? "");
                setBagsOfTen(Number(buyer.bagsOfTen ?? 0));
                setBagsOfTwenty(Number(buyer.bagsOfTwenty ?? 0));
              }}
              disabled={!hasUnsavedChanges || isSaving}
            >
              Restablecer
            </button>

            <button type="button" className={buttonClass} onClick={saveEdits} disabled={!hasUnsavedChanges || isSaving}>
              {isSaving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="flex justify-end">
        <button
          type="button"
          className={dangerButtonClass}
          onClick={async () => {
            await removeBuyer(buyer.id);
            navigate("/");
          }}
        >
          Borrar comprador
        </button>
      </div>
    </div>
  );
}
