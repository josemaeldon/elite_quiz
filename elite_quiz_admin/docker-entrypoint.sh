#!/bin/sh
set -e

PERSISTENT_DIR="/var/lib/elite_quiz_admin"
PERSISTENT_DB_CONFIG="${PERSISTENT_DIR}/database.php"
APP_DB_CONFIG="/var/www/html/application/config/database.php"

# Ensure the persistent directory exists
mkdir -p "$PERSISTENT_DIR"

# Restore database config from the persistent volume on container start/update
if [ -f "$PERSISTENT_DB_CONFIG" ]; then
    cp "$PERSISTENT_DB_CONFIG" "$APP_DB_CONFIG"
    chown www-data:www-data "$APP_DB_CONFIG"
fi

exec "$@"
