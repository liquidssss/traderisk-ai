import React from 'react';
import { X } from 'lucide-react';

export default function Sidebar({ isOpen, onClose, profile }) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:relative md:block
        w-64 h-screen bg-dark-card border-r border-dark-border
        transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        z-40 overflow-y-auto
      `}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-accent-green">Your Strategy</h2>
            <button
              onClick={onClose}
              className="md:hidden p-1 hover:bg-dark-accent rounded"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {/* Strategy Info */}
            <div className="bg-dark-accent rounded-lg p-4">
              <h3 className="font-bold text-sm mb-2">{profile.strategy.name}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                {profile.strategy.rules}
              </p>
            </div>

            {/* Account Info */}
            <div className="space-y-2">
              <div className="text-xs">
                <p className="text-gray-400">Account Balance</p>
                <p className="font-bold text-accent-green">${profile.accountBalance.toLocaleString()}</p>
              </div>
              <div className="text-xs">
                <p className="text-gray-400">Daily Loss Limit</p>
                <p className="font-bold text-accent-blue">${profile.dailyLossLimit.toLocaleString()}</p>
              </div>
              <div className="text-xs">
                <p className="text-gray-400">Daily Loss Used</p>
                <p className="font-bold text-yellow-400">${profile.dailyLossUsed.toLocaleString()}</p>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-accent-green/10 border border-accent-green/30 rounded-lg p-3">
              <p className="text-xs text-gray-300 leading-relaxed">
                💡 The AI Coach evaluates trades based on your strategy and daily risk limits. Be honest about your numbers.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-dark-border bg-dark-bg">
          <p className="text-xs text-gray-500">
            ⚠️ Not financial advice. Use for learning only.
          </p>
        </div>
      </div>
    </>
  );
}
