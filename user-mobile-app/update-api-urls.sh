#!/bin/bash

# This script updates API_BASE_URL in all app files

# Define search pattern and replacement
SEARCH_PATTERN="const API_BASE_URL = Platform.select({\n  web: .*,\n  default: .*\n});"
REPLACEMENT="const API_BASE_URL = Platform.select({\n  web: 'http://localhost:8080',\n  default: 'http://192.168.1.107:8080' // Use your device's network IP when testing on real devices\n});"

# Find all files containing API_BASE_URL
grep -l "API_BASE_URL" --include="*.tsx" -r ./app/ | while read -r file; do
  # Use sed to replace the pattern in each file
  sed -i "s|$SEARCH_PATTERN|$REPLACEMENT|g" "$file"
  echo "Updated $file"
done

echo "API URL update complete!"
