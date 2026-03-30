import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import collectionsReducer from "./slices/collectionsSlice";
import logsReducer from "./slices/logsSlice";
import rulesReducer from "./slices/rulesSlice";
import environmentsReducer from "./slices/environmentsSlice";
import runtimeVariablesReducer from "./slices/runtimeVariablesSlice";
import workspacesReducer from "./slices/workspacesSlice";
import settingsReducer from "./slices/settingsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    collections: collectionsReducer,
    logs: logsReducer,
    rules: rulesReducer,
    environments: environmentsReducer,
    runtimeVariables: runtimeVariablesReducer,
    workspaces: workspacesReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
