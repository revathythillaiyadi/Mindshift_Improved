#!/bin/bash
echo "Testing n8n Webhook Connection..."
echo ""
echo "1. Testing TEST webhook:"
echo "   URL: https://trevathy.app.n8n.cloud/webhook-test/b15d3ab2-c44b-4786-a227-6e53000b0f43"
echo ""
curl -X POST "https://trevathy.app.n8n.cloud/webhook-test/b15d3ab2-c44b-4786-a227-6e53000b0f43" \
  -H "Content-Type: application/json" \
  -d '{"message":"test connection","userId":"test-user","sessionId":"test-session"}' \
  -w "\n\nHTTP Status: %{http_code}\n" \
  --max-time 10 2>&1 | grep -E "(HTTP|code|message|response|error)" || echo "No response received"
echo ""
echo "---"
echo ""
echo "2. Testing PRODUCTION webhook:"
echo "   URL: https://trevathy.app.n8n.cloud/webhook/dbb33ceb-ed53-4dc1-8781-4d2786571d68"
echo ""
curl -X POST "https://trevathy.app.n8n.cloud/webhook/dbb33ceb-ed53-4dc1-8781-4d2786571d68" \
  -H "Content-Type: application/json" \
  -d '{"message":"test connection","userId":"test-user","sessionId":"test-session"}' \
  -w "\n\nHTTP Status: %{http_code}\n" \
  --max-time 10 2>&1 | grep -E "(HTTP|code|message|response|error)" || echo "No response received"
