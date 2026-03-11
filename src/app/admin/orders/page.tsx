'use client';
import { useQuery } from '@tanstack/react-query'; //
import { adminOrderService } from '@/services/admin-orders.service';
import { OrderStatus } from '@/types/types';

export default function OrdersPage() {
  // CORRECT: Wrap queryKey and queryFn in a single object
  const { data: orders, refetch, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => adminOrderService.getOrders()
  });

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await adminOrderService.updateStatus(orderId, newStatus);
      refetch();
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  if (isLoading) return <div>Loading orders...</div>;

  return (
    <div className="p-6">
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-zinc-100">
            <th className="p-2 border">Order ID</th>
            <th className="p-2 border">Customer</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map(order => (
            <tr key={order.id}>
              <td className="p-2 border">{order.id.slice(-6)}</td>
              <td className="p-2 border">{order.user.name}</td>
              <td className="p-2 border">
                <select 
                  value={order.status} 
                  onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                  className="border p-1 rounded"
                >
                  {['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}