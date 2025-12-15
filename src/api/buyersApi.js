async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: { "content-type": "application/json", ...(options.headers ?? {}) },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status} - ${text}`);
  }

  // 204 has no body
  if (response.status === 204) return null;
  return response.json();
}

export function fetchBuyers({ nameFilter }) {
  const params = new URLSearchParams();
  if (nameFilter?.trim()) params.set("name", nameFilter.trim());
  const url = `/api/buyers${params.toString() ? `?${params}` : ""}`;
  return requestJson(url, { method: "GET", headers: {} });
}

export function createBuyer(payload) {
  return requestJson("/api/buyers", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function patchBuyer(buyerId, patch) {
  return requestJson(`/api/buyers/${buyerId}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export function deleteBuyer(buyerId) {
  return requestJson(`/api/buyers/${buyerId}`, { method: "DELETE" });
}
