# 🚨 n8n Workflow Activation Guide

## ⚠️ Current Issue

Your webhook is returning **404 - "webhook not registered"**. This means your n8n workflow is **NOT ACTIVE**.

**Error Message:**
```
The requested webhook "POST dbb33ceb-ed53-4dc1-8781-4d2786571d68" is not registered.
The workflow must be active for a production URL to run successfully.
```

## ✅ Solution: Activate Your Workflow

### Step-by-Step Instructions

1. **Go to n8n Dashboard**
   - Open: https://trevathy.app.n8n.cloud
   - Login to your account

2. **Find Your Workflow**
   - Look for the workflow that contains the webhook node
   - The webhook ID should be: `dbb33ceb-ed53-4dc1-8781-4d2786571d68`

3. **Open the Workflow**
   - Click on the workflow to open it in the editor

4. **Activate the Workflow**
   - Look for the **toggle switch** in the **top-right corner** of the editor
   - It should say "Inactive" or show an OFF state
   - **Click the toggle** to turn it **ON/ACTIVE**
   - The switch should turn green/blue and show "Active"

5. **Verify the Webhook Node**
   - Click on the **Webhook node** in your workflow
   - Verify the webhook path/ID matches: `dbb33ceb-ed53-4dc1-8781-4d2786571d68`
   - Check that HTTP Method is set to **POST**

6. **Test the Connection**
   - Go back to: http://localhost:5173/test-n8n
   - Click "Test n8n Connection"
   - Should now see ✅ Success!

## 🔍 How to Verify Workflow is Active

### Visual Indicators:
- ✅ Toggle switch is **ON** (green/blue)
- ✅ Status shows **"Active"** in top-right
- ✅ No error messages in the workflow editor

### Test Indicators:
- ✅ Test page shows success
- ✅ Chat receives responses (not fallback message)
- ✅ No 404 errors in console

## 📋 Troubleshooting

### Still Getting 404 After Activation?

1. **Check Workflow Status**
   - Make sure toggle is actually ON (not just clicked)
   - Refresh the n8n page and check again

2. **Verify Webhook ID**
   - Open the webhook node
   - Confirm the ID matches: `dbb33ceb-ed53-4dc1-8781-4d2786571d68`
   - If different, update your `.env` file

3. **Check n8n Executions**
   - Go to "Executions" tab in n8n
   - See if requests are being received
   - Check for any error messages

4. **Wait a Few Seconds**
   - Sometimes activation takes a moment to propagate
   - Wait 10-30 seconds and test again

### Getting "Failed to Fetch" Error?

This could be:
1. **CORS Issue** - n8n webhook should handle CORS automatically, but check webhook node settings
2. **Network Issue** - Check your internet connection
3. **n8n Service Down** - Check n8n status page

### Getting Timeout Errors?

- Your workflow might be taking too long (>25 seconds)
- Check n8n execution logs for slow nodes
- Consider optimizing your workflow

## 🎯 Quick Checklist

Before testing, verify:
- [ ] Workflow is **ACTIVE** in n8n dashboard
- [ ] Webhook ID matches: `dbb33ceb-ed53-4dc1-8781-4d2786571d68`
- [ ] `.env` file has correct webhook URL
- [ ] Dev server has been restarted after `.env` changes
- [ ] No errors in n8n workflow editor

## 📞 Still Not Working?

If you've completed all steps and still getting errors:

1. **Check Browser Console**
   - Open DevTools (F12)
   - Look for detailed error messages
   - Check Network tab for request/response

2. **Test Directly**
   ```bash
   curl -X POST "https://trevathy.app.n8n.cloud/webhook/dbb33ceb-ed53-4dc1-8781-4d2786571d68" \
     -H "Content-Type: application/json" \
     -d '{"message":"test"}'
   ```
   Should return 200 (not 404)

3. **Verify in n8n**
   - Check Executions tab for incoming requests
   - Look for any error messages in workflow execution

## 💡 Key Points

- **Workflow MUST be ACTIVE** for production webhooks to work
- **Test webhooks** only work once after clicking "Execute Workflow"
- **Production webhooks** work continuously when active
- **Environment variables** only take effect after restarting dev server

