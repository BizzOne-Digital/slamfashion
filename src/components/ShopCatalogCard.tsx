"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingBag, Check, Eye } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useProductModal } from "@/context/ProductModalContext";
import { formatVariants } from "@/lib/utils";

interface ShopCatalogCardProps {
  product: Product;
  index?: number;
}

export function ShopCatalogCard({ product, index = 0 }: ShopCatalogCardProps) {
  const { addItem } = useCart();
  const { openProduct } = useProductModal();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      size: product.sizes[0],
      color: product.colors[0].name,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.03 }}
      className="group  border-2
            border-[#292929] rounded-md cursor-pointer"
      onClick={() => openProduct(product)}
    >
      <div className="card-dark  grid            
           
             rounded-sm overflow-hidden hover:border-gold/30 transition-colors duration-300">
        <div className="relative aspect-square bg-surface-light overflow-hidden">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, 16vw"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              openProduct(product);
            }}
            className="absolute top-2 right-2 p-2 bg-black/60 text-white/70 opacity-0 group-hover:opacity-100 transition-opacity rounded-sm"
            aria-label="Quick view"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="p-3 sm:p-4">
          <h3 className="text-[11px] sm:text-xs font-bold tracking-[0.1em] uppercase text-white leading-tight">
            {product.title}
          </h3>
          <p className="mt-1.5 text-[10px] text-muted tracking-wider">
            {formatVariants(product.colors)}
          </p>
          <div className="mt-3 flex items-center justify-between gap-2">
            <span className="text-sm font-black text-white">
              ${product.price.toFixed(2)}
            </span>
            <button
              onClick={handleAdd}
              className={`p-2 rounded-sm transition-colors ${
                added
                  ? "bg-green-600 text-white"
                  : "bg-gold/10 text-gold hover:bg-gold hover:text-black"
              }`}
              aria-label="Add to cart"
            >
              {added ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <ShoppingBag className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
