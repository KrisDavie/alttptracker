import { configureStore } from '@reduxjs/toolkit';
import { rememberReducer, rememberEnhancer } from 'redux-remember';
import itemsReducer from './itemsSlice';
import dungeonsReducer from './dungeonsSlice';
import checksReducer from './checksSlice';
import settingsReducer from './settingsSlice';
import entrancesReducer from './entrancesSlice';
import autotrackerReducer from './autotrackerSlice';

// const rememberedKeys = ['items', 'dungeons', 'checks', 'settings', 'entrances'];
const rememberedKeys = [];

const urlParams = new URLSearchParams(window.location.search);
const instanceId = urlParams.get("id") || urlParams.get("instance") || 'default';

export const store = configureStore({
  reducer: rememberReducer({
    items: itemsReducer,
    dungeons: dungeonsReducer,
    checks: checksReducer,
    settings: settingsReducer,
    entrances: entrancesReducer,
    autotracker: autotrackerReducer,
  }),
  enhancers: (getDefaultEnhancers) => getDefaultEnhancers().concat(
    rememberEnhancer(
      window.localStorage,
      rememberedKeys,
      { prefix: `alttptracker_session_${instanceId}_` }
    )
  )
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
