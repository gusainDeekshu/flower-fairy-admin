import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getSession, signOut } from "next-auth/react";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1",
  timeout: 15000,
  withCredentials: true, // CRITICAL: This allows the browser to send/receive HttpOnly cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Response Interceptor: Handle the "Silent Refresh"
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // If we get a 401, the Access Token (15m) has expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.warn('⚠️ Access Token expired. Attempting Silent Refresh via Cookie...');

      try {
        // We call /auth/refresh. Because withCredentials is true, 
        // the browser automatically attaches the 'refresh_token' cookie.
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          { withCredentials: true } 
        );

        const newToken = res.data.access_token;
        console.log('✅ Silent Refresh successful.');

        // Update the failed request with the new token and retry
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError: any) {
        console.error('❌ Session expired or Cookie missing:', refreshError.response?.data);
        // If refresh fails, the 30-day session is actually dead
        await signOut({ callbackUrl: '/admin/login' });
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
export default apiClient;
