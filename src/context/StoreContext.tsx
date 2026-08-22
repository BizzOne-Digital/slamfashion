"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { DEFAULT_SETTINGS, STORAGE_KEY } from "@/data/defaults";
import { useAuth } from "@/context/AuthContext";
import type {
  BrandCopy,
  BrandPillar,
  CollectionCategory,
  ContactInfo,
  Product,
  ProductCategory,
  StoreSettings,
  ThemeColors,
} from "@/types";

export type SaveStatus = "idle" | "loading" | "saving" | "saved" | "error";

interface StoreContextValue {
  settings: StoreSettings;
  isLoaded: boolean;
  saveStatus: SaveStatus;
  saveError: string | null;
  dataSource: "database" | "defaults";
  dataWarning: string | null;
  updateBrandCopy: (copy: Partial<BrandCopy>) => void;
  updateContact: (contact: Partial<ContactInfo>) => void;
  updateTheme: (theme: Partial<ThemeColors>) => void;
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  removeProduct: (id: string) => void;
  addCollection: (collection: Omit<CollectionCategory, "id">) => void;
  updateCollection: (id: string, collection: Partial<CollectionCategory>) => void;
  removeCollection: (id: string) => void;
  updatePillar: (id: string, pillar: Partial<BrandPillar>) => void;
  resetToDefaults: () => Promise<void>;
  reloadSettings: () => Promise<void>;
  getProductsByCategory: (category: ProductCategory | "All") => Product[];
  featuredProducts: Product[];
}

const StoreContext = createContext<StoreContextValue | null>(null);

const SAVE_DEBOUNCE_MS = 700;

type StoreSettingsResponse = {
  settings: StoreSettings;
  source: "database" | "defaults";
  warning?: string;
};

async function fetchStoreSettings(): Promise<StoreSettingsResponse> {
  const response = await fetch("/api/store/settings", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load store settings");
  }

  return response.json() as Promise<StoreSettingsResponse>;
}

async function persistStoreSettings(settings: StoreSettings): Promise<StoreSettings> {
  const response = await fetch("/api/admin/settings", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(settings),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;
    throw new Error(data?.error || "Failed to save store settings");
  }

  const data = (await response.json()) as { settings: StoreSettings };
  return data.settings;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("loading");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<"database" | "defaults">(
    "defaults"
  );
  const [dataWarning, setDataWarning] = useState<string | null>(null);
  const { isAdmin } = useAuth();

  const settingsRef = useRef(settings);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  settingsRef.current = settings;

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const data = await fetchStoreSettings();
        if (cancelled) return;
        setSettings(data.settings);
        settingsRef.current = data.settings;
        setDataSource(data.source);
        setDataWarning(data.warning ?? null);
        setIsLoaded(true);
        setSaveStatus("idle");
        setSaveError(null);

        if (typeof window !== "undefined") {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch {
        if (cancelled) return;
        setSettings(DEFAULT_SETTINGS);
        setDataSource("defaults");
        setDataWarning("Could not load store settings from the server.");
        setIsLoaded(true);
        setSaveStatus("idle");
        setSaveError(null);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const reloadSettings = useCallback(async () => {
    setSaveStatus("loading");
    setSaveError(null);

    try {
      const data = await fetchStoreSettings();
      setSettings(data.settings);
      settingsRef.current = data.settings;
      setDataSource(data.source);
      setDataWarning(data.warning ?? null);
      setSaveStatus("idle");
      setSaveError(null);
    } catch {
      setDataSource("defaults");
      setDataWarning("Could not load store settings from the server.");
      setSaveStatus("idle");
      setSaveError(null);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const root = document.documentElement;
    root.style.setProperty("--color-gold", settings.theme.gold);
    root.style.setProperty("--color-bg", settings.theme.background);
    root.style.setProperty("--color-surface", settings.theme.surface);
    root.style.setProperty(
      "--color-surface-light",
      settings.theme.surfaceLight
    );
  }, [settings, isLoaded]);

  const saveNow = useCallback(async (nextSettings: StoreSettings) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    setSaveStatus("saving");
    setSaveError(null);

    try {
      const saved = await persistStoreSettings(nextSettings);
      settingsRef.current = saved;
      setSettings(saved);
      setDataSource("database");
      setDataWarning(null);
      setSaveStatus("saved");
      setTimeout(() => {
        setSaveStatus((current) => (current === "saved" ? "idle" : current));
      }, 2000);
    } catch (error) {
      setSaveStatus("error");
      setSaveError(
        error instanceof Error ? error.message : "Failed to save changes"
      );
    }
  }, []);

  const scheduleSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      void saveNow(settingsRef.current);
    }, SAVE_DEBOUNCE_MS);
  }, [saveNow]);

  const persist = useCallback(
    (updater: (prev: StoreSettings) => StoreSettings, immediate = false) => {
      if (!isAdmin) return;

      setSettings((prev) => {
        const next = updater(prev);
        settingsRef.current = next;

        if (immediate) {
          void saveNow(next);
        } else {
          scheduleSave();
        }

        return next;
      });
    },
    [isAdmin, saveNow, scheduleSave]
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
      persist(
        (prev) => ({
          ...prev,
          products: [
            ...prev.products,
            { ...product, id: `p${Date.now()}` },
          ],
        }),
        true
      );
    },
    [persist]
  );

  const updateProduct = useCallback(
    (id: string, product: Partial<Product>) => {
      persist(
        (prev) => ({
          ...prev,
          products: prev.products.map((p) =>
            p.id === id ? { ...p, ...product } : p
          ),
        }),
        true
      );
    },
    [persist]
  );

  const removeProduct = useCallback(
    (id: string) => {
      persist(
        (prev) => ({
          ...prev,
          products: prev.products.filter((p) => p.id !== id),
        }),
        true
      );
    },
    [persist]
  );

  const addCollection = useCallback(
    (collection: Omit<CollectionCategory, "id">) => {
      persist(
        (prev) => ({
          ...prev,
          collections: [
            ...prev.collections,
            { ...collection, id: `c${Date.now()}` },
          ],
        }),
        true
      );
    },
    [persist]
  );

  const updateCollection = useCallback(
    (id: string, collection: Partial<CollectionCategory>) => {
      persist(
        (prev) => ({
          ...prev,
          collections: prev.collections.map((c) =>
            c.id === id ? { ...c, ...collection } : c
          ),
        }),
        true
      );
    },
    [persist]
  );

  const removeCollection = useCallback(
    (id: string) => {
      persist(
        (prev) => ({
          ...prev,
          collections: prev.collections.filter((c) => c.id !== id),
        }),
        true
      );
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

  const resetToDefaults = useCallback(async () => {
    if (!isAdmin) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setSettings(DEFAULT_SETTINGS);
    settingsRef.current = DEFAULT_SETTINGS;
    await saveNow(DEFAULT_SETTINGS);
  }, [isAdmin, saveNow]);

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
      saveStatus,
      saveError,
      dataSource,
      dataWarning,
      updateBrandCopy,
      updateContact,
      updateTheme,
      addProduct,
      updateProduct,
      removeProduct,
      addCollection,
      updateCollection,
      removeCollection,
      updatePillar,
      resetToDefaults,
      reloadSettings,
      getProductsByCategory,
      featuredProducts,
    }),
    [
      settings,
      isLoaded,
      saveStatus,
      saveError,
      dataSource,
      dataWarning,
      updateBrandCopy,
      updateContact,
      updateTheme,
      addProduct,
      updateProduct,
      removeProduct,
      addCollection,
      updateCollection,
      removeCollection,
      updatePillar,
      resetToDefaults,
      reloadSettings,
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
