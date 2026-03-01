// src/services/admin.service.ts
import apiClient from '@/lib/api-client';

export const adminService = {
  // Orders API
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