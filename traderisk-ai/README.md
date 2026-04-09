# TradeRisk AI — Your Personal Trading Coach

**AI-powered decision support tool that keeps traders disciplined and within their rules.**

## 🎯 What It Does

- **Ask Before You Trade** — Get instant AI feedback on trade ideas
- **Strategy Enforcement** — AI enforces your custom trading rules
- **Account Health Dashboard** — Visual risk management tracking
- **Discipline Coach** — Strict, honest feedback designed to prevent account blowups

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

Open `http://localhost:3000`

---

## 🏗️ Architecture

```
src/
├── App.jsx                 # Main router
├── pages/
│   ├── LandingPage.jsx    # Landing + CTA
│   └── ChatPage.jsx       # Main AI coach interface
├── components/
│   ├── ChatInterface.jsx  # Message UI + input
│   ├── AccountHealth.jsx  # Risk tracking dashboard
│   └── Sidebar.jsx        # Strategy & account info
└── index.css              # Global styles + animations
```

---

## 💡 Key Features

### 1. **AI Trading Coach**
- Chat-based interface (like ChatGPT)
- Evaluates trades in real-time
- References user's strategy + risk rules
- Strict, direct responses

### 2. **Strategy Configuration**
- Users define their trading rules
- Entry criteria, timeframes, risk parameters
- Stored locally (localStorage)

### 3. **Account Health Tracking**
- Visual risk meter (green → yellow → red)
- Daily loss logging
- Remaining risk calculation

### 4. **Mock AI Responses**
- Smart pattern matching on user input
- Context-aware responses
- References strategy & account data
- **Ready for OpenAI API integration** (swap `generateCoachResponse` function)

---

## 🔌 Ready for OpenAI Integration

To use real AI, swap the mock function in `ChatPage.jsx`:

```javascript
// Replace generateCoachResponse with:
async function getAIResponse(userMessage, profile) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a strict trading coach. Never guarantee profits. Always prioritize discipline. Reference the user's strategy: ${profile.strategy.rules}`
        },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.7,
    }),
  });
  const data = await response.json();
  return data.choices[0].message.content;
}
```

Then set `REACT_APP_OPENAI_API_KEY` in `.env`

---

## 🎨 Design System

- **Color Scheme**: Dark mode with neon accents
- **Primary**: `#00ff88` (neon green)
- **Secondary**: `#00d4ff` (neon blue)
- **Background**: `#0a0e14` (deep black)
- **Cards**: `#151b27` (charcoal)

---

## 📱 Mobile-First

- Responsive layout (mobile, tablet, desktop)
- Touch-friendly buttons
- Collapsible sidebar on mobile
- Works great on iPhone/Android

---

## 🔐 Data Storage

- **All user data stored locally** (localStorage)
- No backend required for MVP
- Account balance, strategy rules, daily loss tracked in browser

---

## ⚡ Performance

- Fast load time (~48KB gzipped)
- Smooth animations
- Real-time chat updates
- No external dependencies except React + Tailwind

---

## 📊 Future Features

- Trade history logging + analytics
- Backtesting integration
- Premium tier (unlimited AI queries)
- Multi-strategy support
- Mobile app (React Native)
- Real broker integration
- Performance metrics & stats

---

## ⚠️ Disclaimer

**Not financial advice.** This is an educational tool. Always verify with your broker and consult a financial advisor before trading.

---

## 💪 Philosophy

TradeRisk AI is built on one principle:

> **Discipline beats luck.**

The AI coach is strict by design. It prioritizes your account safety over your emotion. Use it to question yourself before every trade.

---

Enjoy. Trade smart. 🎯

