"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Search, User, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";
import { CartDrawer } from "./CartDrawer";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "About" },
  { href: "/contact?section=team-orders", label: "Team Orders" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    const path = href.split("?")[0];
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(path + "/");
  };

  return (
    <>
      <header className="bg-black border-b border-template">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="shrink-0">
              <Logo size="sm" showTagline />
            </Link>

            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-3 py-2 text-[11px] font-bold tracking-[0.15em] uppercase transition-colors",
                    isActive(link.href)
                      ? "text-white"
                      : "text-white/70 hover:text-white"
                  )}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gold" />
                  )}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1 sm:gap-2">
              <Link
                href="/shop"
                className="p-2.5 text-white/70 hover:text-gold transition-colors"
                aria-label="Search"
              >
                <Search className="w-[18px] h-[18px]" />
              </Link>
              <Link
                href="/admin/login"
                className="hidden sm:flex p-2.5 text-white/70 hover:text-gold transition-colors"
                aria-label="Account"
              >
                <User className="w-[18px] h-[18px]" />
              </Link>
              <button
                onClick={openCart}
                className="relative p-2.5 text-white/70 hover:text-gold transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag className="w-[18px] h-[18px]" />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-gold text-black text-[9px] font-black rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2.5 text-white"
                aria-label="Menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-template bg-black overflow-hidden"
            >
              <nav className="px-4 py-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "px-4 py-3 text-xs font-bold tracking-[0.15em] uppercase",
                      isActive(link.href)
                        ? "text-gold bg-gold/10"
                        : "text-white/70"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <CartDrawer />
    </>
  );
}
