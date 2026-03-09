'use client';

import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Loader2, Save } from 'lucide-react';
import { adminProductService } from '@/services/admin-products.service';
import { Product } from '@/types/types';
import { useEffect } from 'react';

interface EditProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function EditProductModal({ product, isOpen, onClose }: EditProductModalProps) {
  const queryClient = useQueryClient();
  
  // Use 'values' to keep form in sync with the selected product
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    values: {
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || 0,
      isActive: product?.isActive ?? true,
    }
  });

  const mutation = useMutation({
    mutationFn: (data: any) => adminProductService.updateProduct(product.id, data),
    onSuccess: () => {
      // Refresh the list and close
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      onClose();
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-zinc-100">
          <h2 className="text-xl font-bold text-zinc-800">Edit Product</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
            <X size={20} className="text-zinc-500" />
          </button>
        </div>

        {/* handleSubmit passes the CURRENT input values to the mutation */}
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Product Name</label>
            <input 
              {...register('name', { required: "Name is required" })} 
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-500 outline-none transition-all"
            />
            {errors.name && <p className="text-rose-500 text-xs mt-1">{errors.name.message as string}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Description</label>
            <textarea 
              {...register('description')} 
              rows={3}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Price (₹)</label>
              <input 
                type="number" 
                {...register('price', { required: "Price is required", valueAsNumber: true })} 
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-500 outline-none transition-all"
              />
            </div>
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-3 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 cursor-pointer hover:bg-zinc-100 transition-colors">
                <input type="checkbox" {...register('isActive')} className="w-5 h-5 accent-rose-500" />
                <span className="text-sm font-semibold text-zinc-700">Active</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-3 font-bold text-zinc-500 hover:bg-zinc-50 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={mutation.isPending}
              className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-rose-200 transition-all disabled:opacity-70"
            >
              {mutation.isPending ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}