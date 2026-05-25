import { createSlice, nanoid, type Action, type PayloadAction } from "@reduxjs/toolkit";
import { REMEMBER_REHYDRATED } from "redux-remember";

type RehydrateAction = Action<typeof REMEMBER_REHYDRATED> & { payload: Record<string, unknown> };

const isRehydrateAction = (action: Action): action is RehydrateAction => action.type === REMEMBER_REHYDRATED;

export interface EventLogEntry {
  id: string;
  timestamp: number;
  title: string;
  detail?: string;
  image?: string;
}

export interface EventLogState {
  entries: EventLogEntry[];
}

const MAX_EVENT_LOG_ENTRIES = 255;

const initialState: EventLogState = {
  entries: [],
};

type EventLogDraft = Omit<EventLogEntry, "id" | "timestamp"> & {
  timestamp?: number;
};

export const eventLogSlice = createSlice({
  name: "eventLog",
  initialState,
  reducers: {
    addEvent: {
      reducer: (state, action: PayloadAction<EventLogEntry>) => {
        state.entries.unshift(action.payload);
        if (state.entries.length > MAX_EVENT_LOG_ENTRIES) {
          state.entries.length = MAX_EVENT_LOG_ENTRIES;
        }
      },
      prepare: (event: EventLogDraft) => ({
        payload: {
          id: nanoid(),
          timestamp: Date.now(),
          ...event,
        },
      }),
    },
    resetEventLog: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addMatcher(isRehydrateAction, (_state, action) => {
      const rehydrated = action.payload.eventLog as EventLogState | undefined;
      if (!rehydrated?.entries) return initialState;
      return {
        entries: rehydrated.entries.slice(0, MAX_EVENT_LOG_ENTRIES),
      };
    });
  },
});

export const { addEvent, resetEventLog } = eventLogSlice.actions;
export default eventLogSlice.reducer;
