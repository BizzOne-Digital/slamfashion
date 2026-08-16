"use client";

import { Footer } from "./Footer";
import { useStore } from "@/context/StoreContext";

export function StoreFooter() {
  const { settings } = useStore();

  return (
    <Footer
      statement={settings.brandCopy.footerStatement}
      email={settings.contact.email}
      phone={settings.contact.phone}
      location={settings.contact.location}
    />
  );
}
