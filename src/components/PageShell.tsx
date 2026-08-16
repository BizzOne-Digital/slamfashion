import { HEADER_HEIGHT } from "@/lib/utils";

export function PageShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{ paddingTop: `${HEADER_HEIGHT}px` }}
    >
      {children}
    </div>
  );
}
