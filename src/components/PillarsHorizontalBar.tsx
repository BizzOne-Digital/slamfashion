"use client";

import { PillarIcon } from "@/components/about/PillarIcons";
import type { BrandPillar } from "@/types";

interface PillarsHorizontalBarProps {
  pillars: BrandPillar[];
}

export function PillarsHorizontalBar({ pillars }: PillarsHorizontalBarProps) {
  return (
    <section className="border-y border-template bg-black">
      <div className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-[#1F1F1F]">
          {pillars.map((pillar) => (
            <div
              key={pillar.id}
              className="flex items-start gap-4 px-5 py-8 lg:py-10"
            >
              <div className="shrink-0 w-9 h-9 rounded-full border border-gold/30 bg-gold/5 flex items-center justify-center mt-0.5">
                <PillarIcon icon={pillar.icon} className="w-4 h-4 text-gold" />
              </div>
              <div className="min-w-0">
                <h3 className="text-[10px] font-black tracking-[0.08em] uppercase text-white leading-snug">
                  {pillar.title}.
                </h3>
                <p className="mt-1.5 text-[11px] text-muted leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
