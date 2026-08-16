import { Suspense } from "react";

export default function ContactLayout({
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
