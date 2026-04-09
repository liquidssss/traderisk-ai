# TradeRisk Auth + Database Setup Guide

## Overview
TradeRisk now has:
- ✅ User signup/login
- ✅ JWT authentication
- ✅ User-specific data isolation
- ✅ PostgreSQL database (via Supabase)
- ✅ Claude integration with user context

---

## 1. Set Up Supabase (Database)

### Create a Free Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up / log in
3. Create a new project
4. Copy your project URL and anon key

### Create Database Tables

Go to **SQL Editor** in Supabase and run this SQL:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Trading profiles table
CREATE TABLE trading_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  strategy_name TEXT DEFAULT 'IFVG Trading',
  strategy_rules TEXT DEFAULT 'Look for Invalid FVG setups on 15m/1h. Max 2% risk per trade. Max 3 trades per day.',
  account_balance DECIMAL DEFAULT 10000,
  daily_loss_limit DECIMAL DEFAULT 200,
  daily_loss_used DECIMAL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Chat messages table (stores conversation history)
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- 'user' or 'assistant'
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_trading_profiles_user_id ON trading_profiles(user_id);
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);
```

---

## 2. Configure Environment Variables

Create a `.env` file in the TradeRisk root:

```bash
# Frontend
REACT_APP_API_URL=http://localhost:3001
REACT_APP_OPENCLAW_API=http://localhost:3001

# Supabase (copy from your project dashboard)
REACT_APP_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
REACT_APP_SUPABASE_ANON_KEY=YOUR_ANON_KEY

# Backend
PORT=3001
JWT_SECRET=super-secret-key-change-in-production
```

---

## 3. Install Dependencies

```bash
cd traderisk-ai
npm install
```

**New dependencies added:**
- `express` - Backend API
- `cors` - Cross-origin requests
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `@supabase/supabase-js` - Database client
- `concurrently` - Run backend + frontend together

---

## 4. Start TradeRisk

### Option A: Both Frontend + Backend Together
```bash
npm run dev
```

This runs:
- **Backend**: localhost:3001 (Express API)
- **Frontend**: localhost:3000 (React)

### Option B: Run Separately
```bash
# Terminal 1 - Backend
npm run start:backend

# Terminal 2 - Frontend
npm start
```

---

## 5. Test It Out

1. Open `http://localhost:3000`
2. Click "Sign up" → Create account
3. Log in with your credentials
4. Start chatting with Claude coach!

---

## Data Flow

```
User Login → Verify Password → Generate JWT → Store Token
     ↓
  Claude Chat
     ↓
Frontend sends: {message, token}
     ↓
Backend auth middleware: Verify JWT
     ↓
Load user's profile from Supabase
     ↓
Call Claude with user context
     ↓
Save messages to database
     ↓
Return response to user
```

---

## User Data Isolation

✅ **Every user has isolated data:**
- Only their trading profile
- Only their chat history
- Only their account settings

✅ **Protected by:**
- JWT authentication (token verified on every request)
- Database queries filtered by `user_id`
- Password hashing (bcryptjs)
- HTTP Authorization header

---

## What Gets Stored

### User Table
- email
- username
- hashed password
- created_at

### Trading Profile Table (Per User)
- account_balance
- daily_loss_limit
- daily_loss_used
- strategy_name
- strategy_rules

### Chat Messages (Per User)
- role (user or assistant)
- content
- created_at
- timestamp

---

## Security Notes

1. **JWT Secret**: Change `JWT_SECRET` in production to something strong
2. **Supabase RLS**: In production, add Row Level Security policies to Supabase tables
3. **HTTPS**: Always use HTTPS in production
4. **Token Expiry**: Tokens expire in 7 days (configurable in `AuthContext.jsx`)
5. **Passwords**: Never send passwords in plaintext (use HTTPS + bcrypt hashing)

---

## Troubleshooting

### "Failed to connect to Supabase"
- Check your `.env` file has correct Supabase URL and key
- Verify Supabase project is running

### "Invalid token"
- Token might be expired (7 day expiry)
- Try logging out and back in

### "User already exists"
- Email is already registered
- Try a different email

### "Backend not responding"
- Make sure `npm run start:backend` is running
- Check it's on localhost:3001

---

## Next Steps

- [ ] Add password reset flow
- [ ] Add email verification
- [ ] Add two-factor authentication
- [ ] Add trade logging + analytics
- [ ] Add performance metrics
- [ ] Add subscription tiers
- [ ] Mobile app (React Native)

---

**Your data is secure, isolated, and backed by Claude. Trade on. 🎯**
