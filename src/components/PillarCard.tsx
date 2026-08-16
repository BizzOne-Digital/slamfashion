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

interface PillarCardProps {
  pillar: BrandPillar;
  index: number;
}

export function PillarCard({ pillar, index }: PillarCardProps) {
  const Icon = iconMap[pillar.icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="group relative"
    >
      <div className="relative h-full p-6 lg:p-8 bg-surface-light border border-white/5 hover:border-gold/30 rounded-sm transition-all duration-500 card-shine overflow-hidden">
        <span className="absolute top-4 right-4 text-5xl font-black text-white/[0.03] group-hover:text-gold/[0.06] transition-colors select-none">
          0{index + 1}
        </span>

        <div className="absolute top-0 left-0 w-full h-px gold-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="w-14 h-14 rounded-sm gold-gradient flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
          <Icon className="w-7 h-7 text-black" />
        </div>

        <h3 className="text-lg font-black text-white mb-3 tracking-wide group-hover:text-gold transition-colors duration-300">
          {pillar.title}
        </h3>
        <p className="text-sm text-white/45 leading-relaxed">
          {pillar.description}
        </p>
      </div>
    </motion.div>
  );
}
