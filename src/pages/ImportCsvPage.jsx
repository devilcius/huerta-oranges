import { useMemo, useState } from "react";
import { parseBuyersCsv } from "../import/parseBuyersCsv";
import { createBuyer } from "../api/buyersApi";
import { buttonClass, secondaryButtonClass } from "../ui/ui";

export default function ImportCsvPage() {
  const [csvText, setCsvText] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resultMessage, setResultMessage] = useState("");

  const parsedRows = useMemo(() => {
    setErrorMessage("");
    setResultMessage("");
    if (!csvText.trim()) return [];
    try {
      return parseBuyersCsv(csvText);
    } catch (error) {
      setErrorMessage(String(error.message ?? error));
      return [];
    }
  }, [csvText]);

  const totalKilosPreview = useMemo(() => {
    return parsedRows.reduce((sum, row) => sum + row.bagsOfTen * 10 + row.bagsOfTwenty * 20, 0);
  }, [parsedRows]);

  async function onImport() {
    setIsImporting(true);
    setErrorMessage("");
    setResultMessage("");

    try {
      // sequential import: simplest + safe for D1
      let createdCount = 0;

      for (const row of parsedRows) {
        await createBuyer({
          buyerName: row.buyerName,
          bagsOfTen: row.bagsOfTen,
          bagsOfTwenty: row.bagsOfTwenty,
          orangesPicked: false,
          orangesPaid: false,
        });
        createdCount += 1;
      }

      setResultMessage(`Imported ${createdCount} buyers.`);
    } catch (error) {
      setErrorMessage(String(error.message ?? error));
    } finally {
      setIsImporting(false);
    }
  }

  async function onFileSelected(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setCsvText(text);
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Importar CSV</h2>
        <p className="mt-1 text-sm text-slate-600">
          Pega el CSV (separado por punto y coma) o sube un archivo .csv.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <input type="file" accept=".csv,text/csv" onChange={onFileSelected} />
        <button type="button" className={secondaryButtonClass} onClick={() => setCsvText("")}>
          Limpiar
        </button>
      </div>

      <textarea
        value={csvText}
        onChange={(e) => setCsvText(e.target.value)}
        placeholder="Paste your CSV here…"
        className="w-full min-h-[220px] rounded-xl border border-slate-200 p-3 font-mono text-xs outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
      />

      {errorMessage ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800 text-sm">
          {errorMessage}
        </div>
      ) : null}

      {parsedRows.length > 0 ? (
        <div className="rounded-2xl border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 flex justify-between">
            <div>Vista previa ({parsedRows.length} compradores)</div>
            <div className="text-slate-600 font-medium">Total kilos: {totalKilosPreview} kg</div>
          </div>

          <div className="max-h-[360px] overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white border-b border-slate-200">
                <tr className="text-left text-xs uppercase tracking-wide text-slate-600">
                  <th className="px-4 py-2">Nombre</th>
                  <th className="px-4 py-2">Bolsas 10</th>
                  <th className="px-4 py-2">Bolsas 20</th>
                  <th className="px-4 py-2">Kilos</th>
                </tr>
              </thead>
              <tbody>
                {parsedRows.map((row, index) => (
                  <tr key={`${row.buyerName}-${index}`} className="border-b border-slate-100">
                    <td className="px-4 py-2">{row.buyerName}</td>
                    <td className="px-4 py-2">{row.bagsOfTen}</td>
                    <td className="px-4 py-2">{row.bagsOfTwenty}</td>
                    <td className="px-4 py-2">{row.bagsOfTen * 10 + row.bagsOfTwenty * 20}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 flex items-center justify-between">
            <div className="text-xs text-slate-600">
              Los compradores importados comenzarán con: recogido = false, pagado = false
            </div>
            <button
              type="button"
              className={buttonClass}
              onClick={onImport}
              disabled={isImporting || parsedRows.length === 0}
            >
              {isImporting ? "Importando…" : "Importar"}
            </button>
          </div>
        </div>
      ) : null}

      {resultMessage ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800 text-sm">
          {resultMessage}
        </div>
      ) : null}
    </div>
  );
}
