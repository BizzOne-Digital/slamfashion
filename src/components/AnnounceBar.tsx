"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useState } from "react";

export function AnnounceBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative z-[60] bg-gold text-black text-center py-2.5 px-10 text-[11px] font-bold tracking-[0.15em] uppercase">
      <span>
        Premium faith-based streetwear —{" "}
        <Link href="/shop" className="underline underline-offset-2 hover:opacity-80">
          Shop the Collection
        </Link>
      </span>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
