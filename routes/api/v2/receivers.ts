import { Handlers } from "$fresh/server.ts";
import { proxy } from "impl/proxy.ts";

export const handler: Handlers = {
  async GET(_req, _ctx) {
    console.log("Get alertmanager receivers");
    const status = await proxy?.getReceivers();
    if (status) {
      return Response.json(status);
    }

    return Response.error();
  },
};
