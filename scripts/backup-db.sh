#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "Executing VERITAS SQLite non-blocking online backup..."
node "$PROJECT_ROOT/scripts/backup-db.js"
