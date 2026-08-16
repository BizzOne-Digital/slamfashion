export const HEADER_HEIGHT = 104;

export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatPhone(p: string) {
  if (p.length === 10) {
    return `(${p.slice(0, 3)}) ${p.slice(3, 6)}-${p.slice(6)}`;
  }
  return p;
}

export function formatVariants(colors: { name: string }[]) {
  return colors.map((c) => `( ${c.name.toUpperCase()} )`).join("  ");
}
