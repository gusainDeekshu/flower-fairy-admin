'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusCircle, Loader2, Package, CheckCircle2, AlertCircle } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { AddProductModal } from '@/components/admin/AddProductModal';
import { Product, Variant } from '@/types/types'; // Import the interfaces above

export default function ProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch products with the double-cast fix for Turbopack/Next.js Build
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const response = await apiClient.get('/products');
      return response as unknown as Product[];
    },
  });

  // Type-safe mutation for stock updates
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
    <div className="p-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-zinc-900">
            <Package className="text-rose-500" size={32} /> Inventory Management
          </h1>
          <p className="text-zinc-500 mt-1 text-sm">Monitor stock levels and manage product variants.</p>
        </div>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-rose-500 hover:bg-rose-600 text-white flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all shadow-md active:scale-95"
        >
          <PlusCircle size={20} /> Add New Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((product) => (
          <div key={product.id} className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4 border-b border-zinc-50 pb-3">
                <h3 className="font-bold text-lg text-zinc-800 line-clamp-1">{product.name}</h3>
                <span className="text-[10px] bg-zinc-100 text-zinc-600 px-2 py-1 rounded-full uppercase font-black tracking-tighter">
                  {typeof product.category === 'object' ? product.category.name : product.category}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                   <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Variant Control</p>
                   {variantMutation.isPending && <Loader2 className="animate-spin text-rose-500" size={14} />}
                </div>

                {product.variants?.map((v) => (
                  <div key={v.id} className="bg-zinc-50 p-3 rounded-xl flex justify-between items-center group border border-transparent hover:border-zinc-200 transition-all">
                    <span className="text-sm font-semibold text-zinc-700">{v.name}</span>
                    <div className="relative flex items-center">
                      <input
                        type="number"
                        className="w-20 bg-white border border-zinc-200 rounded-lg px-2 py-1.5 text-sm font-bold text-center focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all"
                        defaultValue={v.stock}
                        onBlur={(e) => {
                          const newStock = parseInt(e.target.value);
                          if (!isNaN(newStock) && newStock !== v.stock) {
                            variantMutation.mutate({ id: v.id, data: { stock: newStock } });
                          }
                        }}
                      />
                    </div>
                  </div>
                ))}

                {(!product.variants || product.variants.length === 0) && (
                  <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl text-amber-700">
                    <AlertCircle size={16} />
                    <p className="text-xs font-medium">No variants configured</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-50 flex items-center justify-between">
              <span className={`flex items-center gap-1.5 text-xs font-bold ${product.isActive ? 'text-emerald-600' : 'text-zinc-400'}`}>
                <CheckCircle2 size={14} /> {product.isActive ? 'VISIBLE' : 'HIDDEN'}
              </span>
              <button className="text-xs font-bold text-zinc-400 hover:text-rose-500 transition-colors">Edit Details</button>
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