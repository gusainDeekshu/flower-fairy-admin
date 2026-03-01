'use client';

import { useQuery } from '@tanstack/react-query';
import { ShoppingBag, DollarSign, Package, Users, TrendingUp } from 'lucide-react';
import { adminService } from '@/services/admin.service';
import  apiClient  from '@/lib/api-client';

export default function AdminDashboard() {
  // Fetch real data from your NestJS backend controllers
  const { data: orders } = useQuery({ 
    queryKey: ['admin-orders'], 
    queryFn: adminService.getOrders 
  });

  const { data: products } = useQuery({ 
    queryKey: ['products'], 
    queryFn: () => apiClient.get('/products') 
  });

  // Calculate stats based on your Prisma models
  const stats = [
    {
      label: 'Total Revenue',
      value: `₹${orders?.reduce((acc: number, curr: any) => acc + (curr.status === 'PAID' ? curr.totalAmount : 0), 0).toFixed(2) || '0.00'}`,
      icon: <DollarSign className="text-emerald-600" />,
      description: 'From paid orders'
    },
    {
      label: 'Total Orders',
      value: orders?.length || 0,
      icon: <ShoppingBag className="text-blue-600" />,
      description: 'All time orders'
    },
    {
      label: 'Active Products',
      value: products?.filter((p: any) => p.isActive).length || 0,
      icon: <Package className="text-rose-600" />,
      description: 'Live in store'
    },
    {
      label: 'Pending Fulfillment',
      value: orders?.filter((o: any) => o.status === 'PAID').length || 0,
      icon: <TrendingUp className="text-amber-600" />,
      description: 'Needs shipping'
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Dashboard Overview
        </h1>
        <p className="text-zinc-500">Welcome back to the Flower Fairy operations center.</p>
      </div>

      {/* Statistical Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-500">{stat.label}</span>
              <div className="rounded-md bg-zinc-50 p-2 dark:bg-zinc-900">{stat.icon}</div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-zinc-400 mt-1">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          <div className="space-y-4">
            {orders?.slice(0, 5).map((order: any) => (
              <div key={order.id} className="flex items-center justify-between border-b border-zinc-100 pb-3 last:border-0 dark:border-zinc-800">
                <div>
                  <p className="font-medium">{order.user.name}</p>
                  <p className="text-xs text-zinc-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{order.totalAmount}</p>
                  <p className={`text-[10px] font-bold uppercase ${getStatusColor(order.status)}`}>
                    {order.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center justify-center p-4 rounded-lg border border-zinc-100 hover:bg-zinc-50 transition-colors dark:border-zinc-800">
              <Package className="mb-2 text-rose-500" />
              <span className="text-sm">Add Product</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 rounded-lg border border-zinc-100 hover:bg-zinc-50 transition-colors dark:border-zinc-800">
              <ShoppingBag className="mb-2 text-blue-500" />
              <span className="text-sm">Review Orders</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Utility for status colors based on your Prisma Enums
const getStatusColor = (status: string) => {
  switch (status) {
    case 'PAID': return 'text-blue-600';
    case 'DELIVERED': return 'text-emerald-600';
    case 'CANCELLED': return 'text-rose-600';
    default: return 'text-amber-600';
  }
};