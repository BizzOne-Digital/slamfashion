"use client";

import {
  Shield,
  Dumbbell,
  Mountain,
  Crown,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import type { BrandPillar } from "@/types";

const iconMap: Record<BrandPillar["icon"], LucideIcon> = {
  shield: Shield,
  dumbbell: Dumbbell,
  lion: Crown,
  mountain: Mountain,
  crown: Crown,
};

interface PillarIconCardProps {
  pillar: BrandPillar;
  index: number;
}

export function PillarIconCard({ pillar, index }: PillarIconCardProps) {
  const Icon = iconMap[pillar.icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="flex flex-col items-center text-center p-6 card-dark rounded-sm hover:border-gold/25 transition-colors"
    >
      <div className="w-14 h-14 flex items-center justify-center border border-template rounded-sm mb-4">
        <Icon className="w-6 h-6 text-gold" strokeWidth={1.5} />
      </div>
      <h3 className="text-xs font-black tracking-[0.12em] uppercase text-white">
        {pillar.title}
      </h3>
      <p className="mt-2 text-xs text-muted leading-relaxed">
        {pillar.description}
      </p>
    </motion.div>
  );
}
