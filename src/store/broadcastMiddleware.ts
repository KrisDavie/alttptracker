import type { Middleware } from "@reduxjs/toolkit";

const WINDOW_ID = crypto.randomUUID();

export const createBroadcastMiddleware =
  (instanceId: string): Middleware<object, unknown> =>
  (store) => {
    const channel = new BroadcastChannel(`alttptracker_sync_${instanceId}`);
    channel.onmessage = (e) => {
      // Ignore messages from this window
      if (e.data?.windowId === WINDOW_ID) return;
      store.dispatch({ ...e.data.action, meta: { ...e.data.action.meta, fromBroadcast: true } });
    };
    return (next) => (action) => {
      const result = next(action);
      const a = action as { type?: string; meta?: { fromBroadcast?: boolean } };
      if (
        a.type &&
        // Don't broadcast actions that originated from a broadcast to prevent infinite loops
        !a.meta?.fromBroadcast &&
        // Don't broadcast internal Redux actions or the rehydration action from redux-remember
        !a.type.startsWith("@@") &&
        a.type !== "@@redux-remember/REHYDRATED"
      ) {
        channel.postMessage({ windowId: WINDOW_ID, action });
      }
      return result;
    };
  };