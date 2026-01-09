import { apiClient } from '@/lib/api/client';

// Initialize API client token from localStorage on app load
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('token');
  if (token) {
    apiClient.setToken(token);
  }
}

