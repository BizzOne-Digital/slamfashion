"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { ShopCatalogCard } from "@/components/ShopCatalogCard";
import { PillarIconCard } from "@/components/PillarIconCard";
import { Monogram } from "@/components/Logo";
import { useStore } from "@/context/StoreContext";

export default function HomePage() {
  const { settings, featuredProducts } = useStore();
  const { brandCopy, pillars } = settings;

  return (
    <PageShell>
      {/* Hero — split layout with visible image panel */}
      <section className="border-b border-template bg-black">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[520px] lg:min-h-[calc(100vh-104px)]">
            <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-16 xl:px-20 py-14 lg:py-20">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="max-w-xl"
              >
                <p className="label-caps text-gold mb-6">S.L.A.M. Activewear</p>
                <h1 className="heading-xl text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white">
                  {brandCopy.heroHeadline}
                </h1>
                <p className="mt-8 text-lg text-muted leading-relaxed">
                  {brandCopy.heroSubheadline}
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/shop"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 btn-gold text-xs rounded-sm"
                  >
                    {brandCopy.heroCta}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/collections"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-template text-white text-xs font-bold tracking-[0.15em] uppercase rounded-sm hover:border-gold/40 transition-colors"
                  >
                    View Collections
                  </Link>
                </div>
              </motion.div>
            </div>

            <div className="relative min-h-[480px] sm:min-h-[560px] lg:min-h-0 bg-[#0A0A0A] overflow-hidden flex items-center justify-center">
              <Monogram
                size={400}
                variant="watermark"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 opacity-40 pointer-events-none z-[1]"
              />
              <Image
                src={brandCopy.heroImage}
                alt="S.L.A.M. premium t-shirt collection"
                fill
                className="object-contain object-center z-[2]"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div
                className="absolute inset-0 z-[3] pointer-events-none bg-gradient-to-r from-black/70 via-black/15 to-transparent lg:from-black/50 lg:via-transparent lg:to-transparent"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pillars preview */}
      <section className="py-20 lg:py-28 border-b border-template bg-surface">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12">
            <div>
              <h2 className="heading-section text-xl sm:text-2xl text-white">
                The S.L.A.M. Way
              </h2>
              <p className="mt-3 text-muted max-w-lg">
                {brandCopy.essenceText}
              </p>
            </div>
            <Link
              href="/about"
              className="text-[10px] font-bold tracking-[0.2em] uppercase text-gold hover:underline"
            >
              Learn More →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {pillars.map((pillar, i) => (
              <PillarIconCard key={pillar.id} pillar={pillar} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="py-20 lg:py-28 border-b border-template">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex justify-between items-end gap-4 mb-12">
            <h2 className="heading-section text-xl sm:text-2xl text-white">
              Featured Apparel
            </h2>
            <Link
              href="/shop"
              className="text-[10px] font-bold tracking-[0.2em] uppercase text-gold"
            >
              Shop All →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {featuredProducts.slice(0, 6).map((product, i) => (
              <ShopCatalogCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Gold banner */}
      <section className="bg-gold">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm font-black tracking-[0.08em] uppercase text-black">
            {brandCopy.midBannerLeft}
          </p>
          <p className="text-sm font-black tracking-[0.2em] uppercase text-black">
            {brandCopy.midBannerRight}
          </p>
        </div>
      </section>
    </PageShell>
  );
}
