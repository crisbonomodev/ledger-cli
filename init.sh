#!/usr/bin/env bash
set -e

INSTALL_CMD="npm install"
VERIFY_CMD="npm run check && npm test"
REMOVE_BUILD_CMD="rm -rf dist"
BUILD_CMD="npm run build"
START_CMD="npm start"

echo "Running in: $(pwd)"

echo "Installing dependencies..."
$INSTALL_CMD

echo "Running verification..."
eval "$VERIFY_CMD"

echo "Running build..."
$REMOVE_BUILD_CMD
$BUILD_CMD

echo "Setup complete. Start with:"
echo "  $START_CMD"

if [ "$RUN_START_COMMAND" = "1" ]; then
  $START_CMD
fi