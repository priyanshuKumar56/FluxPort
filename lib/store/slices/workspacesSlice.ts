import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api/client";

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description?: string;
  owner_id: string;
  is_personal: boolean;
  settings?: any;
  member_role?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: "owner" | "admin" | "editor" | "viewer";
  status: "active" | "pending" | "inactive";
  joined_at: string;
}

interface WorkspacesState {
  workspaces: Workspace[];
  members: WorkspaceMember[];
  activeWorkspaceId: string | null;
  invitations: any[];
  loading: boolean;
  error: string | null;
}

const initialState: WorkspacesState = {
  workspaces: [],
  members: [],
  activeWorkspaceId: null,
  invitations: [],
  loading: false,
  error: null,
};

// ============================================================================
// ASYNC THUNKS
// ============================================================================

export const fetchWorkspaces = createAsyncThunk(
  "workspaces/fetchAll",
  async () => {
    try {
      const workspaces = await apiClient.getWorkspaces();
      return workspaces || [];
    } catch (error) {
      console.error("Failed to fetch workspaces:", error);
      throw error;
    }
  },
);

export const createWorkspace = createAsyncThunk(
  "workspaces/create",
  async (data: {
    name: string;
    description?: string;
    is_personal?: boolean;
  }) => {
    return await apiClient.createWorkspace(data);
  },
);

export const updateWorkspace = createAsyncThunk(
  "workspaces/update",
  async ({
    id,
    data,
  }: {
    id: string;
    data: { name?: string; description?: string; settings?: any };
  }) => {
    return await apiClient.updateWorkspace(id, data);
  },
);

export const deleteWorkspace = createAsyncThunk(
  "workspaces/delete",
  async (id: string) => {
    await apiClient.deleteWorkspace(id);
    return id;
  },
);

export const fetchWorkspaceMembers = createAsyncThunk(
  "workspaces/fetchMembers",
  async (workspaceId: string) => {
    try {
      const members = await apiClient.getWorkspaceMembers(workspaceId);
      return members || [];
    } catch (error) {
      console.error("Failed to fetch members:", error);
      return [];
    }
  },
);

export const inviteMember = createAsyncThunk(
  "workspaces/inviteMember",
  async ({
    workspaceId,
    email,
    role,
  }: {
    workspaceId: string;
    email: string;
    role?: string;
  }) => {
    return await apiClient.inviteWorkspaceMember(workspaceId, email, role);
  },
);

export const acceptInvitation = createAsyncThunk(
  "workspaces/acceptInvitation",
  async (token: string) => {
    return await apiClient.acceptInvitation(token);
  },
);

export const fetchWorkspaceInvitations = createAsyncThunk(
  "workspaces/fetchWorkspaceInvitations",
  async (workspaceId: string) => {
    return await apiClient.getWorkspaceInvitations(workspaceId);
  },
);

export const updateMemberRole = createAsyncThunk(
  "workspaces/updateMemberRole",
  async ({
    workspaceId,
    memberId,
    role,
  }: {
    workspaceId: string;
    memberId: string;
    role: string;
  }) => {
    return await apiClient.updateMemberRole(workspaceId, memberId, role);
  },
);

export const removeMember = createAsyncThunk(
  "workspaces/removeMember",
  async ({
    workspaceId,
    memberId,
  }: {
    workspaceId: string;
    memberId: string;
  }) => {
    await apiClient.removeWorkspaceMember(workspaceId, memberId);
    return memberId;
  },
);

export const leaveWorkspace = createAsyncThunk(
  "workspaces/leave",
  async (workspaceId: string) => {
    await apiClient.leaveWorkspace(workspaceId);
    return workspaceId;
  },
);

// ============================================================================
// SLICE
// ============================================================================

const workspacesSlice = createSlice({
  name: "workspaces",
  initialState,
  reducers: {
    setActiveWorkspace(state, action: PayloadAction<string>) {
      state.activeWorkspaceId = action.payload;
    },
    clearWorkspacesError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch workspaces
      .addCase(fetchWorkspaces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkspaces.fulfilled, (state, action) => {
        state.loading = false;
        state.workspaces = action.payload;
        // Set first workspace as active if none selected
        if (!state.activeWorkspaceId && action.payload.length > 0) {
          state.activeWorkspaceId = action.payload[0].id;
        }
      })
      .addCase(fetchWorkspaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch workspaces";
      })
      // Create workspace
      .addCase(createWorkspace.fulfilled, (state, action) => {
        state.workspaces.push(action.payload);
        state.activeWorkspaceId = action.payload.id;
      })
      // Update workspace
      .addCase(updateWorkspace.fulfilled, (state, action) => {
        const index = state.workspaces.findIndex(
          (w) => w.id === action.payload.id,
        );
        if (index !== -1) {
          state.workspaces[index] = action.payload;
        }
      })
      // Delete workspace
      .addCase(deleteWorkspace.fulfilled, (state, action) => {
        state.workspaces = state.workspaces.filter(
          (w) => w.id !== action.payload,
        );
        if (state.activeWorkspaceId === action.payload) {
          state.activeWorkspaceId =
            state.workspaces.length > 0 ? state.workspaces[0].id : null;
        }
      })
      // Fetch members
      .addCase(fetchWorkspaceMembers.fulfilled, (state, action) => {
        state.members = action.payload;
      })
      // Fetch invitations
      .addCase(fetchWorkspaceInvitations.fulfilled, (state, action) => {
        state.invitations = action.payload;
      })
      // Remove member
      .addCase(removeMember.fulfilled, (state, action) => {
        state.members = state.members.filter((m) => m.id !== action.payload);
      })
      // Accept invitation
      .addCase(acceptInvitation.fulfilled, (state, action) => {
        // Refresh workspaces to get the newly added workspace
        return {
          ...state,
          workspaces: [...state.workspaces, action.payload],
          activeWorkspaceId: action.payload.id
        };
      })
      .addCase(acceptInvitation.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to accept invitation';
      })
      // Leave workspace
      .addCase(leaveWorkspace.fulfilled, (state, action) => {
        state.workspaces = state.workspaces.filter(
          (w) => w.id !== action.payload,
        );
        if (state.activeWorkspaceId === action.payload) {
          state.activeWorkspaceId =
            state.workspaces.length > 0 ? state.workspaces[0].id : null;
        }
      });
  },
});

export const { setActiveWorkspace, clearWorkspacesError } =
  workspacesSlice.actions;
export default workspacesSlice.reducer;
