"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingBag, Check, Eye } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useProductModal } from "@/context/ProductModalContext";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  index?: number;
  showFullDetails?: boolean;
}

export function ProductCard({
  product,
  index = 0,
  showFullDetails = false,
}: ProductCardProps) {
  const { addItem } = useCart();
  const { openProduct } = useProductModal();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      size: selectedSize,
      color: selectedColor.name,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="group card-shine"
    >
      <div className="relative bg-surface border border-white/5 hover:border-gold/25 transition-all duration-500 rounded-sm overflow-hidden">
        <div
          className="relative aspect-[3/4] overflow-hidden bg-surface-light cursor-pointer"
          onClick={() => openProduct(product)}
        >
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <span className="px-2.5 py-1 glass text-[9px] font-bold tracking-[0.15em] uppercase text-gold rounded-sm">
              {product.category}
            </span>
            {product.featured && (
              <span className="px-2.5 py-1 bg-gold text-black text-[9px] font-bold tracking-[0.15em] uppercase rounded-sm w-fit">
                Featured
              </span>
            )}
          </div>

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={(e) => {
                e.stopPropagation();
                openProduct(product);
              }}
              className="flex items-center gap-2 px-5 py-3 glass border border-white/20 text-white text-[11px] font-bold tracking-wider uppercase rounded-sm hover:border-gold/50 transition-colors translate-y-4 group-hover:translate-y-0 duration-300"
            >
              <Eye className="w-4 h-4" />
              Quick View
            </button>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                {product.title}
              </h3>
              <p className="text-gold font-black text-lg mt-0.5">
                ${product.price.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="p-5">
          {showFullDetails && (
            <>
              <p className="text-xs text-white/40 line-clamp-2 mb-4">
                {product.description}
              </p>

              <div className="space-y-4">
                <div>
                  <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/35 mb-2">
                    Size
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "min-w-[36px] px-2.5 py-1.5 text-[11px] font-bold rounded-sm border transition-all",
                          selectedSize === size
                            ? "border-gold bg-gold/10 text-gold"
                            : "border-white/10 text-white/50 hover:border-white/25"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/35 mb-2">
                    Color
                  </p>
                  <div className="flex gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          "w-7 h-7 rounded-full border-2 transition-all",
                          selectedColor.name === color.name
                            ? "border-gold scale-110 ring-2 ring-gold/30"
                            : "border-white/20 hover:border-white/40"
                        )}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                        aria-label={color.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {!showFullDetails && (
            <h3 className="text-sm font-bold text-white tracking-wide mb-1 lg:hidden">
              {product.title}
            </h3>
          )}

          <button
            onClick={handleAddToCart}
            className={cn(
              "w-full py-3.5 flex items-center justify-center gap-2 text-[11px] font-bold tracking-[0.15em] uppercase rounded-sm transition-all duration-300",
              showFullDetails ? "mt-5" : "mt-3",
              added
                ? "bg-green-600 text-white"
                : "bg-white/5 border border-white/10 text-white hover:border-gold/40 hover:bg-gold/10 hover:text-gold"
            )}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" />
                Added
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
