function toIntegerOrZero(value) {
  if (value == null) return 0;
  const trimmed = String(value).trim();
  if (!trimmed) return 0;
  const numberValue = Number(trimmed.replace(",", "."));
  if (!Number.isFinite(numberValue)) return 0;
  return Math.max(0, Math.trunc(numberValue));
}

export function parseBuyersCsv(csvText) {
  const lines = String(csvText ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) return [];

  const header = lines[0].split(";").map((h) => h.trim().toLowerCase());

  const nameIndex = header.findIndex((h) => h.startsWith("nombre"));
  const bags10Index = header.findIndex((h) => h.includes("bolsas de 10"));
  const bags20Index = header.findIndex((h) => h.includes("bolsas de 20"));

  if (nameIndex < 0 || bags10Index < 0 || bags20Index < 0) {
    throw new Error("CSV headers not recognized. Expected: nombre; Nº DE BOLSAS DE 10; Nº DE BOLSAS DE 20");
  }

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const columns = lines[i].split(";");

    const buyerName = String(columns[nameIndex] ?? "").trim();
    if (!buyerName) continue;

    rows.push({
      buyerName,
      bagsOfTen: toIntegerOrZero(columns[bags10Index]),
      bagsOfTwenty: toIntegerOrZero(columns[bags20Index]),
    });
  }

  return rows;
}
