'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { LayoutDashboard, ShoppingBag, Package, Settings, LogOut, Menu, X, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const logoutStore = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    logoutStore(); // Clear local Zustand state
    await signOut({ callbackUrl: '/admin/login' }); // Clear NextAuth cookie & Redirect
  };

  const navItems = [
    { href: '/admin', icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { href: '/admin/orders', icon: <ShoppingBag size={20} />, label: "Orders" },
    { href: '/admin/products', icon: <Package size={20} />, label: "Products" },
    { href: '/admin/categories', icon: <Package size={20} />, label: "Categories" },
  ];

  return (
    <>
      {/* Mobile Trigger */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-zinc-950 text-white sticky top-0 z-50 border-b border-zinc-800">
        <span className="text-rose-500 font-bold">Admin Portal</span>
        <button onClick={() => setIsOpen(true)}><Menu size={24} /></button>
      </div>

      {/* Sidebar Content */}
      <aside className={`
        fixed inset-y-0 left-0 z-[60] w-64 bg-zinc-950 text-white transform transition-transform duration-300
        lg:translate-x-0 lg:static lg:inset-0 border-r border-zinc-800 flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex justify-between items-center border-b border-zinc-800">
          <span className="text-xl font-bold text-rose-500">Admin</span>
          <button className="lg:hidden" onClick={() => setIsOpen(false)}><X size={24} /></button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 p-3 rounded-lg ${pathname === item.href ? 'bg-zinc-900 text-rose-500' : 'text-zinc-400 hover:text-white'}`}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>

        <button 
          onClick={handleLogout} 
          className="p-4 flex items-center gap-3 border-t border-zinc-800 text-zinc-400 hover:text-white mt-auto"
        >
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-[55] lg:hidden" onClick={() => setIsOpen(false)} />}
    </>
  );
};