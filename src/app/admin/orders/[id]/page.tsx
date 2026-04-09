// src/app/order/[id]/page.tsx
'use client';

import { OrderStatus, Order } from '@/types/types'; // Import both the Enum and the Interface
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function UserOrderDetails({ params }: { params: { id: string } }) {
  // 1. Properly type the SWR hook with your Order interface
  const { data: order, error } = useSWR<Order>(`/api/orders/${params.id}`, fetcher, {
    refreshInterval: (data) => 
      // 2. Use Enum members for comparison to fix "not assignable" error
      (data?.status === OrderStatus.DELIVERED || data?.status === OrderStatus.CANCELLED) ? 0 : 5000,
  });

  if (error) return <div className="p-10 text-red-500">Failed to load order.</div>;
  if (!order) return <div className="skeleton-loader p-10">Loading order status...</div>;

  // Timeline UI generator
  const getTimelineStep = (step: OrderStatus) => {
    // 3. Define the progression array using the Enum
    const states = [
      OrderStatus.PENDING, 
      OrderStatus.PAID, 
      OrderStatus.SHIPPED, 
      OrderStatus.DELIVERED
    ];
    
    const currentIndex = states.indexOf(order.status);
    const stepIndex = states.indexOf(step);
    
    if (order.status === OrderStatus.CANCELLED) return 'text-red-500';
    if (stepIndex <= currentIndex) return 'text-green-600 font-bold';
    return 'text-gray-400';
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Track Your Order</h1>
      
      {/* Live Status Timeline */}
      <div className="flex justify-between items-center border-b pb-6 mb-6">
        <span className={getTimelineStep(OrderStatus.PENDING)}>Order Placed</span>
        <div className="flex-1 h-1 bg-gray-200 mx-2 rounded overflow-hidden">
          <div 
            className="bg-green-600 h-1 transition-all duration-500" 
            style={{ width: order.status === OrderStatus.PENDING ? '25%' : '100%' }}
          ></div>
        </div>
        
        <span className={getTimelineStep(OrderStatus.PAID)}>Confirmed</span>
        <div className="flex-1 h-1 bg-gray-200 mx-2 rounded"></div>
        
        <span className={getTimelineStep(OrderStatus.SHIPPED)}>Shipped</span>
        <div className="flex-1 h-1 bg-gray-200 mx-2 rounded"></div>
        
        <span className={getTimelineStep(OrderStatus.DELIVERED)}>Delivered</span>
      </div>

      {/* Items Section */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Items</h3>
        {order.items?.map((item) => (
          <div key={item.id} className="flex justify-between border p-4 rounded bg-gray-50">
            <div className="flex flex-col">
              <span className="font-medium">{item.product.name}</span>
              <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
            </div>
            <span className="font-bold">₹{item.price}</span>
          </div>
        ))}
      </div>
      
      {/* Shipment/Tracking Section */}
      {order.status === OrderStatus.SHIPPED && (
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 font-medium">Your package is on the way!</p>
          <a 
            href="#" // Replace with order.shipment?.trackingUrl when API is ready
            target="_blank" 
            className="mt-2 inline-block text-blue-600 underline font-semibold"
          >
            Track Shipment
          </a>
        </div>
      )}
    </div>
  );
}