import { onRequest as __api_buyers__id__js_onRequest } from "/home/marcos/code/orange-sales/functions/api/buyers/[id].js"
import { onRequest as __api_buyers_index_js_onRequest } from "/home/marcos/code/orange-sales/functions/api/buyers/index.js"

export const routes = [
    {
      routePath: "/api/buyers/:id",
      mountPath: "/api/buyers",
      method: "",
      middlewares: [],
      modules: [__api_buyers__id__js_onRequest],
    },
  {
      routePath: "/api/buyers",
      mountPath: "/api/buyers",
      method: "",
      middlewares: [],
      modules: [__api_buyers_index_js_onRequest],
    },
  ]