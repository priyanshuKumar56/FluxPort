import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/lib/api/client';

interface ApiLog {
  id: string;
  user_id: string;
  workspace_id?: string;
  requestUrl: string;
  requestMethod: string;
  responseStatus: number;
  latencyMs: number;
  timestamp: string;
}

interface LogsState {
  logs: ApiLog[];
  stats: {
    totalRequests: number;
    avgLatency: number;
    errorRate: string;
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: LogsState = {
  logs: [],
  stats: null,
  loading: false,
  error: null,
};

export const fetchLogs = createAsyncThunk(
  'logs/fetchAll',
  async ({ 
    limit = 100, 
    offset = 0, 
    workspaceId 
  }: { 
    limit?: number; 
    offset?: number; 
    workspaceId?: string;
  } = {}) => {
    try {
      const logs = await apiClient.getApiLogs(workspaceId, limit, offset);
      return logs || [];
    } catch (error) {
      console.error('Failed to fetch logs:', error);
      return [];
    }
  }
);

export const createLog = createAsyncThunk(
  'logs/create',
  async (data: {
    requestUrl: string;
    requestMethod: string;
    responseStatus: number;
    latencyMs: number;
    workspaceId: string;
  }) => {
    return await apiClient.createApiLog(data);
  }
);

export const fetchStats = createAsyncThunk('logs/fetchStats', async (workspaceId?: string) => {
  return await apiClient.getApiLogStats(workspaceId);
});

const logsSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload;
      })
      .addCase(fetchLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch logs';
      })
      .addCase(createLog.fulfilled, (state, action) => {
        state.logs.unshift(action.payload);
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export default logsSlice.reducer;

