import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/lib/api/client';

interface InterceptorRule {
  id: string;
  userId: string;
  name: string;
  description?: string;
  type: string;
  isActive: boolean;
  priority: number;
  matchType: string;
  matchPattern: string;
  methods?: string[];
  config?: any;
  createdAt: string;
  updatedAt: string;
}

interface RulesState {
  rules: InterceptorRule[];
  loading: boolean;
  error: string | null;
}

const initialState: RulesState = {
  rules: [],
  loading: false,
  error: null,
};

export const fetchRules = createAsyncThunk('rules/fetchAll', async () => {
  try {
    const rules = await apiClient.getInterceptorRules();
    return rules || [];
  } catch (error) {
    console.error('Failed to fetch rules:', error);
    return [];
  }
});

export const createRule = createAsyncThunk('rules/create', async (data: any) => {
  return await apiClient.createInterceptorRule(data);
});

export const updateRule = createAsyncThunk(
  'rules/update',
  async ({ id, data }: { id: string; data: any }) => {
    return await apiClient.updateInterceptorRule(id, data);
  }
);

export const deleteRule = createAsyncThunk('rules/delete', async (id: string) => {
  await apiClient.deleteInterceptorRule(id);
  return id;
});

const rulesSlice = createSlice({
  name: 'rules',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRules.fulfilled, (state, action) => {
        state.loading = false;
        state.rules = action.payload;
      })
      .addCase(fetchRules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch rules';
      })
      .addCase(createRule.fulfilled, (state, action) => {
        state.rules.push(action.payload);
      })
      .addCase(updateRule.fulfilled, (state, action) => {
        const index = state.rules.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.rules[index] = action.payload;
        }
      })
      .addCase(deleteRule.fulfilled, (state, action) => {
        state.rules = state.rules.filter((r) => r.id !== action.payload);
      });
  },
});

export default rulesSlice.reducer;

