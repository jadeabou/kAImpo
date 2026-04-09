# kAImpo — Deployment Guide
## Vercel + Supabase (Free)

Estimated time: 30–45 minutes. No coding knowledge needed beyond copy-paste.

---

## STEP 1 — Get Your Anthropic API Key

1. Go to https://console.anthropic.com
2. Sign up or log in
3. Click "API Keys" in the left sidebar
4. Click "Create Key" → copy and save it somewhere safe
   Example: sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

---

## STEP 2 — Set Up Supabase (Your Database)

1. Go to https://supabase.com and click "Start your project" (free)
2. Sign up with GitHub or email
3. Click "New project"
   - Name: kaImpo
   - Database password: choose a strong password (save it)
   - Region: choose the one closest to you
4. Wait ~2 minutes for it to set up
5. In the left sidebar, click "SQL Editor"
6. Open the file `supabase_schema.sql` from this project
7. Paste ALL the SQL content into the editor and click "Run"
   You should see "Success. No rows returned"
8. In the left sidebar, go to Settings → API
9. Copy and save:
   - "Project URL" (looks like: https://abcdefgh.supabase.co)
   - "anon public" key (long string starting with eyJ...)

---

## STEP 3 — Put the Code on GitHub

1. Go to https://github.com and sign up/log in
2. Click "+" → "New repository"
   - Name: kaImpo
   - Keep it Public (or Private — both work with Vercel free)
   - Click "Create repository"
3. You'll see a page with instructions. Follow the "…or upload an existing file" option
4. Upload ALL the files from this project folder
   (Or if you know git: `git init`, `git add .`, `git commit -m "init"`, `git push`)

---

## STEP 4 — Deploy on Vercel

1. Go to https://vercel.com and sign up with GitHub (recommended)
2. Click "Add New Project"
3. Find your "kaImpo" GitHub repository and click "Import"
4. In the configuration screen:
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: leave as is
5. Click "Environment Variables" and add these 3 variables:
   
   Name: ANTHROPIC_API_KEY
   Value: (your Anthropic API key from Step 1)
   
   Name: NEXT_PUBLIC_SUPABASE_URL
   Value: (your Supabase Project URL from Step 2)
   
   Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: (your Supabase anon key from Step 2)

6. Click "Deploy"
7. Wait ~3 minutes
8. You'll get a URL like: https://kaimpo.vercel.app

---

## STEP 5 — Configure Supabase Auth (Required)

1. In your Supabase dashboard, go to Authentication → URL Configuration
2. Set "Site URL" to your Vercel URL: https://kaimpo.vercel.app
3. Under "Redirect URLs" add: https://kaimpo.vercel.app/**
4. Click Save

---

## STEP 6 — Test It!

1. Open your Vercel URL
2. Click "Create Account"
3. Enter your name, email, password
4. Start a consultation!

---

## CUSTOM DOMAIN (Optional)

If you want kaImpo.com or kaImpo.app:
1. Buy domain on Namecheap (~$10/year)
2. In Vercel: Settings → Domains → Add your domain
3. Follow Vercel's DNS instructions
4. Update Supabase Site URL and Redirect URL to your new domain

---

## TROUBLESHOOTING

**"Connection error"** → Check that all 3 environment variables are set correctly in Vercel

**"Invalid email/password"** → Make sure you configured Supabase Auth in Step 5

**Map not showing** → This is normal if no places are found near your location — try a major city

**Build fails** → Make sure you uploaded ALL files, especially package.json

---

## UPDATING THE APP

To update kAImpo after changes:
1. Update your files on GitHub
2. Vercel auto-deploys every time you push to GitHub

---

## YOUR URLS

- App: https://[your-project].vercel.app
- Supabase dashboard: https://app.supabase.com
- Vercel dashboard: https://vercel.com/dashboard
- Anthropic console: https://console.anthropic.com

---

Built with love 🌿 kAImpo — Natural remedy guidance, free for everyone.
