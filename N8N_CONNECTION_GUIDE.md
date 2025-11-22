# n8n Connection Troubleshooting Guide

## 🔍 Root Cause Analysis

### The Problem
Your chat isn't connecting to n8n because **the webhook is not registered/active** in your n8n instance.

### What's Happening
1. **Test Webhook (404)**: The test webhook requires you to manually execute the workflow in n8n's test mode
2. **Production Webhook (404)**: The production webhook requires the workflow to be **activated** (toggled on) in n8n

### Current Status
- Test URL: `https://trevathy.app.n8n.cloud/webhook-test/b15d3ab2-c44b-4786-a227-6e53000b0f43` → **404 Not Registered**
- Production URL: `https://trevathy.app.n8n.cloud/webhook/dbb33ceb-ed53-4dc1-8781-4d2786571d68` → **404 Not Registered**

## ✅ The Fix

### Option 1: Activate Production Webhook (Recommended for Production)

1. **Open your n8n workflow** in the editor
2. **Toggle the workflow to ACTIVE** (top-right toggle switch)
3. **Verify the webhook node** is configured correctly:
   - HTTP Method: `POST`
   - Path: Should match the webhook ID in your URL
   - Authentication: Configure if needed
4. **Test the connection** using the test script:
   ```bash
   ./test_n8n_webhook.sh
   ```

### Option 2: Use Test Webhook (For Development)

1. **Open your n8n workflow** in the editor
2. **Click "Execute Workflow"** button (this activates the test webhook temporarily)
3. **Immediately test** - test webhooks only work for one call after execution
4. **Note**: This is not suitable for production as it requires manual activation each time

### Option 3: Update Webhook URL (If IDs Changed)

If your webhook IDs have changed, update them in `src/lib/n8n.ts`:

```typescript
// For production
const N8N_WEBHOOK_URL = 'https://trevathy.app.n8n.cloud/webhook/YOUR-NEW-WEBHOOK-ID';

// For testing
const N8N_WEBHOOK_URL = 'https://trevathy.app.n8n.cloud/webhook-test/YOUR-NEW-TEST-ID';
```

## 🧠 Understanding the Concept

### How n8n Webhooks Work

**Webhook Registration:**
- n8n webhooks are **not always available** - they need to be registered
- **Test webhooks**: Only active after clicking "Execute Workflow" (one-time use)
- **Production webhooks**: Only active when workflow is **toggled ON** (persistent)

**Webhook Lifecycle:**
1. **Create Workflow** → Webhook node exists but not registered
2. **Activate Workflow** → Webhook becomes available at the URL
3. **Deactivate Workflow** → Webhook returns 404
4. **Delete Workflow** → Webhook permanently unavailable

**Why This Design?**
- **Security**: Prevents unauthorized access to inactive workflows
- **Resource Management**: Only active workflows consume resources
- **Testing**: Test mode allows safe experimentation without affecting production

### The Mental Model

Think of n8n webhooks like a **phone line**:
- **Inactive workflow** = Phone is unplugged (404 - can't connect)
- **Active workflow** = Phone is plugged in (200 - connection works)
- **Test mode** = Temporary connection (works once, then disconnects)

### Request Flow

```
Your App (ChatArea.tsx)
    ↓
sendToN8N() in n8n.ts
    ↓
POST to https://trevathy.app.n8n.cloud/webhook/...
    ↓
n8n checks: Is workflow active?
    ├─ YES → Process request → Return response
    └─ NO → Return 404 "webhook not registered"
```

## ⚠️ Warning Signs to Watch For

### Before Deployment

1. **Webhook URL hardcoded** (not environment variable)
   - **Problem**: Can't easily switch between test/prod
   - **Fix**: Use environment variables

2. **No error handling for 404**
   - **Problem**: User sees generic error, not helpful message
   - **Fix**: Check response status, show specific error

3. **No connection testing**
   - **Problem**: Deploy broken code
   - **Fix**: Test webhook before deploying

4. **Using test webhook in production**
   - **Problem**: Requires manual activation
   - **Fix**: Use production webhook with activated workflow

### During Runtime

1. **Console shows 404 errors**
   ```
   ❌ Error calling n8n webhook: n8n webhook returned status 404
   ```
   - **Meaning**: Webhook not registered/active
   - **Action**: Activate workflow in n8n

2. **Chat shows fallback message**
   ```
   "I hear you. Let's work through this together..."
   ```
   - **Meaning**: n8n call failed, using fallback
   - **Action**: Check browser console for errors

3. **Network tab shows 404**
   - **Meaning**: Webhook URL is wrong or workflow inactive
   - **Action**: Verify webhook URL and workflow status

4. **Timeout errors**
   ```
   Request timed out. Please try again.
   ```
   - **Meaning**: n8n workflow is taking too long (>25 seconds)
   - **Action**: Optimize workflow or increase timeout

## 🔧 Improved Error Handling

I'll update the code to:
1. **Better error messages** for 404 (webhook not active)
2. **Environment variable** for webhook URL
3. **Connection testing** utility
4. **User-friendly error messages**

## 📋 Verification Checklist

After fixing, verify:

- [ ] Workflow is **ACTIVE** in n8n dashboard
- [ ] Webhook URL matches the webhook node path in n8n
- [ ] Test script returns 200 (not 404)
- [ ] Browser console shows successful requests (not 404)
- [ ] Chat receives responses from n8n (not fallback message)
- [ ] Network tab shows 200 status for webhook calls

## 🚀 Immediate Action Steps

### Step 1: Activate Your n8n Workflow

1. Go to your n8n dashboard: `https://trevathy.app.n8n.cloud`
2. Open your workflow in the editor
3. **Toggle the workflow to ACTIVE** (top-right switch)
4. Verify the webhook node shows the correct path/ID

### Step 2: Test the Connection

Run the test script:
```bash
./test_n8n_webhook.sh
```

You should see:
- ✅ **200 OK** status (not 404)
- ✅ A response from your workflow

### Step 3: Update Environment Variable (Optional)

If you want to use a different webhook URL, add to your `.env`:
```bash
VITE_N8N_WEBHOOK_URL=https://trevathy.app.n8n.cloud/webhook/dbb33ceb-ed53-4dc1-8781-4d2786571d68
```

### Step 4: Test in Browser

1. Open your app
2. Open browser DevTools (F12) → Console tab
3. Send a chat message
4. Check console for:
   - ✅ `⚡ n8n response time: XXXms` (success)
   - ❌ `❌ Error calling n8n webhook` (failure)

### Step 5: Verify Chat Works

- Chat should receive responses from n8n (not fallback message)
- Console should show successful requests
- Network tab should show 200 status

## 🔄 Alternative Approaches

### 1. Environment-Based Webhook URLs
**Pros:**
- Easy to switch between test/prod
- No code changes needed

**Cons:**
- Need to manage environment variables

**When to use:** Production deployments

### 2. Webhook Health Check
**Pros:**
- Detect issues before user tries to chat
- Better UX

**Cons:**
- Extra API call on app load

**When to use:** Critical production apps

### 3. Fallback to Local AI
**Pros:**
- Works even if n8n is down
- Better reliability

**Cons:**
- More complex implementation
- May need different AI provider

**When to use:** High-availability requirements

### 4. Retry Logic with Exponential Backoff
**Pros:**
- Handles temporary failures
- Better user experience

**Cons:**
- More complex error handling
- May delay error feedback

**When to use:** Unreliable network conditions

