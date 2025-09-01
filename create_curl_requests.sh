#!/bin/bash

# Script to generate curl requests for each account in sample-account-requests.json
# Usage: ./create_curl_requests.sh [API_BASE_URL]

API_ENDPOINT=${1:-"http://localhost:3000/account"}
JSON_FILE="sample-account-requests.json"

echo "# Curl requests for creating accounts"
echo "# Generated from: $JSON_FILE"
echo "# API Endpoint: $API_ENDPOINT"
echo ""

# Check if jq is available
if ! command -v jq &> /dev/null; then
    echo "Error: jq is required but not installed. Please install jq first."
    exit 1
fi

# Check if JSON file exists
if [ ! -f "$JSON_FILE" ]; then
    echo "Error: $JSON_FILE not found in current directory"
    exit 1
fi

# Counter for request numbering
counter=1

# Read JSON array and create curl request for each object
jq -c '.[]' "$JSON_FILE" | while read -r account; do
    echo "# Request $counter"
    echo "curl -X POST \"${API_ENDPOINT}\" \\"
    echo "  -H \"Content-Type: application/json\" \\"
    echo "  -H \"Accept: application/json\" \\"
    echo "  -d '$account'"
    echo ""
    ((counter++))
done

echo "# Total requests generated: $((counter-1))"
