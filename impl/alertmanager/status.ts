export function isAlertmanagerStatus(
  obj: unknown,
): obj is AlertmanagerStatus {
  const ams = obj as AlertmanagerStatus;
  return ams !== undefined &&
    isClusterStatus(ams.cluster) &&
    isVersionInfo(ams.versionInfo) &&
    isAlertmanagerConfig(ams.config) &&
    ams.uptime !== undefined;
}

export interface AlertmanagerStatus {
  cluster: ClusterStatus;
  versionInfo: VersionInfo;
  config: AlertmanagerConfig;
  uptime: Date;
}

function isClusterStatus(obj: unknown): obj is ClusterStatus {
  return isClusterStatusValue((obj as ClusterStatus)?.status);
}

export interface ClusterStatus {
  name?: string;
  status: ClusterStatusValue;
  peers?: PeerStatus[];
}

function isClusterStatusValue(v: unknown): v is ClusterStatusValue {
  return typeof v === "string" &&
    CLUSTER_STATUS_VALUES.includes(v as ClusterStatusValue);
}

export const CLUSTER_STATUS_VALUES = ["ready", "settling", "disabled"] as const;
export type ClusterStatusValue = typeof CLUSTER_STATUS_VALUES[number];

export interface PeerStatus {
  name: string;
  address: string;
}

function isVersionInfo(it: unknown): it is VersionInfo {
  const vi = it as VersionInfo;
  return vi !== undefined &&
    vi.version !== undefined &&
    vi.revision !== undefined &&
    vi.branch !== undefined &&
    vi.buildUser != undefined &&
    vi.buildDate !== undefined &&
    vi.goVersion !== undefined;
}

export interface VersionInfo {
  version: string;
  revision: string;
  branch: string;
  buildUser: string;
  buildDate: string;
  goVersion: string;
}

function isAlertmanagerConfig(it: unknown): it is AlertmanagerConfig {
  return it !== undefined && (it as AlertmanagerConfig).original !== undefined;
}

export interface AlertmanagerConfig {
  original: string;
}
