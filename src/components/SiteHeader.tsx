"use client";

import { GoldBanner } from "./GoldBanner";
import { Navbar } from "./Navbar";
import { ClientOnly } from "./ClientOnly";

function HeaderFallback() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[104px] bg-black border-b border-template" />
  );
}

export function SiteHeader() {
  return (
    <ClientOnly fallback={<HeaderFallback />}>
      <div className="fixed top-0 left-0 right-0 z-50">
        <GoldBanner />
        <Navbar />
      </div>
    </ClientOnly>
  );
}
