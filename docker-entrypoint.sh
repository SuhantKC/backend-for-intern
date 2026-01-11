#!/bin/sh
set -e

# Run Prisma migrations to ensure the database is ready
echo "Running Prisma db push..."
npx prisma db push || true

# Execute the main container command (CMD in Dockerfile)
exec "$@"
