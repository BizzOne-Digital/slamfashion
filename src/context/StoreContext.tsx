"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DEFAULT_SETTINGS, STORAGE_KEY } from "@/data/defaults";
import { useAuth } from "@/context/AuthContext";
import type {
  BrandCopy,
  BrandPillar,
  ContactInfo,
  Product,
  ProductCategory,
  StoreSettings,
  ThemeColors,
} from "@/types";

interface StoreContextValue {
  settings: StoreSettings;
  isLoaded: boolean;
  updateBrandCopy: (copy: Partial<BrandCopy>) => void;
  updateContact: (contact: Partial<ContactInfo>) => void;
  updateTheme: (theme: Partial<ThemeColors>) => void;
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  removeProduct: (id: string) => void;
  updatePillar: (id: string, pillar: Partial<BrandPillar>) => void;
  resetToDefaults: () => void;
  getProductsByCategory: (category: ProductCategory | "All") => Product[];
  featuredProducts: Product[];
}

const StoreContext = createContext<StoreContextValue | null>(null);

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

function loadSettings(): StoreSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as StoreSettings;
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        brandCopy: mergeBrandCopy(parsed.brandCopy),
        contact: { ...DEFAULT_SETTINGS.contact, ...parsed.contact },
        theme: { ...DEFAULT_SETTINGS.theme, ...parsed.theme },
        products: parsed.products?.length ? parsed.products : DEFAULT_SETTINGS.products,
        pillars: parsed.pillars?.length ? parsed.pillars : DEFAULT_SETTINGS.pillars,
        coreValues: parsed.coreValues?.length
          ? parsed.coreValues.map((v, i) => ({
              ...DEFAULT_SETTINGS.coreValues[i],
              ...v,
            }))
          : DEFAULT_SETTINGS.coreValues,
        collections: parsed.collections?.length ? parsed.collections : DEFAULT_SETTINGS.collections,
      };
    }
  } catch {
    /* use defaults */
  }
  return DEFAULT_SETTINGS;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => {
    queueMicrotask(() => {
      setSettings(loadSettings());
      setIsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

    const root = document.documentElement;
    root.style.setProperty("--color-gold", settings.theme.gold);
    root.style.setProperty("--color-bg", settings.theme.background);
    root.style.setProperty("--color-surface", settings.theme.surface);
    root.style.setProperty("--color-surface-light", settings.theme.surfaceLight);
  }, [settings, isLoaded]);

  const persist = useCallback(
    (updater: (prev: StoreSettings) => StoreSettings) => {
      if (!isAdmin) return;
      setSettings(updater);
    },
    [isAdmin]
  );

  const updateBrandCopy = useCallback(
    (copy: Partial<BrandCopy>) => {
      persist((prev) => ({
        ...prev,
        brandCopy: { ...prev.brandCopy, ...copy },
      }));
    },
    [persist]
  );

  const updateContact = useCallback(
    (contact: Partial<ContactInfo>) => {
      persist((prev) => ({
        ...prev,
        contact: { ...prev.contact, ...contact },
      }));
    },
    [persist]
  );

  const updateTheme = useCallback(
    (theme: Partial<ThemeColors>) => {
      persist((prev) => ({
        ...prev,
        theme: { ...prev.theme, ...theme },
      }));
    },
    [persist]
  );

  const addProduct = useCallback(
    (product: Omit<Product, "id">) => {
      persist((prev) => ({
        ...prev,
        products: [
          ...prev.products,
          { ...product, id: `p${Date.now()}` },
        ],
      }));
    },
    [persist]
  );

  const updateProduct = useCallback(
    (id: string, product: Partial<Product>) => {
      persist((prev) => ({
        ...prev,
        products: prev.products.map((p) =>
          p.id === id ? { ...p, ...product } : p
        ),
      }));
    },
    [persist]
  );

  const removeProduct = useCallback(
    (id: string) => {
      persist((prev) => ({
        ...prev,
        products: prev.products.filter((p) => p.id !== id),
      }));
    },
    [persist]
  );

  const updatePillar = useCallback(
    (id: string, pillar: Partial<BrandPillar>) => {
      persist((prev) => ({
        ...prev,
        pillars: prev.pillars.map((p) =>
          p.id === id ? { ...p, ...pillar } : p
        ),
      }));
    },
    [persist]
  );

  const resetToDefaults = useCallback(() => {
    if (!isAdmin) return;
    setSettings(DEFAULT_SETTINGS);
  }, [isAdmin]);

  const getProductsByCategory = useCallback(
    (category: ProductCategory | "All") => {
      if (category === "All") return settings.products;
      return settings.products.filter((p) => p.category === category);
    },
    [settings.products]
  );

  const featuredProducts = useMemo(
    () => settings.products.filter((p) => p.featured),
    [settings.products]
  );

  const value = useMemo(
    () => ({
      settings,
      isLoaded,
      updateBrandCopy,
      updateContact,
      updateTheme,
      addProduct,
      updateProduct,
      removeProduct,
      updatePillar,
      resetToDefaults,
      getProductsByCategory,
      featuredProducts,
    }),
    [
      settings,
      isLoaded,
      updateBrandCopy,
      updateContact,
      updateTheme,
      addProduct,
      updateProduct,
      removeProduct,
      updatePillar,
      resetToDefaults,
      getProductsByCategory,
      featuredProducts,
    ]
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
