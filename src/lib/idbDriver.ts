/**
 * IndexedDB-based storage driver for redux-remember.
 * Also used by LaunchPage to pre-seed session data before opening a tracker,
 * and by sessionManager to clean up data when deleting sessions.
 */

import { touchSession } from "@/lib/sessionManager";

const DB_NAME = "muffins_tracker_store";
const DB_VERSION = 1;
const STORE_NAME = "redux";
const SESSION_KEY_RE = /^alttptracker_session_([^_]+)_/;
const TOUCH_THROTTLE_MS = 30_000; // update session timestamp at most every 30s

let dbPromise: Promise<IDBDatabase> | null = null;

function openDB(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  return dbPromise;
}

/** Throttled per-session touch tracking */
const lastTouchTimes = new Map<string, number>();

function throttledTouchSession(key: string): void {
  const match = key.match(SESSION_KEY_RE);
  if (!match) return;
  const sessionId = match[1];
  const now = Date.now();
  const last = lastTouchTimes.get(sessionId) ?? 0;
  if (now - last < TOUCH_THROTTLE_MS) return;
  lastTouchTimes.set(sessionId, now);
  touchSession(sessionId).catch(() => {});
}

/**
 * Redux-remember compatible driver using IndexedDB.
 * Implements { getItem, setItem } with async return values.
 */
export const idbDriver = {
  async getItem(key: string): Promise<string | null> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => reject(req.error);
    });
  },

  async setItem(key: string, value: string): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(value, key);
      req.onsuccess = () => {
        throttledTouchSession(key);
        resolve();
      };
      req.onerror = () => reject(req.error);
    });
  },
};

/**
 * Delete all redux-remember keys for a given session ID.
 * Called when a session is deleted.
 */
export async function deleteSessionStoreData(sessionId: string): Promise<void> {
  const prefix = `alttptracker_session_${sessionId}_`;
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.openCursor();
    req.onsuccess = () => {
      const cursor = req.result;
      if (cursor) {
        if (typeof cursor.key === "string" && cursor.key.startsWith(prefix)) {
          cursor.delete();
        }
        cursor.continue();
      } else {
        resolve();
      }
    };
    req.onerror = () => reject(req.error);
  });
}
