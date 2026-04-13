"use client";

import React, { useState } from "react";

export default function AdminMenuPreview({ groups }: { groups: any[] }) {
  const [activeGroup, setActiveGroup] = useState<number | null>(null);

  return (
    <div className="w-full bg-white border-b shadow-sm sticky top-0 z-50">
      
      {/* TOP NAV */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex gap-8 items-center">
        <div className="font-black text-lg">AE NATURALS</div>

        {groups.map((group, gIdx) => (
          <div
            key={gIdx}
            onMouseEnter={() => setActiveGroup(gIdx)}
            onMouseLeave={() => setActiveGroup(null)}
            className="relative"
          >
            <span className="font-semibold text-sm uppercase tracking-wide cursor-pointer hover:text-[#006044]">
              {group.title}
            </span>

            {/* 🔥 MEGA MENU */}
            {activeGroup === gIdx && (
              <div className="absolute left-0 top-full mt-4 w-[900px] bg-white border rounded-2xl shadow-2xl p-8 grid grid-cols-3 gap-10">

                {(group.columns || []).map((col: any, cIdx: number) => (
                  <div key={cIdx}>
                    
                    {/* COLUMN TITLE */}
                    <h3 className="font-bold text-lg mb-4 text-gray-900">
                      {col.title}
                    </h3>

                    {/* ITEMS */}
                    <div className="flex flex-col gap-3">
                      {(col.items || []).map((item: any, iIdx: number) => (
                        <span
                          key={iIdx}
                          className="text-sm text-gray-600 hover:text-black cursor-pointer transition"
                        >
                          {item.label}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}

              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}