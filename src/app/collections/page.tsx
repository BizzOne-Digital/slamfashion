"use client";

import Image from "next/image";
import { PageShell } from "@/components/PageShell";
import { CollectionCard } from "@/components/CollectionCard";
import { PillarsHorizontalBar } from "@/components/PillarsHorizontalBar";
import { Monogram } from "@/components/Logo";
import { useStore } from "@/context/StoreContext";

export default function CollectionsPage() {
  const { settings } = useStore();
  const { brandCopy, collections, pillars } = settings;

  return (
    <PageShell>
      <main className="bg-black text-white">
        {/* =========================================================
        HERO
    ========================================================= */}
        <section className="border-b border-[#242424] bg-black">
          <div className="mx-auto max-w-[1400px]">
            <div
              className="
            relative
            grid
            h-[505px]
            grid-cols-[51.5%_48.5%]
            overflow-hidden
          "
            >
              {/* LEFT CONTENT */}
              <div
                className="
              relative
              z-20
              flex
              h-full
              flex-col
              justify-center
              px-[38px]
              sm:px-[48px]
              lg:px-[57px]
            "
              >
                <h1
                  className="
                m-0
                whitespace-nowrap
                font-black
                uppercase
                text-white
                leading-[0.86]
                tracking-[0.015em]
                text-[48px]
                sm:text-[54px]
                lg:text-[58px]
                xl:text-[62px]
              "
                  style={{
                    fontFamily:
                      '"Arial Narrow", "Roboto Condensed", "Helvetica Neue", sans-serif',
                  }}
                >
                  {brandCopy.collectionsTitle}
                </h1>

                {/* GOLD LINE */}
                <div className="mt-[22px] h-[3px] w-[43px] bg-[#C6922D]" />

                <p
                  className="
                mt-[17px]
                max-w-[390px]
                text-[13px]
                font-normal
                leading-[1.55]
                tracking-[0.01em]
                text-[#d2d2d2]
                sm:text-[14px]
                lg:text-[15px]
              "
                >
                  {brandCopy.collectionsSubheadline}
                </p>
              </div>

              {/* HERO IMAGE AREA */}
              <div className="absolute inset-y-0 right-0 z-10 w-[57%] overflow-hidden bg-[#080808]">
                {/* WATERMARK */}
                <Monogram
                  size={400}
                  variant="watermark"
                  className="
                pointer-events-none
                absolute
                -right-[85px]
                top-1/2
                z-[1]
                -translate-y-1/2
                opacity-[0.19]
              "
                />

                {/* HERO IMAGE */}
                <Image
                  src={brandCopy.collectionsHeroImage}
                  alt="S.L.A.M. activewear collection"
                  fill
                  priority
                  sizes="57vw"
                  className="
                z-[2]
                object-cover
                  
              "
                />

                {/* LEFT FADE */}
                <div
                  className="
                absolute
                inset-0
                z-[3]
                bg-gradient-to-r
                from-black
                via-black/45
                via-[25%]
                to-transparent
              "
                />

                {/* BOTTOM FADE */}
                <div
                  className="
                absolute
                inset-x-0
                bottom-0
                z-[4]
                h-[28%]
                bg-gradient-to-t
                from-black/40
                to-transparent
              "
                />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
        COLLECTION GRID
    ========================================================= */}
        <section className="bg-black py-0">
          <div className="mx-auto max-w-[1400px] px-[19px]">
            <div
              className="
            grid
            grid-cols-2
            
            border-2
            border-[#292929]
            gap-2
            md:grid-cols-3
            lg:grid-cols-4
          "
            >
              {collections.map((collection, index) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
        PILLARS
    ========================================================= */}
        <PillarsHorizontalBar pillars={pillars} />
      </main>
    </PageShell>
  );
}
