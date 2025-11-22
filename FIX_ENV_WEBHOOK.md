# Fix Your n8n Webhook URL in .env

## 🔍 Current Issue

Your `.env` file has:
```bash
VITE_N8N_WEBHOOK_URL=https://trevathy.app.n8n.cloud/webhook/b15d3ab2-c44b-4786-a227-6e53000b0f43
```

**Problem:** This is mixing the test webhook ID with the production URL format. This won't work.

## ✅ Solution: Use Production Webhook

### Option 1: Production Webhook (Recommended)

Update your `.env` file to use the **production webhook URL**:

```bash
VITE_N8N_WEBHOOK_URL=https://trevathy.app.n8n.cloud/webhook/dbb33ceb-ed53-4dc1-8781-4d2786571d68
```

**Why?** Production webhooks work continuously once the workflow is active.

### Option 2: Test Webhook (Development Only)

If you want to use the test webhook (not recommended for production):

```bash
VITE_N8N_WEBHOOK_URL=https://trevathy.app.n8n.cloud/webhook-test/b15d3ab2-c44b-4786-a227-6e53000b0f43
```

**Note:** Test webhooks only work once after clicking "Execute Workflow" in n8n.

## 🛠️ How to Fix

### Step 1: Edit .env File

Open your `.env` file and change the line to:

```bash
VITE_N8N_WEBHOOK_URL=https://trevathy.app.n8n.cloud/webhook/dbb33ceb-ed53-4dc1-8781-4d2786571d68
```

### Step 2: Restart Dev Server

**IMPORTANT:** After changing `.env`, you **must restart** your dev server:

1. Stop the current server (press `Ctrl+C` in the terminal where it's running)
2. Start it again:
   ```bash
   npm run dev
   ```

Vite only reads `.env` files when the server starts, so changes won't take effect until you restart.

### Step 3: Activate Workflow in n8n

Even with the correct URL, the workflow must be **ACTIVE**:

1. Go to: https://trevathy.app.n8n.cloud
2. Open your workflow
3. Toggle it to **ACTIVE** (top-right switch)
4. Verify the webhook node shows the correct ID: `dbb33ceb-ed53-4dc1-8781-4d2786571d68`

### Step 4: Test Again

1. Open: http://localhost:5173/test-n8n
2. Click "Test n8n Connection"
3. Should see success message ✅

## 📋 Quick Reference

| Type | URL Format | When to Use |
|------|-----------|-------------|
| **Production** | `https://...n8n.cloud/webhook/xxxxx` | Always (requires workflow ACTIVE) |
| **Test** | `https://...n8n.cloud/webhook-test/xxxxx` | Development only (requires manual execution) |

## ❓ Which Webhook ID Should I Use?

- **Production:** `dbb33ceb-ed53-4dc1-8781-4d2786571d68` ✅ Use this
- **Test:** `b15d3ab2-c44b-4786-a227-6e53000b0f43` ❌ Don't use for production

## 🔍 Verify Your Setup

After fixing, check:
- ✅ `.env` has production webhook URL
- ✅ Dev server restarted
- ✅ Workflow is ACTIVE in n8n
- ✅ Webhook ID matches in n8n dashboard

