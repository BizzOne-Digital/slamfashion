"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { ContactForm } from "@/components/ContactForm";
import { ContactInfo } from "@/components/ContactInfo";
import { ContactPillarsBar } from "@/components/ContactPillarsBar";
import { LargeBrandMark } from "@/components/LargeBrandMark";
import { Monogram } from "@/components/Logo";
import { useStore } from "@/context/StoreContext";

export default function ContactPage() {
  const searchParams = useSearchParams();
  const section = searchParams.get("section");
  const { settings } = useStore();
  const { brandCopy, contact, pillars } = settings;

  useEffect(() => {
    if (section === "team-orders") {
      const el = document.getElementById("team-orders");
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 300);
      }
    }
  }, [section]);

  return (
    <PageShell>
      {/* ── Hero: split with gradient + monogram ── */}
      <section className="border-b border-template bg-gradient-to-br from-[#1A1A1A] via-black to-black">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[380px] lg:min-h-[420px]">
            {/* Left */}
            <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-16 xl:px-20 py-14 lg:py-20">
              <p className="text-[11px] font-bold tracking-[0.28em] uppercase text-gold mb-5">
                {brandCopy.contactSubheadline}
              </p>
              <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-black uppercase tracking-[0.02em] text-white leading-none">
                {brandCopy.contactTitle}
              </h1>
              <p className="mt-8 text-[15px] text-muted leading-[1.75] max-w-lg">
                {brandCopy.contactHeroText}
              </p>
              <p className="mt-6 text-[11px] font-bold tracking-[0.25em] uppercase text-gold">
                {brandCopy.contactTagline}
              </p>
            </div>

            {/* Right — large SM monogram */}
            <div className="relative flex items-center justify-center py-12 lg:py-0 min-h-[240px]">
              <LargeBrandMark className="w-[min(280px,70vw)] h-auto opacity-90" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Form + contact info ── */}
      <section className="py-16 lg:py-24 bg-black">
        <div className="max-w-[1100px] mx-auto px-8 sm:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 xl:gap-28">
            <ContactForm
              email={contact.email}
              phone={contact.phone}
              defaultSubject={
                section === "team-orders"
                  ? "Team Orders & Partnerships"
                  : undefined
              }
            />
            <ContactInfo
              email={contact.email}
              phone={contact.phone}
              location={contact.location}
            />
          </div>
        </div>
      </section>

      {/* ── Brand pillars bar ── */}
      <ContactPillarsBar pillars={pillars} />

      {/* ── Map + Team Orders ── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 border-b border-template">
        {/* Map */}
        <div className="relative min-h-[360px] lg:min-h-[440px] bg-[#0A0A0A]">
          <Image
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&q=80"
            alt="Charlotte, NC map"
            fill
            className="object-cover opacity-50 grayscale contrast-125"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-black/40" />
          {/* Gold map pin */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
            <MapPin className="w-10 h-10 text-gold fill-gold/20" strokeWidth={1.5} />
          </div>
          <div className="absolute bottom-6 left-6">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/60">
              Charlotte, NC
            </p>
          </div>
        </div>

        {/* Team orders card */}
        <div
          id="team-orders"
          className="relative flex flex-col justify-center px-8 sm:px-12 lg:px-16 xl:px-20 py-16 lg:py-20 bg-[#111111] border-t lg:border-t-0 lg:border-l border-template overflow-hidden"
        >
          {/* Watermark monogram */}
          <Monogram
            size={280}
            variant="watermark"
            className="absolute -right-16 bottom-0 opacity-100 pointer-events-none"
          />

          <div className="relative z-10 max-w-md">
            <h2 className="text-[11px] font-black tracking-[0.18em] uppercase text-white">
              {brandCopy.teamOrdersTitle}
            </h2>
            <div className="mt-3 h-[2px] w-10 bg-gold" />
            <p className="mt-8 text-[15px] text-muted leading-[1.75]">
              {brandCopy.teamOrdersText}
            </p>
            <Link
              href={`mailto:${contact.email}?subject=Team Orders %26 Partnerships`}
              className="mt-10 inline-flex items-center gap-3 px-8 py-4 border border-gold text-gold text-[11px] font-black tracking-[0.18em] uppercase rounded-sm hover:bg-gold/10 transition-colors"
            >
              Team Order Inquiry
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
