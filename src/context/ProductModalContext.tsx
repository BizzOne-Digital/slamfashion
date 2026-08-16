"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { Product } from "@/types";
import { ProductModal } from "@/components/ProductModal";

interface ProductModalContextValue {
  openProduct: (product: Product) => void;
  closeProduct: () => void;
  selectedProduct: Product | null;
}

const ProductModalContext = createContext<ProductModalContextValue | null>(
  null
);

export function ProductModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const openProduct = useCallback((product: Product) => {
    setSelectedProduct(product);
  }, []);

  const closeProduct = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  const value = useMemo(
    () => ({ openProduct, closeProduct, selectedProduct }),
    [openProduct, closeProduct, selectedProduct]
  );

  return (
    <ProductModalContext.Provider value={value}>
      {children}
      <ProductModal />
    </ProductModalContext.Provider>
  );
}

export function useProductModal() {
  const ctx = useContext(ProductModalContext);
  if (!ctx)
    throw new Error("useProductModal must be used within ProductModalProvider");
  return ctx;
}
