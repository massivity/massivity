#!/bin/bash
echo "🚀 Exécution des migrations..."
docker cp migrations/V1__add_refresh_token.sql massivity-db-1:/tmp/migration.sql
docker exec -it massivity-db-1 psql -U postgres -d monapiclient -f /tmp/migration.sql
echo "✅ Migration terminée"
