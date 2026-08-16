"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { PageShell } from "@/components/PageShell";
import { ShopCatalogCard } from "@/components/ShopCatalogCard";
import { useStore } from "@/context/StoreContext";

export default function ShopPage() {
  const searchParams = useSearchParams();
  const catParam = searchParams.get("cat");
  const { settings } = useStore();

  const products = useMemo(() => {
    if (!catParam) return settings.products;
    const slug = catParam.toLowerCase();
    return settings.products.filter(
      (p) =>
        p.category.toLowerCase().includes(slug) ||
        p.title.toLowerCase().includes(slug.replace("-", " "))
    );
  }, [settings.products, catParam]);

  return (
    <PageShell>
      <section className="py-12 lg:py-16 border-b border-template">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="heading-xl text-3xl sm:text-4xl lg:text-5xl text-white">
              Shop
            </h1>
            <p className="mt-4 text-muted text-base max-w-xl">
              Premium activewear catalog. Select variants, add to cart, and inquire to order.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-10 lg:py-16">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
          <p className="label-caps text-muted mb-8">
            {products.length} Products
          </p>
          <div className=" grid
            grid-cols-2
            
          
            gap-2
            md:grid-cols-3
            lg:grid-cols-4">
            {products.map((product, i) => (
              <ShopCatalogCard key={product.id} product={product} index={i} />
            ))}
          </div>
          {products.length === 0 && (
            <p className="text-center text-muted py-20">No products in this category.</p>
          )}
        </div>
      </section>
    </PageShell>
  );
}
