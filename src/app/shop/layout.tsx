import { Suspense } from "react";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="pt-[104px] p-10 text-muted">Loading...</div>}>
      {children}
    </Suspense>
  );
}
