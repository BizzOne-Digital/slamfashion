"use client";

import { PillarIcon } from "@/components/about/PillarIcons";
import type { BrandPillar } from "@/types";

interface ContactPillarsBarProps {
  pillars: BrandPillar[];
}

export function ContactPillarsBar({ pillars }: ContactPillarsBarProps) {
  return (
    <section className="border-y border-template bg-black">
      <div className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-[#1F1F1F]">
          {pillars.map((pillar) => (
            <div
              key={pillar.id}
              className="flex flex-col items-center text-center px-4 py-8 lg:py-10"
            >
              <div className="w-10 h-10 rounded-full border border-gold/30 bg-gold/5 flex items-center justify-center mb-4">
                <PillarIcon icon={pillar.icon} className="w-4 h-4 text-gold" />
              </div>
              <h3 className="text-[10px] font-black tracking-[0.1em] uppercase text-gold leading-snug">
                {pillar.title}.
              </h3>
              <p className="mt-2 text-[11px] text-muted leading-relaxed max-w-[160px]">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
