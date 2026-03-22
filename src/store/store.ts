import { configureStore } from '@reduxjs/toolkit';
import { rememberReducer, rememberEnhancer } from 'redux-remember';
import { idbDriver } from '@/lib/idbDriver';
import itemsReducer from './itemsSlice';
import dungeonsReducer from './dungeonsSlice';
import checksReducer from './checksSlice';
import settingsReducer from './settingsSlice';
import entrancesReducer from './entrancesSlice';
import autotrackerReducer from './autotrackerSlice';
import trackerReducer from './trackerSlice';
import overworldReducer from './overworldSlice';

import { getSessionInstanceId } from '@/lib/sessionHelper';

const rememberedKeys = ['items', 'dungeons', 'checks', 'settings', 'entrances', 'overworld'];

const instanceId = getSessionInstanceId();

export const store = configureStore({
  reducer: rememberReducer({
    trackerState: trackerReducer,
    items: itemsReducer,
    dungeons: dungeonsReducer,
    checks: checksReducer,
    settings: settingsReducer,
    entrances: entrancesReducer,
    autotracker: autotrackerReducer,
    overworld: overworldReducer,
  }),
  enhancers: (getDefaultEnhancers) => getDefaultEnhancers().concat(
    rememberEnhancer(
      idbDriver,
      rememberedKeys,
      { prefix: `alttptracker_session_${instanceId}_` }
    )
  )
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
