// src/app/admin/products/page.tsx
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusCircle, Loader2, Package } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { AddProductModal } from '@/components/admin/AddProductModal';

export default function ProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => apiClient.get('/products'),
  });

  const variantMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { stock: number } }) => 
      apiClient.patch(`/admin/products/variants/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });

  if (isLoading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="animate-spin text-rose-500" size={40} />
        <p className="text-zinc-500 font-medium">Loading Inventory...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-zinc-800">
          <Package className="text-rose-500" /> Inventory Management
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-rose-500 hover:bg-rose-600 text-white flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all shadow-sm active:scale-95"
        >
          <PlusCircle size={20} /> Add New Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((product: any) => (
          <div key={product.id} className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4 border-b pb-2">
              <h3 className="font-bold text-lg text-zinc-800">{product.name}</h3>
              {/* FIX: Access .name instead of rendering the whole object */}
              <span className="text-xs bg-zinc-100 text-zinc-500 px-2 py-1 rounded uppercase font-bold">
                {typeof product.category === 'object' ? product.category.name : product.category}
              </span>
            </div>
            
            <div className="space-y-3">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Stock by Variant</p>
              {product.variants?.map((v: any) => (
                <div key={v.id} className="bg-zinc-50 p-3 rounded-lg flex justify-between items-center group border border-transparent hover:border-zinc-200 transition-all">
                  <span className="text-sm font-medium text-zinc-600">{v.name}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      className="w-20 border border-zinc-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all"
                      defaultValue={v.stock}
                      onBlur={(e) => {
                        const newStock = parseInt(e.target.value);
                        if (!isNaN(newStock)) {
                          variantMutation.mutate({ id: v.id, data: { stock: newStock } });
                        }
                      }}
                    />
                  </div>
                </div>
              ))}
              {(!product.variants || product.variants.length === 0) && (
                <p className="text-sm text-zinc-400 italic">No variants defined</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}