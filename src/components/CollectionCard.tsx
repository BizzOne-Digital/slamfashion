"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { CollectionCategory } from "@/types";

interface CollectionCardProps {
  collection: CollectionCategory;
  index: number;
}

export function CollectionCard({ collection, index }: CollectionCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ delay: index * 0.03, duration: 0.4 }}
      className="group bg-black border-2
            border-[#292929]
 hover:bg-[#0A0A0A] transition-colors duration-300"
    >
      {/* Image */}
      <div className="relative  aspect-square overflow-hidden bg-[#0A0A0A]">
        <Image
          src={collection.image}
          alt={collection.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, 25vw"
          unoptimized
        />
      </div>

      {/* Text — centered */}
      <div className="px-4 sm:px-6 py-6 sm:py-8 text-center border-t border-[#1F1F1F]">
        <h3 className="text-[11px] sm:text-xs font-black tracking-[0.14em] uppercase text-white">
          {collection.title}
        </h3>
        <p className="mt-3 text-[11px] sm:text-xs text-muted leading-relaxed mx-auto max-w-[220px]">
          {collection.description}
        </p>
        <Link
          href={`/shop?cat=${collection.slug}`}
          className="mt-5 inline-flex items-center justify-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-gold hover:opacity-80 transition-opacity"
        >
          Shop Now
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </motion.article>
  );
}
