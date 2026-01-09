"use client"

import { useEffect } from 'react'
import { Provider } from 'react-redux'
import { store } from '@/lib/store/store'
import { apiClient } from '@/lib/api/client'

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize API client token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      apiClient.setToken(token);
    }
  }, []);

  return <Provider store={store}>{children}</Provider>
}

