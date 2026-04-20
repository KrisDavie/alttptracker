import { configureStore, Tuple } from '@reduxjs/toolkit';
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
import scoutsReducer from './scoutsSlice';

import { getSessionInstanceId } from '@/lib/sessionHelper';
import { createBroadcastMiddleware } from './broadcastMiddleware';

const rememberedKeys = ['items', 'dungeons', 'checks', 'settings', 'entrances', 'overworld', 'scouts'];

const instanceId = getSessionInstanceId();

const reducers = {
  trackerState: trackerReducer,
  items: itemsReducer,
  dungeons: dungeonsReducer,
  checks: checksReducer,
  settings: settingsReducer,
  entrances: entrancesReducer,
  autotracker: autotrackerReducer,
  overworld: overworldReducer,
  scouts: scoutsReducer,
};

export const store = configureStore({
  reducer: rememberReducer(reducers),
  enhancers: (getDefaultEnhancers) => getDefaultEnhancers().concat(
    rememberEnhancer(
      idbDriver,
      rememberedKeys,
      { prefix: `alttptracker_session_${instanceId}_` }
    )
  ),
  middleware: (getDefaultMiddleware) => new Tuple(...getDefaultMiddleware(), createBroadcastMiddleware(instanceId)) as ReturnType<typeof getDefaultMiddleware>,
});
export type RootState = {
  [K in keyof typeof reducers]: ReturnType<(typeof reducers)[K]>;
};
export type AppDispatch = typeof store.dispatch;
