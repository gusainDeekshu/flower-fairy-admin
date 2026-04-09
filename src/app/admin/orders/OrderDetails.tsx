// src/app/admin/orders/OrderDetails.tsx
import { useState } from 'react';
import { OrderStatus } from '@/types/types';
import { toast } from 'react-hot-toast';

export default function AdminOrderDetails({ order }: { order: any }) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    // Confirm critical actions
    if (newStatus === 'CANCELLED' && !window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    setIsUpdating(true);
    const previousStatus = status;
    setStatus(newStatus); // Optimistic UI update

    try {
      const res = await fetch(`/api/admin/orders/${order.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('State transition failed');
      toast.success(`Order marked as ${newStatus}`);
    } catch (error) {
      setStatus(previousStatus); // Revert on failure
      toast.error('Failed to update order. Invalid state transition.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Order #{order.id.slice(-6).toUpperCase()}</h2>
        
        {/* Status Controls */}
        <div className="flex gap-2">
          {status === 'PENDING' && (
            <button onClick={() => handleStatusChange(OrderStatus.PAID)} disabled={isUpdating} className="btn-primary">
              Mark Paid
            </button>
          )}
          {status === 'PAID' && (
            <button onClick={() => handleStatusChange(OrderStatus.SHIPPED)} disabled={isUpdating} className="btn-blue">
              Mark Shipped
            </button>
          )}
          {status === 'SHIPPED' && (
            <button onClick={() => handleStatusChange(OrderStatus.DELIVERED)} disabled={isUpdating} className="btn-green">
              Mark Delivered
            </button>
          )}
          {(status === 'PENDING' || status === 'PAID') && (
            <button onClick={() => handleStatusChange(OrderStatus.CANCELLED)} disabled={isUpdating} className="btn-danger">
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* Snapshot Details */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm text-gray-500">Shipping Address Snapshot</h3>
          <p className="mt-1 text-sm">{order.addressSnapshot?.name}</p>
          <p className="text-sm">{order.addressSnapshot?.addressLine}, {order.addressSnapshot?.city}</p>
        </div>
        <div>
           <h3 className="text-sm text-gray-500">Payment Info</h3>
           <p className="mt-1 text-sm">{order.paymentProvider} - {order.totalAmount}</p>
        </div>
      </div>
    </div>
  );
}