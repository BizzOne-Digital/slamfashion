"use client";

const items = [
  "SUBMIT TO PURPOSE",
  "LIVE WITH POWER",
  "STRENGTH THROUGH SUBMISSION",
  "BUILT FOR MEN OF FAITH",
  "LEAD WITH INTEGRITY",
  "SUBMIT LIKE A MAN",
];

export function Marquee() {
  const doubled = [...items, ...items];

  return (
    <div className="relative overflow-hidden border-y border-white/5 bg-surface py-4">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-surface to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-surface to-transparent z-10" />
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="mx-8 text-sm font-bold tracking-[0.3em] uppercase text-white/30 flex items-center gap-8"
          >
            {item}
            <span className="text-gold text-lg">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
