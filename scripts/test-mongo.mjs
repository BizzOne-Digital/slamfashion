import { MongoClient } from "mongodb";
import { readFileSync } from "fs";

function loadEnv() {
  try {
    const raw = readFileSync(".env.local", "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    /* ignore */
  }
}

loadEnv();

const user = process.env.MONGODB_USERNAME;
const pass = process.env.MONGODB_PASSWORD;
const uri = process.env.MONGODB_URI;
const standard = process.env.MONGODB_STANDARD_URI;
const host = process.env.MONGODB_CLUSTER || "cluster0.bjivbmr.mongodb.net";
const db = process.env.MONGODB_DB_NAME || "slamfashion";

const enc = (s) => encodeURIComponent(s);

const shards = [
  "ac-67mawqe-shard-00-00.bjivbmr.mongodb.net",
  "ac-67mawqe-shard-00-01.bjivbmr.mongodb.net",
  "ac-67mawqe-shard-00-02.bjivbmr.mongodb.net",
];

const replicaSetUri =
  user && pass
    ? `mongodb://${enc(user)}:${enc(pass)}@${shards.map((h) => `${h}:27017`).join(",")}/${db}?ssl=true&replicaSet=atlas-67mawqe-shard-0&authSource=admin&retryWrites=true&w=majority`
    : null;

const candidates = [
  ["MONGODB_STANDARD_URI", standard],
  ["replica-set-direct", replicaSetUri],
  [
    "direct-single-host",
    user && pass
      ? `mongodb://${enc(user)}:${enc(pass)}@${host}:27017/${db}?ssl=true&authSource=admin`
      : null,
  ],
  ["MONGODB_URI (srv)", uri],
];

async function test(name, connectionUri) {
  if (!connectionUri) {
    console.log(`SKIP ${name}: not configured`);
    return false;
  }

  const masked = connectionUri.replace(/:[^:@]+@/, ":***@");
  const client = new MongoClient(connectionUri, {
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
  });
  const start = Date.now();

  try {
    await client.connect();
    await client.db(db).command({ ping: 1 });
    console.log(`OK   ${name} (${Date.now() - start}ms)`);
    console.log(`     ${masked.slice(0, 100)}...`);
    await client.close();
    return true;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.log(`FAIL ${name} (${Date.now() - start}ms)`);
    console.log(`     ${msg.slice(0, 200)}`);
    try {
      await client.close();
    } catch {
      /* ignore */
    }
    return false;
  }
}

console.log("MongoDB connection diagnostics\n");

for (const [name, connectionUri] of candidates) {
  const ok = await test(name, connectionUri);
  if (ok) process.exit(0);
}

process.exit(1);
