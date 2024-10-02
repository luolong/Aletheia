import { AlertStatus as GettableAlertStatus } from "impl/alertmanager/alert.ts";

export const ALERT_STATUS_VALUES = ["firing", "silenced", "resolved"] as const;

export const ALERT_SEVERITY_VALUES = [
  "info",
  "warning",
  "error",
  "critical",
] as const;

export type AlertSeverity = typeof ALERT_SEVERITY_VALUES[number];
export type AlertStatus = typeof ALERT_STATUS_VALUES[number];

export interface AlertProps {
  severity?: AlertSeverity;
  status?: AlertStatus;
  title?: string;
  description?: string;
}

/// Interactive alert panel.
/// This panel displays current alert status of the given alert with
/// a graph of the underlyuing Prometheus quert
export function Alert(props: AlertProps = {}) {
  return (
    <article class={["alert", `alert-${props.severity}`].join(" ")}>
      {props.title && (
        <header>
          <h3>{props.title}</h3>
        </header>
      )}
      {props.description && (
        <section class="body">
          <p>{props.description}</p>
        </section>
      )}
    </article>
  );
}

export function isSeverity(value: string | undefined): value is AlertSeverity {
  return !!ALERT_SEVERITY_VALUES.find((s) => s === value);
}

export function asAlertSeverity(value: string | undefined): AlertSeverity {
  return isSeverity(value) ? value : "info";
}

export function asAlertStatus(
  value: GettableAlertStatus | undefined,
): AlertStatus | undefined {
  if (value) {
    switch (value.state) {
      case "unprocessed":
        return "firing";
      case "active":
        return (value.silencedBy || value.inhibitedBy) ? "silenced" : "firing";
      case "suppressed":
        return "silenced";
    }
  }
}
