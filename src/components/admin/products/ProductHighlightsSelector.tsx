"use client";

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import * as LucideIcons from 'lucide-react';
import { Loader2 } from 'lucide-react';

interface Props {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export default function ProductHighlightsSelector({ selectedIds, onChange }: Props) {
  // Fetch global master list of highlights
  const { data: masterHighlights = [], isLoading } = useQuery({
    queryKey: ['admin-features'],
    queryFn: () => apiClient.get('/admin/features'),
  });

  const toggleHighlight = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  if (isLoading) return <Loader2 className="animate-spin text-zinc-400" />;

  return (
    <div className="space-y-3">
      <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">
        Product Highlights
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {Array.isArray(masterHighlights) && masterHighlights.map((feature: any) => {
          const IconComponent = (LucideIcons as any)[feature.icon] || LucideIcons.CheckCircle;
          const isSelected = selectedIds.includes(feature.id);

          return (
            <div 
              key={feature.id}
              onClick={() => toggleHighlight(feature.id)}
              className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                isSelected 
                  ? 'bg-green-50 border-[#006044] text-[#006044] shadow-sm' 
                  : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-zinc-100'
              }`}
            >
              <IconComponent size={18} />
              <span className="text-sm font-bold">{feature.title}</span>
            </div>
          );
        })}
      </div>
      <p className="text-[10px] text-zinc-400">Select the highlights to display on this specific product's page. The order clicked determines the display order.</p>
    </div>
  );
}