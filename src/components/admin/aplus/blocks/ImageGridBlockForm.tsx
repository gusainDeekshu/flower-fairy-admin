import React from 'react';
import { useFormContext, useController } from "react-hook-form";
import { Trash2 } from 'lucide-react';
import CloudinaryUpload from '../shared/CloudinaryUpload';

export default function ImageGridBlockForm({ index }: { index: number }) {
  const { register, control } = useFormContext();
  const basePath = `extra.aPlusContent.${index}.content`;

  // 🔥 PRODUCTION-GRADE: useController binds this custom UI directly to RHF's engine
  const { 
    field: { value, onChange } 
  } = useController({
    name: `${basePath}.images`,
    control,
    defaultValue: [], // Guarantees RHF initializes this path as an array
  });

  // Ensure it's always an array to prevent mapping errors
  const currentImages = Array.isArray(value) ? value : [];

  const handleUpload = (url: string) => {
    // 100% reliable state update. RHF will immediately re-render the UI.
    onChange([...currentImages, url]);
  };

  const handleDelete = (idxToDelete: number) => {
    // Standard array filtering hooked directly into RHF
    onChange(currentImages.filter((_, i) => i !== idxToDelete));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">
          Grid Title (Optional)
        </label>
        <input 
          {...register(`${basePath}.title`)} 
          className="w-full px-4 py-3 border rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#006044] bg-white font-medium" 
          placeholder="Gallery" 
        />
      </div>
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest">
            Grid Images
          </label>
          <CloudinaryUpload 
            multiple 
            buttonText="ADD IMAGES"
            className="bg-[#006044] text-white px-4 py-2 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-md hover:bg-[#004d36] transition"
            onUpload={handleUpload}
          />
        </div>

        <div className="grid grid-cols-4 gap-4 bg-white p-4 rounded-2xl border border-zinc-200">
          {currentImages.map((imgUrl: string, idx: number) => (
            <div key={idx} className="relative aspect-square rounded-xl border bg-zinc-50 overflow-hidden group">
              <img src={imgUrl} alt="grid" className="w-full h-full object-cover" />
              <button 
                type="button" 
                onClick={() => handleDelete(idx)}
                className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 shadow hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {currentImages.length === 0 && (
            <div className="col-span-4 text-center py-8 text-xs text-zinc-400 font-bold uppercase tracking-widest">
              No images added yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}