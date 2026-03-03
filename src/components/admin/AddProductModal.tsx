// src/components/admin/AddProductModal.tsx
'use client';

import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X, Upload, Loader2, Save, AlertCircle } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
import { useState } from 'react';
import apiClient from '@/lib/api-client';
import { adminProductService } from '@/services/admin-products.service';

export const AddProductModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const queryClient = useQueryClient();
  const [imageUrl, setImageUrl] = useState<string>('');
  
  // Fetch dynamic categories from your schema
  const { data: categories } = useQuery({ 
    queryKey: ['categories'], 
    queryFn: () => apiClient.get('/categories') 
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const mutation = useMutation({
  mutationFn: async (formData: any) => {
    // 1. Verify we have an image
    if (!imageUrl) throw new Error("Please upload an image first");

    // 2. Prepare Production Payload
    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      categoryId: formData.categoryId, // From the dropdown
      image: imageUrl, // Single string as per your schema
      stock: parseInt(formData.stock || "0"),
      // You need a valid Store ID from your DB here
      storeId: "cmm104jw300007gty09c8e8ey", 
    };

    return adminProductService.createProduct(payload);
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    reset();
    setImageUrl('');
    onClose();
  },
  onError: (error: any) => {
    console.error("Save Error:", error);
  }
});

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        <div className="p-6 border-b flex justify-between items-center bg-zinc-50">
          <h2 className="text-xl font-bold text-zinc-800">New Product Entry</h2>
          <button onClick={onClose} className="p-1 hover:bg-zinc-200 rounded-full transition-colors"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="p-6 space-y-4">
          {/* Validation Feedback */}
          {Object.keys(errors).length > 0 && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle size={16} /> All fields marked with * are required.
            </div>
          )}

          <input {...register('name', { required: true })} placeholder="Product Name *" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 uppercase">Category *</label>
              <select {...register('categoryId', { required: true })} className="w-full p-2.5 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-rose-500">
                {categories?.map((cat: any) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 uppercase">Base Price *</label>
              <input {...register('price', { required: true })} type="number" step="0.01" placeholder="0.00" className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-500 uppercase">Product Image *</label>
            <CldUploadWidget 
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              onSuccess={(result: any) => setImageUrl(result.info.secure_url)}
            >
              {({ open }) => (
                <button type="button" onClick={() => open()} className={`w-full flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-xl transition-all ${imageUrl ? 'border-green-500 bg-green-50' : 'border-zinc-300 hover:border-rose-500 bg-zinc-50'}`}>
                  {imageUrl ? <img src={imageUrl} alt="Preview" className="h-20 w-20 object-cover rounded-lg shadow-sm" /> : <Upload className="text-zinc-400" size={32} />}
                  <span className="text-sm text-zinc-500 font-medium">{imageUrl ? 'Image Ready' : 'Click to Upload'}</span>
                </button>
              )}
            </CldUploadWidget>
          </div>

          <textarea {...register('description')} placeholder="Description" rows={3} className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500" />

          <button disabled={mutation.isPending || !imageUrl} className="w-full bg-rose-500 text-white py-3 rounded-xl font-bold hover:bg-rose-600 disabled:bg-zinc-300 flex justify-center items-center gap-2 shadow-lg">
            {mutation.isPending ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Publish Product</>}
          </button>
        </form>
      </div>
    </div>
  );
};