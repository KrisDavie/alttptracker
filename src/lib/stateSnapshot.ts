/**
 * Tracker state snapshot export/import.
 *
 * Captures the complete persisted tracker state as a JSON document so a bug
 * report can be replicated exactly on another machine.
 *
 * Only the redux-remember "remembered" slices are captured — these fully
 * determine the tracker's logical/visual state. Transient UI state
 * (trackerState) and environment-specific config (autotracker connection)
 * are intentionally excluded.
 *
 * Importing creates a brand-new session, seeds it with the snapshot, and the
 * caller navigates to it — leaving the importer's existing session untouched.
 */

import type { SettingsState } from "@/store/settingsSlice";
import type { RememberedKey, RootState } from "@/store/store";
import { rememberedKeys } from "@/store/store";
import type { ClientMetadata } from "./clientMetadata";
import { idbDriver } from "./idbDriver";
import { createSession } from "./sessionManager";

export const SNAPSHOT_KEYS = rememberedKeys;

export type SnapshotKey = RememberedKey;

export type SnapshotState = Pick<RootState, SnapshotKey>;

export interface StateSnapshot {
  /** Snapshot format version, for forward compatibility. */
  v: 1;
  createdAt: string;
  /** Git commit / build identifier the snapshot was generated from, when available. */
  version?: string;
  /** Best-effort client/environment metadata for bug reproduction. */
  meta?: ClientMetadata;
  state: SnapshotState;
}

/** Build a snapshot object from the current store state. */
export function buildStateSnapshot(state: RootState, version?: string, meta?: ClientMetadata): StateSnapshot {
  const picked = Object.fromEntries(SNAPSHOT_KEYS.map((key) => [key, structuredClone(state[key])])) as SnapshotState;
  return {
    v: 1,
    createdAt: new Date().toISOString(),
    ...(version ? { version } : {}),
    ...(meta ? { meta } : {}),
    state: picked,
  };
}

/** Pretty-printed JSON document for downloading a snapshot as a file. */
export function snapshotToJsonDocument(snapshot: StateSnapshot): string {
  return JSON.stringify(snapshot, null, 2);
}

export function parseSnapshotJson(input: string): StateSnapshot {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("No snapshot data provided.");
  let parsed: StateSnapshot;
  try {
    parsed = JSON.parse(trimmed) as StateSnapshot;
  } catch {
    throw new Error("File is not valid JSON.");
  }
  if (!parsed || typeof parsed !== "object" || !parsed.state) {
    throw new Error("JSON did not contain valid tracker state.");
  }
  return parsed;
}

/**
 * Create a brand-new tracker session seeded with the snapshot's state and
 * return its id. The current session is left untouched.
 */
export async function importSnapshotToNewSession(snapshot: StateSnapshot): Promise<string> {
  const id = crypto.randomUUID().slice(0, 8);
  const settings = snapshot.state.settings as Partial<SettingsState> & { spriteName?: string };
  const name = `Imported ${new Date().toLocaleString()}`;

  await createSession(settings, name, settings?.spriteName, undefined, id, undefined);

  const prefix = `alttptracker_session_${id}_`;
  await Promise.all(SNAPSHOT_KEYS.map((key) => idbDriver.setItem(prefix + key, JSON.stringify(snapshot.state[key]))));

  return id;
}
