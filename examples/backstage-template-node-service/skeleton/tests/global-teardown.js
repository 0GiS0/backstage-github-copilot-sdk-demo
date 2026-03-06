/**
 * 🧹 Jest Global Teardown
 * -----------------------
 * Executes AFTER all test suites finish. Ensures a graceful shutdown order:
 *  1. Close pg pool (avoids FATAL 57P01 event spam).
 *  2. Stop the PostgreSQL Testcontainers container.
 *  3. Remove the container and metadata file.
 * Silent catches are intentional to keep teardown resilient in flaky environments.
 */
const { execSync } = require("child_process");
const path = require("path");
const { readFile, unlink } = require("fs/promises");
const { closePool } = require("../src/db");

module.exports = async () => {
  // Stop and remove container if metadata exists
  const metaFile = path.join(__dirname, "pg-test-meta.json");
  try {
    const meta = JSON.parse(await readFile(metaFile, "utf-8"));
    // Close pool first to avoid FATAL 57P01
    await closePool().catch(() => {});
    if (meta.id) {
      try {
        execSync(`docker stop ${meta.id}`, { stdio: "ignore" });
      } catch {
        /* noop */
      }
      try {
        execSync(`docker rm ${meta.id}`, { stdio: "ignore" });
      } catch {
        /* noop */
      }
    }
    await unlink(metaFile).catch(() => {});
  } catch {
    // metadata not present
  }
};
