"use client";

import { useStorefrontStore } from "@/store/useStorefrontStore";
import { CldUploadWidget } from "next-cloudinary";
import { Upload, X, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";

export function SectionConfigPanel() {
  const { sections, activeSectionId, updateSectionSettings } = useStorefrontStore();
  const activeSection = sections.find((s) => s.id === activeSectionId);

  const isCollectionBlock = activeSection?.type === "COLLECTIONS";
  // 🔥 FETCH COLLECTIONS
  const { 
    data: collections, // <-- Removed the = [] default here to check real loading state
    isLoading: isLoadingCollections,
    isFetching, // <-- Added this to track background fetching
    refetch
  } = useQuery({
    queryKey: ["builder-collections", activeSection?.id],
    queryFn: async () => {
      try {
        const res: any = await apiClient.get(`/admin/collections?t=${Date.now()}`);
        
        if (Array.isArray(res)) return res;
        if (res?.data && Array.isArray(res.data)) return res.data;
        
        return [];
      } catch (error) {
        console.error("Failed to fetch collections:", error);
        return [];
      }
    },
    enabled: isCollectionBlock,
    // 🚨 REMOVED: initialData: [], so the loading state actually triggers!
  });

  if (!activeSection) {
    return (
      <div className="flex items-center justify-center h-full text-xs font-black text-zinc-300 uppercase tracking-widest">
        Select a block to configure
      </div>
    );
  }

  const selectedCollectionId = typeof activeSection.settings?.collectionId === "string" 
    ? activeSection.settings.collectionId 
    : "";

  const handleSelectCollection = (id: string) => {
    updateSectionSettings(activeSection.id, { collectionId: id });
  };

  // Safely fallback to empty array for rendering
  const safeCollections = collections || [];

  return (
    <div className="p-8 space-y-8 animate-in slide-in-from-right-4 duration-300">
      <div>
        <h3 className="text-2xl font-black text-zinc-900 tracking-tight">
          {activeSection.type.replace("_", " ")}
        </h3>
        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">
          Block Configuration
        </p>
      </div>

      <div className="space-y-8">
        
        {/* TITLE INPUT */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
            Section Title
          </label>
          <input
            type="text"
            className="w-full p-4 border border-zinc-200 rounded-2xl outline-none font-bold text-sm bg-white focus:ring-2 focus:ring-[#006044] transition-all"
            value={activeSection.settings.title || ""}
            onChange={(e) => updateSectionSettings(activeSection.id, { title: e.target.value })}
            placeholder="e.g. Featured Collection"
          />
        </div>

        {/* COLLECTIONS SELECTOR */}
        {isCollectionBlock && (
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                Select One Collection to Preview
              </label>
              
              <button 
                onClick={() => refetch()}
                disabled={isFetching}
                className="text-[10px] flex items-center gap-1 font-bold text-[#006044] hover:underline disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isFetching ? 'animate-spin' : ''}`} />
                Reload Data
              </button>
            </div>
            
            {/* 🚨 UPDATED LOGIC: Will show loading spinner first, instead of "No collections" */}
            {isLoadingCollections || (isFetching && safeCollections.length === 0) ? (
              <div className="text-sm font-medium text-zinc-500 animate-pulse">Loading collections...</div>
            ) : safeCollections.length === 0 ? (
              <div className="text-sm font-medium text-amber-600 bg-amber-50 border border-amber-100 p-4 rounded-xl">
                No collections found. Click 'Reload Data' to fetch again.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {safeCollections.map((col: any) => {
                  const isSelected = selectedCollectionId === col.id;
                  return (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => handleSelectCollection(col.id)}
                      className={`px-4 py-2 text-xs font-bold rounded-full border transition-all ${
                        isSelected
                          ? "bg-[#006044] text-white border-[#006044] shadow-md scale-105"
                          : "bg-white text-zinc-600 border-zinc-200 hover:border-[#006044] hover:bg-green-50"
                      }`}
                    >
                      {col.name} {isSelected && "✓"}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* IMAGE UPLOAD */}
        {["HERO", "PROMO_BANNER"].includes(activeSection.type) && (
          <div className="space-y-3 pt-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              Banner Image *
            </label>
            <div className="flex gap-4 flex-wrap">
              {activeSection.settings.imageUrl ? (
                <div className="relative h-40 w-full rounded-3xl overflow-hidden border shadow-sm group">
                  <img src={activeSection.settings.imageUrl} className="h-full w-full object-cover" alt="Banner" />
                  <button 
                    type="button"
                    onClick={() => updateSectionSettings(activeSection.id, { imageUrl: null })} 
                    className="absolute top-3 right-3 bg-white/90 rounded-full p-2 hover:bg-red-50 hover:text-red-500"
                  >
                    <X size={16} strokeWidth={3} />
                  </button>
                </div>
              ) : (
                <CldUploadWidget 
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET} 
                  onSuccess={(result: any) => {
                    if (result.event === "success") {
                      updateSectionSettings(activeSection.id, { imageUrl: result.info.secure_url });
                    }
                  }}
                >
                  {({ open }) => (
                    <button 
                      type="button" onClick={() => open()} 
                      className="h-40 w-full border-2 border-dashed border-zinc-300 rounded-3xl flex flex-col items-center justify-center text-zinc-400 hover:border-[#006044] hover:bg-green-50 transition-all"
                    >
                      <Upload size={28} />
                      <span className="text-[10px] font-black mt-3 tracking-widest uppercase">Upload Photo</span>
                    </button>
                  )}
                </CldUploadWidget>
              )}
            </div>
          </div>
        )}

        {/* DATA SOURCE */}
        {["PRODUCT_CAROUSEL", "BLOG_SECTION"].includes(activeSection.type) && (
          <div className="space-y-2 pt-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              Data Source (Key)
            </label>
            <input
              type="text"
              className="w-full p-4 border border-zinc-200 rounded-2xl outline-none font-bold text-sm bg-white focus:ring-2 focus:ring-[#006044] transition-all font-mono"
              value={activeSection.settings.dataSource || ""}
              onChange={(e) => updateSectionSettings(activeSection.id, { dataSource: e.target.value })}
              placeholder="e.g. newArrivals"
            />
          </div>
        )}
      </div>
    </div>
  );
}