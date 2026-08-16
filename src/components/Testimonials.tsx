"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "S.L.A.M. isn't just apparel — it's armor for the man who leads with faith. The quality is unmatched.",
    author: "Marcus T.",
    role: "Pastor & Fitness Coach",
  },
  {
    quote:
      "Finally, streetwear that represents who I am. Bold design, premium feel, and a message that matters.",
    author: "David R.",
    role: "Entrepreneur",
  },
  {
    quote:
      "The embroidery detail alone sets these pieces apart. I wear S.L.A.M. to the gym and to church.",
    author: "James K.",
    role: "Father of Three",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute inset-0 mesh-bg opacity-30" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-gold text-[11px] font-bold tracking-[0.35em] uppercase mb-4">
            Testimonials
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Worn With Purpose
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative p-8 bg-surface border border-white/5 rounded-sm hover:border-gold/20 transition-colors duration-500"
            >
              <Quote className="w-8 h-8 text-gold/30 mb-4" />
              <p className="text-white/60 leading-relaxed text-sm italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 pt-6 border-t border-white/5">
                <p className="text-white font-bold text-sm">{t.author}</p>
                <p className="text-white/35 text-xs mt-0.5">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LookbookStrip() {
  const images = [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80",
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",
    "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80",
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
  ];

  return (
    <section className="py-4 overflow-hidden">
      <div className="flex gap-3 animate-marquee">
        {[...images, ...images].map((src, i) => (
          <div
            key={i}
            className="relative w-64 h-80 shrink-0 rounded-sm overflow-hidden border border-white/5"
          >
            <Image
              src={src}
              alt="S.L.A.M. lookbook"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
              sizes="256px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        ))}
      </div>
    </section>
  );
}
