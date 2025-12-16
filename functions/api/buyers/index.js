export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === "GET") {
    const url = new URL(request.url);
    const name = (url.searchParams.get("name") ?? "").trim();

    const { results } = await env.DB.prepare(
      `
      SELECT
        id,
        buyer_name as buyerName,
        bags_of_ten as bagsOfTen,
        bags_of_twenty as bagsOfTwenty,
        oranges_picked as orangesPicked,
        oranges_paid as orangesPaid,
        paid_method as paidMethod,
        created_at_iso as createdAtIso
      FROM buyers
      WHERE (?1 = '' OR LOWER(buyer_name) LIKE '%' || LOWER(?1) || '%')
      ORDER BY created_at_iso DESC
      `
    )
      .bind(name)
      .all();

    return json(results);
  }

  if (request.method === "POST") {
    const body = await request.json();

    const buyerName = String(body.buyerName ?? "").trim();
    const bagsOfTen = clampNonNegativeInteger(body.bagsOfTen);
    const bagsOfTwenty = clampNonNegativeInteger(body.bagsOfTwenty);

    const id = crypto.randomUUID();
    const createdAtIso = new Date().toISOString();

    await env.DB.prepare(
      `
        INSERT INTO buyers (id, buyer_name, bags_of_ten, bags_of_twenty, oranges_picked, oranges_paid, paid_method, created_at_iso)
        VALUES (?1, ?2, ?3, ?4, 0, 0, NULL, ?5)
      `
    )
      .bind(id, buyerName, bagsOfTen, bagsOfTwenty, createdAtIso)
      .run();

    return json(
      {
        id,
        buyerName,
        bagsOfTen,
        bagsOfTwenty,
        orangesPicked: 0,
        orangesPaid: 0,
        paidMethod: null,
        createdAtIso,
      },
      201
    );
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
