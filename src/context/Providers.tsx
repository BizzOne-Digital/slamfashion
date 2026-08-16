"use client";

import { AuthProvider } from "./AuthContext";
import { StoreProvider } from "./StoreContext";
import { CartProvider } from "./CartContext";
import { ProductModalProvider } from "./ProductModalContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <StoreProvider>
        <CartProvider>
          <ProductModalProvider>{children}</ProductModalProvider>
        </CartProvider>
      </StoreProvider>
    </AuthProvider>
  );
}
