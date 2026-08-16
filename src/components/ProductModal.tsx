"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ShoppingBag, Check, Minus, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProductModal } from "@/context/ProductModalContext";
import { useCart } from "@/context/CartContext";

export function ProductModal() {
  const { selectedProduct, closeProduct } = useProductModal();
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const product = selectedProduct;

  const handleOpen = () => {
    if (product) {
      setSelectedSize(product.sizes[0]);
      setSelectedColor(product.colors[0]);
      setQuantity(1);
      setAdded(false);
    }
  };

  const handleAddToCart = () => {
    if (!product || !selectedSize || !selectedColor) return;
    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      size: selectedSize,
      color: selectedColor.name,
      quantity,
    });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      closeProduct();
    }, 1200);
  };

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeProduct}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[80]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            onAnimationStart={handleOpen}
            className="fixed inset-4 sm:inset-8 lg:inset-16 z-[90] flex items-center justify-center pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-5xl max-h-full overflow-y-auto bg-surface border border-white/10 rounded-2xl border-glow grain">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative aspect-square lg:aspect-auto lg:min-h-[520px] bg-surface-light overflow-hidden rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:bg-gradient-to-r" />
                  <span className="absolute top-4 left-4 px-3 py-1.5 glass text-[10px] font-bold tracking-wider uppercase text-gold rounded-sm">
                    {product.category}
                  </span>
                </div>

                <div className="p-6 sm:p-8 lg:p-10 flex flex-col">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold/70 mb-2">
                        S.L.A.M. Collection
                      </p>
                      <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                        {product.title}
                      </h2>
                    </div>
                    <button
                      onClick={closeProduct}
                      className="p-2 rounded-sm bg-white/5 hover:bg-white/10 transition-colors shrink-0"
                      aria-label="Close"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="mt-4 text-3xl font-black gold-text">
                    ${product.price.toFixed(2)}
                  </p>
                  <p className="mt-4 text-sm text-white/50 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="mt-8 space-y-6 flex-1">
                    <div>
                      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-3">
                        Select Size
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`min-w-[44px] px-4 py-2.5 text-xs font-bold rounded-sm border transition-all ${
                              selectedSize === size
                                ? "border-gold bg-gold/15 text-gold"
                                : "border-white/10 text-white/60 hover:border-white/30"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-3">
                        Select Color
                      </p>
                      <div className="flex gap-3">
                        {product.colors.map((color) => (
                          <button
                            key={color.name}
                            onClick={() => setSelectedColor(color)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-sm border transition-all ${
                              selectedColor?.name === color.name
                                ? "border-gold bg-gold/10"
                                : "border-white/10 hover:border-white/20"
                            }`}
                          >
                            <span
                              className="w-5 h-5 rounded-full border border-white/20"
                              style={{ backgroundColor: color.hex }}
                            />
                            <span className="text-xs font-medium text-white/70">
                              {color.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-3">
                        Quantity
                      </p>
                      <div className="inline-flex items-center border border-white/10 rounded-sm">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="p-3 hover:bg-white/5 transition-colors"
                          aria-label="Decrease"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-bold">{quantity}</span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="p-3 hover:bg-white/5 transition-colors"
                          aria-label="Increase"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={added}
                    className={`mt-8 w-full py-4 flex items-center justify-center gap-2 text-sm font-bold tracking-wider uppercase rounded-sm transition-all ${
                      added
                        ? "bg-green-600 text-white"
                        : "gold-gradient text-black hover:opacity-90"
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="w-5 h-5" />
                        Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" />
                        Add to Cart — ${(product.price * quantity).toFixed(2)}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
