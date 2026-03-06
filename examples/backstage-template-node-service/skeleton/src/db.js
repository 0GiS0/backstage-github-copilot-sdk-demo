const { Pool } = require("pg");

let pool = null;
let shuttingDown = false;

function getPool() {
  if (!pool) {
    pool = new Pool({
      host: process.env.PGHOST || "localhost",
      port: parseInt(process.env.PGPORT || "5432", 10),
      user: process.env.PGUSER || "app_user",
      password: process.env.PGPASSWORD || "app_password",
      database: process.env.PGDATABASE || "app_db",
      max: 5,
      idleTimeoutMillis: 10000,
    });
    // Silence expected termination errors when container stops
    pool.on("error", (err) => {
      if (err && err.code === "57P01") {
        return; // always ignore admin termination
      }
      if (shuttingDown) {
        return; // suppress any other errors during shutdown
      }
      console.error("[pg pool error]", err.code, err.message);
    });
  }
  return pool;
}

async function closePool() {
  if (pool) {
    shuttingDown = true;
    try {
      await pool.end();
    } catch {
      /* ignore */
    }
    pool = null;
  }
}

module.exports = { getPool, closePool };
