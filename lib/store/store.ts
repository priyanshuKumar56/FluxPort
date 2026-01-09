import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import collectionsReducer from './slices/collectionsSlice';
import logsReducer from './slices/logsSlice';
import rulesReducer from './slices/rulesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    collections: collectionsReducer,
    logs: logsReducer,
    rules: rulesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

