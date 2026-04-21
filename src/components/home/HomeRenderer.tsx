// src\components\home\HomeRenderer.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useStorefrontStore } from "@/store/useStorefrontStore";
import { HeroBanner } from "./HeroBanner";
import { ProductCarousel } from "./ProductCarousel";
import { PromotionalBanner } from "./PromotionalBanner";
import { TrustTicker } from "./TrustTicker";
import { BrandStory } from "./BrandStory";
import HomeBlogSection from "./HomeBlogSection";
import { CollectionsShowcase } from "./CollectionsShowcase";

const SECTION_COMPONENTS: Record<string, React.FC<any>> = {
  HERO: HeroBanner,
  COLLECTIONS: CollectionsShowcase,
  PRODUCT_CAROUSEL: ProductCarousel,
  PROMO_BANNER: PromotionalBanner,
  TRUST_BADGES: TrustTicker,
  BRAND_STORY: BrandStory,
  BLOG_SECTION: HomeBlogSection,
};

interface HomeRendererProps {
  config: { sectionsOrder: any[] };
  data: any;
  previewMode?: boolean;
}

export default function HomeRenderer({
  config,
  data,
  previewMode = false,
}: HomeRendererProps) {
  // Mount state to prevent hydration errors when mixing Zustand with SSR
  const [mounted, setMounted] = useState(false);
  const liveSections = useStorefrontStore((state) => state.sections);

  useEffect(() => {
    setMounted(true);
  }, []);

  // If in preview mode inside the admin panel, use the Zustand store.
  // Otherwise, use the SSR injected config.
  const sectionsToRender =
    previewMode && mounted ? liveSections : config?.sectionsOrder;

  if (!sectionsToRender) return null;

  return (
    <div
      className={`flex flex-col gap-y-12 md:gap-y-16 bg-white ${
        previewMode ? "min-h-full pb-16" : "min-h-screen pb-24"
      }`}
    >
      {sectionsToRender
        .filter((section: any) => section.isActive)
        .map((section: any) => {
          const Component = SECTION_COMPONENTS[section.type];
          if (!Component) return null;

          const resolvedData = resolveData(section, data);

          return (
            <section
              key={section.id}
              id={section.id}
              className="w-full px-4 md:px-0"
            >
              <Component
                data={resolvedData}
                settings={section.settings || {}}
              />
            </section>
          );
        })}
    </div>
  );
}

// Inside src/components/home/HomeRenderer.tsx

function resolveData(section: any, data: any) {
  switch (section.type) {
    case 'PRODUCT_CAROUSEL':
    case 'FEATURED_PRODUCTS':
      return data[section.settings?.dataSource] || [];
    case 'COLLECTIONS': // 🚨 REPLACED CATEGORIES WITH COLLECTIONS
      return null; 
    case 'BLOG_SECTION':
      return data.blogs || [];
    case 'HERO':
      return data.banners || []; 
    default:
      return null;
  }
}