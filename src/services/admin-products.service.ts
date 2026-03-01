// src/services/admin-products.service.ts
import apiClient from '@/lib/api-client';

export const adminProductService = {
  updateProduct: async (id: string, data: any) => {
    return apiClient.put(`/admin/products/${id}`, data);
  },

  updateVariant: async (variantId: string, stock: number, priceModifier: number) => {
    return apiClient.put(`/admin/products/variants/${variantId}`, {
      stock,
      priceModifier,
    });
  },
};