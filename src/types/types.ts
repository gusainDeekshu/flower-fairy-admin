// Define based on your prisma/schema.prisma
export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface Order {
  id: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  user: {
    name: string;
  };
}


// Define the structure of the data coming from adminService.getStats()
export interface DashboardStats {
  revenue: number;
  orderCount: number;
  userCount: number;
  productCount: number;
}

// Define props for the StatCard component
interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
}
export interface Variant {
  id: string;
  name: string;
  stock: number;
  priceModifier: number;
}

export interface Product {
  id: string;
  name: string;
  category: { name: string } | string;
  isActive: boolean;
   description?: string;
  price: number;
  variants: Variant[];
}