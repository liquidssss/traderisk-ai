# TradeRisk Setup Checklist

## Before You Start
- [ ] OpenClaw is running (`openclaw status`)
- [ ] Node.js installed (`node --version`)
- [ ] npm installed (`npm --version`)

---

## Step 1: Set Up Supabase (Database) — 5 mins
- [ ] Go to https://supabase.com and sign up (free tier)
- [ ] Create a new project
- [ ] Wait for it to initialize
- [ ] Go to **Settings** → **API** and copy:
  - [ ] Project URL → `REACT_APP_SUPABASE_URL`
  - [ ] Anon Key → `REACT_APP_SUPABASE_ANON_KEY`

---

## Step 2: Create Database Tables — 2 mins
- [ ] In Supabase, go to **SQL Editor**
- [ ] Create new query
- [ ] Copy the SQL from `AUTH_DATABASE_SETUP.md` → paste it in
- [ ] Run query
- [ ] Verify tables created: `users`, `trading_profiles`, `chat_messages`

---

## Step 3: Configure Environment — 3 mins
- [ ] Create `.env` file in `traderisk-ai/` root:
```
REACT_APP_SUPABASE_URL=YOUR_SUPABASE_URL
REACT_APP_SUPABASE_ANON_KEY=YOUR_ANON_KEY
REACT_APP_API_URL=http://localhost:3001
PORT=3001
JWT_SECRET=any-random-secret-string
```
- [ ] Save file

---

## Step 4: Install Dependencies — 3 mins
```bash
cd traderisk-ai
npm install
```

---

## Step 5: Start TradeRisk — 1 min
```bash
npm run dev
```

This starts:
- Backend on `localhost:3001`
- Frontend on `localhost:3000`

---

## Step 6: Create Account & Test — 2 mins
- [ ] Open `http://localhost:3000`
- [ ] Click "Sign up"
- [ ] Create account (email + password)
- [ ] Login
- [ ] Chat with Claude coach!
- [ ] Try: "Should I take a long on EURUSD at 1.0850?"

---

## Troubleshooting

**"Cannot find module 'express'"**
→ Run `npm install`

**"Supabase connection failed"**
→ Check `.env` has correct URL and key

**"Backend not responding"**
→ Make sure `npm run dev` is running, check localhost:3001

**"Login failing"**
→ Check Supabase tables exist, check database connection in `.env`

---

## You're Done! 🎉

TradeRisk now has:
- ✅ User signup/login
- ✅ User-specific data (encrypted)
- ✅ Claude coaching
- ✅ Database backup (PostgreSQL)
- ✅ Zero API costs

**Next:** Start using it to evaluate your trades!

---

## Files to Know

| File | Purpose |
|------|---------|
| `.env` | Your Supabase credentials (DO NOT COMMIT) |
| `src/server.js` | Backend API + auth |
| `src/context/AuthContext.jsx` | Auth state management |
| `src/pages/LoginPage.jsx` | Login form |
| `src/pages/SignupPage.jsx` | Signup form |
| `src/pages/ChatPage.jsx` | Main chat interface |
| `AUTH_DATABASE_SETUP.md` | Database schema + detailed guide |

---

**Questions? Check AUTH_DATABASE_SETUP.md for detailed docs. Trade smart! 🎯**
