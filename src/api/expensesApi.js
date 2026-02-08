async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: { "content-type": "application/json", ...(options.headers ?? {}) },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status} - ${text}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export function fetchExpenses() {
  return requestJson("/api/expenses", { method: "GET", headers: {} });
}

export function createExpense(payload) {
  return requestJson("/api/expenses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteExpense(expenseId) {
  return requestJson(`/api/expenses/${expenseId}`, { method: "DELETE" });
}
