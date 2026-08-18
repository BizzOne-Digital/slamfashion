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
  updatePillar: (id: string, pillar: Partial<BrandPillar>) => void;
  resetToDefaults: () => Promise<void>;
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
  const skipSaveRef = useRef(true);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  settingsRef.current = settings;

  useEffect(() => {
    let cancelled = false;

    fetchStoreSettings()
      .then((data) => {
        if (cancelled) return;
        setSettings(data.settings);
        setDataSource(data.source);
        setDataWarning(data.warning ?? null);
        setIsLoaded(true);
        setSaveStatus(data.source === "database" ? "idle" : "error");
        setSaveError(
          data.source === "database" ? null : data.warning ?? null
        );
        skipSaveRef.current = true;
        queueMicrotask(() => {
          skipSaveRef.current = false;
        });

        if (typeof window !== "undefined") {
          localStorage.removeItem(STORAGE_KEY);
        }
      })
      .catch(() => {
        if (cancelled) return;
        setSettings(DEFAULT_SETTINGS);
        setDataSource("defaults");
        setDataWarning("Could not load store settings from the server.");
        setIsLoaded(true);
        setSaveStatus("error");
        setSaveError("Could not load store settings from the server.");
      });

    return () => {
      cancelled = true;
    };
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
    setSaveStatus("saving");
    setSaveError(null);

    try {
      const saved = await persistStoreSettings(nextSettings);
      skipSaveRef.current = true;
      setSettings(saved);
      setDataSource("database");
      setDataWarning(null);
      setSaveStatus("saved");
      queueMicrotask(() => {
        skipSaveRef.current = false;
      });
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

    setSaveStatus("saving");
    setSaveError(null);

    saveTimeoutRef.current = setTimeout(() => {
      void saveNow(settingsRef.current);
    }, SAVE_DEBOUNCE_MS);
  }, [saveNow]);

  useEffect(() => {
    if (!isLoaded || !isAdmin || skipSaveRef.current) return;
    scheduleSave();

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [settings, isLoaded, isAdmin, scheduleSave]);

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

  const resetToDefaults = useCallback(async () => {
    if (!isAdmin) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    skipSaveRef.current = true;
    setSettings(DEFAULT_SETTINGS);
    await saveNow(DEFAULT_SETTINGS);
    skipSaveRef.current = false;
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
      updatePillar,
      resetToDefaults,
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
