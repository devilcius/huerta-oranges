import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useBuyers } from "../state/useBuyers";
import { buttonClass, secondaryButtonClass } from "../ui/ui";

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

function Chip({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "px-3 py-1.5 rounded-full text-sm font-medium transition border",
        active
          ? "bg-brand-100 text-brand-700 border-brand-300"
          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function eurosForBuyer(buyer) {
  return (
    (Number(buyer.bagsOfTen) || 0) * 16 + (Number(buyer.bagsOfTwenty) || 0) * 30
  );
}

export default function BuyersListPage() {
  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | needs_picking | needs_payment

  const { buyers, isLoading, loadError } = useBuyers({ nameFilter });
  const navigate = useNavigate();

  const visibleBuyers = useMemo(() => {
    if (statusFilter === "needs_picking")
      return buyers.filter((b) => !b.orangesPicked);
    if (statusFilter === "needs_payment")
      return buyers.filter((b) => !b.orangesPaid);
    return buyers;
  }, [buyers, statusFilter]);

  const countNeedsPicking = useMemo(
    () => buyers.filter((b) => !b.orangesPicked).length,
    [buyers]
  );
  const countNeedsPayment = useMemo(
    () => buyers.filter((b) => !b.orangesPaid).length,
    [buyers]
  );

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700">
            Filtrar por nombre del comprador
          </label>
          <input
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            placeholder="Escribe un nombre…"
            className="mt-1 w-full sm:max-w-md rounded-xl border border-slate-200 px-3 py-2 outline-none
                       focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-3 text-sm text-slate-600">
          {isLoading ? <span>Cargando…</span> : null}
          <span>
            {visibleBuyers.length} mostrados / {buyers.length} en total
          </span>
        </div>
      </div>

      {/* Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <Chip
          active={statusFilter === "all"}
          onClick={() => setStatusFilter("all")}
        >
          Todos ({buyers.length})
        </Chip>
        <Chip
          active={statusFilter === "needs_picking"}
          onClick={() => setStatusFilter("needs_picking")}
        >
          Por recoger ({countNeedsPicking})
        </Chip>
        <Chip
          active={statusFilter === "needs_payment"}
          onClick={() => setStatusFilter("needs_payment")}
        >
          Por pagar ({countNeedsPayment})
        </Chip>
      </div>

      {loadError ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800 text-sm">
          Error al cargar compradores: {String(loadError.message ?? loadError)}
        </div>
      ) : null}

      {/* Empty state */}
      {buyers.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <div className="text-slate-900 font-medium">
            No hay compradores aún
          </div>
          <div className="mt-1 text-sm text-slate-600">
            Crea tu primer comprador para empezar a rastrear bolsas, recolección
            y pagos.
          </div>
          <div className="mt-4">
            <Link to="/buyers/new" className={buttonClass}>
              Nuevo comprador
            </Link>
          </div>
        </div>
      ) : visibleBuyers.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <div className="text-slate-900 font-medium">No hay coincidencias</div>
          <div className="mt-1 text-sm text-slate-600">
            Intenta limpiar los filtros o ajustar el filtro por nombre.
          </div>
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={secondaryButtonClass}
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Mobile: cards */}
          <div className="sm:hidden space-y-3">
            {visibleBuyers.map((buyer, index) => {
              const total = eurosForBuyer(buyer);

              return (
                <button
                  key={buyer.id}
                  type="button"
                  onClick={() => navigate(`/buyers/${buyer.id}`)}
                  className={[
                    "w-full text-left rounded-2xl border-l-4 p-4 transition",
                    index % 2 === 0
                      ? "bg-white border-l-brand-300 border-slate-200"
                      : "bg-slate-50/70 border-l-brand-400 border-slate-200",
                    "shadow-sm hover:bg-slate-100",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-3">
                    {/* Name: allow wrap; no harsh truncation */}
                    <div className="min-w-0">
                      <div className="text-base font-semibold text-slate-900 leading-snug break-words">
                        {buyer.buyerName || "(no name)"}
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <div className="text-xs uppercase tracking-wide text-slate-500">
                        Total
                      </div>
                      <div className="text-lg font-semibold text-slate-900">
                        €{total}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <div className="text-xs uppercase tracking-wide text-slate-500">
                        Bolsas 10
                      </div>
                      <div className="mt-1 text-lg font-semibold text-slate-900">
                        {buyer.bagsOfTen}
                      </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <div className="text-xs uppercase tracking-wide text-slate-500">
                        Bolsas 20
                      </div>
                      <div className="mt-1 text-lg font-semibold text-slate-900">
                        {buyer.bagsOfTwenty}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <StatusPill
                      ok={buyer.orangesPicked}
                      labelOk="Recogido"
                      labelNo="No recogido"
                    />
                    <StatusPill
                      ok={buyer.orangesPaid}
                      labelOk="Pagado"
                      labelNo="No pagado"
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Desktop/tablet: table */}
          <div className="hidden sm:block overflow-hidden rounded-2xl border border-slate-200">
            <div className="grid grid-cols-[2fr_0.8fr_0.8fr_0.9fr_1fr_1fr] gap-3 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
              <div>Comprador</div>
              <div>Bolsas 10</div>
              <div>Bolsas 20</div>
              <div>Total €</div>
              <div>Recogido</div>
              <div>Pagado</div>
            </div>

            {visibleBuyers.map((buyer) => {
              const total = eurosForBuyer(buyer);

              return (
                <button
                  key={buyer.id}
                  type="button"
                  onClick={() => navigate(`/buyers/${buyer.id}`)}
                  className="w-full text-left grid grid-cols-[2fr_0.8fr_0.8fr_0.9fr_1fr_1fr] gap-3 px-4 py-3 border-t border-slate-100 items-center
                           hover:bg-slate-50 focus:bg-slate-50 focus:outline-none"
                >
                  <div className="min-w-0">
                    <div className="font-medium text-slate-900 truncate">
                      {buyer.buyerName || "(no name)"}
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      Toca para abrir
                    </div>
                  </div>

                  <div className="text-slate-700">{buyer.bagsOfTen}</div>
                  <div className="text-slate-700">{buyer.bagsOfTwenty}</div>
                  <div className="font-semibold text-slate-900">€{total}</div>

                  <div>
                    <StatusPill
                      ok={buyer.orangesPicked}
                      labelOk="Recogido"
                      labelNo="No recogido"
                    />
                  </div>

                  <div>
                    <StatusPill
                      ok={buyer.orangesPaid}
                      labelOk="Pagado"
                      labelNo="No pagado"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
