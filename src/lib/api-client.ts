// src/lib/api-client.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getSession, signOut } from "next-auth/react";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 15000, // 15s timeout for production stability
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Auth Token
apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const session: any = await getSession();
  
  if (session?.accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  
  return config;
}, (error) => Promise.reject(error));

// Response Interceptor: Global Error Handling
apiClient.interceptors.response.use(
  (response) => response.data, // Directly return data to services
  async (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401) {
      // Session expired or invalid - force logout to clear stale client state
      await signOut({ callbackUrl: '/admin/login' });
    }

    if (status === 403) {
      console.error("Access denied: You do not have admin permissions.");
    }

    // Standardized error object for services to catch
    const errorMessage = (error.response?.data as any)?.message || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

export default apiClient;