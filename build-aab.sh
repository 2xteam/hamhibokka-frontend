#!/bin/bash
set -euo pipefail

# Resolve project root (directory of this script)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "[1/5] Checking environment..."
if ! command -v node >/dev/null 2>&1; then
  echo "error: node is not installed or not in PATH" >&2
  exit 1
fi

if ! command -v yarn >/dev/null 2>&1 && ! command -v npm >/dev/null 2>&1; then
  echo "error: yarn or npm is required" >&2
  exit 1
fi

echo "[2/5] Installing JS dependencies (if needed)..."
if command -v yarn >/dev/null 2>&1; then
  yarn install --frozen-lockfile || yarn install
else
  npm ci || npm install
fi

echo "[3/5] Cleaning Android build..."
pushd android >/dev/null

# Ensure Node is reachable for Gradle Exec tasks
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"

./gradlew clean

echo "[4/5] Building Android App Bundle (Release)..."
./gradlew bundleRelease

echo "[5/5] Done. Output bundle: app/build/outputs/bundle/release/app-release.aab"
popd >/dev/null


