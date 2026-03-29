import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  isTeam: boolean;
  createdAt: string;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  joinedAt: string;
}

interface WorkspacesState {
  workspaces: Workspace[];
  members: WorkspaceMember[];
  activeWorkspaceId: string | null;
  loading: boolean;
}

// Load initial state from local storage to simulate persistence
const loadState = () => {
  if (typeof window === 'undefined') return { workspaces: [], members: [] };
  const storedWorkspaces = localStorage.getItem('fluxport_workspaces');
  const storedMembers = localStorage.getItem('fluxport_members');
  
  let parsedWorkspaces = storedWorkspaces ? JSON.parse(storedWorkspaces) : [];
  
  if (parsedWorkspaces.length === 0) {
    parsedWorkspaces = [{
      id: "default-local",
      name: "My Workspace",
      ownerId: "local",
      isTeam: false,
      createdAt: new Date().toISOString()
    }];
    localStorage.setItem('fluxport_workspaces', JSON.stringify(parsedWorkspaces));
  }

  return {
    workspaces: parsedWorkspaces,
    members: storedMembers ? JSON.parse(storedMembers) : []
  };
};

const savedState = loadState();

const initialState: WorkspacesState = {
  workspaces: savedState.workspaces,
  members: savedState.members,
  activeWorkspaceId: savedState.workspaces.length > 0 ? savedState.workspaces[0].id : null,
  loading: false,
};

const workspacesSlice = createSlice({
  name: 'workspaces',
  initialState,
  reducers: {
    setActiveWorkspace(state, action: PayloadAction<string>) {
      state.activeWorkspaceId = action.payload;
    },
    createWorkspace(state, action: PayloadAction<{ name: string, isTeam: boolean, ownerId: string }>) {
      const newWorkspace: Workspace = {
        id: Date.now().toString(),
        name: action.payload.name,
        isTeam: action.payload.isTeam,
        ownerId: action.payload.ownerId,
        createdAt: new Date().toISOString()
      };
      state.workspaces.push(newWorkspace);
      if (typeof window !== 'undefined') {
        localStorage.setItem('fluxport_workspaces', JSON.stringify(state.workspaces));
      }
      // Automatically switch to the newly created workspace
      state.activeWorkspaceId = newWorkspace.id;
    },
    inviteMember(state, action: PayloadAction<{ workspaceId: string, email: string, role: WorkspaceMember['role'] }>) {
      const newMember: WorkspaceMember = {
        id: Date.now().toString(),
        workspaceId: action.payload.workspaceId,
        userId: `user_${Math.random().toString(36).substr(2, 9)}`, // Mock user ID
        email: action.payload.email,
        role: action.payload.role,
        joinedAt: new Date().toISOString()
      };
      state.members.push(newMember);
      if (typeof window !== 'undefined') {
        localStorage.setItem('fluxport_members', JSON.stringify(state.members));
      }
    },
    removeMember(state, action: PayloadAction<string>) {
      state.members = state.members.filter(m => m.id !== action.payload);
      if (typeof window !== 'undefined') {
        localStorage.setItem('fluxport_members', JSON.stringify(state.members));
      }
    }
  }
});

export const { setActiveWorkspace, createWorkspace, inviteMember, removeMember } = workspacesSlice.actions;
export default workspacesSlice.reducer;
