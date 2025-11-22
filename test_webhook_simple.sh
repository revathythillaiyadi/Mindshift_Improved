#!/bin/bash
echo "🔍 Testing n8n Webhook Connection..."
echo ""
echo "Webhook URL: https://trevathy.app.n8n.cloud/webhook/dbb33ceb-ed53-4dc1-8781-4d2786571d68"
echo ""
echo "Sending test request..."
echo ""

response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "https://trevathy.app.n8n.cloud/webhook/dbb33ceb-ed53-4dc1-8781-4d2786571d68" \
  -H "Content-Type: application/json" \
  -d '{"message":"test connection","userId":"test-user","sessionId":"test-session"}')

http_status=$(echo "$response" | grep "HTTP_STATUS" | cut -d: -f2)
body=$(echo "$response" | sed '/HTTP_STATUS/d')

echo "Response:"
echo "$body" | jq . 2>/dev/null || echo "$body"
echo ""
echo "HTTP Status Code: $http_status"
echo ""

if [ "$http_status" = "200" ]; then
  echo "✅ SUCCESS! Workflow is active and working!"
elif [ "$http_status" = "404" ]; then
  echo "❌ FAILED: Workflow is NOT active (404)"
  echo ""
  echo "💡 Solution:"
  echo "   1. Go to https://trevathy.app.n8n.cloud"
  echo "   2. Open your workflow"
  echo "   3. Toggle it to ACTIVE (top-right switch)"
  echo "   4. Run this test again"
else
  echo "⚠️  Unexpected status: $http_status"
  echo "   Check n8n dashboard for workflow status"
fi
