interface MonogramProps {
  size?: number;
  className?: string;
  variant?: "gold" | "white" | "watermark";
}

export function Monogram({
  size = 40,
  className = "",
  variant = "gold",
}: MonogramProps) {
  const fill =
    variant === "gold"
      ? "var(--color-gold, #D4AF37)"
      : variant === "watermark"
        ? "rgba(212, 175, 55, 0.08)"
        : "#FFFFFF";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M6 8 L6 52 L14 52 L14 30 L22 52 L30 52 L20 28 L30 8 L22 8 L14 26 L14 8 Z"
        fill={fill}
      />
      <path
        d="M32 8 L32 52 L40 52 L40 34 L48 52 L56 52 L46 28 L56 8 L48 8 L40 24 L40 8 Z"
        fill={variant === "watermark" ? "rgba(212,175,55,0.05)" : fill}
      />
    </svg>
  );
}

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  className?: string;
}

export function Logo({ size = "md", showTagline = false, className = "" }: LogoProps) {
  const sizes = {
    sm: { title: "text-xl", tagline: "text-[8px]" },
    md: { title: "text-2xl", tagline: "text-[9px]" },
    lg: { title: "text-3xl", tagline: "text-[10px]" },
  };

  const s = sizes[size];

  return (
    <div className={`flex flex-col items-start leading-none ${className}`}>
      <span
        className={`${s.title} font-black tracking-[0.12em] text-white uppercase`}
      >
        S.L.A.M.
      </span>
      {showTagline && (
        <div className="flex items-center gap-2 mt-2">
          <span className="h-px w-6 bg-gold/60" />
          <span
            className={`${s.tagline} font-bold tracking-[0.22em] text-gold uppercase`}
          >
            Submit Like A Man
          </span>
          <span className="h-px w-6 bg-gold/60" />
        </div>
      )}
    </div>
  );
}
