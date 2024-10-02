import {
  AlertmanagerAlertsApi,
  AlertmanagerAPI,
  AlertmanagerApi,
  AlertmanagerReceiversApi,
  AlertmanagerStatus,
  AlertmanagerStatusApi,
  GetAlertsParams,
  GettableAlert,
} from "impl/alertmanager/api.ts";
import { Receiver } from "impl/alertmanager/receiver.ts";

class AlertmanagerProxy
  implements
    AlertmanagerStatusApi,
    AlertmanagerReceiversApi,
    AlertmanagerAlertsApi {
  // Lazily initializecd at forst access
  private target: AlertmanagerApi | undefined;

  // deno-lint-ignore require-await
  private async getApi(): Promise<AlertmanagerApi> {
    if (this.target) {
      console.log("Fetching already initialized api instance");
      return Promise.resolve(this.target);
    }

    console.log("No API initialized. Autodetecting...");
    return AlertmanagerAPI.autodetect().then((api) => {
      if (api) {
        console.log("API inscance autodetected...");
        this.target = api;
        return Promise.resolve(api);
      }
      return Promise.reject("Could not autodetect alertmanager api");
    });
  }

  async getStatus(): Promise<AlertmanagerStatus | undefined> {
    const api = await this.getApi();
    return await api.getStatus();
  }

  async getReceivers(): Promise<Receiver[] | undefined> {
    const api = await this.getApi();
    return await api.getReceivers();
  }

  async getAlerts(
    params: GetAlertsParams = {},
  ): Promise<GettableAlert[] | undefined> {
    const api = await this.getApi();
    return await api.getAlerts(params);
  }

  async getAlertGroups(
    params: GetAlertGroupsParams,
  ): Promise<AlertGroup[] | undefined> {
    const api = await this.getApi();
    return await api.getAlertGroups(params);
  }
}
export const proxy = new AlertmanagerProxy();

export default proxy;
