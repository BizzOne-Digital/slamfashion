interface LargeBrandMarkProps {
  className?: string;
}

export function LargeBrandMark({ className = "" }: LargeBrandMarkProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M20 28 L20 172 L52 172 L52 100 L84 172 L116 172 L76 92 L116 28 L84 28 L52 88 L52 28 Z"
        fill="#D4AF37"
      />
      <path
        d="M120 28 L120 172 L152 172 L152 112 L184 172 L216 172 L164 88 L216 28 L184 28 L152 80 L152 28 Z"
        fill="#FFFFFF"
        transform="translate(-16, 0)"
      />
    </svg>
  );
}
