# 🔧 Fixing "Failed to Fetch" / CORS Error

## 🔍 Understanding the Error

The "Failed to fetch" or "Network error" you're seeing can have several causes:

1. **Workflow Not Active** (Most Common)
   - n8n workflow must be ACTIVE for webhooks to work
   - Returns 404, but browser shows it as "Failed to fetch"

2. **CORS Issue**
   - Browser blocking cross-origin requests
   - n8n webhooks should allow CORS by default, but may need configuration

3. **Network Connectivity**
   - Internet connection issue
   - Firewall blocking requests
   - VPN or proxy interference

4. **SSL/Certificate Issue**
   - Certificate validation failure
   - Mixed content (HTTP/HTTPS)

## ✅ Step-by-Step Fix

### Step 1: Verify Workflow is Active (CRITICAL)

**This is the most common cause!**

1. Go to: https://trevathy.app.n8n.cloud
2. Open your workflow
3. **Toggle must be ON/ACTIVE** (top-right corner)
4. Verify it shows "Active" status

**Test:** Run this command to verify:
```bash
curl -X POST "https://trevathy.app.n8n.cloud/webhook/dbb33ceb-ed53-4dc1-8781-4d2786571d68" \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}'
```

- **404 response** = Workflow not active ❌
- **200 response** = Workflow is active ✅

### Step 2: Check n8n Webhook CORS Settings

1. In your n8n workflow, click on the **Webhook node**
2. Look for **CORS** or **Response Headers** settings
3. Ensure CORS is enabled or set to allow all origins:
   - `Access-Control-Allow-Origin: *`
   - Or specific origin: `Access-Control-Allow-Origin: http://localhost:5173`

**Note:** Most n8n webhooks allow CORS by default, but check if you've customized settings.

### Step 3: Check Browser Console

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Look for detailed error messages
4. Go to **Network** tab
5. Try the test again
6. Click on the failed request
7. Check:
   - **Status Code** (404, 500, etc.)
   - **Response Headers** (look for CORS headers)
   - **Error message** in Response tab

### Step 4: Test Network Connectivity

```bash
# Test if n8n is reachable
curl -I https://trevathy.app.n8n.cloud

# Test webhook directly
curl -X POST "https://trevathy.app.n8n.cloud/webhook/dbb33ceb-ed53-4dc1-8781-4d2786571d68" \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}' \
  -v
```

## 🔍 Diagnostic Checklist

Run through this checklist:

- [ ] **Workflow is ACTIVE** in n8n dashboard
- [ ] **Webhook ID matches** in `.env` and n8n dashboard
- [ ] **Dev server restarted** after `.env` changes
- [ ] **Network connection** is working
- [ ] **No VPN/proxy** blocking requests
- [ ] **Browser console** shows detailed error
- [ ] **CORS headers** present in response (check Network tab)

## 🛠️ Advanced Troubleshooting

### If Workflow is Active but Still Getting Errors:

1. **Check n8n Executions**
   - Go to "Executions" tab in n8n
   - See if requests are being received
   - Check for error messages in execution logs

2. **Test with Different Browser**
   - Try Chrome, Firefox, Safari
   - Some browsers handle CORS differently

3. **Disable Browser Extensions**
   - Ad blockers or privacy extensions can block requests
   - Try incognito/private mode

4. **Check Firewall/Antivirus**
   - May be blocking outbound requests
   - Temporarily disable to test

5. **Use Proxy/Backend**
   - If CORS persists, create a backend proxy
   - Route requests through your own server

## 📊 What Success Looks Like

When everything works:

1. **Browser Console:**
   ```
   ⚡ n8n response time: XXXms
   ```

2. **Network Tab:**
   - Status: 200 OK
   - Response: JSON with your workflow output
   - Headers include CORS headers

3. **Test Page:**
   - Shows ✅ "Connection Successful!"
   - Displays response data

## 🚨 Most Likely Issue

**90% of the time, the issue is: The workflow is NOT ACTIVE in n8n.**

Even if you think you activated it:
1. Double-check the toggle is ON
2. Refresh the n8n page
3. Verify it shows "Active" status
4. Test with curl command above

## 💡 Quick Test

Run this to see the actual error:

```bash
curl -X POST "https://trevathy.app.n8n.cloud/webhook/dbb33ceb-ed53-4dc1-8781-4d2786571d68" \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}' \
  -w "\nHTTP Status: %{http_code}\n"
```

- **404** = Workflow not active → Activate it!
- **200** = Workflow active → Check CORS/browser settings
- **Other** = Different issue → Check n8n logs

