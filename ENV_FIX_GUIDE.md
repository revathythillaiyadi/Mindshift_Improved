# ⚠️ Critical: Fix Your .env File

## 🚨 Issue Found

Your `.env` file has a **JWT token** instead of a **webhook URL**:

```bash
# ❌ WRONG - This is an n8n API token, not a webhook URL
VITE_N8N_WEBHOOK_URL=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## ✅ Correct Format

The `VITE_N8N_WEBHOOK_URL` should be a **webhook URL** that looks like this:

```bash
# ✅ CORRECT - This is a webhook URL
VITE_N8N_WEBHOOK_URL=https://trevathy.app.n8n.cloud/webhook/dbb33ceb-ed53-4dc1-8781-4d2786571d68
```

## 🔍 Understanding the Difference

### Webhook URL (What you need)
- **Format:** `https://your-n8n-instance.com/webhook/webhook-id`
- **Purpose:** Endpoint that receives POST requests from your app
- **Used for:** Sending messages to n8n and getting responses
- **Example:** `https://trevathy.app.n8n.cloud/webhook/dbb33ceb-ed53-4dc1-8781-4d2786571d68`

### API Token (What you have)
- **Format:** JWT token (long string starting with `eyJ...`)
- **Purpose:** Authentication for n8n API calls
- **Used for:** Managing workflows, executions, etc. via n8n API
- **Not used for:** Webhook calls from your app

## 🛠️ How to Fix

### Step 1: Get Your Webhook URL

1. Go to your n8n dashboard: https://trevathy.app.n8n.cloud
2. Open your workflow
3. Find the **Webhook node**
4. Click on it to see the webhook URL
5. It should look like: `https://trevathy.app.n8n.cloud/webhook/xxxxx-xxxxx-xxxxx`

### Step 2: Update .env File

Replace the JWT token with the actual webhook URL:

```bash
# Remove or comment out the old line:
# VITE_N8N_WEBHOOK_URL=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Add the correct webhook URL:
VITE_N8N_WEBHOOK_URL=https://trevathy.app.n8n.cloud/webhook/dbb33ceb-ed53-4dc1-8781-4d2786571d68
```

### Step 3: Restart Dev Server

After updating `.env`, you **must restart** your dev server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

**Important:** Vite only reads `.env` files when the server starts, so changes won't take effect until you restart.

### Step 4: Verify

1. Open: http://localhost:5173/test-n8n
2. Check the "Configuration Information" section
3. It should show your webhook URL (not the JWT token)
4. Click "Test n8n Connection"

## 📝 Complete .env Example

Here's what your `.env` file should look like:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://prckzpxdkobdzfrmjknf.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# n8n Webhook URL (NOT an API token!)
VITE_N8N_WEBHOOK_URL=https://trevathy.app.n8n.cloud/webhook/dbb33ceb-ed53-4dc1-8781-4d2786571d68

# If you need n8n API token for other purposes, use a different variable name:
# VITE_N8N_API_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🎯 Quick Test

After fixing, test the connection:

1. **Via Browser:** http://localhost:5173/test-n8n
2. **Via Command Line:** `./test_n8n_webhook.sh`

Both should work once:
- ✅ Webhook URL is correct in `.env`
- ✅ Workflow is **ACTIVE** in n8n dashboard
- ✅ Dev server has been restarted

## ❓ FAQ

**Q: Can I use the API token for webhooks?**  
A: No. Webhooks use URLs, not tokens. The token is for API calls, not webhook calls.

**Q: Where do I find my webhook URL?**  
A: In your n8n workflow, click on the Webhook node. The URL is shown there.

**Q: Do I need both the webhook URL and API token?**  
A: For basic chat functionality, you only need the webhook URL. The API token is only needed if you're making n8n API calls from your app.

**Q: What if I don't set VITE_N8N_WEBHOOK_URL?**  
A: The code will use the default production webhook URL. But it's better to set it explicitly.

