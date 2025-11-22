# 📋 Step-by-Step: Testing n8n Webhook

## 🖥️ Where to Run the Command

Run the `curl` command in your **Terminal** (command line).

### On Mac:
- **Terminal** app (Applications → Utilities → Terminal)
- Or press `Cmd + Space`, type "Terminal", press Enter

### On Windows:
- **Command Prompt** or **PowerShell**
- Press `Win + R`, type `cmd`, press Enter

### In Cursor/VS Code:
- Open the integrated terminal (View → Terminal, or `` Ctrl + ` ``)
- Or Terminal → New Terminal

## 📝 Step-by-Step Instructions

### Step 1: Open Terminal

1. Open Terminal (Mac) or Command Prompt (Windows)
2. You should see a prompt like: `$` (Mac) or `>` (Windows)

### Step 2: Navigate to Your Project (Optional)

If you want to be in your project directory:

```bash
cd /Users/trevathy/Documents/Mindshift-Nira/Mindshift_NIRA
```

**Note:** This step is optional - the curl command works from any directory.

### Step 3: Run the Test Command

Copy and paste this entire command:

```bash
curl -X POST "https://trevathy.app.n8n.cloud/webhook/dbb33ceb-ed53-4dc1-8781-4d2786571d68" -H "Content-Type: application/json" -d '{"message":"test connection","userId":"test-user","sessionId":"test-session"}' -w "\n\nHTTP Status: %{http_code}\n"
```

**Or the shorter version:**

```bash
curl -X POST "https://trevathy.app.n8n.cloud/webhook/dbb33ceb-ed53-4dc1-8781-4d2786571d68" -H "Content-Type: application/json" -d '{"message":"test"}' -w "\nHTTP Status: %{http_code}\n"
```

### Step 4: Press Enter

Press Enter to run the command.

### Step 5: Read the Results

You'll see one of these responses:

#### ✅ Success (Workflow is Active):
```json
{
  "response": "Your workflow response here...",
  ...
}
HTTP Status: 200
```

#### ❌ Workflow Not Active:
```json
{
  "code": 404,
  "message": "The requested webhook \"POST dbb33ceb-ed53-4dc1-8781-4d2786571d68\" is not registered.",
  "hint": "The workflow must be active for a production URL to run successfully..."
}
HTTP Status: 404
```

## 🎯 What the Results Mean

### If You Get 404:
- **Meaning:** Workflow is NOT active
- **Action:** Go to n8n dashboard and activate the workflow

### If You Get 200:
- **Meaning:** Workflow IS active and working!
- **Action:** If browser still shows errors, it's likely a CORS issue

### If You Get Other Errors:
- **500:** Workflow error - check n8n execution logs
- **Timeout:** Workflow taking too long
- **Connection refused:** Network issue

## 🔍 Alternative: Use the Test Script

You can also use the test script I created:

```bash
cd /Users/trevathy/Documents/Mindshift-Nira/Mindshift_NIRA
./test_n8n_webhook.sh
```

This will test both test and production webhooks.

## 📸 Visual Guide

### Terminal Example (Mac):

```
$ curl -X POST "https://trevathy.app.n8n.cloud/webhook/dbb33ceb-ed53-4dc1-8781-4d2786571d68" \
>   -H "Content-Type: application/json" \
>   -d '{"message":"test"}' \
>   -w "\nHTTP Status: %{http_code}\n"
  
{"code":404,"message":"The requested webhook..."}
HTTP Status: 404
$
```

### What You Type vs What You See:

- **What you type:** The curl command
- **What you see:** The response from n8n
- **Last line:** HTTP Status code (200 = success, 404 = not found)

## 💡 Tips

1. **Copy the entire command** - Don't break it into multiple lines unless you use `\`
2. **Check for typos** - Make sure the webhook URL is correct
3. **Wait for response** - It may take a few seconds
4. **Check your internet** - Make sure you're connected

## 🚨 Common Issues

### "command not found: curl"
- **Mac/Linux:** Usually pre-installed
- **Windows:** May need to install or use PowerShell's `Invoke-WebRequest`

### "Could not resolve host"
- Check your internet connection
- Verify the URL is correct

### Permission denied
- Make sure you're in the right directory
- Check file permissions if using the script

## 🎯 Next Steps After Testing

1. **If 404:** Activate workflow in n8n, then test again
2. **If 200:** Workflow is working! Check browser/CORS if still having issues
3. **If other error:** Check n8n execution logs for details

