import type { SettingsState } from "@/store/settingsSlice";
import { deleteSessionStoreData } from "@/lib/idbDriver";

export interface TrackerSession {
  id: string;
  name: string;
  createdAt: number;
  lastAccessedAt: number;
  settings: Partial<SettingsState>;
  spriteName?: string;
  presetId?: string;
  pinned?: boolean;
}

const DB_NAME = "muffins_tracker_db";
const DB_VERSION = 1;
const STORE_NAME = "sessions";
const MAX_SESSIONS = 50;
const DISPLAY_SESSIONS = 8;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getSessions(): Promise<TrackerSession[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const sessions = (req.result as TrackerSession[]).sort((a, b) => {
          // Pinned first, then by lastAccessedAt descending
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return b.lastAccessedAt - a.lastAccessedAt;
        });
        resolve(sessions);
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}

export async function createSession(
  settings: Partial<SettingsState>,
  name?: string,
  spriteName?: string,
  presetId?: string,
  providedId?: string
): Promise<TrackerSession> {
  const id = providedId || crypto.randomUUID().slice(0, 8);
  const session: TrackerSession = {
    id,
    name: name || `Session ${new Date().toLocaleDateString()}`,
    createdAt: Date.now(),
    lastAccessedAt: Date.now(),
    settings,
    spriteName,
    presetId,
  };
  const db = await openDB();
  // Auto-prune BEFORE adding: remove oldest unpinned sessions to make room
  await pruneOldSessions();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.add(session);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
  return session;
}

export async function deleteSession(id: string): Promise<void> {
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
  // Also clean up redux-remember keys for this session in IndexedDB
  await deleteSessionStoreData(id);
}

export async function touchSession(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const getReq = store.get(id);
    getReq.onsuccess = () => {
      const session = getReq.result as TrackerSession | undefined;
      if (session) {
        session.lastAccessedAt = Date.now();
        const putReq = store.put(session);
        putReq.onsuccess = () => resolve();
        putReq.onerror = () => reject(putReq.error);
      } else {
        resolve();
      }
    };
    getReq.onerror = () => reject(getReq.error);
  });
}

export async function togglePin(id: string): Promise<boolean> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const getReq = store.get(id);
    getReq.onsuccess = () => {
      const session = getReq.result as TrackerSession | undefined;
      if (session) {
        session.pinned = !session.pinned;
        const putReq = store.put(session);
        putReq.onsuccess = () => resolve(!!session.pinned);
        putReq.onerror = () => reject(putReq.error);
      } else {
        resolve(false);
      }
    };
    getReq.onerror = () => reject(getReq.error);
  });
}

async function pruneOldSessions(): Promise<void> {
  const sessions = await getSessions();
  if (sessions.length < MAX_SESSIONS) return;
  // Only prune unpinned sessions beyond the cap
  const unpinned = sessions.filter((s) => !s.pinned);
  if (unpinned.length === 0) return;
  // unpinned is already sorted by lastAccessedAt desc; remove from the tail
  const excess = sessions.length - MAX_SESSIONS + 1; // +1 to make room for the new session
  const toDelete = unpinned.slice(-excess);
  for (const session of toDelete) {
    await deleteSession(session.id);
  }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export { MAX_SESSIONS, DISPLAY_SESSIONS };
