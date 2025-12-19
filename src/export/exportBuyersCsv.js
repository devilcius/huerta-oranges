function escapeCsvCell(value) {
  const text = String(value ?? "");
  // CSV-safe even with semicolons/newlines/quotes
  if (/[;"\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function buyersToCsv(buyers) {
  const header = [
    "nombre",
    "bolsas_10",
    "bolsas_20",
    "recogido",
    "pagado",
    "metodo_pago",
  ];

  const rows = buyers.map((buyer) => {
    const metodo =
      buyer.orangesPaid && buyer.paidMethod
        ? buyer.paidMethod === "bizum"
          ? "BIZUM"
          : "EFECTIVO"
        : "";

    return [
      buyer.buyerName ?? "",
      Number(buyer.bagsOfTen ?? 0),
      Number(buyer.bagsOfTwenty ?? 0),
      buyer.orangesPicked ? "SI" : "NO",
      buyer.orangesPaid ? "SI" : "NO",
      metodo,
    ].map(escapeCsvCell);
  });

  return [header.map(escapeCsvCell).join(";"), ...rows.map((r) => r.join(";"))].join("\n");
}

export function downloadTextFile({ filename, text, mimeType }) {
  const blob = new Blob([text], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
}
