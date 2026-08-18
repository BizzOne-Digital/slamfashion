import { DEFAULT_SETTINGS } from "@/data/defaults";
import type { BrandCopy, CollectionCategory, Product, StoreSettings } from "@/types";

const INVALID_HERO_IMAGE_IDS = [
  "c89c272b14cd",
  "1517836357463-d25dfeac3438",
  "1556821840-3a63f95609a7",
];

function mergeBrandCopy(stored?: Partial<BrandCopy>): BrandCopy {
  const merged = { ...DEFAULT_SETTINGS.brandCopy, ...stored };
  const heroImage = merged.heroImage?.trim();
  const defaultHero = DEFAULT_SETTINGS.brandCopy.heroImage;

  if (
    !heroImage ||
    heroImage.includes("images.unsplash.com") ||
    INVALID_HERO_IMAGE_IDS.some((id) => heroImage.includes(id))
  ) {
    merged.heroImage = defaultHero;
  }

  return merged;
}

function mergeProducts(stored?: Product[]): Product[] {
  const defaults = DEFAULT_SETTINGS.products;
  if (!stored?.length) return defaults;

  const storedIds = new Set(stored.map((p) => p.id));
  const missing = defaults.filter((p) => !storedIds.has(p.id));
  return missing.length ? [...stored, ...missing] : stored;
}

function mergeCollections(stored?: CollectionCategory[]): CollectionCategory[] {
  const defaults = DEFAULT_SETTINGS.collections;
  if (!stored?.length) return defaults;

  const storedIds = new Set(stored.map((collection) => collection.id));
  const missing = defaults.filter((collection) => !storedIds.has(collection.id));
  return missing.length ? [...stored, ...missing] : stored;
}

export function normalizeStoreSettings(
  stored?: Partial<StoreSettings> | null
): StoreSettings {
  if (!stored) return DEFAULT_SETTINGS;

  return {
    ...DEFAULT_SETTINGS,
    ...stored,
    brandCopy: mergeBrandCopy(stored.brandCopy),
    contact: { ...DEFAULT_SETTINGS.contact, ...stored.contact },
    theme: { ...DEFAULT_SETTINGS.theme, ...stored.theme },
    products: mergeProducts(stored.products),
    pillars: stored.pillars?.length ? stored.pillars : DEFAULT_SETTINGS.pillars,
    coreValues: stored.coreValues?.length
      ? stored.coreValues.map((value, index) => ({
          ...DEFAULT_SETTINGS.coreValues[index],
          ...value,
        }))
      : DEFAULT_SETTINGS.coreValues,
    collections: mergeCollections(stored.collections),
  };
}
