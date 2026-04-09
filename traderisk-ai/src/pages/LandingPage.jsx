import React from 'react';
import { TrendingUp, Zap, Target } from 'lucide-react';

export default function LandingPage({ onStart }) {
  return (
    <div className="min-h-screen bg-dark-bg text-white flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-3xl text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
              Ask Before You Trade.
              <br />
              <span className="text-accent-green">Stop Blowing Accounts.</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Your AI trading coach that keeps you disciplined and within your rules.
            </p>
          </div>

          <button
            onClick={onStart}
            className="bg-accent-green text-dark-bg font-bold py-4 px-10 rounded-lg hover:shadow-glow transition-all text-lg mb-12"
          >
            Start Free
          </button>

          {/* Features Preview */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="bg-dark-card border border-dark-border rounded-lg p-6">
              <Zap className="w-8 h-8 text-accent-green mx-auto mb-3" />
              <h3 className="font-bold mb-2">AI Coach</h3>
              <p className="text-sm text-gray-400">Get instant feedback on every trade idea before you enter</p>
            </div>

            <div className="bg-dark-card border border-dark-border rounded-lg p-6">
              <Target className="w-8 h-8 text-accent-blue mx-auto mb-3" />
              <h3 className="font-bold mb-2">Strategy Rules</h3>
              <p className="text-sm text-gray-400">Define your strategy and let AI enforce your discipline</p>
            </div>

            <div className="bg-dark-card border border-dark-border rounded-lg p-6">
              <TrendingUp className="w-8 h-8 text-accent-green mx-auto mb-3" />
              <h3 className="font-bold mb-2">Account Health</h3>
              <p className="text-sm text-gray-400">Track your daily risk and stay within safe limits</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-border py-6 px-4 text-center text-gray-400 text-sm">
        <p>⚠️ Not financial advice. For educational purposes only.</p>
        <p className="mt-2">© 2026 TradeRisk AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
