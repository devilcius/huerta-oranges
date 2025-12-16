import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useBuyers } from "../state/useBuyers";
import {
  buttonClass,
  dangerButtonClass,
  inputClass,
  secondaryButtonClass,
} from "../ui/ui";

function StatusPill({ ok, labelOk, labelNo }) {
  return (
    <span
      className={[
        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
        ok
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-slate-50 text-slate-600 border-slate-200",
      ].join(" ")}
    >
      {ok ? labelOk : labelNo}
    </span>
  );
}

function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
  label,
  description,
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="text-sm font-medium text-slate-900">{label}</div>
        {description ? (
          <div className="mt-0.5 text-xs text-slate-500">{description}</div>
        ) : null}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={[
          "relative inline-flex h-9 w-16 shrink-0 items-center rounded-full border transition",
          "focus:outline-none focus:ring-2 focus:ring-brand-500/20",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
          checked
            ? "bg-brand-500 border-brand-600"
            : "bg-slate-200 border-slate-300",
        ].join(" ")}
      >
        <span
          className={[
            "inline-block h-7 w-7 transform rounded-full bg-white shadow-sm transition",
            checked ? "translate-x-8" : "translate-x-1",
          ].join(" ")}
        />
      </button>
    </div>
  );
}

function SegmentedToggle({
  leftLabel,
  rightLabel,
  value, // "left" | "right"
  onChange,
  disabled = false,
  label,
  helper,
}) {
  function optionButton(optionValue, optionLabel) {
    const isActive = value === optionValue;

    return (
      <button
        type="button"
        disabled={disabled}
        aria-pressed={isActive}
        onClick={() => onChange(optionValue)}
        className={[
          "flex-1 sm:flex-none px-4 py-2 rounded-xl text-sm font-medium transition",
          "focus:outline-none focus:ring-2 focus:ring-brand-500/20",
          disabled ? "cursor-not-allowed" : "cursor-pointer",
          isActive
            ? "bg-brand-500 text-white shadow-sm"
            : "text-slate-700 hover:bg-white",
        ].join(" ")}
      >
        {optionLabel}
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <div>
        <div className="text-sm font-medium text-slate-900">{label}</div>
        {helper ? (
          <div className="mt-0.5 text-xs text-slate-500">{helper}</div>
        ) : null}
      </div>

      <div
        className={[
          "flex w-full sm:w-auto gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-1",
          disabled ? "opacity-60" : "",
        ].join(" ")}
      >
        {optionButton("left", leftLabel)}
        {optionButton("right", rightLabel)}
      </div>
    </div>
  );
}

export default function BuyerDetailPage() {
  const { buyerId } = useParams();
  const navigate = useNavigate();
  const {
    buyersById,
    updateBuyer,
    removeBuyer,
    refresh,
    isLoading,
    loadError,
  } = useBuyers();

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
        <p className="text-slate-700">
          {isLoading ? "Cargando…" : "Comprador no encontrado."}
        </p>
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

  const paidMethodValue =
    buyer.paidMethod === "cash" ? "left" : "right"; // left=Efectivo, right=Bizum

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            {buyer.buyerName || "(no name)"}
          </h2>
          <div className="mt-2 flex flex-wrap gap-2">
            <StatusPill
              ok={buyer.orangesPicked}
              labelOk="Recogido"
              labelNo="No recogido"
            />
            <StatusPill ok={buyer.orangesPaid} labelOk="Pagado" labelNo="No pagado" />
            {buyer.orangesPaid && buyer.paidMethod ? (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border bg-brand-50 text-brand-700 border-brand-200">
                {buyer.paidMethod === "bizum" ? "Bizum" : "Efectivo"}
              </span>
            ) : null}
          </div>
        </div>

        <Link className="text-sm text-slate-700 hover:underline" to="/">
          Volver a la lista
        </Link>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            Bolsas de 10
          </div>
          <div className="mt-1 text-2xl font-semibold">{bagsOfTen}</div>
          <div className="mt-1 text-sm text-slate-600">16 € cada una</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            Bolsas de 20
          </div>
          <div className="mt-1 text-2xl font-semibold">{bagsOfTwenty}</div>
          <div className="mt-1 text-sm text-slate-600">30 € cada una</div>
        </div>

        <div className="rounded-2xl border border-brand-200 bg-brand-500 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-white">
            Total
          </div>
          <div className="mt-1 text-2xl font-semibold text-white">€{totalPrice}</div>
          <div className="mt-1 text-sm text-white">
            Calculado a partir del número de bolsas
          </div>
        </div>
      </div>

      {/* Edit card */}
      <div className="rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-semibold text-slate-900">
            Detalles del pedido
          </div>
          {hasUnsavedChanges ? (
            <span className="text-xs font-medium rounded-full border border-brand-200 bg-brand-50 text-brand-700 px-2 py-1">
              Cambios sin guardar
            </span>
          ) : null}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-1">
            <label className="block text-sm font-medium text-slate-700">
              Nombre del comprador
            </label>
            <input
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              className={`${inputClass} mt-1`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Bolsas de 10 (16 €)
            </label>
            <input
              type="number"
              min="0"
              value={bagsOfTen}
              onChange={(e) => setBagsOfTen(e.target.value)}
              className={`${inputClass} mt-1`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Bolsas de 20 (30 €)
            </label>
            <input
              type="number"
              min="0"
              value={bagsOfTwenty}
              onChange={(e) => setBagsOfTwenty(e.target.value)}
              className={`${inputClass} mt-1`}
            />
          </div>
        </div>

        {/* Status switches */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <ToggleSwitch
              checked={buyer.orangesPicked}
              onChange={(nextValue) =>
                updateBuyer(buyer.id, { orangesPicked: nextValue })
              }
              label="Naranjas recogidas"
              description="Marca si el pedido ya se ha recogido"
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-4">
            <ToggleSwitch
              checked={buyer.orangesPaid}
              onChange={(nextValue) =>
                updateBuyer(
                  buyer.id,
                  nextValue
                    ? {
                        orangesPaid: true,
                        paidMethod: buyer.paidMethod ?? "bizum",
                      }
                    : { orangesPaid: false, paidMethod: null }
                )
              }
              label="Naranjas pagadas"
              description="Marca si el pedido ya está pagado"
            />

            <SegmentedToggle
              label="Método de pago"
              helper={
                buyer.orangesPaid
                  ? "Elige cómo se ha realizado el pago"
                  : "Márcalo como pagado para seleccionar un método"
              }
              leftLabel="Efectivo"
              rightLabel="Bizum"
              value={paidMethodValue}
              disabled={!buyer.orangesPaid}
              onChange={(next) =>
                updateBuyer(buyer.id, {
                  paidMethod: next === "left" ? "cash" : "bizum",
                })
              }
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="text-xs text-slate-500">
            Los cambios en el estado (recogido/pagado) se guardan al momento.
            Los detalles del pedido requieren guardar.
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

            <button
              type="button"
              className={buttonClass}
              onClick={saveEdits}
              disabled={!hasUnsavedChanges || isSaving}
            >
              {isSaving ? "Guardando…" : "Guardar"}
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
