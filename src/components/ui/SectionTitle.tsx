export function SectionTitle({ children }: { children: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-[13px] font-black tracking-[0.14em] uppercase text-white">
        {children}
      </h2>
      <div className="mt-3 h-[2px] w-10 bg-gold" />
    </div>
  );
}

export function GoldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-gold mb-4">
      {children}
    </p>
  );
}
