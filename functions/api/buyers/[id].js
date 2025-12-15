export async function onRequest(context) {
  const { request, env, params } = context;
  const buyerId = String(params.id);

  if (request.method === "PATCH") {
    const body = await request.json();

    // Optional patch fields
    const patchBuyerName = body.buyerName != null ? String(body.buyerName).trim() : null;
    const patchBagsOfTen = body.bagsOfTen != null ? clampNonNegativeInteger(body.bagsOfTen) : null;
    const patchBagsOfTwenty = body.bagsOfTwenty != null ? clampNonNegativeInteger(body.bagsOfTwenty) : null;

    const patchPicked = body.orangesPicked != null ? (body.orangesPicked ? 1 : 0) : null;
    const patchPaid = body.orangesPaid != null ? (body.orangesPaid ? 1 : 0) : null;

    await env.DB.prepare(
      `
      UPDATE buyers SET
        buyer_name      = COALESCE(?2, buyer_name),
        bags_of_ten     = COALESCE(?3, bags_of_ten),
        bags_of_twenty  = COALESCE(?4, bags_of_twenty),
        oranges_picked  = COALESCE(?5, oranges_picked),
        oranges_paid    = COALESCE(?6, oranges_paid)
      WHERE id = ?1
      `
    )
      .bind(buyerId, patchBuyerName, patchBagsOfTen, patchBagsOfTwenty, patchPicked, patchPaid)
      .run();

    const row = await env.DB.prepare(
      `
      SELECT
        id,
        buyer_name as buyerName,
        bags_of_ten as bagsOfTen,
        bags_of_twenty as bagsOfTwenty,
        oranges_picked as orangesPicked,
        oranges_paid as orangesPaid,
        created_at_iso as createdAtIso
      FROM buyers
      WHERE id = ?1
      `
    )
      .bind(buyerId)
      .first();

    if (!row) return new Response("Not Found", { status: 404 });
    return json(row);
  }

  if (request.method === "DELETE") {
    await env.DB.prepare(`DELETE FROM buyers WHERE id = ?1`).bind(buyerId).run();
    return new Response(null, { status: 204 });
  }

  return new Response("Method Not Allowed", { status: 405 });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function clampNonNegativeInteger(value) {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) return 0;
  return Math.max(0, Math.trunc(numberValue));
}
