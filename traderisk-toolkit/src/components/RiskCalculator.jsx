import React, { useState } from 'react';

const INSTRUMENTS = {
  NQ: { name: 'Nasdaq 100 (NQ)', pointValue: 20, defaultTicks: 20 },
  ES: { name: 'S&P 500 (ES)', pointValue: 50, defaultTicks: 10 },
  YM: { name: 'Dow Jones (YM)', pointValue: 5, defaultTicks: 100 },
  EURUSD: { name: 'EUR/USD', pointValue: 100000, defaultTicks: 50 },
  GBPUSD: { name: 'GBP/USD', pointValue: 100000, defaultTicks: 50 },
  USDJPY: { name: 'USD/JPY', pointValue: 100000, defaultTicks: 100 },
};

export default function RiskCalculator() {
  const [accountBalance, setAccountBalance] = useState(10000);
  const [riskPercent, setRiskPercent] = useState(2);
  const [stopLoss, setStopLoss] = useState(20);
  const [instrument, setInstrument] = useState('NQ');
  const [propFirmMode, setPropFirmMode] = useState(false);
  const [dailyLossLimit, setDailyLossLimit] = useState(500);
  const [maxDrawdown, setMaxDrawdown] = useState(5);

  const inst = INSTRUMENTS[instrument];
  const dollarRisk = (accountBalance * riskPercent) / 100;
  const positionSize = Math.round(dollarRisk / (stopLoss * (inst.pointValue / 100)));
  const actualRisk = Math.round((positionSize * stopLoss * (inst.pointValue / 100)) * 100) / 100;
  const actualRiskPercent = (actualRisk / accountBalance) * 100;

  const getRiskMessage = () => {
    if (actualRiskPercent > 2) {
      return {
        text: '⚠️ You\'re over-risking. Most prop firms recommend 1–2%.',
        color: 'text-red-400',
        bg: 'bg-red-500/10',
      };
    }
    return {
      text: '✅ Good risk management.',
      color: 'text-accent-green',
      bg: 'bg-green-500/10',
    };
  };

  const riskMsg = getRiskMessage();

  const checkPropFirmViolations = () => {
    const violations = [];
    if (actualRisk > dailyLossLimit) {
      violations.push(`Daily loss limit: $${dailyLossLimit} (Current risk: $${actualRisk})`);
    }
    if (actualRiskPercent > maxDrawdown) {
      violations.push(`Max drawdown: ${maxDrawdown}% (Current risk: ${actualRiskPercent.toFixed(2)}%)`);
    }
    return violations;
  };

  const propFirmViolations = propFirmMode ? checkPropFirmViolations() : [];

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Inputs Panel */}
        <div className="bg-dark-card border border-dark-border rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-accent-green">Position Size Calculator</h2>

          {/* Account Balance */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2 text-gray-300">Account Balance ($)</label>
            <input
              type="number"
              value={accountBalance}
              onChange={(e) => setAccountBalance(Math.max(1, parseFloat(e.target.value) || 0))}
              className="w-full"
            />
          </div>

          {/* Risk Percentage */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2 text-gray-300">Risk Percentage (%)</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={riskPercent}
                onChange={(e) => setRiskPercent(parseFloat(e.target.value))}
                className="flex-1 accent-green-500"
              />
              <span className="text-accent-green font-bold w-12 text-right">{riskPercent.toFixed(1)}%</span>
            </div>
          </div>

          {/* Instrument */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2 text-gray-300">Instrument</label>
            <select
              value={instrument}
              onChange={(e) => setInstrument(e.target.value)}
              className="w-full"
            >
              {Object.entries(INSTRUMENTS).map(([key, val]) => (
                <option key={key} value={key}>{val.name}</option>
              ))}
            </select>
          </div>

          {/* Stop Loss */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-300">Stop Loss (Ticks/Pips)</label>
            <input
              type="number"
              value={stopLoss}
              onChange={(e) => setStopLoss(Math.max(1, parseFloat(e.target.value) || 1))}
              className="w-full"
            />
          </div>

          {/* Prop Firm Mode Toggle */}
          <div className="border-t border-dark-border pt-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={propFirmMode}
                onChange={(e) => setPropFirmMode(e.target.checked)}
                className="w-5 h-5 accent-green-500"
              />
              <span className="font-medium">Prop Firm Mode</span>
            </label>

            {propFirmMode && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Daily Loss Limit ($)</label>
                  <input
                    type="number"
                    value={dailyLossLimit}
                    onChange={(e) => setDailyLossLimit(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Max Drawdown (%)</label>
                  <input
                    type="number"
                    value={maxDrawdown}
                    onChange={(e) => setMaxDrawdown(Math.max(0, parseFloat(e.target.value) || 0))}
                    step="0.1"
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-4">
          {/* Position Size Card */}
          <div className="bg-dark-card border border-accent-green border-opacity-30 rounded-lg p-6 shadow-glow">
            <p className="text-gray-400 text-sm mb-1">Position Size</p>
            <p className="text-4xl font-bold text-accent-green">{positionSize}</p>
            <p className="text-gray-500 text-sm mt-2">{inst.name}</p>
          </div>

          {/* Dollar Risk Card */}
          <div className="bg-dark-card border border-accent-blue border-opacity-30 rounded-lg p-6 shadow-glow-blue">
            <p className="text-gray-400 text-sm mb-1">Dollar Risk</p>
            <p className="text-4xl font-bold text-accent-blue">${actualRisk.toFixed(2)}</p>
            <p className="text-gray-500 text-sm mt-2">{actualRiskPercent.toFixed(2)}% of account</p>
          </div>

          {/* Risk Message */}
          <div className={`rounded-lg p-4 border border-opacity-30 ${riskMsg.bg}`}>
            <p className={`font-medium ${riskMsg.color}`}>{riskMsg.text}</p>
          </div>

          {/* Prop Firm Violations */}
          {propFirmMode && propFirmViolations.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-400 font-bold mb-2">⚠️ Prop Firm Violations:</p>
              <ul className="space-y-1 text-red-300 text-sm">
                {propFirmViolations.map((v, i) => (
                  <li key={i}>• {v}</li>
                ))}
              </ul>
            </div>
          )}

          {propFirmMode && propFirmViolations.length === 0 && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <p className="text-accent-green font-bold">✅ Passes all prop firm checks</p>
            </div>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-dark-card border border-dark-border rounded-lg p-6">
        <h3 className="text-lg font-bold mb-3 text-accent-green">How It Works</h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          This calculator determines your position size based on your account balance, risk tolerance, and stop loss distance. 
          Enter your account size and desired risk percentage, select your instrument, and set your stop loss level. 
          The tool will instantly calculate how many contracts/lots you should trade. Use Prop Firm Mode to ensure your trades 
          comply with challenge rules. <strong>Disclaimer:</strong> This is a free tool for educational purposes. Always verify with your broker.
        </p>
      </div>
    </div>
  );
}
