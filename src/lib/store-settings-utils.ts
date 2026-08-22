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

/** Fix known-broken image paths on existing records (migration only). */
function migrateProductImages(products: Product[]): Product[] {
  const defaultById = new Map(
    DEFAULT_SETTINGS.products.map((product) => [product.id, product])
  );

  return products.map((product) => {
    const defaultProduct = defaultById.get(product.id);
    if (!defaultProduct) return product;

    if (
      product.image.startsWith("/images/slides/") &&
      defaultProduct.image.startsWith("http")
    ) {
      return { ...product, image: defaultProduct.image };
    }

    return product;
  });
}

function resolveProducts(stored?: Product[]): Product[] {
  if (!stored) return DEFAULT_SETTINGS.products;
  return migrateProductImages(stored);
}

function resolveCollections(stored?: CollectionCategory[]): CollectionCategory[] {
  if (!stored) return DEFAULT_SETTINGS.collections;
  return stored;
}

/**
 * Normalize settings when loading from the database.
 * Fills in missing structural fields but does NOT re-add deleted products/collections.
 */
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
    products: resolveProducts(stored.products),
    pillars: stored.pillars?.length ? stored.pillars : DEFAULT_SETTINGS.pillars,
    coreValues: stored.coreValues?.length
      ? stored.coreValues.map((value, index) => ({
          ...DEFAULT_SETTINGS.coreValues[index],
          ...value,
        }))
      : DEFAULT_SETTINGS.coreValues,
    collections: resolveCollections(stored.collections),
  };
}

/**
 * Prepare settings for saving to MongoDB.
 * Admin edits are authoritative — deleted items stay deleted.
 */
export function sanitizeStoreSettingsForSave(
  input: Partial<StoreSettings>
): StoreSettings {
  return {
    brandCopy: mergeBrandCopy(input.brandCopy),
    contact: { ...DEFAULT_SETTINGS.contact, ...input.contact },
    theme: { ...DEFAULT_SETTINGS.theme, ...input.theme },
    products: Array.isArray(input.products)
      ? input.products.map((product) => ({
          ...product,
          price: Number(product.price) || 0,
          sizes: product.sizes?.length ? product.sizes : ["S", "M", "L", "XL"],
          colors: product.colors?.length
            ? product.colors
            : [{ name: "Black", hex: "#000000" }],
        }))
      : [],
    pillars: input.pillars?.length ? input.pillars : DEFAULT_SETTINGS.pillars,
    coreValues: input.coreValues?.length
      ? input.coreValues
      : DEFAULT_SETTINGS.coreValues,
    collections: Array.isArray(input.collections) ? input.collections : [],
  };
}
