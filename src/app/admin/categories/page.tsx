'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminCategoryService } from '@/services/admin-category.service';
import { Trash2, Plus, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function CategoryPage() {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');

  const { data: categories, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: adminCategoryService.getCategories
  });

  const createMutation = useMutation({
    mutationFn: (newData: { name: string; slug: string }) => 
      adminCategoryService.createCategory(newData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setName('');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminCategoryService.deleteCategory(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = name.toLowerCase().replace(/ /g, '-');
    createMutation.mutate({ name, slug });
  };

  if (isLoading) return <Loader2 className="animate-spin m-10" />;

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Category Management</h1>

      <form onSubmit={handleAdd} className="flex gap-4 bg-white p-4 rounded-lg border">
        <input 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New Category Name (e.g. Birthday Cakes)"
          className="flex-1 border p-2 rounded"
          required
        />
        <button 
          disabled={createMutation.isPending}
          className="bg-rose-500 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={18} /> Add Category
        </button>
      </form>

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-zinc-50 border-b">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Slug</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(categories) && categories?.map((cat: any) => (
              <tr key={cat.id} className="border-b last:border-0">
                <td className="p-4 font-medium">{cat.name}</td>
                <td className="p-4 text-zinc-500">{cat.slug}</td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => deleteMutation.mutate(cat.id)}
                    className="text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}