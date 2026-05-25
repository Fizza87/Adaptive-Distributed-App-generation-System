#!/bin/bash

echo "========================================================================"
echo " ADAGDS - End-to-End Orchestration & Verification Runner"
echo "========================================================================"

# Clean up old states
echo "[1/4] Flushing old outputs and configurations..."
rm -rf output configs
mkdir -p configs

# Create exactly 15 unique JSON configurations to satisfy the 10-20 requirement
echo "[2/4] Populating multi-tenant JSON configurations..."
for i in {1..15}
do
  if [ $((i % 3)) -eq 0 ]; then
    FEATURES='["auth", "api"]'
  elif [ $((i % 3)) -eq 1 ]; then
    FEATURES='["dashboard", "api"]'
  else
    FEATURES='["auth", "dashboard", "api"]'
  fi

  cat <<EOF > configs/app${i}.json
{
  "appName": "app${i}",
  "appId": "tenant-00${i}",
  "version": "1.0.0",
  "environment": "production",
  "port": $((3000 + i)),
  "features": ${FEATURES}
}
EOF
done

echo "[3/4] Starting Master Coordinator..."
node master.js

echo ""
echo "[4/4] Verifying generated standalone structures..."
if [ -d "output" ]; then
  echo "✔ Output folder created successfully."
else
  echo "❌ Error: Generation step failed."
fi
