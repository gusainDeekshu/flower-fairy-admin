// src/services/admin-orders.service.ts
import apiClient from '@/lib/api-client';
import { Order, OrderStatus } from '@/types/types';

export const adminOrderService = {
  // Fetch all orders for the admin panel
  getOrders: async (): Promise<Order[]> => {
    return apiClient.get('/admin/orders');
  },

  // Update the status of a specific order
  updateStatus: async (orderId: string, status: OrderStatus) => {
    return apiClient.patch(`/admin/orders/${orderId}/status`, { status });
  },

  // Get details for a single order
  getOrderDetails: async (orderId: string): Promise<Order> => {
    return apiClient.get(`/admin/orders/${orderId}`);
  }
};

// Keep the default export if other parts of your app rely on it, 
// though typically service files use named exports like above.
export default apiClient;