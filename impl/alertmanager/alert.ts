import { Receiver } from "./receiver.ts";

export interface Alert {
  labels: LabelSet;
  generatorURL?: string;
}

export interface GettableAlert extends Alert {
  annotations: LabelSet;
  receivers: Array<Receiver>;
  fingerprint: string;
  startsAt: Date;
  updatedAt: Date;
  endsAt: Date;
  status: AlertStatus;
}

export interface AlertGroup {
  labels: LabelSet;
  receiver: Array<Receiver>;
  alerts: Array<GettableAlert>;
}

export interface AlertStatus {
  state: AlertStatusState;
  silencedBy: Array<string>;
  inhibitedBy: Array<string>;
}

export const ALERT_STATUS_STATE_VALUES = [
  "unprocessed",
  "active",
  "suppressed",
] as const;
export type AlertStatusState = (typeof ALERT_STATUS_STATE_VALUES)[number];

export interface LabelSet {
  [name: string]: string;
}
