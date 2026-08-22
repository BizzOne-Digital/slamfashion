"use client";

import { useState } from "react";
import { Plus, Search, Star, Trash2 } from "lucide-react";
import { AdminModal } from "@/components/admin/AdminModal";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import type { Product, ProductCategory } from "@/types";

const CATEGORIES: ProductCategory[] = [
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
  "Bracelets",
];

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

export const emptyProduct: Omit<Product, "id"> = {
  title: "",
  category: "T-Shirts",
  price: 0,
  image: "",
  description: "",
  sizes: ["S", "M", "L", "XL", "2XL"],
  colors: [{ name: "Black", hex: "#000000" }],
  featured: false,
};

interface ProductsPanelProps {
  products: Product[];
  onAdd: (product: Omit<Product, "id">) => void;
  onUpdate: (id: string, product: Partial<Product>) => void;
  onRemove: (id: string) => void;
}

export function ProductsPanel({
  products,
  onAdd,
  onUpdate,
  onRemove,
}: ProductsPanelProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | "All">(
    "All"
  );
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Omit<Product, "id"> | null>(
    null
  );

  const filtered = products.filter((product) => {
    const matchesSearch =
      !search.trim() ||
      product.title.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">
            Products ({products.length})
          </h2>
          <p className="mt-1 text-sm text-white/40">
            Add, edit, or remove products. Changes save to MongoDB instantly.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setNewProduct({ ...emptyProduct });
            setEditingProduct(null);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-gold px-4 py-2 text-xs font-bold tracking-wider text-black uppercase transition-colors hover:bg-gold/90"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-lg border border-white/10 bg-surface py-2.5 pr-4 pl-10 text-sm text-white focus:border-gold/50 focus:outline-none"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) =>
            setCategoryFilter(e.target.value as ProductCategory | "All")
          }
          className="rounded-lg border border-white/10 bg-surface px-4 py-2.5 text-sm text-white focus:border-gold/50 focus:outline-none"
        >
          <option value="All">All categories</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <AdminModal
        open={Boolean(newProduct || editingProduct)}
        onClose={() => {
          setEditingProduct(null);
          setNewProduct(null);
        }}
        title={newProduct ? "New Product" : "Edit Product"}
      >
        {(newProduct || editingProduct) && (
          <ProductForm
            key={editingProduct?.id ?? "new-product"}
            product={editingProduct || newProduct!}
            isNew={!!newProduct}
            onSave={(data) => {
              if (editingProduct) {
                onUpdate(editingProduct.id, data);
              } else {
                onAdd(data);
              }
              setEditingProduct(null);
              setNewProduct(null);
            }}
            onCancel={() => {
              setEditingProduct(null);
              setNewProduct(null);
            }}
          />
        )}
      </AdminModal>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 bg-surface/50 px-6 py-12 text-center">
          <p className="text-sm text-white/50">
            {products.length === 0
              ? "No products yet. Click Add Product to get started."
              : "No products match your search."}
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-4 rounded-xl border border-white/5 bg-surface p-4 transition-colors hover:border-white/10"
            >
              <div
                className="h-16 w-16 shrink-0 rounded-lg bg-surface-light bg-cover bg-center"
                style={{
                  backgroundImage: product.image
                    ? `url(${product.image})`
                    : undefined,
                }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-bold text-white">
                    {product.title || "Untitled product"}
                  </h3>
                  {product.featured && (
                    <Star className="h-3.5 w-3.5 shrink-0 fill-gold text-gold" />
                  )}
                </div>
                <p className="mt-0.5 text-xs text-white/40">
                  {product.category} · ${product.price.toFixed(2)}
                </p>
                {product.description && (
                  <p className="mt-1 line-clamp-1 text-xs text-white/30">
                    {product.description}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(product);
                    setNewProduct(null);
                  }}
                  className="rounded border border-gold/30 px-3 py-1.5 text-xs font-semibold text-gold transition-colors hover:bg-gold/10"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (
                      confirm(
                        `Delete "${product.title}"? This will remove it from MongoDB permanently.`
                      )
                    ) {
                      onRemove(product.id);
                      if (editingProduct?.id === product.id) {
                        setEditingProduct(null);
                      }
                    }
                  }}
                  className="rounded p-1.5 text-red-400 transition-colors hover:bg-red-400/10"
                  aria-label={`Delete ${product.title}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
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
  const [colorName, setColorName] = useState("");
  const [colorHex, setColorHex] = useState("#000000");

  const toggleSize = (size: string) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const addColor = () => {
    if (!colorName.trim()) return;
    setForm((prev) => ({
      ...prev,
      colors: [...prev.colors, { name: colorName.trim(), hex: colorHex }],
    }));
    setColorName("");
    setColorHex("#000000");
  };

  const removeColor = (index: number) => {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index),
    }));
  };

  const canSave = form.title.trim() && form.image.trim() && form.price >= 0;
  const featuredFieldId = isNew
    ? "featured-new"
    : `featured-${(product as Product).id}`;

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-semibold tracking-wider text-white/40 uppercase">
            Title *
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded-lg border border-white/10 bg-surface-light px-4 py-2.5 text-sm text-white focus:border-gold/50 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold tracking-wider text-white/40 uppercase">
            Category
          </label>
          <select
            value={form.category}
            onChange={(e) =>
              setForm({
                ...form,
                category: e.target.value as ProductCategory,
              })
            }
            className="w-full rounded-lg border border-white/10 bg-surface-light px-4 py-2.5 text-sm text-white focus:border-gold/50 focus:outline-none"
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold tracking-wider text-white/40 uppercase">
            Price ($) *
          </label>
          <input
            type="number"
            min={0}
            step={0.01}
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: parseFloat(e.target.value) || 0 })
            }
            className="w-full rounded-lg border border-white/10 bg-surface-light px-4 py-2.5 text-sm text-white focus:border-gold/50 focus:outline-none"
          />
        </div>
        <div className="sm:col-span-2">
          <ImageUploadField
            label="Product Image *"
            value={form.image}
            folder="products"
            onChange={(url) => setForm({ ...form, image: url })}
            hint="Upload from your computer — stored in MongoDB when connected."
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-semibold tracking-wider text-white/40 uppercase">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full resize-none rounded-lg border border-white/10 bg-surface-light px-4 py-2.5 text-sm text-white focus:border-gold/50 focus:outline-none"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-2 block text-xs font-semibold tracking-wider text-white/40 uppercase">
            Sizes
          </label>
          <div className="flex flex-wrap gap-2">
            {SIZE_OPTIONS.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  form.sizes.includes(size)
                    ? "border-gold bg-gold/20 text-gold"
                    : "border-white/10 text-white/50 hover:border-white/20"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-2 block text-xs font-semibold tracking-wider text-white/40 uppercase">
            Colors
          </label>
          <div className="mb-3 flex flex-wrap gap-2">
            {form.colors.map((color, index) => (
              <span
                key={`${color.name}-${index}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-surface-light px-3 py-1 text-xs text-white/70"
              >
                <span
                  className="h-3 w-3 rounded-full border border-white/20"
                  style={{ backgroundColor: color.hex }}
                />
                {color.name}
                <button
                  type="button"
                  onClick={() => removeColor(index)}
                  className="text-white/30 hover:text-red-400"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={colorName}
              onChange={(e) => setColorName(e.target.value)}
              placeholder="Color name"
              className="rounded-lg border border-white/10 bg-surface-light px-3 py-2 text-sm text-white focus:border-gold/50 focus:outline-none"
            />
            <input
              type="color"
              value={colorHex}
              onChange={(e) => setColorHex(e.target.value)}
              className="h-10 w-10 cursor-pointer rounded-lg border border-white/10 bg-transparent"
            />
            <button
              type="button"
              onClick={addColor}
              className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-white/60 hover:bg-white/5"
            >
              Add color
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:col-span-2">
          <input
            type="checkbox"
            id={featuredFieldId}
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            className="h-4 w-4 accent-gold"
          />
          <label htmlFor={featuredFieldId} className="text-sm text-white/60">
            Featured on homepage
          </label>
        </div>
      </div>
      <div className="sticky bottom-0 mt-6 flex gap-3 border-t border-white/10 bg-surface pt-4">
        <button
          type="button"
          disabled={!canSave}
          onClick={() => onSave(form)}
          className="rounded-lg bg-gold px-6 py-2.5 text-xs font-bold tracking-wider text-black uppercase transition-colors hover:bg-gold/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isNew ? "Add Product" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-white/10 px-6 py-2.5 text-xs font-bold tracking-wider text-white/60 uppercase transition-colors hover:bg-white/5"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
