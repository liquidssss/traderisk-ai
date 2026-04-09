# TradeRisk AI — Powered by Claude

**AI-powered trading coach that keeps you disciplined. Now with real Claude AI backing it.**

## 🎯 What Changed

TradeRisk is now connected to **Claude via OpenClaw** — no more mock responses. Real, intelligent coaching powered by Anthropic's Claude.

### Before
Mock pattern-matching responses that were helpful but limited.

### After
✅ Full Claude AI integration  
✅ Real-time trading analysis  
✅ Context-aware coaching  
✅ Zero additional costs (using OpenClaw)  
✅ Instant feedback on trade ideas  

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd traderisk-ai
npm install
```

### 2. Make Sure OpenClaw is Running
TradeRisk needs OpenClaw running to access Claude. Check:
```bash
openclaw status
```

### 3. Start TradeRisk (Both Frontend + Backend)
```bash
npm run dev
```

This starts:
- **Backend API** on `http://localhost:3001` (bridges to Claude)
- **Frontend** on `http://localhost:3000` (React app)

### Alternative: Run Separately
```bash
# Terminal 1 - Backend
npm run start:backend

# Terminal 2 - Frontend
npm start
```

---

## 🏗️ Architecture

```
traderisk-ai/
├── src/
│   ├── server.js           # Backend API (Express)
│   ├── api/
│   │   └── claude.js       # Claude integration
│   ├── pages/
│   │   ├── ChatPage.jsx    # Chat interface (calls Claude)
│   │   └── LandingPage.jsx
│   ├── components/
│   │   ├── ChatInterface.jsx
│   │   ├── AccountHealth.jsx
│   │   └── Sidebar.jsx
│   └── index.css
├── package.json
└── README.md
```

### Flow
1. User sends message in React frontend
2. Frontend calls `/api/claude` on backend (localhost:3001)
3. Backend bridges to OpenClaw's Claude instance
4. Claude evaluates trade against user's strategy & risk rules
5. Response returned to frontend and displayed

---

## 💡 How Claude Coach Works

**System Prompt:**
Claude is given your trading strategy, account balance, daily loss limit, and risk rules. It evaluates every trade idea against these constraints.

**Example:**
```
User: "Should I take a short on EURUSD at 1.0850 with stop at 1.0865, risking $50?"

Claude Coach analyzes:
✓ Does this match your IFVG strategy?
✓ Are you over your daily loss limit?
✓ Is the risk appropriate for your account?
✓ Is the stop loss reasonable?

Response: Specific, honest feedback with YES/NO + reasoning.
```

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
# Frontend
REACT_APP_OPENCLAW_API=http://localhost:3001

# Backend
PORT=3001
```

The backend automatically connects to OpenClaw on `http://localhost:3000`.

---

## 📱 Features

### 1. AI Trading Coach (Claude)
- Real Claude AI evaluating your trades
- Context-aware responses
- References your specific strategy
- Strict, honest feedback

### 2. Strategy Configuration
- Define your trading rules
- Set daily loss limits
- Configure entry criteria
- Stored locally (localStorage)

### 3. Account Health Tracking
- Visual risk meter
- Daily loss logging
- Remaining risk calculation
- Real-time account status

### 4. Conversation History
- Claude remembers your conversation
- Learns from your trades
- Contextual coaching

---

## 🔌 Customization

### Change the Coach's Personality
Edit the system prompt in `src/api/claude.js`:

```javascript
const systemPrompt = `You are TradeRisk, a strict trading coach...`;
```

### Change the AI Model
In `src/api/claude.js`, modify:
```javascript
model: 'claude-haiku-4.5', // Change to 'claude-opus-4-1' for more powerful AI
```

### Add More Features
- Trade logging & analytics
- Performance metrics
- Backtesting integration
- Multi-strategy support

---

## 🚀 Deployment

### Local (Development)
```bash
npm run dev
```

### Production
```bash
npm run build
npm run start:backend
# Serve build/ folder with your web server
```

---

## ⚠️ Important Notes

1. **OpenClaw Required:** TradeRisk needs OpenClaw running to access Claude. It won't work standalone.

2. **localhost:3000 vs 3001:**
   - `3000` = OpenClaw gateway (where Claude lives)
   - `3001` = TradeRisk backend API
   - `3000` (React) = Frontend (via `npm start`)

3. **No API Keys Needed:** No OpenAI key, no Claude API key. OpenClaw handles authentication.

4. **Data Storage:** All your strategy rules and account data stored locally in browser (localStorage). Nothing sent to external servers.

---

## 📊 What's Next

- [ ] Trade history logging
- [ ] Performance analytics
- [ ] Backtesting integration
- [ ] Mobile app (React Native)
- [ ] Real broker API integration
- [ ] Multi-timeframe analysis
- [ ] Advanced risk metrics

---

## 💪 Philosophy

> **Discipline beats luck.**

TradeRisk AI is built to keep you disciplined. The coach is strict by design. It prioritizes your account safety over your emotion.

Use it to question yourself before every trade.

---

**Trade smart. Stay disciplined. 🎯**
