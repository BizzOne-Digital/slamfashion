"use client";

import { Footer } from "./Footer";
import { ClientOnly } from "./ClientOnly";
import { useStore } from "@/context/StoreContext";

function FooterFallback() {
  return <div className="h-64 bg-black border-t border-template" />;
}

export function StoreFooter() {
  const { settings } = useStore();

  return (
    <ClientOnly fallback={<FooterFallback />}>
      <Footer
        statement={settings.brandCopy.footerStatement}
        email={settings.contact.email}
        phone={settings.contact.phone}
        location={settings.contact.location}
      />
    </ClientOnly>
  );
}
