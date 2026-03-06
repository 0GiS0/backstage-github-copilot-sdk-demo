/**
 * 🚀 Jest Global Setup
 * --------------------
 * Starts an ephemeral PostgreSQL container using Testcontainers _before_ any test file runs.
 * It persists dynamic connection details to `pg-test-meta.json` so that the later
 * `setup-test-db.js` (listed in `setupFilesAfterEnv`) can inject them into process.env.
 *
 * Why separate files?
 *  - global-setup (this file) must run in a separate Node context (cannot directly mutate the test env)
 *  - setup-test-db runs inside the test context and can safely set env vars + run seeding queries
 *
 * Output:
 *  - pg-test-meta.json { host, port, user, password, database, id }
 *  - process.env.__PG_TESTCONTAINERS_ID__ (container id for optional manual debugging)
 */
const { writeFile } = require("fs/promises");
const path = require("path");
const { PostgreSqlContainer } = require("@testcontainers/postgresql");

module.exports = async () => {
  const container = await new PostgreSqlContainer()
    .withDatabase("test_db")
    .withUsername("test_user")
    .withPassword("test_password")
    .start();

  const metadata = {
    host: container.getHost(),
    port: container.getPort(),
    user: container.getUsername(),
    password: container.getPassword(),
    database: container.getDatabase(),
    id: container.getId(),
  };

  await writeFile(
    path.join(__dirname, "pg-test-meta.json"),
    JSON.stringify(metadata),
    "utf-8"
  );
  // Expose container id for teardown
  process.env.__PG_TESTCONTAINERS_ID__ = metadata.id;
};
