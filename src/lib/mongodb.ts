import { resolveSrv } from "dns/promises";
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
  const hostPart = match?.[1] || "";
  return hostPart.split(":")[0] || "";
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
    const directMatch = uri.match(/^mongodb:\/\/([^@]+)@([^/?]+)(?:\/([^?]*))?/);
    if (!directMatch) return null;
    return {
      userPass: directMatch[1],
      host: extractHostFromUri(uri),
      dbName: directMatch[3]?.trim() || getMongoDbName(),
    };
  }

  return {
    userPass: match[1],
    host: match[2],
    dbName: match[3]?.trim() || getMongoDbName(),
  };
}

function buildAtlasSrvUri(creds: AtlasCredentials): string {
  return `mongodb+srv://${creds.userPass}@${creds.host}/${creds.dbName}?retryWrites=true&w=majority`;
}

/**
 * Resolve Atlas shard hosts via SRV (works on Windows when TXT records time out).
 * Avoids mongodb+srv:// which requires a TXT DNS lookup that many routers block.
 */
async function resolveAtlasShardUris(
  creds: AtlasCredentials
): Promise<string[]> {
  try {
    const records = await resolveSrv(`_mongodb._tcp.${creds.host}`);
    if (!records.length) return [];

    const hosts = records.map((record) => `${record.name}:${record.port}`).join(",");
    const primary = records[0];

    return [
      `mongodb://${creds.userPass}@${hosts}/${creds.dbName}?ssl=true&authSource=admin&retryWrites=true&w=majority`,
      `mongodb://${creds.userPass}@${primary.name}:${primary.port}/${creds.dbName}?ssl=true&authSource=admin&directConnection=true&retryWrites=true&w=majority`,
    ];
  } catch (error) {
    console.warn("Could not resolve Atlas SRV records:", error);
    return [];
  }
}

/** Static URIs from environment — excludes broken cluster-hostname:27017 shortcuts. */
export function getStaticConnectionCandidates(): string[] {
  const creds = getAtlasCredentials();
  const rawUri = process.env.MONGODB_URI?.trim();

  const candidates = [
    process.env.MONGODB_STANDARD_URI?.trim(),
    process.env.MONGODB_URI_STANDARD?.trim(),
    process.env.MONGO_URL?.trim(),
    process.env.MONGODB_URL?.trim(),
    rawUri && !isSrvUri(rawUri) && isValidUri(rawUri) ? rawUri : "",
    creds ? buildAtlasSrvUri(creds) : "",
    rawUri && isSrvUri(rawUri) && isValidUri(rawUri) ? rawUri : "",
  ].filter((value): value is string => Boolean(value && isValidUri(value)));

  return [...new Set(candidates)];
}

/** @deprecated Use getStaticConnectionCandidates — kept for compatibility */
export function getMongoConnectionCandidates(): string[] {
  return getStaticConnectionCandidates();
}

export function getMongoUri(): string {
  return getStaticConnectionCandidates()[0] || "";
}

export function isMongoConfigured(): boolean {
  return Boolean(getAtlasCredentials() || getStaticConnectionCandidates().length);
}

async function connectWithFallback(): Promise<MongoClient> {
  const staticCandidates = getStaticConnectionCandidates();
  const creds = getAtlasCredentials();

  if (!staticCandidates.length && !creds) {
    throw new Error("MONGODB_URI is not configured");
  }

  const resolvedCandidates = creds ? await resolveAtlasShardUris(creds) : [];

  // Prefer SRV-resolved shard URIs first — fixes Windows router TXT DNS timeouts.
  const candidates = [...new Set([...resolvedCandidates, ...staticCandidates])];

  let lastError: unknown;

  for (const uri of candidates) {
    const client = new MongoClient(uri, CLIENT_OPTIONS);

    try {
      await client.connect();
      await client.db(getMongoDbName()).command({ ping: 1 });

      const scheme = uri.includes("directConnection=true")
        ? "shard-direct"
        : isSrvUri(uri)
          ? "srv"
          : "standard";
      console.info(`MongoDB connected using ${scheme} URI.`);

      return client;
    } catch (error) {
      lastError = error;
      try {
        await client.close();
      } catch {
        /* ignore */
      }

      console.warn(`MongoDB connection attempt failed (${uri.slice(0, 40)}...).`);
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
    return "MongoDB DNS timeout (your router blocks SRV TXT lookups). Restart the dev server — the app now auto-resolves shard hosts. Or set MONGODB_STANDARD_URI from Atlas Connect → Drivers.";
  }

  if (
    message.includes("Authentication failed") ||
    message.includes("bad auth")
  ) {
    return "MongoDB login failed. Check MONGODB_USERNAME and MONGODB_PASSWORD match your Atlas user.";
  }

  if (message.includes("MONGODB_URI is not configured")) {
    return "Database is not configured. Add MongoDB settings to your environment file.";
  }

  if (message.includes("Server selection timed out")) {
    return "MongoDB connection timed out. Check Atlas Network Access (0.0.0.0/0) and restart npm run dev.";
  }

  return "Could not connect to MongoDB. Verify Atlas credentials and restart the dev server.";
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
