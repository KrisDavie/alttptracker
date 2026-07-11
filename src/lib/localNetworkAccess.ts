import { useEffect, useState } from "react";

/**
 * Detection for the browser "Local Network Access" (LNA) permission.
 *
 * Chromium gates connections from a public origin to local/loopback addresses
 * (e.g. SNI on localhost:8190 or QUsb2snes) behind a Local Network Access
 * permission. When it isn't granted, autotracking silently fails to connect.
 *
 * The permission is queryable via the Permissions API as "local-network-access".
 * Browsers that don't implement LNA (Firefox, Safari, older Chromium) reject the
 * query — there the feature simply isn't gated, so we report "unsupported" and
 * callers should not warn.
 */
export type LocalNetworkAccessState = "granted" | "denied" | "prompt" | "unsupported";

/** One-shot query of the Local Network Access permission state. */
export async function queryLocalNetworkAccess(): Promise<{ state: LocalNetworkAccessState; status?: PermissionStatus }> {
  if (typeof navigator === "undefined" || !navigator.permissions?.query) {
    return { state: "unsupported" };
  }
  try {
    // "local-network-access" isn't in the standard PermissionName union yet.
    const status = await navigator.permissions.query({ name: "local-network-access" as PermissionName });
    return { state: status.state as LocalNetworkAccessState, status };
  } catch {
    // Unknown permission name → this browser doesn't gate local network access.
    return { state: "unsupported" };
  }
}

/**
 * React hook returning the live Local Network Access permission state. Updates
 * automatically if the user changes the permission while the page is open.
 */
export function useLocalNetworkAccess(): LocalNetworkAccessState {
  const [state, setState] = useState<LocalNetworkAccessState>("unsupported");

  useEffect(() => {
    let cancelled = false;
    let status: PermissionStatus | undefined;
    const onChange = () => {
      if (status && !cancelled) setState(status.state as LocalNetworkAccessState);
    };

    queryLocalNetworkAccess().then((result) => {
      if (cancelled) return;
      setState(result.state);
      if (result.status) {
        status = result.status;
        status.addEventListener("change", onChange);
      }
    });

    return () => {
      cancelled = true;
      status?.removeEventListener("change", onChange);
    };
  }, []);

  return state;
}

/**
 * Whether a "local network access not granted" warning should be shown.
 * Only true when the browser supports LNA and it isn't granted — avoids false
 * alarms on browsers that don't gate local connections at all.
 */
export function shouldWarnLocalNetworkAccess(state: LocalNetworkAccessState): boolean {
  return state === "denied" || state === "prompt";
}
