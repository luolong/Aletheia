import {
  AlertmanagerConfig,
  AlertmanagerStatus,
  CLUSTER_STATUS_VALUES,
  ClusterStatus,
  ClusterStatusValue,
  isAlertmanagerStatus,
  VersionInfo,
} from "impl/alertmanager/status.ts";

import {
  Alert,
  ALERT_STATUS_STATE_VALUES,
  AlertGroup,
  AlertStatus,
  AlertStatusState,
  GettableAlert,
  LabelSet,
} from "impl/alertmanager/alert.ts";

import { toURLSearchParams } from "impl/url.ts";
import { Receiver } from "impl/alertmanager/receiver.ts";

export interface HostAndPort {
  host: string;
  port: number;
}

export interface AlertmanagerStatusApi {
  getStatus(): Promise<AlertmanagerStatus | undefined>;
}

export interface AlertmanagerReceiversApi {
  getReceivers(): Promise<Receiver[] | undefined>;
}

export interface AlertmanagerAlertsApi {
  getAlerts(params: GetAlertsParams): Promise<GettableAlert[] | undefined>;

  getAlertGroups(
    params: GetAlertGroupsParams,
  ): Promise<AlertGroup[] | undefined>;
}

export interface AlertmanagerApi
  extends
    AlertmanagerStatusApi,
    AlertmanagerReceiversApi,
    AlertmanagerAlertsApi {
}

export class AlertmanagerAPI implements AlertmanagerApi {
  constructor(private baseURL: string) {}

  static async autodetect(): Promise<AlertmanagerApi | undefined> {
    let alertmanagerApi = undefined;

    alertmanagerApi = await autodetectFromEnvironment();
    if (alertmanagerApi !== undefined) {
      return alertmanagerApi;
    }

    alertmanagerApi = await autodetectLocalhost();
    if (alertmanagerApi !== undefined) {
      return alertmanagerApi;
    }
  }

  static async fromHostAndPort(hostAndPort: HostAndPort) {
    const { host, port } = hostAndPort;
    const baseUrl = `http://${host}:${port}/api/v2`;

    return await AlertmanagerAPI.fromBaseUrl(baseUrl);
  }

  static async fromBaseUrl(baseUrl: string) {
    const response = await fetch(`${baseUrl}/status`);
    if (response.ok) {
      const status = await response.json();
      if (isAlertmanagerStatus(status)) {
        return new AlertmanagerAPI(baseUrl);
      }
    }
  }

  /// Get current status of an Alertmanager instance and its cluster
  async getStatus() {
    const result = await fetch(`${this.baseURL}/status`);
    if (result.ok) {
      const status: AlertmanagerStatus = await result.json();
      return status;
    }
  }

  async getReceivers() {
    const result = await fetch(`${this.baseURL}/receivers`);
    if (result.ok) {
      const receivers: Receiver[] = await result.json();
      return receivers;
    }
  }

  /// Get a list of alerts
  async getAlerts(params: GetAlertsParams = {}) {
    const q = toURLSearchParams(params);
    const result = await fetch(
      `${this.baseURL}/alerts${q?.size ? "?" + q : ""}`,
    );
    if (result.ok) {
      const alerts: Array<GettableAlert> = await result.json();
      return alerts;
    }
  }

  /// Get a list of alert groups
  async getAlertGroups(params: GetAlertGroupsParams) {
    const q = toURLSearchParams(params);
    const result = await fetch(
      `${this.baseURL}/alerts${q?.size ? "?" + q : ""}`,
    );
    if (result.ok) {
      const alerts: Array<AlertGroup> = await result.json();
      return alerts;
    }
  }
}

export interface GetAlertsParams {
  /// Show active alerts
  active?: boolean;

  /// Show silenced alerts
  silenced?: boolean;

  /// Show inhibited alerts
  inhibited?: boolean;

  /// Show unprocessed alerts
  unprocessed?: boolean;

  /// A list of matchers to filter alerts by
  filter?: string[];

  /// A regex matching receivers to filter alerts by
  receiver?: string;
}

export interface GetAlertGroupsParams {
  /// Show active alerts
  active?: boolean;

  /// Show silenced alerts
  silenced?: boolean;

  /// Show silenced alerts
  inhibited?: boolean;

  /// A list of matchers to filter alerts by
  filter?: string[];

  /// A regex matching receivers to filter alerts by
  receiver: string;
}

async function autodetectFromEnvironment() {
  const env = Deno.env.toObject();
  // Lets try alertnamanger installes as part of Kuberentes Prostgres Operator
  const hostAndPort = Object.entries(env)
    .filter(([key, _]) =>
      key.endsWith("ALERTNAMAGER_SERVICE_HOST") ||
      key.endsWith("ALERTMANAGER_SERVICE_PORT")
    )
    .reduce((obj: Partial<HostAndPort>, [key, value]) => {
      if (key.endsWith("_PORT")) {
        obj.port = parseInt(value);
      } else if (key.endsWith("_HOST")) {
        obj.host = value;
      }
      return obj;
    }, {});

  if (isHostAndPortDefined(hostAndPort)) {
    return await AlertmanagerAPI.fromHostAndPort(hostAndPort).finally(() =>
      console.groupEnd()
    );
  }
}

async function autodetectLocalhost() {
  const baseUrl = "http://localhost:9093/api/v2";
  return await AlertmanagerAPI.fromBaseUrl(baseUrl).finally(() =>
    console.groupEnd()
  );
}

function isHostAndPortDefined(
  partial: Partial<HostAndPort>,
): partial is HostAndPort {
  return partial.host !== undefined && partial.port !== undefined;
}

// Re-expot everything
export type {
  Alert,
  ALERT_STATUS_STATE_VALUES,
  AlertGroup,
  AlertmanagerConfig,
  AlertmanagerStatus,
  AlertStatus,
  AlertStatusState,
  CLUSTER_STATUS_VALUES,
  ClusterStatus,
  ClusterStatusValue,
  GettableAlert,
  LabelSet,
  VersionInfo,
};
