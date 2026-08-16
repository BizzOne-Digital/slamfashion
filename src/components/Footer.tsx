"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { Logo } from "./Logo";

interface FooterProps {
  statement: string;
  email: string;
  phone: string;
  location: string;
}

export function Footer({ statement, email, phone, location }: FooterProps) {
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const formatPhone = (p: string) => {
    if (p.length === 10) {
      return `(${p.slice(0, 3)}) ${p.slice(3, 6)}-${p.slice(6)}`;
    }
    return p;
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      window.location.href = `mailto:${email}?subject=Join the Movement&body=Newsletter signup: ${newsletterEmail}`;
      setNewsletterEmail("");
    }
  };

  return (
    <footer className="bg-black border-t border-template mt-auto">
      <div className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-16 xl:px-20 py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Logo size="lg" showTagline />
            <p className="mt-6 text-sm text-muted leading-relaxed">
              {statement}
            </p>
            <div className="flex gap-3 mt-6">
              {["IG", "FB", "YT"].map((label) => (
                <a
                  key={label}
                  href="#"
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-template text-[10px] font-bold text-muted hover:text-gold hover:border-gold/40 transition-colors"
                  aria-label={label}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-[11px] font-bold tracking-[0.18em] uppercase text-white mb-5">
              Shop
            </h3>
            <nav className="flex flex-col gap-2.5">
              {[
                "All Products",
                "T-Shirts",
                "Tanks",
                "Hoodies",
                "Joggers",
                "Shorts",
                "Slide Credit",
                "Accessories",
              ].map((label) => (
                <Link
                  key={label}
                  href="/shop"
                  className="text-sm text-muted hover:text-gold transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-[11px] font-bold tracking-[0.18em] uppercase text-white mb-5">
              Company
            </h3>
            <nav className="flex flex-col gap-2.5">
              {[
                { href: "/about", label: "About Us" },
                { href: "/about", label: "Our Mission" },
                { href: "/contact?section=team-orders", label: "Team Orders" },
                { href: "/contact", label: "Size Guide" },
                { href: "/contact", label: "Shipping & Returns" },
                { href: "/contact", label: "FAQ" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-muted hover:text-gold transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-[11px] font-bold tracking-[0.18em] uppercase text-white mb-5">
              Customer Service
            </h3>
            <nav className="flex flex-col gap-2.5">
              {[
                { href: "/contact", label: "Contact Us" },
                { href: "/contact", label: "Order Tracking" },
                { href: "/contact", label: "Returns & Exchanges" },
                { href: "/contact", label: "Privacy Policy" },
                { href: "/contact", label: "Terms of Service" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-muted hover:text-gold transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-[11px] font-bold tracking-[0.18em] uppercase text-white mb-3">
              Join the Movement
            </h3>
            <p className="text-sm text-muted leading-relaxed mb-5">
              Be the first to know about new drops, exclusive offers, and more.
            </p>
            <form onSubmit={handleNewsletter}>
              <div className="flex border border-template rounded-sm overflow-hidden bg-surface-card">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-transparent text-sm text-white placeholder:text-muted focus:outline-none min-w-0"
                />
                <button
                  type="submit"
                  className="px-4 bg-gold text-black hover:opacity-90 transition-opacity shrink-0"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </form>
            <div className="mt-6 space-y-3 hidden lg:block">
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 text-xs text-muted hover:text-gold transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-gold" />
                {email}
              </a>
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-2 text-xs text-muted hover:text-gold transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-gold" />
                {formatPhone(phone)}
              </a>
              <div className="flex items-center gap-2 text-xs text-muted">
                <MapPin className="w-3.5 h-3.5 text-gold" />
                {location}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-template text-center">
          <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted">
            &copy; {new Date().getFullYear()} S.L.A.M. Activewear. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
