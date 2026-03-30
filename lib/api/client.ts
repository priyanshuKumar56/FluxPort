const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://fluxport.onrender.com/api";

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.loadToken();
  }

  private loadToken() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("token");
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }
    }
  }

  getToken(): string | null {
    this.loadToken();
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Network error" }));
      
      console.log("API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        url: url,
        error: error
      });
      
      throw new Error(error?.error || error?.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Triggers a 'wake up' call to the backend to eliminate cold start latency.
   * Called automatically when users land on the home page.
   */
  async wakeUp() {
    try {
      if (typeof window === "undefined") return null;
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 2500);
      try {
        // Prefer CORS-enabled request (lets the backend run health + DB ping).
        return await fetch(`${this.baseUrl}/health`, {
          method: "GET",
          mode: "cors",
          cache: "no-store",
          signal: controller.signal,
        });
      } catch {
        // Fallback: still trigger the request even if response can't be read.
        return await fetch(`${this.baseUrl}/health`, {
          method: "GET",
          mode: "no-cors",
          cache: "no-store",
          signal: controller.signal,
        });
      } finally {
        window.clearTimeout(timeoutId);
      }
    } catch {
      return null;
    }
  }

  // Auth
  async login(email: string, password: string) {
    const data = await this.request<{ user: any; token: string }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      },
    );
    this.setToken(data.token);
    return data;
  }

  async register(email: string, password: string) {
    const data = await this.request<{ user: any; token: string }>(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      },
    );
    this.setToken(data.token);
    return data;
  }

  async getCurrentUser() {
    return this.request<{ user: any }>("/auth/me");
  }

  // API Logs
  async getApiLogs(limit = 100, offset = 0) {
    return this.request<any[]>(`/api-logs?limit=${limit}&offset=${offset}`);
  }

  async createApiLog(data: {
    requestUrl: string;
    requestMethod: string;
    responseStatus: number;
    latencyMs: number;
  }) {
    return this.request<any>("/api-logs", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getApiLogStats() {
    return this.request<any>("/api-logs/stats");
  }

  // Proxy
  async proxyRequest(data: {
    url: string;
    method?: string;
    headers?: Record<string, string>;
    body?: any;
    workspaceId?: string;
  }) {
    return this.request<any>("/proxy", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async proxyRequestWithFiles(data: {
    url: string;
    method?: string;
    headers?: Record<string, string>;
    files: File[];
    formFields?: Record<string, string>;
    workspaceId?: string;
  }) {
    const formData = new FormData();
    formData.append("url", data.url);
    formData.append("method", data.method || "POST");
    formData.append("headers", JSON.stringify(data.headers || {}));
    if (data.workspaceId) {
      formData.append("workspaceId", data.workspaceId);
    }

    // Add files
    data.files.forEach((file, index) => {
      formData.append(`file_${index}`, file);
    });

    // Add additional form fields
    if (data.formFields) {
      Object.entries(data.formFields).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    return fetch(`${this.baseUrl}/proxy`, {
      method: "POST",
      headers: {
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      },
      body: formData,
    }).then(async (res) => {
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || `HTTP ${res.status}`);
      }
      return res.json();
    });
  }

  // Interceptor Rules (Workspace-scoped)
  async getInterceptorRules(workspaceId: string) {
    return this.request<any[]>(`/interceptor-rules/workspace/${workspaceId}`);
  }

  async createInterceptorRule(workspaceId: string, data: any) {
    return this.request<any>(`/interceptor-rules/workspace/${workspaceId}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateInterceptorRule(id: string, data: any) {
    return this.request<any>(`/interceptor-rules/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteInterceptorRule(id: string) {
    return this.request<void>(`/interceptor-rules/${id}`, {
      method: "DELETE",
    });
  }

  async getActiveRulesForProxy(workspaceId: string) {
    return this.request<any[]>("/interceptor-rules/active-for-proxy", {
      method: "POST",
      body: JSON.stringify({ workspaceId }),
    });
  }

  // ============================================================================
  // WORKSPACES
  // ============================================================================

  async getWorkspaces() {
    return this.request<any[]>("/workspaces");
  }

  async getWorkspace(id: string) {
    return this.request<any>(`/workspaces/${id}`);
  }

  async createWorkspace(data: {
    name: string;
    description?: string;
    is_personal?: boolean;
  }) {
    return this.request<any>("/workspaces", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateWorkspace(
    id: string,
    data: { name?: string; description?: string; settings?: any },
  ) {
    return this.request<any>(`/workspaces/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteWorkspace(id: string) {
    return this.request<void>(`/workspaces/${id}`, {
      method: "DELETE",
    });
  }

  // Workspace Members
  async getWorkspaceMembers(workspaceId: string) {
    return this.request<any[]>(`/workspaces/${workspaceId}/members`);
  }

  async inviteWorkspaceMember(
    workspaceId: string,
    email: string,
    role?: string,
  ) {
    return this.request<any>(`/workspaces/${workspaceId}/invite`, {
      method: "POST",
      body: JSON.stringify({ email, role }),
    });
  }

  async acceptInvitation(token: string) {
    return this.request<any>("/workspaces/invite/accept", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  }

  async updateMemberRole(workspaceId: string, memberId: string, role: string) {
    return this.request<any>(`/workspaces/${workspaceId}/members/${memberId}`, {
      method: "PUT",
      body: JSON.stringify({ role }),
    });
  }

  async removeWorkspaceMember(workspaceId: string, memberId: string) {
    return this.request<void>(
      `/workspaces/${workspaceId}/members/${memberId}`,
      {
        method: "DELETE",
      },
    );
  }

  async leaveWorkspace(workspaceId: string) {
    return this.request<any>(`/workspaces/${workspaceId}/leave`, {
      method: "POST",
    });
  }

  // ============================================================================
  // SETTINGS
  // ============================================================================

  async getWorkspaceSettings(workspaceId: string) {
    return this.request<Record<string, any>>(
      `/settings/workspace/${workspaceId}`,
    );
  }

  async getWorkspaceSetting(workspaceId: string, key: string) {
    return this.request<any>(`/settings/workspace/${workspaceId}/${key}`);
  }

  async updateWorkspaceSetting(workspaceId: string, key: string, value: any) {
    return this.request<any>(`/settings/workspace/${workspaceId}/${key}`, {
      method: "PUT",
      body: JSON.stringify({ value }),
    });
  }

  async deleteWorkspaceSetting(workspaceId: string, key: string) {
    return this.request<void>(`/settings/workspace/${workspaceId}/${key}`, {
      method: "DELETE",
    });
  }

  // Environment Variables
  async getEnvVars(workspaceId: string, environment?: string) {
    const query = environment ? `?environment=${environment}` : "";
    return this.request<any[]>(
      `/settings/workspace/${workspaceId}/env${query}`,
    );
  }

  async createEnvVar(
    workspaceId: string,
    data: {
      name: string;
      key: string;
      value: string;
      is_encrypted?: boolean;
      environment?: string;
    },
  ) {
    return this.request<any>(`/settings/workspace/${workspaceId}/env`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateEnvVar(
    workspaceId: string,
    id: string,
    data: { name?: string; value?: string; is_encrypted?: boolean },
  ) {
    return this.request<any>(`/settings/workspace/${workspaceId}/env/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteEnvVar(workspaceId: string, id: string) {
    return this.request<void>(`/settings/workspace/${workspaceId}/env/${id}`, {
      method: "DELETE",
    });
  }

  // API Keys
  async getApiKeys(workspaceId: string) {
    return this.request<any[]>(`/settings/workspace/${workspaceId}/api-keys`);
  }

  async createApiKey(
    workspaceId: string,
    data: { name: string; scopes?: string[]; expires_in_days?: number },
  ) {
    return this.request<any>(`/settings/workspace/${workspaceId}/api-keys`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async deleteApiKey(workspaceId: string, id: string) {
    return this.request<void>(
      `/settings/workspace/${workspaceId}/api-keys/${id}`,
      {
        method: "DELETE",
      },
    );
  }

  // ============================================================================
  // COLLECTIONS (Workspace-Scoped)
  // ============================================================================

  async getCollections(workspaceId: string) {
    return this.request<any[]>(`/collections/workspace/${workspaceId}`);
  }

  async getCollection(collectionId: string) {
    return this.request<any>(`/collections/${collectionId}`);
  }

  async getCollectionTree(collectionId: string) {
    return this.request<any>(`/collections/${collectionId}/tree`);
  }

  async createCollection(
    workspaceId: string,
    name: string,
    description?: string,
  ) {
    return this.request<any>(`/collections/workspace/${workspaceId}`, {
      method: "POST",
      body: JSON.stringify({ name, description }),
    });
  }

  async updateCollection(id: string, name?: string, description?: string) {
    return this.request<any>(`/collections/${id}`, {
      method: "PUT",
      body: JSON.stringify({ name, description }),
    });
  }

  async deleteCollection(id: string) {
    return this.request<void>(`/collections/${id}`, {
      method: "DELETE",
    });
  }

  // Folders
  async createFolder(
    collectionId: string,
    name: string,
    description?: string,
    parent_folder_id?: string,
  ) {
    return this.request<any>(`/collections/${collectionId}/folders`, {
      method: "POST",
      body: JSON.stringify({ name, description, parent_folder_id }),
    });
  }

  async updateFolder(id: string, name?: string, description?: string) {
    return this.request<any>(`/collections/folders/${id}`, {
      method: "PUT",
      body: JSON.stringify({ name, description }),
    });
  }

  async deleteFolder(id: string) {
    return this.request<void>(`/collections/folders/${id}`, {
      method: "DELETE",
    });
  }

  // Saved Requests
  async createSavedRequest(
    collectionId: string,
    folderId: string | undefined,
    data: any,
  ) {
    return this.request<any>(`/collections/${collectionId}/requests`, {
      method: "POST",
      body: JSON.stringify({ ...data, folder_id: folderId }),
    });
  }

  async updateSavedRequest(id: string, data: any) {
    return this.request<any>(`/collections/requests/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteSavedRequest(id: string) {
    return this.request<void>(`/collections/requests/${id}`, {
      method: "DELETE",
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
