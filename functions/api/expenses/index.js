export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === "GET") {
    const { results } = await env.DB.prepare(
      `
      SELECT
        id,
        description,
        amount_cents as amountCents,
        created_at_iso as createdAtIso
      FROM expenses
      ORDER BY created_at_iso DESC
      `
    ).all();

    return json(results);
  }

  if (request.method === "POST") {
    const body = await request.json();

    const description = String(body.description ?? "").trim();
    const amountCents = parseAmountCents(body.amountEuros);

    if (!description) {
      return json({ error: "description is required" }, 400);
    }

    if (amountCents <= 0) {
      return json({ error: "amountEuros must be greater than 0" }, 400);
    }

    const id = crypto.randomUUID();
    const createdAtIso = new Date().toISOString();

    await env.DB.prepare(
      `
      INSERT INTO expenses (id, description, amount_cents, created_at_iso)
      VALUES (?1, ?2, ?3, ?4)
      `
    )
      .bind(id, description, amountCents, createdAtIso)
      .run();

    return json(
      {
        id,
        description,
        amountCents,
        amountEuros: centsToEuros(amountCents),
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

function parseAmountCents(value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return 0;
  return Math.round(numericValue * 100);
}

function centsToEuros(cents) {
  return (Number(cents) || 0) / 100;
}
