# TradeRisk Toolkit

**Free trading risk management tools for traders and prop firm challenges.**

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm build
```

The app will open at `http://localhost:3000`

---

## 📋 Features

### ✅ Position Size Calculator
- Calculate contracts/lots based on account balance and risk
- Support for multiple instruments (NQ, ES, YM, Forex pairs)
- Real-time calculations with slider controls
- Visual risk warnings

### ✅ Prop Firm Mode
- Monitor daily loss limits
- Track max drawdown
- Receive violations alerts

### ✅ Trading Session Timer
- Asia, London, New York session tracking
- Active session highlighting
- Countdown to next session
- Live UTC time display

### ✅ Dark Mode UI
- Neon green & blue accent colors
- Smooth shadows and glows
- Mobile-first responsive design

---

## 🛠️ Tech Stack

- **React 18** — UI library
- **Tailwind CSS 3** — styling
- **Responsive** — mobile-first design

---

## 📁 Project Structure

```
src/
├── App.jsx                    # Main app component
├── index.css                  # Global styles
├── components/
│   ├── Hero.jsx              # Hero section
│   ├── RiskCalculator.jsx    # Main trading tool
│   ├── SessionTimer.jsx      # Session tracking
│   └── Footer.jsx            # Footer
public/
├── index.html                # HTML template
```

---

## ⚠️ Disclaimer

**Not financial advice.** These tools are for educational purposes only. Always verify calculations with your broker and consult a financial advisor before trading.

---

## 📝 License

Free to use and modify.

Enjoy! 🎯

