#!/bin/bash

# === Start Owncast ===
echo "Starting Owncast..."
../owncast/owncast > ../owncast.log 2>&1 &

# Wait for Owncast to initialize
echo "Waiting 10 seconds for Owncast to start..."
sleep 10

# === Start Node.js Server ===
echo "Starting Node.js server..."
node server.js > nodejs.log 2>&1 &

# === Wait for Node.js server to be ready ===
echo "Waiting for Node.js server on port 3001..."

for i in {1..10}; do
  nc -z localhost 3001 && break
  echo "Waiting... ($i)"
  sleep 1
done

if ! nc -z localhost 3001; then
  echo "Node.js server failed to start. Exiting."
  exit 1
fi

echo "Node.js server is running!"

# === Start Ngrok ===
echo "Starting Ngrok..."
ngrok http --host-header=rewrite 3001

