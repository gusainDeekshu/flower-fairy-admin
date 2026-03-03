// src/app/admin/products/add/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminProductService } from '@/services/admin-products.service';
import { useRouter } from 'next/navigation';

export default function AddProductPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm();

  const mutation = useMutation({
    mutationFn: adminProductService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      router.push('/admin/products');
    },
  });

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      <form onSubmit={handleSubmit((data) => mutation.mutate(data as any))} className="space-y-4">
        <input {...register('name')} placeholder="Product Name" className="w-full p-2 border rounded" required />
        <textarea {...register('description')} placeholder="Description" className="w-full p-2 border rounded" />
        <div className="grid grid-cols-2 gap-4">
          <input {...register('price')} type="number" placeholder="Regular Price" className="p-2 border rounded" required />
          <input {...register('salePrice')} type="number" placeholder="Sale Price (Optional)" className="p-2 border rounded" />
        </div>
        <input {...register('category')} placeholder="Category (e.g., FLOWERS, CAKES)" className="w-full p-2 border rounded" required />
        <input {...register('stock')} type="number" placeholder="Initial Stock" className="w-full p-2 border rounded" required />
        
        <button 
          disabled={mutation.isPending}
          className="bg-rose-500 text-white px-6 py-2 rounded-lg hover:bg-rose-600 disabled:bg-zinc-400"
        >
          {mutation.isPending ? 'Saving...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
}