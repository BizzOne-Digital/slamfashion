"use client";

import { GoldBanner } from "./GoldBanner";
import { Navbar } from "./Navbar";

export function SiteHeader() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <GoldBanner />
      <Navbar />
    </div>
  );
}
