/**
 * 🧪 Legacy Inline Testcontainers Setup (Not Active)
 * -------------------------------------------------
 * This file demonstrates an alternative approach where container lifecycle
 * is managed via Jest's `beforeAll/afterAll` inside the test environment itself.
 *
 * CURRENT STATUS: Not referenced by the active Jest configuration.
 * Kept only as an educational example. Preferred approach uses:
 *  - global-setup.js (start container, write metadata)
 *  - setup-test-db.js (inject env + seed)
 *  - global-teardown.js (graceful shutdown)
 *
 * You can delete this file safely once confident with the new flow.
 */
/* eslint-env jest */
/* global beforeAll, afterAll */
const { PostgreSqlContainer } = require("@testcontainers/postgresql");
const { closePool } = require("../src/db");
const fs = require("fs");

// Keep reference across tests
let container;

async function globalSetup() {
  let runtimeAvailable = false;
  runtimeAvailable =
    fs.existsSync("/var/run/docker.sock") || !!process.env.DOCKER_HOST;

  if (runtimeAvailable) {
    try {
      container = await new PostgreSqlContainer()
        .withDatabase("test_db")
        .withUsername("test_user")
        .withPassword("test_password")
        .start();

      process.env.PGHOST = container.getHost();
      process.env.PGPORT = String(container.getPort());
      process.env.PGUSER = container.getUsername();
      process.env.PGPASSWORD = container.getPassword();
      process.env.PGDATABASE = container.getDatabase();
      console.log("[testcontainers] Started ephemeral PostgreSQL container");
    } catch (err) {
      console.warn(
        "[testcontainers] Failed to start container, falling back to existing DB:",
        err.message
      );
    }
  } else {
    console.warn(
      "[testcontainers] No container runtime detected, using existing database configuration"
    );
  }

  // Simple bootstrap schema (mirror minimal production schema subset)
  const { getPool } = require("../src/db");
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

async function globalTeardown() {
  await closePool();
  if (container) {
    await container.stop();
  }
}

beforeAll(async () => {
  await globalSetup();
});
afterAll(async () => {
  await globalTeardown();
});
