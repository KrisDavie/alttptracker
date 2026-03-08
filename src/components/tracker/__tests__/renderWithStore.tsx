import React from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import itemsReducer from "@/store/itemsSlice";
import dungeonsReducer from "@/store/dungeonsSlice";
import checksReducer from "@/store/checksSlice";
import settingsReducer from "@/store/settingsSlice";
import entrancesReducer from "@/store/entrancesSlice";
import autotrackerReducer from "@/store/autotrackerSlice";
import trackerReducer from "@/store/trackerSlice";
import overworldReducer from "@/store/overworldSlice";
import type { RootState } from "@/store/store";

/**
 * Creates a fresh Redux store for testing (without redux-remember middleware).
 */
export function createTestStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: {
      trackerState: trackerReducer,
      items: itemsReducer,
      dungeons: dungeonsReducer,
      checks: checksReducer,
      settings: settingsReducer,
      entrances: entrancesReducer,
      autotracker: autotrackerReducer,
      overworld: overworldReducer,
    },
    preloadedState: preloadedState as RootState,
  });
}

type TestStore = ReturnType<typeof createTestStore>;

interface RenderWithStoreOptions extends Omit<RenderOptions, "wrapper"> {
  store?: TestStore;
  preloadedState?: Partial<RootState>;
}

/**
 * Renders a component wrapped in a Redux Provider with a test store.
 */
export function renderWithStore(
  ui: React.ReactElement,
  { store, preloadedState, ...renderOptions }: RenderWithStoreOptions = {},
) {
  const testStore = store ?? createTestStore(preloadedState);
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={testStore}>{children}</Provider>;
  }
  return { store: testStore, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
