// src/app/admin/orders/[id]/OrderDetails.tsx
import { useState } from 'react';
import { OrderStatus } from '@/types/types';

// Mirroring the backend transitions
const ORDER_TRANSITIONS: Record<string, OrderStatus[]> = {
  PENDING: [OrderStatus.PAID, OrderStatus.CANCELLED],
  PAID: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  SHIPPED: [OrderStatus.DELIVERED],
  DELIVERED: [],
  CANCELLED: [],
};

const ACTION_LABELS: Record<string, string> = {
  PAID: "Mark as Paid",
  SHIPPED: "Fulfill & Ship",
  DELIVERED: "Confirm Delivery",
  CANCELLED: "Cancel Order",
};

export default function OrderDetails({ order }: { order: any }) {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const availableActions = ORDER_TRANSITIONS[currentStatus] || [];

  const handleStateChange = async (newStatus: OrderStatus) => {
    setIsUpdating(true);
    try {
      await fetch(`/api/admin/orders/${order.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      setCurrentStatus(newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 flex justify-between items-start">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Order #{order.id.slice(-6)}</h2>
        <p className="text-sm text-gray-500 mt-1">Currently: <strong className="text-gray-900">{currentStatus}</strong></p>
      </div>
      
      {/* Dynamic State Machine Buttons */}
      <div className="flex gap-3">
        {availableActions.map((targetStatus) => (
          <button
            key={targetStatus}
            onClick={() => handleStateChange(targetStatus)}
            disabled={isUpdating}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              targetStatus === 'CANCELLED' 
                ? 'bg-white text-red-600 border border-red-200 hover:bg-red-50'
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            {ACTION_LABELS[targetStatus] || targetStatus}
          </button>
        ))}
      </div>
    </div>
  );
}