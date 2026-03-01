// src/app/admin/orders/page.tsx
'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';

export default function OrdersPage() {
  const queryClient = useQueryClient();
  const { data: orders, isLoading } = useQuery({ 
    queryKey: ['admin-orders'], 
    queryFn: adminService.getOrders 
  });

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => 
      adminService.updateOrderStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
  });

  if (isLoading) return <div className="p-10">Loading Operations...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Order Management</h1>
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-zinc-50 border-b">
            <tr>
              <th className="p-4 font-medium text-zinc-600">Order ID</th>
              <th className="p-4 font-medium text-zinc-600">Customer</th>
              <th className="p-4 font-medium text-zinc-600">Amount</th>
              <th className="p-4 font-medium text-zinc-600">Status</th>
              <th className="p-4 font-medium text-zinc-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order: any) => (
              <tr key={order.id} className="border-b last:border-0">
                <td className="p-4 font-mono text-sm">{order.id.slice(-8)}</td>
                <td className="p-4">{order.user.name}</td>
                <td className="p-4">₹{order.totalAmount}</td>
                <td className="p-4">
                  <span className="px-2 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                    {order.status}
                  </span>
                </td>
                <td className="p-4">
                  <select 
                    className="border rounded p-1 text-sm bg-white"
                    defaultValue={order.status}
                    onChange={(e) => mutation.mutate({ id: order.id, status: e.target.value })}
                  >
                    <option value="PAID">Paid</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}