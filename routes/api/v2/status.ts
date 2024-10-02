import { Handlers } from "$fresh/server.ts";
import { proxy } from "impl/proxy.ts";
import { AlertmanagerStatus } from "impl/alertmanager/status.ts";

export const handler: Handlers<AlertmanagerStatus> = {
  async GET(_req, _ctx) {
    console.log("Get alertmanager status");
    const status = await proxy?.getStatus();
    if (status) {
      return Response.json(status);
    }
    return Response.error();
  },
};
