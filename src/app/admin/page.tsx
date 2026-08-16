"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  Type,
  Palette,
  Phone,
  Trash2,
  Plus,
  RotateCcw,
  Save,
  Star,
  LogOut,
} from "lucide-react";
import { motion } from "framer-motion";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import type { BrandCopy, Product, ProductCategory } from "@/types";

type AdminTab = "products" | "brand" | "theme" | "contact";

const BRAND_IMAGE_FIELDS = new Set<keyof BrandCopy>([
  "heroImage",
  "founderImage",
  "collectionsHeroImage",
]);

function brandImageFolder(key: keyof BrandCopy): "brand" | "collections" {
  return key === "collectionsHeroImage" ? "collections" : "brand";
}

const categories: ProductCategory[] = [
  "T-Shirts",
  "Tanks",
  "Hoodies",
  "Joggers",
  "Shorts",
  "Headwear",
  "Bags & Accessories",
  "Sweatshirts",
  "Slides & Accessories",
  "Performance",
  "Accessories",
];

const emptyProduct: Omit<Product, "id"> = {
  title: "",
  category: "T-Shirts",
  price: 0,
  image: "",
  description: "",
  sizes: ["S", "M", "L", "XL", "2XL"],
  colors: [{ name: "Black", hex: "#000000" }],
  featured: false,
};

export default function AdminPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const {
    settings,
    updateBrandCopy,
    updateContact,
    updateTheme,
    addProduct,
    updateProduct,
    removeProduct,
    resetToDefaults,
  } = useStore();

  const [activeTab, setActiveTab] = useState<AdminTab>("products");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Omit<Product, "id"> | null>(
    null
  );
  const [saved, setSaved] = useState(false);

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
    router.refresh();
  };

  const tabs: { id: AdminTab; label: string; icon: typeof Package }[] = [
    { id: "products", label: "Products", icon: Package },
    { id: "brand", label: "Brand Copy", icon: Type },
    { id: "theme", label: "Theme", icon: Palette },
    { id: "contact", label: "Contact", icon: Phone },
  ];

  return (
    <div className="min-h-screen bg-black pt-[104px]">
      <div className="border-b border-white/10 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-white/40 hover:text-gold transition-colors mb-3"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Store
              </Link>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Admin Panel
              </h1>
              <p className="text-sm text-white/40 mt-1">
                Manage products, brand copy, and theme settings
              </p>
            </div>
            <div className="flex items-center gap-3">
              {saved && (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-green-400"
                >
                  <Save className="w-3.5 h-3.5" />
                  Saved
                </motion.span>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-wider uppercase text-white/60 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
              <button
                onClick={() => {
                  if (
                    confirm(
                      "Reset all settings to defaults? This cannot be undone."
                    )
                  ) {
                    resetToDefaults();
                    showSaved();
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-wider uppercase text-red-400 border border-red-400/30 rounded-lg hover:bg-red-400/10 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
          </div>

          <div className="flex gap-2 mt-6 overflow-x-auto pb-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold tracking-wider uppercase rounded-lg whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-gold text-black"
                    : "bg-surface-light text-white/60 hover:text-white"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "products" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-white">
                Products ({settings.products.length})
              </h2>
              <button
                onClick={() => {
                  setNewProduct({ ...emptyProduct });
                  setEditingProduct(null);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gold text-black text-xs font-bold tracking-wider uppercase rounded-lg hover:bg-gold/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </div>

            {(newProduct || editingProduct) && (
              <ProductForm
                product={editingProduct || newProduct!}
                isNew={!!newProduct}
                onSave={(data) => {
                  if (editingProduct) {
                    updateProduct(editingProduct.id, data);
                  } else {
                    addProduct(data);
                  }
                  setEditingProduct(null);
                  setNewProduct(null);
                  showSaved();
                }}
                onCancel={() => {
                  setEditingProduct(null);
                  setNewProduct(null);
                }}
              />
            )}

            <div className="space-y-3 mt-6">
              {settings.products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-4 bg-surface rounded-xl border border-white/5"
                >
                  <div
                    className="w-16 h-16 rounded-lg bg-surface-light bg-cover bg-center shrink-0"
                    style={{ backgroundImage: `url(${product.image})` }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white truncate">
                        {product.title}
                      </h3>
                      {product.featured && (
                        <Star className="w-3.5 h-3.5 text-gold fill-gold shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-white/40 mt-0.5">
                      {product.category} · ${product.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setNewProduct(null);
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-gold border border-gold/30 rounded hover:bg-gold/10 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${product.title}"?`)) {
                          removeProduct(product.id);
                          showSaved();
                        }
                      }}
                      className="p-1.5 text-red-400 hover:bg-red-400/10 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "brand" && (
          <div className="max-w-2xl space-y-6">
            <h2 className="text-lg font-bold text-white mb-4">Brand Copy</h2>
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
                      showSaved();
                    }}
                    hint="Upload an image or paste a URL."
                  />
                ) : (
                  <>
                    <label className="block text-xs font-semibold tracking-wider uppercase text-white/40 mb-2">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </label>
                    {value.length > 100 ? (
                      <textarea
                        value={value}
                        onChange={(e) => {
                          updateBrandCopy({ [key]: e.target.value });
                          showSaved();
                        }}
                        rows={3}
                        className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold/50 resize-none"
                      />
                    ) : (
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => {
                          updateBrandCopy({ [key]: e.target.value });
                          showSaved();
                        }}
                        className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold/50"
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
            <h2 className="text-lg font-bold text-white mb-4">Theme Colors</h2>
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
                    showSaved();
                  }}
                  className="w-12 h-12 rounded-lg border border-white/10 cursor-pointer bg-transparent"
                />
                <div className="flex-1">
                  <label className="block text-xs font-semibold tracking-wider uppercase text-white/40 mb-1">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => {
                      updateTheme({ [key]: e.target.value });
                      showSaved();
                    }}
                    className="w-full px-4 py-2 bg-surface border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold/50 font-mono"
                  />
                </div>
              </div>
            ))}
            <div className="p-6 rounded-xl border border-white/10 mt-8">
              <p className="text-xs font-semibold tracking-wider uppercase text-white/40 mb-4">
                Preview
              </p>
              <div
                className="p-6 rounded-lg"
                style={{ backgroundColor: settings.theme.background }}
              >
                <div
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: settings.theme.surface }}
                >
                  <p style={{ color: settings.theme.gold }} className="font-bold">
                    Gold Accent Text
                  </p>
                  <div
                    className="mt-2 p-3 rounded"
                    style={{ backgroundColor: settings.theme.surfaceLight }}
                  >
                    <p className="text-white text-sm">Surface Light Background</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "contact" && (
          <div className="max-w-2xl space-y-6">
            <h2 className="text-lg font-bold text-white mb-4">
              Contact Information
            </h2>
            <div>
              <label className="block text-xs font-semibold tracking-wider uppercase text-white/40 mb-2">
                Email
              </label>
              <input
                type="email"
                value={settings.contact.email}
                onChange={(e) => {
                  updateContact({ email: e.target.value });
                  showSaved();
                }}
                className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-wider uppercase text-white/40 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={settings.contact.phone}
                onChange={(e) => {
                  updateContact({ phone: e.target.value });
                  showSaved();
                }}
                className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-wider uppercase text-white/40 mb-2">
                Location
              </label>
              <input
                type="text"
                value={settings.contact.location}
                onChange={(e) => {
                  updateContact({ location: e.target.value });
                  showSaved();
                }}
                className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold/50"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductForm({
  product,
  isNew,
  onSave,
  onCancel,
}: {
  product: Product | Omit<Product, "id">;
  isNew: boolean;
  onSave: (data: Omit<Product, "id">) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({ ...product });

  return (
    <div className="p-6 bg-surface rounded-xl border border-gold/20 mb-6">
      <h3 className="text-sm font-bold text-gold mb-4 tracking-wider uppercase">
        {isNew ? "New Product" : "Edit Product"}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold tracking-wider uppercase text-white/40 mb-1">
            Title
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-2.5 bg-surface-light border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold/50"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold tracking-wider uppercase text-white/40 mb-1">
            Category
          </label>
          <select
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value as ProductCategory })
            }
            className="w-full px-4 py-2.5 bg-surface-light border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold/50"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold tracking-wider uppercase text-white/40 mb-1">
            Price ($)
          </label>
          <input
            type="number"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: parseFloat(e.target.value) || 0 })
            }
            className="w-full px-4 py-2.5 bg-surface-light border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold/50"
          />
        </div>
        <div className="sm:col-span-2">
          <ImageUploadField
            label="Product Image"
            value={form.image}
            folder="products"
            onChange={(url) => setForm({ ...form, image: url })}
            hint="Upload a photo from your computer or paste an image URL."
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold tracking-wider uppercase text-white/40 mb-1">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            className="w-full px-4 py-2.5 bg-surface-light border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold/50 resize-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="featured"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            className="w-4 h-4 accent-gold"
          />
          <label htmlFor="featured" className="text-sm text-white/60">
            Featured on homepage
          </label>
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => onSave(form)}
          className="px-6 py-2.5 bg-gold text-black text-xs font-bold tracking-wider uppercase rounded-lg hover:bg-gold/90 transition-colors"
        >
          {isNew ? "Add Product" : "Save Changes"}
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-2.5 text-white/60 text-xs font-bold tracking-wider uppercase rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
