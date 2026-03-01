// src/components/admin/Sidebar.tsx
'use client';

import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, Package, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export const Sidebar = () => {
  const logout = useAuthStore((state) => state.logout);

  return (
    <aside className="w-64 bg-zinc-950 text-white min-h-screen flex flex-col sticky top-0">
      <div className="p-6 text-xl font-bold border-b border-zinc-800 text-rose-500">
        Admin Portal
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <NavItem href="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" />
        <NavItem href="/admin/orders" icon={<ShoppingBag size={20} />} label="Orders" />
        <NavItem href="/admin/products" icon={<Package size={20} />} label="Products" />
        <NavItem href="/admin/settings" icon={<Settings size={20} />} label="Settings" />
      </nav>
      <button 
        onClick={logout} 
        className="p-4 flex items-center gap-3 hover:bg-zinc-900 text-zinc-400 transition-colors w-full border-t border-zinc-800"
      >
        <LogOut size={20} /> Logout
      </button>
    </aside>
  );
};

const NavItem = ({ href, icon, label }: { href: string; icon: any; label: string }) => (
  <Link href={href} className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-900 transition-colors">
    {icon} <span>{label}</span>
  </Link>
);