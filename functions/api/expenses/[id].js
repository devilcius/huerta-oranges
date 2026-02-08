export async function onRequest(context) {
  const { request, env, params } = context;
  const expenseId = String(params.id ?? "").trim();

  if (!expenseId) {
    return new Response("Bad Request", { status: 400 });
  }

  if (request.method === "DELETE") {
    await env.DB.prepare("DELETE FROM expenses WHERE id = ?1").bind(expenseId).run();
    return new Response(null, { status: 204 });
  }

  return new Response("Method Not Allowed", { status: 405 });
}
