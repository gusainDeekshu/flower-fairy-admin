// src\app\admin\storefront\page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import {
  LayoutTemplate,
  Plus,
  Save,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  Store,
} from "lucide-react";
import { SectionEditModal } from "./SectionEditModal";

export type ThemeSection = {
  id: string;
  type: string;
  isActive: boolean;
  settings?: any;
};

const AVAILABLE_SECTIONS = [
  {
    type: "HERO",
    label: "Hero Banner Slider",
    desc: "Top of page dynamic slider.",
  },
  {
    type: "TRUST_BADGES",
    label: "Trust Badges Ticker",
    desc: "Scrolling validation bar.",
  },
  {
    type: "CATEGORIES",
    label: "Category Grid",
    desc: "Visual category navigation.",
  },
  {
    type: "PRODUCT_CAROUSEL",
    label: "Product Carousel",
    desc: "Swipeable product row.",
  },
  {
    type: "PROMO_BANNER",
    label: "Promotional Banner",
    desc: "Full-width image breakout.",
  },
  {
    type: "BRAND_STORY",
    label: "Brand Story Block",
    desc: "Editorial text and image.",
  },
  {
    type: "BLOG_SECTION",
    label: "Journal / Blog",
    desc: "Latest articles feed.",
  },
];

export default function StorefrontBuilderPage() {
  const queryClient = useQueryClient();
  const [sections, setSections] = useState<ThemeSection[]>([]);
  const [storeId, setStoreId] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // 🔥 1. Just fetch the layout directly. The backend resolves the fallback storeId automatically.
  const { data: homeData, isLoading: isConfigLoading } = useQuery({
    queryKey: ["store-home-config"],
    queryFn: () => adminService.getHomepageData(),
  });

  // 2. Sync fetched data and backend-resolved Store ID to local state
  useEffect(() => {
    if (homeData) {
      if ((homeData as any).storeId) {
        setStoreId((homeData as any).storeId);
      }
      if ((homeData as any).config?.sectionsOrder) {
        setSections((homeData as any).config.sectionsOrder);
      }
    }
  }, [homeData]);

  // 3. Save Mutation using the resolved storeId
  const saveMutation = useMutation({
    mutationFn: async (newSections: ThemeSection[]) => {
      if (!storeId) throw new Error("Store ID is missing");
      return adminService.updateThemeConfig(storeId, {
        sectionsOrder: newSections,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store-home-config"] });
      alert("Storefront layout published successfully!");
    },
    onError: (error) => {
      console.error("Save failed:", error);
      alert("Failed to save layout. Ensure your config is correct.");
    },
  });

  const moveSection = (index: number, direction: "UP" | "DOWN") => {
    const newSections = [...sections];
    if (direction === "UP" && index > 0) {
      [newSections[index - 1], newSections[index]] = [
        newSections[index],
        newSections[index - 1],
      ];
    } else if (direction === "DOWN" && index < newSections.length - 1) {
      [newSections[index + 1], newSections[index]] = [
        newSections[index],
        newSections[index + 1],
      ];
    }
    setSections(newSections);
  };

  const removeSection = (index: number) =>
    setSections(sections.filter((_, i) => i !== index));

  const toggleActive = (index: number) => {
    const newSections = [...sections];
    newSections[index].isActive = !newSections[index].isActive;
    setSections(newSections);
  };

  const addSection = (type: string) => {
    setSections([
      ...sections,
      {
        id: `sec-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        type,
        isActive: true,
        settings: {},
      },
    ]);
  };

  if (isConfigLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#006044]" />
        <p className="font-medium tracking-widest uppercase text-sm">
          Resolving Storefront...
        </p>
      </div>
    );
  }

  // The "No Store Found" error block is completely removed because the backend guarantees an ID.

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-3 tracking-tight">
            <Store className="text-[#006044] w-7 h-7" /> Storefront Builder
          </h1>
          <p className="text-sm text-gray-500 mt-1.5 font-medium">
            Editing layout for Store ID:{" "}
            <span className="font-mono bg-gray-100 px-1 rounded">
              {storeId}
            </span>
          </p>
        </div>
        <button
          onClick={() => saveMutation.mutate(sections)}
          disabled={saveMutation.isPending || !storeId}
          className="flex items-center gap-2 bg-[#006044] hover:bg-[#004d36] text-white px-8 py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-[#006044]/20 transition-all disabled:opacity-70 uppercase tracking-widest"
        >
          {saveMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save size={18} />
          )}
          {saveMutation.isPending ? "Saving..." : "Publish Layout"}
        </button>
      </div>

      {/* Canvas and Toolbox Grid (Same as before) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Live Layout Canvas */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">
              Active Layout Sequence
            </h2>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              {sections.length} Sections
            </span>
          </div>

          {sections.length === 0 && (
            <div className="p-12 text-center border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 bg-gray-50">
              <LayoutTemplate className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="font-medium">No sections added yet.</p>
              <p className="text-sm mt-1">
                Build your page by adding blocks from the toolbox.
              </p>
            </div>
          )}

          <div className="space-y-3">
            {sections.map((section, index) => (
              <div
                key={section.id}
                className={`group flex items-center justify-between p-4 bg-white border rounded-2xl transition-all duration-300 ${section.isActive ? "border-gray-200 shadow-sm hover:shadow-md" : "border-gray-100 bg-gray-50 opacity-60"}`}
              >
                <div className="flex items-center gap-5">
                  <div className="flex flex-col gap-1 bg-gray-50 p-1 rounded-lg border border-gray-100">
                    <button
                      onClick={() => moveSection(index, "UP")}
                      disabled={index === 0}
                      className="text-gray-400 hover:text-gray-900 disabled:opacity-20 p-1 transition-colors"
                    >
                      <ArrowUp size={16} strokeWidth={3} />
                    </button>
                    <button
                      onClick={() => moveSection(index, "DOWN")}
                      disabled={index === sections.length - 1}
                      className="text-gray-400 hover:text-gray-900 disabled:opacity-20 p-1 transition-colors"
                    >
                      <ArrowDown size={16} strokeWidth={3} />
                    </button>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 tracking-wide text-sm">
                      {section.type.replace("_", " ")}
                    </h3>
                    <p className="text-[11px] text-gray-500 font-medium uppercase tracking-widest mt-1">
                      {section.settings?.title ||
                        section.settings?.dataSource ||
                        "Global Configuration"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 transition-opacity">
                  <button
                    onClick={() => toggleActive(index)}
                    className={`p-2.5 rounded-xl transition-colors ${section.isActive ? "text-[#006044] bg-[#006044]/10 hover:bg-[#006044]/20" : "text-gray-400 bg-gray-200 hover:bg-gray-300"}`}
                  >
                    {section.isActive ? (
                      <Eye size={18} />
                    ) : (
                      <EyeOff size={18} />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setEditingIndex(index);
                      setIsModalOpen(true);
                    }}
                    className="p-2.5 rounded-xl text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => removeSection(index)}
                    className="p-2.5 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Toolbox */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-2">
            Available Blocks
          </h2>
          <div className="grid grid-cols-1 gap-3 sticky top-24">
            {AVAILABLE_SECTIONS.map((block) => (
              <button
                key={block.type}
                onClick={() => addSection(block.type)}
                className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-[#006044] hover:shadow-md transition-all group text-left"
              >
                <div>
                  <span className="text-sm font-bold text-gray-900 group-hover:text-[#006044] block transition-colors">
                    {block.label}
                  </span>
                  <span className="text-[11px] text-gray-500 font-medium block mt-1">
                    {block.desc}
                  </span>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg group-hover:bg-[#006044]/10 transition-colors">
                  <Plus
                    size={18}
                    className="text-gray-400 group-hover:text-[#006044]"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {editingIndex !== null && (
        <SectionEditModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingIndex(null);
          }}
          section={sections[editingIndex]}
          onSave={(updatedSection) => {
            const newSections = [...sections];
            newSections[editingIndex] = updatedSection;
            setSections(newSections);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
