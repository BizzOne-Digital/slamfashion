"use client";

import { ClientOnly } from "@/components/ClientOnly";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientOnly
      fallback={
        <div className="min-h-screen bg-black pt-[104px] flex items-center justify-center">
          <p className="text-sm text-white/40">Loading admin...</p>
        </div>
      }
    >
      {children}
    </ClientOnly>
  );
}
