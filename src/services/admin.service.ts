// src/services/admin.service.ts
import apiClient from '@/lib/api-client';

export const adminService = {
  
  getStats: async () => {
    // Ensure the result of the get request is returned
    const data = await apiClient.get('/admin/stats');
    return data ?? null; // Return null if data is somehow missing, never undefined
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