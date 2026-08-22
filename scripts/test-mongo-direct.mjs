import { MongoClient } from "mongodb";
import { readFileSync } from "fs";
import { resolveSrv } from "dns/promises";

function loadEnv() {
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
    process.env[key] = val;
  }
}

loadEnv();

const user = encodeURIComponent(process.env.MONGODB_USERNAME || "");
const pass = encodeURIComponent(process.env.MONGODB_PASSWORD || "");
const db = process.env.MONGODB_DB_NAME || "slamfashion";
const cluster = "cluster0.bjivbmr.mongodb.net";

const srv = await resolveSrv(`_mongodb._tcp.${cluster}`);
const hosts = srv.map((r) => `${r.name}:${r.port}`).join(",");

const tests = [
  [
    "multi-shard from SRV",
    `mongodb://${user}:${pass}@${hosts}/${db}?ssl=true&authSource=admin&retryWrites=true&w=majority`,
  ],
  [
    "single shard directConnection",
    `mongodb://${user}:${pass}@${srv[0].name}:${srv[0].port}/${db}?ssl=true&authSource=admin&directConnection=true`,
  ],
];

for (const [name, uri] of tests) {
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 20000 });
  try {
    await client.connect();
    await client.db(db).command({ ping: 1 });
    console.log("OK", name);
    await client.close();
  } catch (e) {
    console.log("FAIL", name, (e instanceof Error ? e.message : e).slice(0, 120));
    try {
      await client.close();
    } catch {
      /* ignore */
    }
  }
}
