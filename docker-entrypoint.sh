#!/bin/sh
set -e

# Run Prisma migrations to ensure the database is ready
echo "Running Prisma migrations..."
npx prisma migrate deploy

# Execute the main container command (CMD in Dockerfile)
exec "$@"
