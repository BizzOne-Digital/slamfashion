"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import type { CollectionCategory } from "@/types";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const emptyCollection: Omit<CollectionCategory, "id"> = {
  title: "",
  description: "",
  image: "",
  slug: "",
};

interface CollectionsPanelProps {
  collections: CollectionCategory[];
  onAdd: (collection: Omit<CollectionCategory, "id">) => void;
  onUpdate: (id: string, collection: Partial<CollectionCategory>) => void;
  onRemove: (id: string) => void;
}

export function CollectionsPanel({
  collections,
  onAdd,
  onUpdate,
  onRemove,
}: CollectionsPanelProps) {
  const [editing, setEditing] = useState<CollectionCategory | null>(null);
  const [creating, setCreating] = useState<Omit<CollectionCategory, "id"> | null>(
    null
  );

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">
            Collections ({collections.length})
          </h2>
          <p className="mt-1 text-sm text-white/40">
            Manage collection cards shown on the Collections page.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setCreating({ ...emptyCollection });
            setEditing(null);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-gold px-4 py-2 text-xs font-bold tracking-wider text-black uppercase transition-colors hover:bg-gold/90"
        >
          <Plus className="h-4 w-4" />
          Add Collection
        </button>
      </div>

      {(creating || editing) && (
        <CollectionForm
          collection={editing || creating!}
          isNew={!!creating}
          onSave={(data) => {
            if (editing) {
              onUpdate(editing.id, data);
            } else {
              onAdd(data);
            }
            setEditing(null);
            setCreating(null);
          }}
          onCancel={() => {
            setEditing(null);
            setCreating(null);
          }}
        />
      )}

      {collections.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 bg-surface/50 px-6 py-12 text-center">
          <p className="text-sm text-white/50">
            No collections yet. Add your first collection.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="overflow-hidden rounded-xl border border-white/5 bg-surface transition-colors hover:border-white/10"
            >
              <div
                className="h-32 bg-surface-light bg-cover bg-center"
                style={{
                  backgroundImage: collection.image
                    ? `url(${collection.image})`
                    : undefined,
                }}
              />
              <div className="p-4">
                <h3 className="text-sm font-bold text-white">
                  {collection.title}
                </h3>
                <p className="mt-1 text-xs text-gold/80">/{collection.slug}</p>
                <p className="mt-2 line-clamp-2 text-xs text-white/40">
                  {collection.description}
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(collection);
                      setCreating(null);
                    }}
                    className="flex-1 rounded border border-gold/30 py-1.5 text-xs font-semibold text-gold transition-colors hover:bg-gold/10"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        confirm(
                          `Delete "${collection.title}"? This cannot be undone.`
                        )
                      ) {
                        onRemove(collection.id);
                        if (editing?.id === collection.id) setEditing(null);
                      }
                    }}
                    className="rounded p-1.5 text-red-400 transition-colors hover:bg-red-400/10"
                    aria-label={`Delete ${collection.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CollectionForm({
  collection,
  isNew,
  onSave,
  onCancel,
}: {
  collection: CollectionCategory | Omit<CollectionCategory, "id">;
  isNew: boolean;
  onSave: (data: Omit<CollectionCategory, "id">) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({ ...collection });
  const [slugManual, setSlugManual] = useState(
    Boolean(collection.slug && collection.title)
  );

  const updateTitle = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: slugManual ? prev.slug : slugify(title),
    }));
  };

  const canSave =
    form.title.trim() && form.slug.trim() && form.image.trim();

  return (
    <div className="mb-6 rounded-xl border border-gold/20 bg-surface p-6">
      <h3 className="mb-4 text-sm font-bold tracking-wider text-gold uppercase">
        {isNew ? "New Collection" : "Edit Collection"}
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-semibold tracking-wider text-white/40 uppercase">
            Title *
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => updateTitle(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-surface-light px-4 py-2.5 text-sm text-white focus:border-gold/50 focus:outline-none"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-semibold tracking-wider text-white/40 uppercase">
            URL Slug *
          </label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => {
              setSlugManual(true);
              setForm({ ...form, slug: slugify(e.target.value) });
            }}
            placeholder="e.g. headwear"
            className="w-full rounded-lg border border-white/10 bg-surface-light px-4 py-2.5 font-mono text-sm text-white focus:border-gold/50 focus:outline-none"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-semibold tracking-wider text-white/40 uppercase">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            rows={2}
            className="w-full resize-none rounded-lg border border-white/10 bg-surface-light px-4 py-2.5 text-sm text-white focus:border-gold/50 focus:outline-none"
          />
        </div>
        <div className="sm:col-span-2">
          <ImageUploadField
            label="Collection Image *"
            value={form.image}
            folder="collections"
            onChange={(url) => setForm({ ...form, image: url })}
            hint="This image appears on the Collections page card."
          />
        </div>
      </div>
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          disabled={!canSave}
          onClick={() => onSave(form)}
          className="rounded-lg bg-gold px-6 py-2.5 text-xs font-bold tracking-wider text-black uppercase transition-colors hover:bg-gold/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isNew ? "Add Collection" : "Save Changes"}
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
