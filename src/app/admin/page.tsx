'use client';

import { useQuery } from '@tanstack/react-query';
import { ShoppingBag, DollarSign, Package, TrendingUp, Loader2 } from 'lucide-react';
import { adminService } from '@/services/admin.service';
import apiClient from '@/lib/api-client';
import { Order, Product, DashboardStat, OrderStatus } from '@/types/types'; // Import your types

export default function AdminDashboard() {
  // Fetch orders with explicit Typing
  const { data: orders, isLoading: ordersLoading } = useQuery<Order[]>({ 
    queryKey: ['admin-orders'], 
    queryFn: async () => {
      const data = await adminService.getOrders();
      return data as unknown as Order[]; // Cast to match our interface
    }
  });

  // Fetch products with explicit Typing
  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({ 
    queryKey: ['products'], 
    queryFn: async () => {
      const data = await apiClient.get('/products');
      console.log('Fetched products:', data); // Debug log to inspect raw response
      return data as unknown as Product[]; 
    }
  });

  if (ordersLoading || productsLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-rose-500" size={40} />
      </div>
    );
  }

  // Calculate stats using type-safe array methods
  const stats: DashboardStat[] = [
    {
      label: 'Total Revenue',
      value: `₹${orders?.reduce((acc, curr) => 
        acc + (curr.status === 'PAID' || curr.status === 'DELIVERED' ? curr.totalAmount : 0), 0
      ).toLocaleString('en-IN') || '0.00'}`,
      icon: <DollarSign className="text-emerald-600" />,
      description: 'From confirmed payments'
    },
    {
      label: 'Total Orders',
      value: orders?.length || 0,
      icon: <ShoppingBag className="text-blue-600" />,
      description: 'All time volume'
    },
    {
      label: 'Active Products',
      value: products?.filter(p => p.isActive).length || 0,
      icon: <Package className="text-rose-600" />,
      description: 'Live in store'
    },
    {
      label: 'Pending Fulfillment',
      value: orders?.filter(o => o.status === 'PAID').length || 0,
      icon: <TrendingUp className="text-amber-600" />,
      description: 'Awaiting shipping'
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          Dashboard Overview
        </h1>
        <p className="text-zinc-500">Welcome back to the Flower Fairy operations center.</p>
      </div>

      {/* Statistical Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-500 uppercase tracking-wider">{stat.label}</span>
              <div className="rounded-md bg-zinc-50 p-2">{stat.icon}</div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-zinc-900">{stat.value}</div>
              <p className="text-xs text-zinc-400 mt-1">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-zinc-800">Recent Orders</h2>
          <div className="space-y-4">
            {orders?.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between border-b border-zinc-100 pb-3 last:border-0">
                <div>
                  <p className="font-medium text-zinc-900">{order.user.name}</p>
                  <p className="text-xs text-zinc-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-zinc-900">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                  <p className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full inline-block ${getStatusColor(order.status)}`}>
                    {order.status}
                  </p>
                </div>
              </div>
            ))}
            {orders?.length === 0 && <p className="text-sm text-zinc-400 italic">No orders found.</p>}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-zinc-800">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center justify-center p-4 rounded-lg border border-zinc-100 hover:bg-rose-50 hover:border-rose-200 transition-all group">
              <Package className="mb-2 text-rose-500 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Add Product</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 rounded-lg border border-zinc-100 hover:bg-blue-50 hover:border-blue-200 transition-all group">
              <ShoppingBag className="mb-2 text-blue-500 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Review Orders</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const getStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case 'PAID': return 'bg-blue-50 text-blue-600';
    case 'DELIVERED': return 'bg-emerald-50 text-emerald-600';
    case 'CANCELLED': return 'bg-rose-50 text-rose-600';
    case 'SHIPPED': return 'bg-purple-50 text-purple-600';
    default: return 'bg-amber-50 text-amber-600';
  }
};