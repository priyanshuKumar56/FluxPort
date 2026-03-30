const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://fluxport.onrender.com/api';

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.loadToken();
  }

  private loadToken() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    }
  }

  getToken(): string | null {
    this.loadToken();
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
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
    const data = await this.request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    return data;
  }

  async register(email: string, password: string) {
    const data = await this.request<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    return data;
  }

  async getCurrentUser() {
    return this.request<{ user: any }>('/auth/me');
  }

  // Collections
  async getCollections() {
    return this.request<any[]>('/collections');
  }

  async createCollection(name: string) {
    return this.request<any>('/collections', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async updateCollection(id: string, name: string) {
    return this.request<any>(`/collections/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
  }

  async deleteCollection(id: string) {
    return this.request<void>(`/collections/${id}`, {
      method: 'DELETE',
    });
  }

  // Folders
  async getFolders(collectionId: string) {
    return this.request<any[]>(`/folders/collection/${collectionId}`);
  }

  async createFolder(name: string, collectionId: string) {
    return this.request<any>('/folders', {
      method: 'POST',
      body: JSON.stringify({ name, collectionId }),
    });
  }

  async updateFolder(id: string, name: string) {
    return this.request<any>(`/folders/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
  }

  async deleteFolder(id: string) {
    return this.request<void>(`/folders/${id}`, {
      method: 'DELETE',
    });
  }

  // Saved Requests
  async getSavedRequests(collectionId: string) {
    try {
      const requests = await this.request<any[]>(`/saved-requests/collection/${collectionId}`);
      // Parse headers if they're stored as JSON strings
      return requests.map(req => ({
        ...req,
        headers: typeof req.headers === 'string' ? JSON.parse(req.headers || '{}') : req.headers,
      }));
    } catch (error) {
      console.error('Failed to fetch saved requests:', error);
      return [];
    }
  }

  async createSavedRequest(data: any) {
    return this.request<any>('/saved-requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSavedRequest(id: string, data: any) {
    return this.request<any>(`/saved-requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSavedRequest(id: string) {
    return this.request<void>(`/saved-requests/${id}`, {
      method: 'DELETE',
    });
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
    return this.request<any>('/api-logs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getApiLogStats() {
    return this.request<any>('/api-logs/stats');
  }

  // Interceptor Rules
  async getInterceptorRules() {
    return this.request<any[]>('/interceptor-rules');
  }

  async createInterceptorRule(data: any) {
    return this.request<any>('/interceptor-rules', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateInterceptorRule(id: string, data: any) {
    return this.request<any>(`/interceptor-rules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteInterceptorRule(id: string) {
    return this.request<void>(`/interceptor-rules/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

