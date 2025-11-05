# 🔒 Security Guide - Protecting Your API Keys

## ✅ Where to Put Your API Key

### Step 1: Create `.env.local` File

In your project root directory (same level as `package.json`), create a file named `.env.local`:

```bash
# In your project root: C:\Users\anshs\Projects\sous\.env.local

GEMINI_API_KEY=your_actual_api_key_here
```

**Important:** Replace `your_actual_api_key_here` with your real API key from Google AI Studio.

### Step 2: Verify It's Working

After creating the file, restart your development server:

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

The app will now automatically load your API key from `.env.local`.

---

## 🛡️ Security Best Practices

### ✅ What's Already Protected

1. **`.gitignore` includes `.env*`** - Your `.env.local` file will NEVER be committed to git
2. **Next.js Server-Side Only** - API keys are only used on the server, never exposed to the browser
3. **Environment Variables** - Only accessible in Node.js server code, not in client-side code

### ✅ Your API Key is Safe Because:

```typescript
// ✅ SAFE - This runs on the server only
// app/api/recipes/search/route.ts
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ❌ NEVER DO THIS - Would expose the key to the browser
// const apiKey = process.env.GEMINI_API_KEY; // in client component
```

All your API routes are server-side only, so the API key never reaches the user's browser.

---

## 🚀 Publishing Your App Securely

### Option 1: Deploy to Vercel (Recommended)

Vercel is made by the Next.js team and has the best integration:

1. **Push your code to GitHub** (your `.env.local` won't be included)

2. **Import your project to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository

3. **Add Environment Variable in Vercel:**
   - In your project dashboard, go to **Settings → Environment Variables**
   - Add:
     - **Name:** `GEMINI_API_KEY`
     - **Value:** Your actual API key
     - **Environment:** Production, Preview, Development (select all)
   - Click **Save**

4. **Deploy!** - Vercel will automatically redeploy with your API key

### Option 2: Deploy to Netlify

1. **Push to GitHub** (without `.env.local`)

2. **Import to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository

3. **Add Environment Variable:**
   - Go to **Site settings → Environment variables**
   - Click **Add a variable**
   - Add:
     - **Key:** `GEMINI_API_KEY`
     - **Value:** Your actual API key
   - Click **Save**

4. **Redeploy** - Trigger a new deploy

### Option 3: Deploy to Railway, Render, or Other Platforms

Similar process for any platform:

1. Push code to GitHub
2. Connect repository to platform
3. Add `GEMINI_API_KEY` in platform's environment variables settings
4. Deploy

---

## 🔍 How to Verify Your API Key is Secure

### Check 1: It's Not in Git

```bash
# Run this command - it should return NOTHING
git log --all --full-history -- .env.local

# Or check if it's tracked
git ls-files | grep .env
```

If nothing appears, you're good! ✅

### Check 2: It's Not in Your Browser

1. Open your deployed app
2. Right-click → "View Page Source"
3. Search for your API key (Ctrl+F)
4. It should NOT be found ✅

### Check 3: It's Only in `.env.local`

```bash
# This file should exist and contain your key
cat .env.local

# These files should NOT exist or be empty
cat .env
cat .env.production
```

---

## ⚠️ What NOT to Do

### ❌ NEVER Commit `.env.local` to Git

```bash
# ❌ BAD - Don't do this!
git add .env.local
git commit -m "Add API key"
git push
```

### ❌ NEVER Put API Keys in Client Code

```typescript
// ❌ BAD - Exposes key to browser
"use client";
export default function Component() {
  const apiKey = process.env.GEMINI_API_KEY; // DON'T DO THIS!
}
```

### ❌ NEVER Share Your API Key

- Don't put it in screenshots
- Don't paste it in chat/Discord/Slack
- Don't include it in code reviews
- Don't hardcode it in your source files

---

## 🔄 If Your API Key is Compromised

If you accidentally expose your API key:

1. **Immediately revoke it:**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Delete the compromised key

2. **Create a new key:**
   - Generate a new API key
   - Update `.env.local` with the new key
   - Update your deployment platform with the new key

3. **Check for unauthorized usage:**
   - Review your Google Cloud Console for unusual activity
   - Check API usage logs

---

## 📋 Quick Security Checklist

Before deploying:

- [ ] `.env.local` exists with your API key
- [ ] `.env.local` is NOT tracked by git (check `.gitignore`)
- [ ] You've tested locally and it works
- [ ] You've added the environment variable to your hosting platform
- [ ] You've verified the deployed app works
- [ ] You've checked that the key is NOT visible in browser source

---

## 🆘 Troubleshooting

### "Gemini API key not configured" Error

**Local Development:**
- Make sure `.env.local` exists in the project root
- Make sure the file contains: `GEMINI_API_KEY=your_key_here`
- Restart the dev server: `npm run dev`

**Production:**
- Make sure you added `GEMINI_API_KEY` in your hosting platform
- Make sure you selected the correct environment (Production)
- Trigger a new deployment after adding the variable

### API Key Works Locally But Not in Production

- Check that you added the environment variable in your hosting platform
- Make sure you redeployed after adding the variable
- Check the deployment logs for errors

---

## 📚 Additional Resources

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Google AI Studio API Keys](https://makersuite.google.com/app/apikey)

---

**Remember:** Your API key is like a password. Treat it with the same care! 🔐


