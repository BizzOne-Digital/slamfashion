import { Suspense } from "react";

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <p className="text-white/40 text-sm">Loading...</p>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
