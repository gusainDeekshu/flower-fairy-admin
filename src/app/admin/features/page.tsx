"use client";

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Sparkles, Edit2, Trash2, ArrowUp, ArrowDown, Plus, Loader2, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import apiClient from '@/lib/api-client';

export default function FeaturesManagerPage() {
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // --- FETCH FEATURES ---
  const { data: features = [], isLoading } = useQuery({
    queryKey: ['admin-features'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/admin/features');
        // Fallback to an empty array if the response is completely empty/undefined
        return response ?? []; 
      } catch (error) {
        console.error("Failed to fetch features:", error);
        return []; // Return empty array on error so React Query doesn't crash
      }
    }, 
  });

  // --- REORDER MUTATION (Optimistic Update) ---
  const reorderMutation = useMutation({
    mutationFn: async (newOrder: { id: string; order: number }[]) => {
      return apiClient.patch('/admin/features/reorder', { updates: newOrder });
    },
    onMutate: async (newOrder) => {
      await queryClient.cancelQueries({ queryKey: ['admin-features'] });
      const previousFeatures = queryClient.getQueryData(['admin-features']);
      
      // Optimistically update the cache
      queryClient.setQueryData(['admin-features'], (old: any[]) => {
        const updated = [...old];
        newOrder.forEach(update => {
          const index = updated.findIndex(f => f.id === update.id);
          if (index !== -1) updated[index] = { ...updated[index], order: update.order };
        });
        return updated.sort((a, b) => a.order - b.order);
      });
      
      return { previousFeatures };
    },
    onError: (err, newOrder, context) => {
      queryClient.setQueryData(['admin-features'], context?.previousFeatures);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-features'] });
      queryClient.invalidateQueries({ queryKey: ['active-features'] }); // Invalidate public store UI
    },
  });

  // --- MOVE UP / DOWN LOGIC ---
  const moveFeature = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === features.length - 1) return;

    const newFeatures = [...features];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;

    // Swap their 'order' values
    const tempOrder = newFeatures[index].order;
    newFeatures[index].order = newFeatures[swapIndex].order;
    newFeatures[swapIndex].order = tempOrder;

    // Fire mutation with just the two updated items
    reorderMutation.mutate([
      { id: newFeatures[index].id, order: newFeatures[index].order },
      { id: newFeatures[swapIndex].id, order: newFeatures[swapIndex].order }
    ]);
  };

  // --- DELETE MUTATION ---
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/admin/features/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-features'] });
      queryClient.invalidateQueries({ queryKey: ['active-features'] });
    }
  });

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* HEADER */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-zinc-100">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl">
            <Sparkles size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-zinc-800 tracking-tight">Highlight Features</h1>
            <p className="text-xs text-zinc-500 font-medium mt-1">Manage global service badges (e.g., Same Day Delivery)</p>
          </div>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-zinc-900 hover:bg-zinc-800 text-white px-5 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 transition-colors shadow-md"
        >
          <Plus size={18} /> Add Highlight
        </button>
      </div>

      {/* LIST */}
      <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
        {isLoading ? (
          <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-zinc-400" size={32} /></div>
        ) : features.length === 0 ? (
          <div className="p-10 text-center text-zinc-500 font-medium">No features added yet.</div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {features.map((feature: any, index: number) => (
              <div key={feature.id} className="p-5 flex items-center justify-between hover:bg-zinc-50 transition-colors group">
                
                {/* Left: Ordering & Info */}
                <div className="flex items-center gap-6">
                  <div className="flex flex-col gap-1 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => moveFeature(index, 'up')} disabled={index === 0} className="hover:text-zinc-600 disabled:opacity-30"><ArrowUp size={16}/></button>
                    <button onClick={() => moveFeature(index, 'down')} disabled={index === features.length - 1} className="hover:text-zinc-600 disabled:opacity-30"><ArrowDown size={16}/></button>
                  </div>
                  
                  <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-600 shadow-inner text-sm font-bold">
                    {/* Render actual icon dynamically later, showing string name for now */}
                    {feature.icon.substring(0,2).toUpperCase()}
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-zinc-800 text-lg">{feature.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-mono bg-zinc-100 px-2 py-0.5 rounded text-zinc-500">Lucide: {feature.icon}</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${feature.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {feature.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex gap-2">
                  <button className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => { if(confirm('Remove this feature?')) deleteMutation.mutate(feature.id) }}
                    className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* QUICK ADD MODAL */}
      {isAddModalOpen && (
        <AddFeatureModal onClose={() => setIsAddModalOpen(false)} />
      )}
    </div>
  );
}

// --- SUB-COMPONENT: ADD MODAL ---
function AddFeatureModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();

  const createMutation = useMutation({
    mutationFn: (data: any) => apiClient.post('/admin/features', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-features'] });
      reset();
      onClose();
    }
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b flex justify-between items-center bg-zinc-50">
          <h2 className="text-lg font-black text-zinc-800 uppercase tracking-tight">New Highlight</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-200 rounded-full transition-colors"><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit((data) => createMutation.mutate({ ...data, isActive: true }))} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Display Title</label>
            <input {...register("title", { required: true })} placeholder="e.g. 100% Organic" className="w-full p-4 border rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none font-bold text-sm" />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex justify-between">
              Lucide Icon Name 
              <a href="https://lucide.dev/icons" target="_blank" className="text-blue-500 hover:underline">Find Icons &rarr;</a>
            </label>
            <input {...register("icon", { required: true })} placeholder="e.g. Leaf, Truck, ShieldCheck" className="w-full p-4 border rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none font-bold text-sm" />
          </div>

          <button 
            type="submit" 
            disabled={createMutation.isPending} 
            className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-bold mt-4 hover:bg-zinc-800 disabled:opacity-50 transition-colors flex justify-center"
          >
            {createMutation.isPending ? <Loader2 className="animate-spin" /> : 'Save Feature'}
          </button>
        </form>
      </div>
    </div>
  );
}