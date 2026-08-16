"use client";

import Image from "next/image";
import { PageShell } from "@/components/PageShell";
import { Monogram } from "@/components/Logo";
import { PillarIcon } from "@/components/about/PillarIcons";
import { useStore } from "@/context/StoreContext";
import type { BrandPillar } from "@/types";

function GoldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold tracking-[0.28em] uppercase text-gold mb-5">
      {children}
    </p>
  );
}

function PillarListItem({ pillar }: { pillar: BrandPillar }) {
  return (
    <div className="flex gap-4 py-5 border-b border-template last:border-b-0">
      <div className="shrink-0 w-10 h-10 flex items-center justify-center border border-gold/30 rounded-sm">
        <PillarIcon icon={pillar.icon} className="w-5 h-5 text-gold" />
      </div>
      <div>
        <h3 className="text-[11px] font-black tracking-[0.14em] uppercase text-gold leading-snug">
          {pillar.title}
        </h3>
        <p className="mt-1.5 text-sm text-muted leading-relaxed">
          {pillar.description}
        </p>
      </div>
    </div>
  );
}

export default function AboutPage() {
  const { settings } = useStore();
  const { brandCopy, pillars, coreValues } = settings;

  const storyParagraphs = brandCopy.founderStory
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <PageShell>
      {/* ── Hero: split screen ── */}
      <section className="border-b border-template bg-black">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[480px] lg:min-h-[560px]">
          {/* Left — copy */}
          <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-16 xl:px-20 py-14 lg:py-20">
            <GoldLabel>About S.L.A.M.</GoldLabel>
            <h1 className="text-[clamp(1.75rem,4vw,3.25rem)] font-black uppercase leading-[1.08] tracking-[0.02em] text-white">
              {brandCopy.aboutHeroTitle}
            </h1>
            <p className="mt-8 text-[15px] sm:text-base text-muted leading-[1.75] max-w-md">
              {brandCopy.aboutHeroText}
            </p>
          </div>

          {/* Right — founder portrait */}
          <div className="relative min-h-[360px] lg:min-h-0 bg-[#0A0A0A]">
            <Image
              src={brandCopy.founderImage}
              alt="Sean Mattier, Founder of S.L.A.M. Activewear"
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {/* Fade into black on the left edge */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent lg:from-black lg:via-black/40 lg:to-transparent"
            />
          </div>
        </div>
      </section>

      {/* ── Founder Story + What S.L.A.M. Stands For (side by side) ── */}
      <section className="border-b border-template bg-black">
        <div className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-16 xl:px-20 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 xl:gap-28">
            {/* Left — Founder Story */}
            <div>
              <GoldLabel>Founder Story</GoldLabel>
              <h2 className="text-xl sm:text-2xl lg:text-[1.75rem] font-black uppercase tracking-[0.06em] text-white leading-tight">
                {brandCopy.founderSectionTitle}
              </h2>
              <div className="mt-8 space-y-5">
                {storyParagraphs.map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-[15px] text-caption leading-[1.8]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="mt-10 pt-8 border-t border-template">
                <p
                  className="text-2xl text-white italic"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  {brandCopy.founderName}
                </p>
                <p className="mt-2 text-[10px] font-bold tracking-[0.22em] uppercase text-gold">
                  {brandCopy.founderRole}
                </p>
              </div>
            </div>

            {/* Right — What S.L.A.M. Stands For */}
            <div>
              <GoldLabel>What S.L.A.M. Stands For</GoldLabel>
              <div className="mt-2">
                {pillars.map((pillar) => (
                  <PillarListItem key={pillar.id} pillar={pillar} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Values horizontal bar ── */}
      <section className="relative border-b border-template overflow-hidden">
        {/* Gym background */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a55?w=1920&q=80"
            alt=""
            fill
            className="object-cover opacity-25"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/85" />
        </div>

        <div className="relative max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-16 xl:px-20 py-14 lg:py-16">
          <p className="text-center text-[11px] font-bold tracking-[0.28em] uppercase text-gold mb-10">
            Our Values
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 lg:divide-x divide-gold/25 border border-gold/20">
            {coreValues.map((value) => (
              <div
                key={value.id}
                className="flex flex-col items-center text-center px-4 py-8 lg:py-10"
              >
                <div className="w-11 h-11 flex items-center justify-center border border-gold/40 rounded-sm mb-4">
                  <PillarIcon
                    icon={value.icon}
                    className="w-5 h-5 text-gold"
                  />
                </div>
                <h3 className="text-[10px] sm:text-[11px] font-black tracking-[0.12em] uppercase text-white leading-snug">
                  {value.title}
                </h3>
                <p className="mt-2 text-[11px] text-muted leading-relaxed max-w-[140px]">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Diagonal pre-footer CTA ── */}
      <section className="relative flex min-h-[180px] sm:min-h-[220px] overflow-hidden">
        {/* Black left panel */}
        <div
          className="relative z-10 flex items-center gap-6 sm:gap-10 bg-black px-8 sm:px-12 lg:px-16 xl:px-20 py-12 w-full sm:w-[62%]"
          style={{
            clipPath: "polygon(0 0, 100% 0, 88% 100%, 0 100%)",
          }}
        >
          <Monogram size={72} className="shrink-0 hidden sm:block" />
          <Monogram size={52} className="shrink-0 sm:hidden" />
          <p className="text-sm sm:text-base lg:text-lg font-black uppercase tracking-[0.06em] text-white leading-snug max-w-md">
            {brandCopy.midBannerLeft}
          </p>
        </div>

        {/* Gold right panel */}
        <div
          className="absolute inset-0 bg-gold flex items-center justify-end sm:justify-center pr-8 sm:pr-0 pl-[30%] sm:pl-[55%]"
        >
          <p className="text-lg sm:text-xl lg:text-2xl font-black uppercase tracking-[0.18em] text-white text-right sm:text-center">
            {brandCopy.midBannerRight}
          </p>
        </div>
      </section>
    </PageShell>
  );
}
