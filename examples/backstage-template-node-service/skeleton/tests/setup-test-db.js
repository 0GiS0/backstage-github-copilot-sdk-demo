/**
 * 🌱 Test DB Seeding (Jest setupFilesAfterEnv)
 * -------------------------------------------
 * Runs inside the Jest test environment AFTER global-setup completed.
 * Responsibilities:
 *  1. Read `pg-test-meta.json` produced by global-setup.
 *  2. Inject dynamic PG* env vars so application code points to the ephemeral DB.
 *  3. Create / migrate minimal schema and seed deterministic sample data.
 *
 * Idempotent: safe to run multiple times (CREATE TABLE IF NOT EXISTS + ON CONFLICT DO NOTHING).
 */
const { readFile } = require("fs/promises");
const path = require("path");
const { getPool } = require("../src/db");

async function seed() {
  const metaPath = path.join(__dirname, "pg-test-meta.json");
  let meta;
  try {
    meta = JSON.parse(await readFile(metaPath, "utf-8"));
  } catch {
    console.warn(
      "[tests] No Testcontainers metadata found, skipping container env injection"
    );
    return;
  }
  process.env.PGHOST = meta.host;
  process.env.PGPORT = String(meta.port);
  process.env.PGUSER = meta.user;
  process.env.PGPASSWORD = meta.password;
  process.env.PGDATABASE = meta.database;

  const pool = getPool();
  await pool.query(`CREATE TABLE IF NOT EXISTS memes (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    category TEXT,
    tags TEXT[],
    likes INT NOT NULL DEFAULT 0,
    views INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`);
  await pool.query(`INSERT INTO memes (title, description, image_url, category, tags, likes, views)
    VALUES ('Meme Template A','Great template for reactions','https://example.com/meme-a.jpg','reaction',ARRAY['funny','reaction'],100,500),
           ('Meme Template B','Classic format meme','https://example.com/meme-b.jpg','format',ARRAY['classic','popular'],250,1200)
    ON CONFLICT DO NOTHING;`);
}

module.exports = async () => {
  await seed();
};
