"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  FolderOpen,
  LogOut,
  Package,
  Palette,
  Phone,
  RotateCcw,
  Type,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { AdminStatusBar } from "@/components/admin/AdminStatusBar";
import { CollectionsPanel } from "@/components/admin/CollectionsPanel";
import { ProductsPanel } from "@/components/admin/ProductsPanel";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import type { BrandCopy } from "@/types";

type AdminTab = "products" | "collections" | "brand" | "theme" | "contact";

const BRAND_IMAGE_FIELDS = new Set<keyof BrandCopy>([
  "heroImage",
  "founderImage",
  "collectionsHeroImage",
]);

function brandImageFolder(key: keyof BrandCopy): "brand" | "collections" {
  return key === "collectionsHeroImage" ? "collections" : "brand";
}

export default function AdminPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const {
    settings,
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
    resetToDefaults,
    reloadSettings,
  } = useStore();

  const [activeTab, setActiveTab] = useState<AdminTab>("products");

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
    router.refresh();
  };

  const tabs: { id: AdminTab; label: string; icon: typeof Package }[] = [
    { id: "products", label: "Products", icon: Package },
    { id: "collections", label: "Collections", icon: FolderOpen },
    { id: "brand", label: "Brand Copy", icon: Type },
    { id: "theme", label: "Theme", icon: Palette },
    { id: "contact", label: "Contact", icon: Phone },
  ];

  return (
    <div className="min-h-screen bg-black pt-[104px]">
      <div className="border-b border-white/10 bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <Link
                href="/"
                className="mb-3 inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-white/40 uppercase transition-colors hover:text-gold"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Store
              </Link>
              <h1 className="text-2xl font-black tracking-tight text-white">
                Admin Panel
              </h1>
              <p className="mt-1 text-sm text-white/40">
                Manage your store — all changes save to MongoDB and go live
                instantly
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-xs font-semibold tracking-wider text-white/60 uppercase transition-colors hover:bg-white/5"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
              <button
                type="button"
                onClick={() => {
                  if (
                    confirm(
                      "Reset ALL settings to factory defaults? This will overwrite your MongoDB data."
                    )
                  ) {
                    void resetToDefaults();
                  }
                }}
                className="flex items-center gap-2 rounded-lg border border-red-400/30 px-4 py-2 text-xs font-semibold tracking-wider text-red-400 uppercase transition-colors hover:bg-red-400/10"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset All
              </button>
            </div>
          </div>

          <AdminStatusBar
            saveStatus={saveStatus}
            saveError={saveError}
            dataSource={dataSource}
            dataWarning={dataWarning}
            onReload={reloadSettings}
          />

          {dataSource === "defaults" && dataWarning && (
            <div className="mt-4 rounded-lg border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
              Could not load your store data from MongoDB. Click{" "}
              <strong>Reload from database</strong> above, or restart{" "}
              <code className="text-amber-100">npm run dev</code>.
            </div>
          )}

          <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold tracking-wider whitespace-nowrap uppercase transition-all ${
                  activeTab === tab.id
                    ? "bg-gold text-black"
                    : "bg-surface-light text-white/60 hover:text-white"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {activeTab === "products" && (
          <ProductsPanel
            products={settings.products}
            onAdd={addProduct}
            onUpdate={updateProduct}
            onRemove={removeProduct}
          />
        )}

        {activeTab === "collections" && (
          <CollectionsPanel
            collections={settings.collections}
            onAdd={addCollection}
            onUpdate={updateCollection}
            onRemove={removeCollection}
          />
        )}

        {activeTab === "brand" && (
          <div className="max-w-2xl space-y-6">
            <div className="mb-2">
              <h2 className="text-lg font-bold text-white">Brand Copy</h2>
              <p className="mt-1 text-sm text-white/40">
                Edit homepage, about, and footer text. Image fields support
                upload or URL.
              </p>
            </div>
            {(
              Object.entries(settings.brandCopy) as [
                keyof typeof settings.brandCopy,
                string,
              ][]
            ).map(([key, value]) => (
              <div key={key}>
                {BRAND_IMAGE_FIELDS.has(key) ? (
                  <ImageUploadField
                    label={key.replace(/([A-Z])/g, " $1").trim()}
                    value={value}
                    folder={brandImageFolder(key)}
                    onChange={(url) => {
                      updateBrandCopy({ [key]: url });
                    }}
                    hint="Upload an image or paste a URL."
                  />
                ) : (
                  <>
                    <label className="mb-2 block text-xs font-semibold tracking-wider text-white/40 uppercase">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </label>
                    {value.length > 100 ? (
                      <textarea
                        value={value}
                        onChange={(e) => {
                          updateBrandCopy({ [key]: e.target.value });
                        }}
                        rows={3}
                        className="w-full resize-none rounded-lg border border-white/10 bg-surface px-4 py-3 text-sm text-white focus:border-gold/50 focus:outline-none"
                      />
                    ) : (
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => {
                          updateBrandCopy({ [key]: e.target.value });
                        }}
                        className="w-full rounded-lg border border-white/10 bg-surface px-4 py-3 text-sm text-white focus:border-gold/50 focus:outline-none"
                      />
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "theme" && (
          <div className="max-w-2xl space-y-6">
            <div className="mb-2">
              <h2 className="text-lg font-bold text-white">Theme Colors</h2>
              <p className="mt-1 text-sm text-white/40">
                Customize site colors. Changes apply site-wide instantly.
              </p>
            </div>
            {(
              Object.entries(settings.theme) as [
                keyof typeof settings.theme,
                string,
              ][]
            ).map(([key, value]) => (
              <div key={key} className="flex items-center gap-4">
                <input
                  type="color"
                  value={value}
                  onChange={(e) => {
                    updateTheme({ [key]: e.target.value });
                  }}
                  className="h-12 w-12 cursor-pointer rounded-lg border border-white/10 bg-transparent"
                />
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-semibold tracking-wider text-white/40 uppercase">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => {
                      updateTheme({ [key]: e.target.value });
                    }}
                    className="w-full rounded-lg border border-white/10 bg-surface px-4 py-2 font-mono text-sm text-white focus:border-gold/50 focus:outline-none"
                  />
                </div>
              </div>
            ))}
            <div className="mt-8 rounded-xl border border-white/10 p-6">
              <p className="mb-4 text-xs font-semibold tracking-wider text-white/40 uppercase">
                Preview
              </p>
              <div
                className="rounded-lg p-6"
                style={{ backgroundColor: settings.theme.background }}
              >
                <div
                  className="rounded-lg p-4"
                  style={{ backgroundColor: settings.theme.surface }}
                >
                  <p
                    style={{ color: settings.theme.gold }}
                    className="font-bold"
                  >
                    Gold Accent Text
                  </p>
                  <div
                    className="mt-2 rounded p-3"
                    style={{ backgroundColor: settings.theme.surfaceLight }}
                  >
                    <p className="text-sm text-white">Surface Light Background</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "contact" && (
          <div className="max-w-2xl space-y-6">
            <div className="mb-2">
              <h2 className="text-lg font-bold text-white">
                Contact Information
              </h2>
              <p className="mt-1 text-sm text-white/40">
                Shown on the contact page and footer.
              </p>
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wider text-white/40 uppercase">
                Email
              </label>
              <input
                type="email"
                value={settings.contact.email}
                onChange={(e) => {
                  updateContact({ email: e.target.value });
                }}
                className="w-full rounded-lg border border-white/10 bg-surface px-4 py-3 text-sm text-white focus:border-gold/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wider text-white/40 uppercase">
                Phone
              </label>
              <input
                type="tel"
                value={settings.contact.phone}
                onChange={(e) => {
                  updateContact({ phone: e.target.value });
                }}
                className="w-full rounded-lg border border-white/10 bg-surface px-4 py-3 text-sm text-white focus:border-gold/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wider text-white/40 uppercase">
                Location
              </label>
              <input
                type="text"
                value={settings.contact.location}
                onChange={(e) => {
                  updateContact({ location: e.target.value });
                }}
                className="w-full rounded-lg border border-white/10 bg-surface px-4 py-3 text-sm text-white focus:border-gold/50 focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
