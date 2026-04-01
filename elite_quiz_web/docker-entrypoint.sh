#!/bin/sh
set -e

PERSISTENT_DIR="/var/lib/elite_quiz_web"
RUNTIME_ENV="${PERSISTENT_DIR}/.env.runtime"

# Ensure the persistent directory exists
mkdir -p "$PERSISTENT_DIR"

# Load persistent runtime config if it exists, exporting all vars before starting Next.js
if [ -f "$RUNTIME_ENV" ]; then
    set -a
    # shellcheck disable=SC1090
    . "$RUNTIME_ENV"
    set +a
fi

exec "$@"
