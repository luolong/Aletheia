import { Handlers } from "$fresh/server.ts";
import { proxy } from "impl/proxy.ts";

export const handler: Handlers = {
  async GET(req, _ctx) {
    const [_, query] = req.url.split("?", 1);
    const q = new URLSearchParams(query);
    const params = Object.fromEntries(q);
    const status = await proxy?.getAlerts(params);
    if (status) {
      return Response.json(status);
    }
    return Response.error();
  },
};
