import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface RuntimeVariable {
  id: string;
  key: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  value: string;
  persistent: boolean;
}

interface RuntimeVariablesState {
  variables: RuntimeVariable[];
}

// Load from localStorage if available
const loadPersistedVariables = (): RuntimeVariable[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('fluxport_runtime_variables');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load runtime variables:', e);
  }
  return [];
};

const initialState: RuntimeVariablesState = {
  variables: [],
};

const runtimeVariablesSlice = createSlice({
  name: 'runtimeVariables',
  initialState,
  reducers: {
    initializeVariables: (state) => {
      state.variables = loadPersistedVariables();
    },
    addRuntimeVariable: (state) => {
      const newVar: RuntimeVariable = {
        id: Date.now().toString(),
        key: '',
        type: 'string',
        value: '',
        persistent: true,
      };
      state.variables.push(newVar);
    },
    updateRuntimeVariable: (state, action: PayloadAction<{ id: string; updates: Partial<RuntimeVariable> }>) => {
      const index = state.variables.findIndex(v => v.id === action.payload.id);
      if (index !== -1) {
        state.variables[index] = { ...state.variables[index], ...action.payload.updates };
      }
    },
    deleteRuntimeVariable: (state, action: PayloadAction<string>) => {
      state.variables = state.variables.filter(v => v.id !== action.payload);
    },
    deleteAllRuntimeVariables: (state) => {
      state.variables = [];
    },
    saveRuntimeVariables: (state) => {
      if (typeof window !== 'undefined') {
        const persistent = state.variables.filter(v => v.persistent);
        localStorage.setItem('fluxport_runtime_variables', JSON.stringify(persistent));
      }
    },
  },
});

export const {
  initializeVariables,
  addRuntimeVariable,
  updateRuntimeVariable,
  deleteRuntimeVariable,
  deleteAllRuntimeVariables,
  saveRuntimeVariables,
} = runtimeVariablesSlice.actions;

export default runtimeVariablesSlice.reducer;
