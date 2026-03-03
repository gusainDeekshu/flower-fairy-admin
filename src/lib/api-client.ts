// src/lib/api-client.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getSession, signOut } from "next-auth/react";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  timeout: 15000, // 15s timeout for production stability
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach Auth Token
// Request Interceptor Debug
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const session: any = await getSession();

    console.log("--- FE REQUEST DEBUG ---");
    console.log("URL:", config.url);
    console.log("Token Exists:", !!session?.accessToken);
    console.log("User Role in Session:", session?.user?.role);

    if (session?.accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return config;
  },
);
// Response Interceptor: Global Error Handling
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const data = error.response?.data;

    console.log('--- FE RESPONSE DEBUG ---');
    console.log('Status Code:', status);
    console.log('Error Message from Backend:', data);

    if (status === 401) {
      console.warn("Kicking to login because status is 401. Check backend logs for JWT verification failure.");
      // Temporarily comment out signOut to see the console logs!
      // await signOut({ callbackUrl: '/admin/login' }); 
    }
    return Promise.reject(error);
  });

export default apiClient;
