export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-[11px] font-black tracking-[0.18em] uppercase text-white">
        {children}
      </h2>
      <div className="mt-3 h-[2px] w-10 bg-gold" />
    </div>
  );
}
