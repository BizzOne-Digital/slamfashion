import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/context/Providers";
import { SiteHeader } from "@/components/SiteHeader";
import { StoreFooter } from "@/components/StoreFooter";

export const metadata: Metadata = {
  title: "S.L.A.M. — Submit Like A Man | Premium Faith-Based Apparel",
  description:
    "Strength through submission. Premium athletic streetwear for men who lead with faith and live with integrity. SUBMIT TO PURPOSE. LIVE WITH POWER.",
  keywords: [
    "S.L.A.M.",
    "Submit Like A Man",
    "faith apparel",
    "men's streetwear",
    "Christian clothing",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        <Providers>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <StoreFooter />
        </Providers>
      </body>
    </html>
  );
}
