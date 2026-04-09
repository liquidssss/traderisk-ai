# 🚀 TradeRisk - What You Have Right Now

## Live Demo Links (Testing Only - Not Production)

**Frontend:** https://lots-rhythm-satisfaction-effort.trycloudflare.com
**Backend:** https://new-submitting-facilities-forest.trycloudflare.com

⚠️ These are temporary Cloudflare tunnels. They work but auth/database is not set up yet.

---

## Your GitHub Repository

**Code:** https://github.com/liquidssss/traderisk-ai

Everything is committed and ready to deploy.

---

## What TradeRisk Does

✅ **User signup/login** — Each user gets their own account
✅ **Trading profile** — Account balance, daily loss limit, strategy rules
✅ **Claude AI Coach** — Real Claude evaluates your trades
✅ **Data isolation** — Your data is encrypted and only yours
✅ **Chat history** — Saved to database for reference
✅ **Zero API costs** — Uses OpenClaw's built-in Claude access

---

## To Go Fully Live (Production)

You need to do these 3 things:

### 1️⃣ Sign Up for Supabase (Database)
- Go to https://supabase.com
- Create free project
- Copy URL + Anon Key
- Run SQL schema (see AUTH_DATABASE_SETUP.md)

### 2️⃣ Deploy Frontend to Vercel
- Go to https://vercel.com/new
- Import: `liquidssss/traderisk-ai`
- Add Supabase env vars
- Deploy (instant)
- You get: `https://traderisk-ai.vercel.app`

### 3️⃣ Deploy Backend to Render
- Go to https://render.com
- New Web Service
- Connect: `liquidssss/traderisk-ai`
- Add Supabase env vars
- Deploy (2-3 min)
- You get: `https://traderisk-backend.onrender.com`

### 4️⃣ Connect Frontend to Backend
- In Vercel, set `REACT_APP_API_URL` = your Render URL
- Redeploy
- Done!

---

## Costs
- **Vercel frontend:** $0 (free tier)
- **Render backend:** $7/month (hobby tier, free tier too slow)
- **Supabase database:** $0 (free tier, 500MB storage)
- **Claude API:** $0 (uses OpenClaw's access)

**Total:** ~$7/month (or free if you use Render free tier)

---

## Files You Need to Know

| File | What It Does |
|------|------------|
| `src/server.js` | Backend API (Node.js + Express) |
| `src/context/AuthContext.jsx` | Login/signup state management |
| `src/pages/LoginPage.jsx` | Login form |
| `src/pages/SignupPage.jsx` | Signup form |
| `src/pages/ChatPage.jsx` | Main trading coach chat |
| `src/api/claude.js` | Claude integration |
| `.env` | Environment variables (NOT committed) |
| `AUTH_DATABASE_SETUP.md` | Database schema + detailed guide |
| `DEPLOYMENT.md` | Step-by-step deployment guide |
| `SETUP_CHECKLIST.md` | Quick setup checklist |

---

## Next Steps

1. **Create Supabase project** (5 min)
2. **Deploy to Vercel** (2 min)
3. **Deploy to Render** (5 min)
4. **Test signup/login** (1 min)
5. **Trade with Claude coach!** 🎯

---

## Quick Links

- GitHub: https://github.com/liquidssss/traderisk-ai
- Vercel: https://vercel.com/new
- Render: https://render.com
- Supabase: https://supabase.com
- OpenClaw: https://docs.openclaw.ai

---

**Ready to go live? Follow DEPLOYMENT.md step-by-step. 🚀**
