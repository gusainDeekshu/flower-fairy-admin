// src/app/admin/products/page.tsx
'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';
import apiClient  from '@/lib/api-client';

export default function ProductVariantsPage() {
  const queryClient = useQueryClient();
  const { data: products } = useQuery({ queryKey: ['admin-products'], queryFn: () => apiClient.get('/products') });

  const variantMutation = useMutation({
    mutationFn: ({ id, data }: any) => adminService.updateVariant(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-products'] }),
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products?.map((product: any) => (
        <div key={product.id} className="bg-white p-5 rounded-lg border shadow-sm">
          <h3 className="font-bold text-lg mb-4">{product.name}</h3>
          <div className="space-y-3">
            {product.variants?.map((v: any) => (
              <div key={v.id} className="bg-slate-50 p-3 rounded text-sm">
                <div className="flex justify-between items-center">
                  <span>{v.name}</span>
                  <input 
                    type="number" 
                    className="w-20 border rounded px-1"
                    defaultValue={v.stock}
                    onBlur={(e) => variantMutation.mutate({ id: v.id, data: { stock: parseInt(e.target.value) } })}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}