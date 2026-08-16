"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description?: string;
  image?: string;
  className?: string;
}

export function PageHero({
  eyebrow,
  title,
  description,
  image = "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1920&q=80",
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative py-28 lg:py-36 overflow-hidden grain",
        className
      )}
    >
      <div className="absolute inset-0">
        <Image
          src={image}
          alt=""
          fill
          className="object-cover opacity-25"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/90 to-black" />
        <div className="absolute inset-0 mesh-bg" />
        <div className="absolute inset-0 grid-pattern opacity-30" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <p className="text-gold text-[11px] font-bold tracking-[0.35em] uppercase mb-5">
            {eyebrow}
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05]">
            {title}
          </h1>
          {description && (
            <p className="mt-6 text-lg text-white/50 leading-relaxed max-w-xl">
              {description}
            </p>
          )}
          <div className="section-divider mt-10 w-24" />
        </motion.div>
      </div>
    </section>
  );
}
