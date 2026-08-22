import { getClientPromise, getMongoDbName } from "@/lib/mongodb";
import {
  normalizeStoreSettings,
  sanitizeStoreSettingsForSave,
} from "@/lib/store-settings-utils";
import { DEFAULT_SETTINGS } from "@/data/defaults";
import type { StoreSettings } from "@/types";

const COLLECTION = "store_settings";
const DOC_ID = "main";

type StoreSettingsDocument = StoreSettings & {
  _id: typeof DOC_ID;
  updatedAt?: Date;
};

export async function getStoreSettings(): Promise<StoreSettings> {
  const client = await getClientPromise();
  const collection = client
    .db(getMongoDbName())
    .collection<StoreSettingsDocument>(COLLECTION);
  const doc = await collection.findOne({ _id: DOC_ID });

  if (!doc) {
    await saveStoreSettings(DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  }

  const { _id, updatedAt, ...settings } = doc;

  return normalizeStoreSettings(settings);
}

export async function saveStoreSettings(settings: StoreSettings): Promise<void> {
  const normalized = sanitizeStoreSettingsForSave(settings);
  const client = await getClientPromise();
  const collection = client
    .db(getMongoDbName())
    .collection<StoreSettingsDocument>(COLLECTION);

  await collection.updateOne(
    { _id: DOC_ID },
    {
      $set: {
        ...normalized,
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );
}
