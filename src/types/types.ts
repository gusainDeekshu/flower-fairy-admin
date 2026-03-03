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

export interface Product {
  id: string;
  name: string;
  isActive: boolean;
  price: number;
}

export interface DashboardStat {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
}