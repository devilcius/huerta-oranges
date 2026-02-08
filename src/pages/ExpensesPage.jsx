import { useMemo, useState } from "react";
import { useExpenses } from "../state/useExpenses";
import { buttonClass, inputClass, secondaryButtonClass } from "../ui/ui";

function formatEuros(amountEuros) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(Number(amountEuros) || 0);
}

export default function ExpensesPage() {
  const { expenses, isLoading, loadError, addExpense, removeExpense } = useExpenses();

  const [description, setDescription] = useState("");
  const [amountEuros, setAmountEuros] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const totalExpensesEuros = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + ((expense.amountCents || 0) / 100), 0);
  }, [expenses]);

  async function onSubmit(event) {
    event.preventDefault();

    setErrorMessage("");
    const parsedAmount = Number(amountEuros);

    if (!description.trim()) {
      setErrorMessage("La descripción es obligatoria.");
      return;
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage("El importe debe ser mayor que 0.");
      return;
    }

    setIsSaving(true);

    try {
      await addExpense({ description: description.trim(), amountEuros: parsedAmount });
      setDescription("");
      setAmountEuros("");
    } catch (error) {
      setErrorMessage(String(error.message ?? error));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Gastos</h2>
        <p className="mt-1 text-sm text-slate-600">
          Registra gastos para calcular el balance neto en el resumen.
        </p>
      </div>

      <form onSubmit={onSubmit} className="rounded-2xl border border-slate-200 p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_auto] gap-3 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700">Descripción</label>
            <input
              className={`${inputClass} mt-1`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Gasolina reparto"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Importe (€)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              className={`${inputClass} mt-1`}
              value={amountEuros}
              onChange={(e) => setAmountEuros(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <button type="submit" className={buttonClass} disabled={isSaving}>
            {isSaving ? "Guardando…" : "Añadir gasto"}
          </button>
        </div>

        {errorMessage ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800 text-sm">
            {errorMessage}
          </div>
        ) : null}
      </form>

      <div className="rounded-2xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 flex items-center justify-between gap-3">
          <div>Total gastos</div>
          <div>{formatEuros(totalExpensesEuros)}</div>
        </div>

        {loadError ? (
          <div className="m-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800 text-sm">
            Error al cargar gastos: {String(loadError.message ?? loadError)}
          </div>
        ) : null}

        {isLoading ? <div className="px-4 py-3 text-sm text-slate-600">Cargando…</div> : null}

        {!isLoading && expenses.length === 0 ? (
          <div className="px-4 py-4 text-sm text-slate-600">Todavía no hay gastos registrados.</div>
        ) : null}

        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="px-4 py-3 border-t border-slate-100 flex items-center justify-between gap-3"
          >
            <div>
              <div className="font-medium text-slate-900">{expense.description}</div>
              <div className="text-xs text-slate-500">
                {new Date(expense.createdAtIso).toLocaleString("es-ES")}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="font-semibold text-slate-900">
                {formatEuros((expense.amountCents || 0) / 100)}
              </div>
              <button
                type="button"
                className={secondaryButtonClass}
                onClick={async () => {
                  const ok = window.confirm("¿Quieres eliminar este gasto?");
                  if (!ok) return;

                  try {
                    await removeExpense(expense.id);
                  } catch (error) {
                    window.alert(
                      `No se pudo eliminar el gasto: ${String(error.message ?? error)}`
                    );
                  }
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
