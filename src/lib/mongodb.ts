import { MongoClient, type MongoClientOptions } from "mongodb";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const CLIENT_OPTIONS: MongoClientOptions = {
  serverSelectionTimeoutMS: 15_000,
  connectTimeoutMS: 15_000,
  socketTimeoutMS: 45_000,
};

export function getMongoDbName(): string {
  return process.env.MONGODB_DB_NAME?.trim() || "slamfashion";
}

function extractHostFromUri(uri: string): string {
  const match = uri.match(/@([^/?]+)/);
  return match?.[1] || "";
}

function isPlaceholderUri(uri: string): boolean {
  return (
    uri.includes("username:password") ||
    uri.includes("<password>") ||
    uri.includes("<username>")
  );
}

function isValidUri(uri: string): boolean {
  return uri.includes("@") && !isPlaceholderUri(uri);
}

function isSrvUri(uri: string): boolean {
  return uri.startsWith("mongodb+srv://");
}

interface AtlasCredentials {
  userPass: string;
  host: string;
  dbName: string;
}

function getAtlasCredentials(): AtlasCredentials | null {
  const username = process.env.MONGODB_USERNAME?.trim();
  const password = process.env.MONGODB_PASSWORD?.trim();
  const host =
    process.env.MONGODB_HOST?.trim() ||
    process.env.MONGODB_CLUSTER?.trim() ||
    extractHostFromUri(process.env.MONGODB_URI?.trim() || "");

  if (username && password && host) {
    const cleanHost = host
      .replace(/^mongodb(\+srv)?:\/\//, "")
      .replace(/\/.*$/, "");

    return {
      userPass: `${encodeURIComponent(username)}:${encodeURIComponent(password)}`,
      host: cleanHost,
      dbName: getMongoDbName(),
    };
  }

  const uri = process.env.MONGODB_URI?.trim();
  if (!uri || !isValidUri(uri)) {
    return null;
  }

  const match = uri.match(/^mongodb\+srv:\/\/([^@]+)@([^/?]+)(?:\/([^?]*))?/);
  if (!match) {
    return null;
  }

  return {
    userPass: match[1],
    host: match[2],
    dbName: match[3]?.trim() || getMongoDbName(),
  };
}

function buildAtlasDirectUri(creds: AtlasCredentials): string {
  return `mongodb://${creds.userPass}@${creds.host}:27017/${creds.dbName}?ssl=true&authSource=admin&retryWrites=true&w=majority`;
}

function buildAtlasSrvUri(creds: AtlasCredentials): string {
  return `mongodb+srv://${creds.userPass}@${creds.host}/${creds.dbName}?retryWrites=true&w=majority`;
}

function convertSrvUriToDirect(uri: string): string {
  if (!isSrvUri(uri)) {
    return "";
  }

  const match = uri.match(/^mongodb\+srv:\/\/([^@]+)@([^/?]+)(?:\/([^?]*))?/);
  if (!match) {
    return "";
  }

  const dbName = match[3]?.trim() || getMongoDbName();
  return `mongodb://${match[1]}@${match[2]}:27017/${dbName}?ssl=true&authSource=admin&retryWrites=true&w=majority`;
}

export function getMongoConnectionCandidates(): string[] {
  const creds = getAtlasCredentials();
  const rawUri = process.env.MONGODB_URI?.trim();

  const candidates = [
    process.env.MONGODB_STANDARD_URI?.trim(),
    process.env.MONGODB_URI_STANDARD?.trim(),
    creds ? buildAtlasDirectUri(creds) : "",
    rawUri ? convertSrvUriToDirect(rawUri) : "",
    process.env.MONGO_URL?.trim(),
    process.env.MONGODB_URL?.trim(),
    rawUri && !isSrvUri(rawUri) ? rawUri : "",
    creds ? buildAtlasSrvUri(creds) : "",
    rawUri && isSrvUri(rawUri) ? rawUri : "",
  ].filter((value): value is string => Boolean(value && isValidUri(value)));

  return [...new Set(candidates)];
}

export function getMongoUri(): string {
  return getMongoConnectionCandidates()[0] || "";
}

export function isMongoConfigured(): boolean {
  return getMongoConnectionCandidates().length > 0;
}

async function connectWithFallback(): Promise<MongoClient> {
  const candidates = getMongoConnectionCandidates();

  if (!candidates.length) {
    throw new Error("MONGODB_URI is not configured");
  }

  let lastError: unknown;

  for (const uri of candidates) {
    const client = new MongoClient(uri, CLIENT_OPTIONS);

    try {
      await client.connect();
      await client.db(getMongoDbName()).command({ ping: 1 });

      const scheme = isSrvUri(uri) ? "srv" : "direct";
      console.info(`MongoDB connected using ${scheme} URI.`);

      return client;
    } catch (error) {
      lastError = error;
      try {
        await client.close();
      } catch {
        /* ignore */
      }

      const scheme = isSrvUri(uri) ? "srv" : "direct";
      console.warn(`MongoDB ${scheme} connection attempt failed.`);
    }
  }

  throw lastError;
}

let productionClientPromise: Promise<MongoClient> | undefined;

function createCachedClientPromise(
  assign: (promise: Promise<MongoClient> | undefined) => void
): Promise<MongoClient> {
  const promise = connectWithFallback().catch((error) => {
    assign(undefined);
    throw error;
  });

  assign(promise);
  return promise;
}

export function getClientPromise(): Promise<MongoClient> {
  if (!isMongoConfigured()) {
    throw new Error("MONGODB_URI is not configured");
  }

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      return createCachedClientPromise((next) => {
        global._mongoClientPromise = next;
      });
    }

    return global._mongoClientPromise;
  }

  if (!productionClientPromise) {
    return createCachedClientPromise((next) => {
      productionClientPromise = next;
    });
  }

  return productionClientPromise;
}

export function getMongoConnectionErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes("ETIMEOUT") || message.includes("queryTxt")) {
    return "MongoDB DNS timeout. Allow your IP in Atlas Network Access, then add MONGODB_STANDARD_URI from Atlas Connect → Drivers (the mongodb:// string, not mongodb+srv://).";
  }

  if (
    message.includes("Authentication failed") ||
    message.includes("bad auth")
  ) {
    return "MongoDB login failed. Check MONGODB_USERNAME and MONGODB_PASSWORD.";
  }

  if (message.includes("MONGODB_URI is not configured")) {
    return "Database is not configured. Add MongoDB settings to your environment file.";
  }

  return "Could not connect to MongoDB. Verify Atlas Network Access, credentials, and your connection string.";
}

export async function resetMongoClient(): Promise<void> {
  if (process.env.NODE_ENV === "development" && global._mongoClientPromise) {
    try {
      const client = await global._mongoClientPromise;
      await client.close();
    } catch {
      /* ignore close errors */
    }
    global._mongoClientPromise = undefined;
  }

  productionClientPromise = undefined;
}

export async function testMongoConnection(): Promise<{
  ok: boolean;
  message: string;
}> {
  if (!isMongoConfigured()) {
    return {
      ok: false,
      message:
        "Database is not configured. Add MongoDB settings to your environment file.",
    };
  }

  try {
    await resetMongoClient();
    const client = await getClientPromise();
    await client.db(getMongoDbName()).command({ ping: 1 });

    return {
      ok: true,
      message: "Connected to MongoDB successfully.",
    };
  } catch (error) {
    return {
      ok: false,
      message: getMongoConnectionErrorMessage(error),
    };
  }
}
