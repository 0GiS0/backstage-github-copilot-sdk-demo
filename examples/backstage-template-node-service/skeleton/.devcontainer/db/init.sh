#!/usr/bin/env bash
set -euo pipefail

DB_HOST="${PGHOST:-db}"
DB_PORT="${PGPORT:-5432}"
DB_NAME="${PGDATABASE:-app_db}"
DB_USER="${PGUSER:-app_user}"
DB_PASSWORD="${PGPASSWORD:-app_password}"

echo "[init] Starting database initialization script"

# Ensure psql client is available (image mcr.microsoft.com/devcontainers/javascript-node no trae psql)
if ! command -v psql >/dev/null 2>&1; then
  echo "[init] postgresql-client not found. Installing..."
  # shellcheck disable=SC2016
  sudo apt-get update -y >/dev/null 2>&1 || true
  sudo apt-get install -y --no-install-recommends postgresql-client >/dev/null 2>&1 || {
    echo "[init] Failed to install postgresql-client" >&2; exit 1; }
  echo "[init] postgresql-client installed"
fi

export PGPASSWORD="$DB_PASSWORD"

# Wait for Postgres readiness using exponential backoff (máx ~60s)
echo "[init] Waiting for Postgres at ${DB_HOST}:${DB_PORT}..."
ATTEMPT=0
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" >/dev/null 2>&1; do
  ATTEMPT=$((ATTEMPT+1))
  if [ $ATTEMPT -gt 10 ]; then
    echo "[init] Postgres not ready after $ATTEMPT attempts" >&2
    exit 1
  fi
  SLEEP=$(( ATTEMPT < 5 ? 1 : (ATTEMPT-4)*2 ))
  echo "[init] Not ready yet (attempt $ATTEMPT). Sleeping ${SLEEP}s..."
  sleep "$SLEEP"
done
echo "[init] Postgres is ready"

echo "[init] Relying on container init to create database '${DB_NAME}' (POSTGRES_DB)"

# Apply schema (idempotent: ignore errors on existing objects by using CREATE IF NOT EXISTS inside SQL preferred)
if [ -f .devcontainer/db/schema.sql ]; then
  echo "[init] Applying schema"
  psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -v ON_ERROR_STOP=1 -f .devcontainer/db/schema.sql || {
    echo "[init] Schema application failed" >&2; exit 1; }
else
  echo "[init] WARNING: schema.sql not found, skipping"
fi

# Seed only if target table exists and is empty
if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -tAc "SELECT to_regclass('public.memes')" | grep -q memes; then
  COUNT=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -tAc "SELECT COUNT(*) FROM memes" || echo 0)
  if [ "${COUNT}" = "0" ]; then
    if [ -f .devcontainer/db/seed.sql ]; then
      echo "[init] Seeding data"
      psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -v ON_ERROR_STOP=1 -f .devcontainer/db/seed.sql || {
        echo "[init] Seed failed" >&2; exit 1; }
    else
      echo "[init] WARNING: seed.sql not found, skipping"
    fi
  else
    echo "[init] Skipping seed, table already has data (${COUNT} rows)"
  fi
else
  echo "[init] WARNING: memes table not present after schema. Skipping seed."
fi

echo "[init] Done"
