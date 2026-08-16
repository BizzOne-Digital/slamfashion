"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "./Button";

interface HeroProps {
  headline: string;
  subheadline: string;
  cta: string;
}

export function Hero({ headline, subheadline, cta }: HeroProps) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  const parts = headline.split(". ").filter(Boolean);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden grain">
      <motion.div style={{ y }} className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1920&q=80"
          alt="S.L.A.M. premium apparel"
          fill
          className="object-cover scale-105"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
        <div className="absolute inset-0 mesh-bg" />
        <div className="absolute inset-0 grid-pattern opacity-40" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 glass-light border border-white/10 rounded-full mb-8">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse-gold" />
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/70">
                  S.L.A.M. — Submit Like A Man
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-black tracking-tight text-white leading-[0.95]">
                {parts.map((part, i) => (
                  <span key={i} className="block">
                    {i === 0 ? (
                      <span className="gold-text">{part}</span>
                    ) : (
                      <span className="text-white/90">{part}</span>
                    )}
                    {i < parts.length - 1 && "."}
                  </span>
                ))}
              </h1>

              <p className="mt-8 text-base sm:text-lg lg:text-xl text-white/55 max-w-xl leading-relaxed font-light">
                {subheadline}
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Button href="/shop" size="lg">
                  {cta}
                </Button>
                <Button href="/about" variant="outline" size="lg">
                  Our Story
                </Button>
              </div>

              <div className="mt-14 flex items-center gap-8">
                {[
                  { label: "Premium Quality", value: "Crafted" },
                  { label: "Faith-Driven", value: "Purpose" },
                  { label: "Street Luxury", value: "Style" },
                ].map((item) => (
                  <div key={item.label} className="hidden sm:block">
                    <p className="text-gold text-sm font-black tracking-wider uppercase">
                      {item.value}
                    </p>
                    <p className="text-[10px] text-white/35 tracking-wider uppercase mt-0.5">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block lg:col-span-5 relative h-[500px]"
          >
            <div className="absolute top-0 right-0 w-64 h-80 rounded-sm overflow-hidden border border-white/10 shadow-2xl animate-float">
              <Image
                src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80"
                alt="S.L.A.M. tee"
                fill
                className="object-cover"
                sizes="256px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-[10px] font-bold tracking-wider uppercase text-gold">
                  Classic Tee
                </p>
                <p className="text-white font-bold text-sm mt-0.5">From $45</p>
              </div>
            </div>
            <div
              className="absolute bottom-8 left-0 w-56 h-72 rounded-sm overflow-hidden border border-gold/20 shadow-2xl shadow-gold/10"
              style={{ animationDelay: "1s" }}
            >
              <Image
                src="https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&q=80"
                alt="S.L.A.M. headwear"
                fill
                className="object-cover"
                sizes="224px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-[10px] font-bold tracking-wider uppercase text-gold">
                  Headwear
                </p>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-gold/20 rounded-full flex items-center justify-center">
              <div className="w-24 h-24 border border-gold/10 rounded-full flex items-center justify-center">
                <span className="text-gold text-xs font-black tracking-[0.2em] text-center leading-tight">
                  S.L.A.M.
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <Link
          href="#essence"
          className="flex flex-col items-center gap-2 text-white/30 hover:text-gold transition-colors"
        >
          <span className="text-[9px] font-bold tracking-[0.3em] uppercase">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-5 h-8 border border-white/20 rounded-full flex justify-center pt-1.5"
          >
            <div className="w-0.5 h-2 bg-gold rounded-full" />
          </motion.div>
        </Link>
      </motion.div>
    </section>
  );
}
