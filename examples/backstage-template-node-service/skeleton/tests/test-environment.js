/**
 * 🧪 Legacy Custom Jest Environment (Not Active)
 * ----------------------------------------------
 * Experimental attempt to manage container lifecycle by extending Jest's
 * Environment directly. Ultimately replaced by the simpler globalSetup +
 * globalTeardown pattern for clarity and compatibility.
 *
 * CURRENT STATUS: Not referenced in `package.json#jest.testEnvironment`.
 * Keep only if you want an example of a custom environment; otherwise can delete.
 */
const NodeEnvironment = require("jest-environment-node");
const { PostgreSqlContainer } = require("@testcontainers/postgresql");
const { closePool } = require("../src/db");

class PostgresTestEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);
    this.container = null;
  }

  async setup() {
    await super.setup();
    // Attempt to start container
    try {
      this.container = await new PostgreSqlContainer()
        .withDatabase("test_db")
        .withUsername("test_user")
        .withPassword("test_password")
        .start();
      this.global.process.env.PGHOST = this.container.getHost();
      this.global.process.env.PGPORT = String(this.container.getPort());
      this.global.process.env.PGUSER = this.container.getUsername();
      this.global.process.env.PGPASSWORD = this.container.getPassword();
      this.global.process.env.PGDATABASE = this.container.getDatabase();
      console.log(
        "[jest-env] Started PostgreSQL container at",
        this.global.process.env.PGHOST + ":" + this.global.process.env.PGPORT
      );

      // Initialize schema + seed
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
    } catch (err) {
      console.warn(
        "[jest-env] Failed to start Testcontainers PostgreSQL, fallback to existing DB:",
        err.message
      );
    }
  }

  async teardown() {
    await closePool();
    if (this.container) {
      await this.container.stop();
    }
    await super.teardown();
  }
}

module.exports = PostgresTestEnvironment;
