import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface EnvironmentVariable {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface Environment {
  id: string;
  name: string;
  variables: EnvironmentVariable[];
  isGlobal?: boolean;
}

interface EnvironmentsState {
  environments: Environment[];
  activeEnvironmentId: string | null;
}

const initialState: EnvironmentsState = {
  environments: [
    {
      id: 'global',
      name: 'Global Environment',
      isGlobal: true,
      variables: [],
    },
  ],
  activeEnvironmentId: null,
};

const environmentsSlice = createSlice({
  name: 'environments',
  initialState,
  reducers: {
    createEnvironment: (state, action: PayloadAction<{ name: string }>) => {
      const newEnv: Environment = {
        id: Date.now().toString(),
        name: action.payload.name,
        variables: [],
      };
      state.environments.push(newEnv);
    },
    deleteEnvironment: (state, action: PayloadAction<string>) => {
      state.environments = state.environments.filter(e => e.id !== action.payload);
      if (state.activeEnvironmentId === action.payload) {
        state.activeEnvironmentId = null;
      }
    },
    setActiveEnvironment: (state, action: PayloadAction<string | null>) => {
      state.activeEnvironmentId = action.payload;
    },
    addVariable: (state, action: PayloadAction<{ envId: string; variable: EnvironmentVariable }>) => {
      const env = state.environments.find(e => e.id === action.payload.envId);
      if (env) {
        env.variables.push(action.payload.variable);
      }
    },
    updateVariable: (state, action: PayloadAction<{ envId: string; variableId: string; updates: Partial<EnvironmentVariable> }>) => {
      const env = state.environments.find(e => e.id === action.payload.envId);
      if (env) {
        const varIndex = env.variables.findIndex(v => v.id === action.payload.variableId);
        if (varIndex !== -1) {
          env.variables[varIndex] = { ...env.variables[varIndex], ...action.payload.updates };
        }
      }
    },
    deleteVariable: (state, action: PayloadAction<{ envId: string; variableId: string }>) => {
      const env = state.environments.find(e => e.id === action.payload.envId);
      if (env) {
        env.variables = env.variables.filter(v => v.id !== action.payload.variableId);
      }
    },
    renameEnvironment: (state, action: PayloadAction<{ envId: string; name: string }>) => {
      const env = state.environments.find(e => e.id === action.payload.envId);
      if (env) {
        env.name = action.payload.name;
      }
    },
  },
});

export const {
  createEnvironment,
  deleteEnvironment,
  setActiveEnvironment,
  addVariable,
  updateVariable,
  deleteVariable,
  renameEnvironment,
} = environmentsSlice.actions;

export default environmentsSlice.reducer;
