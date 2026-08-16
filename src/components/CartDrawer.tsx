"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } =
    useCart();
  const { settings } = useStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-surface border-l border-white/10 z-[70] flex flex-col shadow-2xl shadow-black/50"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-surface-light">
              <div>
                <h2 className="text-sm font-black tracking-[0.15em] uppercase text-white">
                  Your Cart
                </h2>
                <p className="text-[10px] text-white/35 mt-0.5 tracking-wider uppercase">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </p>
              </div>
              <button
                onClick={closeCart}
                className="p-2 text-white/60 hover:text-white transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-white/40 text-sm">Your cart is empty</p>
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    className="mt-4 text-gold text-sm font-semibold tracking-wider uppercase hover:underline"
                  >
                    Shop Collection
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-3 bg-surface-light rounded-lg"
                    >
                      <div className="relative w-20 h-20 rounded-md overflow-hidden shrink-0">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-white truncate">
                          {item.title}
                        </h3>
                        <p className="text-xs text-white/50 mt-0.5">
                          {item.size} · {item.color}
                        </p>
                        <p className="text-gold text-sm font-bold mt-1">
                          ${item.price.toFixed(2)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="p-1 rounded bg-white/10 hover:bg-white/20 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-1 rounded bg-white/10 hover:bg-white/20 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="ml-auto p-1 text-red-400 hover:text-red-300 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/60 uppercase tracking-wider">
                    Subtotal
                  </span>
                  <span className="text-xl font-bold text-gold">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <Link
                  href="/contact"
                  onClick={closeCart}
                  className="block w-full py-4 gold-gradient text-black text-center text-[11px] font-black tracking-[0.15em] uppercase rounded-sm hover:opacity-90 transition-opacity"
                >
                  Inquire / Order
                </Link>
                <p className="text-[11px] text-white/30 text-center">
                  Contact us at {settings.contact.email} to complete your order
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
