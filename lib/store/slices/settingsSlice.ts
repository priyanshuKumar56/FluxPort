import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api/client";

export interface EnvVar {
  id: string;
  name: string;
  key: string;
  value: string;
  is_encrypted: boolean;
  environment: string;
  created_at: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  scopes: string[];
  last_used_at?: string;
  created_at: string;
  is_active: boolean;
  api_key?: string; // Only returned on creation
}

interface SettingsState {
  settings: Record<string, any>;
  envVars: EnvVar[];
  apiKeys: ApiKey[];
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  settings: {},
  envVars: [],
  apiKeys: [],
  loading: false,
  error: null,
};

// ============================================================================
// ASYNC THUNKS
// ============================================================================

// Workspace Settings
export const fetchWorkspaceSettings = createAsyncThunk(
  "settings/fetchSettings",
  async (workspaceId: string) => {
    try {
      const settings = await apiClient.getWorkspaceSettings(workspaceId);
      console.log("Fetched workspace settings:", settings);
      return settings || {};
    } catch (error: any) {
      console.error("Failed to fetch settings:", error);
      // If it's a 404 for missing settings, return empty object
      const errorMessage = error?.error || error?.message || '';
      if (errorMessage.includes("Setting not found") || errorMessage.includes("404") || error?.status === 404) {
        console.log("No settings found, returning empty object");
        return {};
      }
      // Re-throw other errors so they can be handled properly
      throw error;
    }
  },
);

export const updateWorkspaceSetting = createAsyncThunk(
  "settings/updateSetting",
  async ({
    workspaceId,
    key,
    value,
  }: {
    workspaceId: string;
    key: string;
    value: any;
  }) => {
    return await apiClient.updateWorkspaceSetting(workspaceId, key, value);
  },
);

// Environment Variables
export const fetchEnvVars = createAsyncThunk(
  "settings/fetchEnvVars",
  async ({
    workspaceId,
    environment,
  }: {
    workspaceId: string;
    environment?: string;
  }) => {
    try {
      const vars = await apiClient.getEnvVars(workspaceId, environment);
      return vars || [];
    } catch (error) {
      console.error("Failed to fetch env vars:", error);
      return [];
    }
  },
);

export const createEnvVar = createAsyncThunk(
  "settings/createEnvVar",
  async ({
    workspaceId,
    data,
  }: {
    workspaceId: string;
    data: {
      name: string;
      key: string;
      value: string;
      is_encrypted?: boolean;
      environment?: string;
    };
  }) => {
    return await apiClient.createEnvVar(workspaceId, data);
  },
);

export const updateEnvVar = createAsyncThunk(
  "settings/updateEnvVar",
  async ({
    workspaceId,
    id,
    data,
  }: {
    workspaceId: string;
    id: string;
    data: { name?: string; value?: string; is_encrypted?: boolean };
  }) => {
    return await apiClient.updateEnvVar(workspaceId, id, data);
  },
);

export const deleteEnvVar = createAsyncThunk(
  "settings/deleteEnvVar",
  async ({ workspaceId, id }: { workspaceId: string; id: string }) => {
    await apiClient.deleteEnvVar(workspaceId, id);
    return id;
  },
);

// API Keys
export const fetchApiKeys = createAsyncThunk(
  "settings/fetchApiKeys",
  async (workspaceId: string) => {
    try {
      const keys = await apiClient.getApiKeys(workspaceId);
      return keys || [];
    } catch (error) {
      console.error("Failed to fetch API keys:", error);
      return [];
    }
  },
);

export const createApiKey = createAsyncThunk(
  "settings/createApiKey",
  async ({
    workspaceId,
    data,
  }: {
    workspaceId: string;
    data: { name: string; scopes?: string[]; expires_in_days?: number };
  }) => {
    return await apiClient.createApiKey(workspaceId, data);
  },
);

export const deleteApiKey = createAsyncThunk(
  "settings/deleteApiKey",
  async ({ workspaceId, id }: { workspaceId: string; id: string }) => {
    await apiClient.deleteApiKey(workspaceId, id);
    return id;
  },
);

// ============================================================================
// SLICE
// ============================================================================

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    clearSettingsError(state) {
      state.error = null;
    },
    clearNewApiKey(state) {
      // Clear the api_key field from any keys (it's only shown once)
      state.apiKeys = state.apiKeys.map((key) => {
        const { api_key, ...rest } = key;
        return rest as ApiKey;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch settings
      .addCase(fetchWorkspaceSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWorkspaceSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(fetchWorkspaceSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch settings";
      })
      // Env vars
      .addCase(fetchEnvVars.fulfilled, (state, action) => {
        state.envVars = action.payload;
      })
      .addCase(createEnvVar.fulfilled, (state, action) => {
        state.envVars.push(action.payload);
      })
      .addCase(updateEnvVar.fulfilled, (state, action) => {
        const index = state.envVars.findIndex(
          (v) => v.id === action.payload.id,
        );
        if (index !== -1) {
          state.envVars[index] = action.payload;
        }
      })
      .addCase(deleteEnvVar.fulfilled, (state, action) => {
        state.envVars = state.envVars.filter((v) => v.id !== action.payload);
      })
      // API keys
      .addCase(fetchApiKeys.fulfilled, (state, action) => {
        state.apiKeys = action.payload;
      })
      .addCase(createApiKey.fulfilled, (state, action) => {
        state.apiKeys.push(action.payload);
      })
      .addCase(deleteApiKey.fulfilled, (state, action) => {
        state.apiKeys = state.apiKeys.filter((k) => k.id !== action.payload);
      });
  },
});

export const { clearSettingsError, clearNewApiKey } = settingsSlice.actions;
export default settingsSlice.reducer;
