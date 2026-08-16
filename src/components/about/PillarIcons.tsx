import {
  Shield,
  Dumbbell,
  Mountain,
  Crown,
  type LucideIcon,
} from "lucide-react";
import type { BrandPillar } from "@/types";

export const pillarIconMap: Record<BrandPillar["icon"], LucideIcon> = {
  shield: Shield,
  dumbbell: Dumbbell,
  lion: Crown,
  mountain: Mountain,
  crown: Crown,
};

export function PillarIcon({
  icon,
  className = "w-5 h-5",
}: {
  icon: BrandPillar["icon"];
  className?: string;
}) {
  const Icon = pillarIconMap[icon];
  return <Icon className={className} strokeWidth={1.5} />;
}
