# Vercel Deployment Guide - Understanding DEPLOYMENT_NOT_FOUND

## Quick Fix Summary

I've created a `vercel.json` configuration file that tells Vercel:
- How to build your Vite app (`npm run build`)
- Where to find the built files (`dist` directory)
- How to handle client-side routing (SPA rewrites)

## Next Steps

1. **Connect your project to Vercel** (if not already connected):
   ```bash
   npm i -g vercel
   vercel login
   vercel link
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```
   Or push to your connected Git branch (Vercel will auto-deploy)

3. **Set Environment Variables** in Vercel Dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - Any other `VITE_*` variables your app needs

## Understanding the Error

### What DEPLOYMENT_NOT_FOUND Means

This error occurs when Vercel cannot find or access a deployment. Common scenarios:

1. **No deployment exists yet** - Project not connected or never deployed
2. **Deployment was deleted** - Removed from dashboard or expired
3. **Incorrect URL** - Typo in deployment URL or accessing wrong project
4. **Build failed** - Deployment never completed successfully
5. **Missing configuration** - Vercel doesn't know how to build/deploy your app

### Why This Happened to You

Your project is a **Vite + React Single Page Application (SPA)**. Without proper configuration, Vercel might:
- Not detect it as a Vite project
- Build incorrectly or fail to build
- Not serve the SPA correctly (missing rewrites for client-side routing)

The `vercel.json` file I created solves this by explicitly telling Vercel:
- This is a Vite project
- Build output goes to `dist/`
- All routes should serve `index.html` (for React Router)

## The Mental Model

### How Vercel Deployment Works

1. **Detection Phase**: Vercel analyzes your project
   - Looks for `package.json`, framework configs, `vercel.json`
   - Tries to auto-detect framework (Vite, Next.js, etc.)

2. **Build Phase**: Runs your build command
   - Executes `npm run build` (or custom command)
   - Should produce static files in `dist/` (for Vite)

3. **Deploy Phase**: Uploads and serves files
   - Serves files from output directory
   - Applies routing rules (rewrites, redirects)

4. **Runtime**: Handles requests
   - Static files served directly
   - Routes matched against rewrites/redirects
   - 404s if deployment doesn't exist or route not matched

### Why SPAs Need Special Configuration

**Traditional Multi-Page Apps:**
- Each route = actual file (`/about.html`)
- Direct file serving works fine

**Single Page Apps (SPAs):**
- All routes = same `index.html`
- JavaScript handles routing client-side
- Need rewrites: `/*` → `/index.html`

Without rewrites:
- `/dashboard` → 404 (no `dashboard.html` file)
- `/login` → 404 (no `login.html` file)

With rewrites:
- `/dashboard` → `/index.html` → React Router handles it
- `/login` → `/index.html` → React Router handles it

## Warning Signs to Watch For

### Before Deployment

1. **Missing `vercel.json`** for SPAs
   - Vercel might auto-detect, but explicit is better
   - Especially for custom build outputs

2. **Build output mismatch**
   - `vite.config.ts` says output is `dist/`
   - `vercel.json` says output is `build/`
   - **Fix**: Keep them consistent

3. **Missing environment variables**
   - App crashes at runtime
   - Check Vercel dashboard → Settings → Environment Variables

4. **Build script issues**
   - `package.json` has no `build` script
   - Build script fails locally
   - **Test**: Run `npm run build` locally first

### During/After Deployment

1. **Build logs show errors**
   - TypeScript errors
   - Missing dependencies
   - Environment variable issues

2. **Deployment shows "Ready" but app doesn't work**
   - Check browser console for errors
   - Verify environment variables are set
   - Check that rewrites are configured

3. **Routes return 404**
   - Missing SPA rewrites
   - Incorrect rewrite patterns

4. **"Deployment not found" when accessing URL**
   - Deployment was deleted
   - Wrong project/URL
   - Build never completed

## Alternative Approaches

### 1. Vercel Auto-Detection (Current Default)
**Pros:**
- Works for standard setups
- No config needed

**Cons:**
- May not detect Vite correctly
- No control over build settings
- SPA routing might not work

**When to use:** Simple projects, testing

### 2. Explicit `vercel.json` (Recommended - What we did)
**Pros:**
- Full control
- Explicit configuration
- Works reliably for SPAs
- Easy to debug

**Cons:**
- Extra file to maintain
- Need to update if build changes

**When to use:** Production apps, SPAs, custom builds

### 3. Vercel CLI with Flags
```bash
vercel --prod --build-env NODE_ENV=production
```
**Pros:**
- Quick one-off deployments
- Can override settings

**Cons:**
- Not persistent
- Easy to forget flags

**When to use:** Quick tests, temporary overrides

### 4. GitHub Integration (Recommended for Teams)
**Pros:**
- Auto-deploy on push
- Preview deployments for PRs
- Team collaboration
- Deployment history

**Cons:**
- Requires Git setup
- Need to manage branches

**When to use:** Team projects, CI/CD workflows

## Common Mistakes to Avoid

1. **Forgetting environment variables**
   - Set in Vercel dashboard, not just `.env`
   - `.env` files are gitignored and not deployed

2. **Wrong output directory**
   - Vite outputs to `dist/`
   - Some tools output to `build/` or `out/`
   - Check your `vite.config.ts` and match in `vercel.json`

3. **Missing SPA rewrites**
   - SPAs need `/*` → `/index.html`
   - Without it, direct URL access fails

4. **Building locally and uploading `dist/`**
   - Vercel should build for you
   - Don't commit `dist/` (it's in `.gitignore` for a reason)
   - Let Vercel build in their environment

5. **Not testing build locally**
   - Always run `npm run build` before deploying
   - Fix build errors locally first

## Verification Checklist

After deploying, verify:

- [ ] Build completes successfully in Vercel logs
- [ ] Root URL (`https://your-app.vercel.app/`) loads
- [ ] Client-side routes work (e.g., `/dashboard`, `/login`)
- [ ] Direct URL access works (refresh on `/dashboard`)
- [ ] Environment variables are set in Vercel dashboard
- [ ] No console errors in browser
- [ ] API calls work (if applicable)

## Troubleshooting

### If deployment still fails:

1. **Check Vercel build logs**
   - Go to project → Deployments → Click failed deployment
   - Look for error messages

2. **Test build locally**
   ```bash
   npm run build
   npm run preview  # Test the built app
   ```

3. **Verify `vercel.json` syntax**
   - JSON must be valid
   - No trailing commas
   - Proper escaping

4. **Check environment variables**
   - All `VITE_*` vars set in Vercel
   - No typos in variable names

5. **Clear Vercel cache**
   - Sometimes old builds cause issues
   - Redeploy or clear cache in settings

## Additional Resources

- [Vercel Vite Documentation](https://vercel.com/docs/frameworks/vite)
- [Vercel Configuration Reference](https://vercel.com/docs/projects/project-configuration)
- [SPA Routing on Vercel](https://vercel.com/docs/configuration/routing#single-page-applications)

