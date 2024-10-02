import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

export type IconKind = "ok" | "info" | "warning" | "error" | "critical";

const Icon: Record<IconKind, string> = {
  ok: "✅",
  info: "ℹ️",
  warning: "⚠️",
  error: "🚨",
  critical: "🔥",
};

export interface IconProps {
  kind: IconKind;
}

export function Button(props: IconProps) {
  return <span class="icon">Icon[props.kind]</span>;
}
