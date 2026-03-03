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


export interface DashboardStat {
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
  variants: Variant[];
}