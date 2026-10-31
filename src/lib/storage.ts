// ============================================================
// CelebrateAI — localStorage Persistence
// Versioned, validated, safe recovery
// ============================================================

import { SCHEMA_VERSION } from './types';
import type { AppStorage, EventState, EventRecord } from './types';

const STORAGE_KEY = 'celebrate_ai_v1';

// ─── Default State ────────────────────────────────────────────

function emptyStorage(): AppStorage {
  return {
    schemaVersion: SCHEMA_VERSION,
    events: [],
    eventStates: {},
    activeEventId: null,
  };
}

// ─── Read ────────────────────────────────────────────────────

export function loadStorage(): AppStorage {
  if (typeof window === 'undefined') return emptyStorage();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStorage();

    const parsed = JSON.parse(raw) as Partial<AppStorage>;

    // Schema version check — if major version mismatch, start fresh
    if (!parsed.schemaVersion) {
      console.warn('[CelebrateAI] No schema version found in stored data. Starting fresh.');
      return emptyStorage();
    }

    // Return with fallbacks for missing fields
    return {
      schemaVersion: parsed.schemaVersion ?? SCHEMA_VERSION,
      events: Array.isArray(parsed.events) ? parsed.events : [],
      eventStates: typeof parsed.eventStates === 'object' && parsed.eventStates !== null
        ? parsed.eventStates
        : {},
      activeEventId: parsed.activeEventId ?? null,
    };
  } catch (e) {
    console.error('[CelebrateAI] Failed to parse stored data:', e);
    return emptyStorage();
  }
}

// ─── Write ───────────────────────────────────────────────────

export function saveStorage(data: AppStorage): { success: boolean; error?: string } {
  if (typeof window === 'undefined') {
    return { success: false, error: 'localStorage is not available (server context).' };
  }

  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, serialized);
    return { success: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown storage error';
    console.error('[CelebrateAI] Failed to save data:', msg);
    return { success: false, error: `Could not save: ${msg}. Your browser storage may be full.` };
  }
}

// ─── Event CRUD ───────────────────────────────────────────────

export function saveEvent(event: EventRecord): { success: boolean; error?: string } {
  const storage = loadStorage();
  const idx = storage.events.findIndex((e) => e.id === event.id);
  if (idx >= 0) {
    storage.events[idx] = event;
  } else {
    storage.events.push(event);
  }
  storage.activeEventId = event.id;
  return saveStorage(storage);
}

export function loadEvent(eventId: string): EventRecord | null {
  const storage = loadStorage();
  return storage.events.find((e) => e.id === eventId) ?? null;
}

export function loadAllEvents(): EventRecord[] {
  return loadStorage().events;
}

export function deleteEvent(eventId: string): { success: boolean; error?: string } {
  const storage = loadStorage();
  storage.events = storage.events.filter((e) => e.id !== eventId);
  delete storage.eventStates[eventId];
  if (storage.activeEventId === eventId) {
    storage.activeEventId = storage.events[0]?.id ?? null;
  }
  return saveStorage(storage);
}

// ─── Event State CRUD ─────────────────────────────────────────

export function saveEventState(state: EventState): { success: boolean; error?: string } {
  const storage = loadStorage();
  storage.eventStates[state.event.id] = {
    ...state,
    lastSavedAt: new Date().toISOString(),
  };
  return saveStorage(storage);
}

export function loadEventState(eventId: string): EventState | null {
  const storage = loadStorage();
  return storage.eventStates[eventId] ?? null;
}

// ─── Active Event ─────────────────────────────────────────────

export function getActiveEventId(): string | null {
  return loadStorage().activeEventId;
}

export function setActiveEventId(eventId: string | null): void {
  const storage = loadStorage();
  storage.activeEventId = eventId;
  saveStorage(storage);
}

// ─── Clear ───────────────────────────────────────────────────

export function clearAllData(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}

// ─── Export ──────────────────────────────────────────────────

export function exportEventJSON(state: EventState): string {
  const exportData = {
    exportFormat: 'CelebrateAI',
    exportVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    event: state.event,
    plan: state.plan,
    guests: state.guests,
    documents: state.documents,
  };
  return JSON.stringify(exportData, null, 2);
}

export function triggerDownload(content: string, filename: string, mimeType: string): void {
  if (typeof window === 'undefined') return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
