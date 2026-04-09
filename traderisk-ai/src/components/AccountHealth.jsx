import React, { useState } from 'react';
import { Activity, AlertCircle, TrendingUp } from 'lucide-react';

export default function AccountHealth({ profile, onUpdateProfile }) {
  const [expanded, setExpanded] = useState(true);
  const [tempDailyLoss, setTempDailyLoss] = useState(profile.dailyLossUsed);

  const dailyRiskPercent = ((profile.dailyLossUsed / profile.accountBalance) * 100).toFixed(1);
  const dailyLimitPercent = ((profile.dailyLossLimit / profile.accountBalance) * 100).toFixed(1);
  const riskRemaining = profile.dailyLossLimit - profile.dailyLossUsed;
  const healthPercent = ((riskRemaining / profile.dailyLossLimit) * 100).toFixed(0);

  const getHealthColor = () => {
    if (riskRemaining < 0) return 'red';
    if (riskRemaining < 100) return 'yellow';
    return 'green';
  };

  const getHealthMessage = () => {
    if (riskRemaining < 0) return 'OVER LIMIT - STOP TRADING';
    if (riskRemaining < 100) return 'DANGER - LIMITED TRADES';
    if (riskRemaining < profile.dailyLossLimit * 0.3) return 'CAUTION';
    return 'SAFE';
  };

  const healthColor = getHealthColor();
  const colorMap = {
    green: { bg: 'bg-green-500/20', border: 'border-green-500/50', text: 'text-green-400' },
    yellow: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/50', text: 'text-yellow-400' },
    red: { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400' },
  };

  const style = colorMap[healthColor];

  const handleUpdateDailyLoss = () => {
    onUpdateProfile({ ...profile, dailyLossUsed: tempDailyLoss });
  };

  return (
    <div className={`${style.bg} border ${style.border} rounded-lg overflow-hidden flex flex-col h-full`}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="p-4 hover:bg-black/20 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Activity className={style.text} size={20} />
          <h3 className="font-bold text-lg">Account Health</h3>
        </div>
        <span className={`${style.text} font-bold text-sm`}>{getHealthMessage()}</span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Health Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-300">Daily Risk Remaining</p>
              <p className="font-bold text-lg">${riskRemaining}</p>
            </div>
            <div className="w-full bg-black/40 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  healthColor === 'green' ? 'bg-green-500' :
                  healthColor === 'yellow' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${Math.min(100, healthPercent)}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">{healthPercent}% available</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-black/20 rounded p-2">
              <p className="text-gray-400 text-xs">Used Today</p>
              <p className="font-bold">${profile.dailyLossUsed}</p>
              <p className="text-xs text-gray-500">{dailyRiskPercent}% of account</p>
            </div>
            <div className="bg-black/20 rounded p-2">
              <p className="text-gray-400 text-xs">Daily Limit</p>
              <p className="font-bold">${profile.dailyLossLimit}</p>
              <p className="text-xs text-gray-500">{dailyLimitPercent}% of account</p>
            </div>
          </div>

          {/* Update Daily Loss */}
          <div className="bg-black/20 rounded p-3">
            <label className="block text-xs text-gray-400 mb-2">Log a loss today</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={tempDailyLoss}
                onChange={(e) => setTempDailyLoss(parseFloat(e.target.value))}
                className="flex-1 text-sm"
              />
              <button
                onClick={handleUpdateDailyLoss}
                className="px-3 py-1 bg-accent-green text-dark-bg text-sm font-bold rounded hover:shadow-glow"
              >
                Update
              </button>
            </div>
          </div>

          {/* Warning if over limit */}
          {riskRemaining < 0 && (
            <div className="bg-red-500/20 border border-red-500/50 rounded p-3 flex gap-2">
              <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">You've exceeded your daily loss limit. Stop trading immediately.</p>
            </div>
          )}

          {/* Warning if low on risk */}
          {riskRemaining > 0 && riskRemaining < 150 && (
            <div className="bg-yellow-500/20 border border-yellow-500/50 rounded p-3 flex gap-2">
              <AlertCircle size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-300">Limited trading capital left. Be very selective.</p>
            </div>
          )}

          {/* Info */}
          <div className="bg-black/20 rounded p-3 text-xs text-gray-400 leading-relaxed">
            <p className="font-bold mb-1">💡 How to use:</p>
            <p>Log your daily losses here. The AI Coach will factor this into trade recommendations.</p>
          </div>
        </div>
      )}
    </div>
  );
}
