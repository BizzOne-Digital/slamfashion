import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <p className="text-gold text-[11px] font-bold tracking-[0.35em] uppercase mb-4">
        {eyebrow}
      </p>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.1]">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-white/50 leading-relaxed text-base sm:text-lg">
          {description}
        </p>
      )}
      <div
        className={cn(
          "section-divider mt-8 w-24",
          align === "center" && "mx-auto"
        )}
      />
    </div>
  );
}
