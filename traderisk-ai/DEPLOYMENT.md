# Deploy TradeRisk to Production

Your code is on GitHub: https://github.com/liquidssss/traderisk-ai

## Current Status
- ✅ Code pushed to GitHub
- ⏳ Need to deploy to Vercel (frontend) + Render (backend)
- ⏳ Need to set up Supabase (database)

---

## Step 1: Deploy Frontend to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repo: `liquidssss/traderisk-ai`
3. Select **React** framework
4. Add environment variables:
   - `REACT_APP_API_URL` = (we'll get this from Render)
   - `REACT_APP_SUPABASE_URL` = (from Supabase)
   - `REACT_APP_SUPABASE_ANON_KEY` = (from Supabase)
   - `REACT_APP_OPENCLAW_API` = (same as API_URL)
5. Deploy
6. Copy the Vercel URL (like `https://traderisk-ai.vercel.app`)

---

## Step 2: Deploy Backend to Render

1. Go to https://render.com/dashboard
2. New → Web Service
3. Connect GitHub repo: `liquidssss/traderisk-ai`
4. Settings:
   - Name: `traderisk-backend`
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `node src/server.js`
5. Add environment variables:
   - `JWT_SECRET` = (any random string)
   - `SUPABASE_URL` = (from Supabase)
   - `SUPABASE_KEY` = (from Supabase)
6. Deploy
7. Copy the Render URL (like `https://traderisk-backend.onrender.com`)

---

## Step 3: Set Up Supabase Database

1. Go to https://supabase.com
2. New Project (free tier)
3. Go to SQL Editor
4. Run the schema from `AUTH_DATABASE_SETUP.md`
5. Go to Settings > API
6. Copy:
   - Project URL → `SUPABASE_URL`
   - Anon Key → `SUPABASE_KEY`

---

## Step 4: Update Environment Variables

**In Vercel Dashboard:**
- Set `REACT_APP_API_URL` = your Render backend URL

**In Render Dashboard:**
- Redeploy with correct `SUPABASE_URL` and `SUPABASE_KEY`

**In Vercel Dashboard:**
- Set `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY`
- Redeploy

---

## Live URLs
- Frontend: https://traderisk-ai.vercel.app (after Vercel deploy)
- Backend API: https://traderisk-backend.onrender.com (after Render deploy)

---

## Testing
1. Visit your Vercel URL
2. Sign up with email/password
3. Chat with Claude
4. Check Supabase to see your data saved

---

**Questions? Check AUTH_DATABASE_SETUP.md or SETUP_CHECKLIST.md**
