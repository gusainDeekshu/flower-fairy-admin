// src/services/admin.service.ts
import apiClient from '@/lib/api-client';
import { DashboardStats } from '@/types/types';

export const adminService = {
  
  getStats: async (): Promise<DashboardStats> => {
    // apiClient already returns response.data due to interceptor
    return apiClient.get<DashboardStats>('/admin/stats') as unknown as Promise<DashboardStats>;
  },
  getOrders: () => apiClient.get('/admin/orders'),
  updateOrderStatus: (id: string, status: string) => 
    apiClient.patch(`/admin/orders/${id}/status`, { status }),

  // Products API
  updateProduct: (id: string, data: any) => 
    apiClient.put(`/admin/products/${id}`, data),
  updateVariant: (id: string, data: { priceModifier: number, stock: number }) => 
    apiClient.put(`/admin/products/variants/${id}`, data),

  // Store Config API
  updateStoreConfig: (slug: string, config: any) => 
    apiClient.put(`/admin/store/config/${slug}`, config),
};