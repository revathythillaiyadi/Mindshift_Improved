# 🔍 How to Find Your Correct n8n Webhook URL

## The Problem

Your workflow is **ACTIVE**, but the webhook ID in your code doesn't match the actual webhook in n8n.

## ✅ Step-by-Step: Find Your Webhook URL

### Step 1: Open Your Workflow in n8n

1. Go to: https://trevathy.app.n8n.cloud
2. Open "NIRA-the-BOT 2.0" workflow
3. Make sure you're on the **Editor** tab

### Step 2: Find the Webhook Node

1. Look for a node that says **"Webhook"** in your workflow
2. It might be the first node or connected to other nodes
3. **Click on the Webhook node** to select it

### Step 3: Get the Webhook URL

When you click the Webhook node, you should see:

1. **Webhook Settings Panel** on the right side
2. Look for a field that shows the **webhook URL** or **webhook path**
3. It might show:
   - Full URL: `https://trevathy.app.n8n.cloud/webhook/xxxxx-xxxxx-xxxxx`
   - Or just the path: `xxxxx-xxxxx-xxxxx`

### Step 4: Copy the Webhook ID

The webhook ID is the part after `/webhook/` in the URL.

**Example:**
- If URL is: `https://trevathy.app.n8n.cloud/webhook/abc123-def456-ghi789`
- The webhook ID is: `abc123-def456-ghi789`

### Step 5: Check Webhook Settings

In the Webhook node settings, verify:
- ✅ **HTTP Method:** Should be `POST`
- ✅ **Path:** This is your webhook ID
- ✅ **Response Mode:** Should be set (usually "Last Node" or "Using 'Respond to Webhook' Node")

## 📋 What to Look For

### In the Webhook Node Panel:

Look for fields like:
- **"Webhook URL"** or **"Production URL"**
- **"Path"** or **"Webhook Path"**
- **"Webhook ID"**

### Common Locations:

1. **Top of the node panel** - Often shows the full URL
2. **Settings section** - Shows the path/ID
3. **Info/Details section** - May have copy button for URL

## 🎯 Quick Check

After finding your webhook ID, compare it to what's in your code:

**Current webhook ID in code:** `dbb33ceb-ed53-4dc1-8781-4d2786571d68`

**Your actual webhook ID from n8n:** `?????` (you need to find this)

**If they don't match:** That's why it's not working!

## ✅ Next Steps After Finding It

1. **Update your `.env` file:**
   ```bash
   VITE_N8N_WEBHOOK_URL=https://trevathy.app.n8n.cloud/webhook/YOUR-ACTUAL-WEBHOOK-ID
   ```

2. **Restart your dev server:**
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

3. **Test again:**
   ```bash
   ./test_webhook_simple.sh
   ```

## 🔍 Alternative: Check n8n Executions

If you can't find the webhook URL in the node:

1. Go to **Executions** tab in n8n
2. Look for recent webhook executions
3. Click on one to see details
3. The webhook URL might be shown in the execution details

## 💡 Pro Tip

Some n8n webhook nodes have a **"Copy URL"** button - use that to get the exact URL!

