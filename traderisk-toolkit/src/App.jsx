import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import RiskCalculator from './components/RiskCalculator';
import SessionTimer from './components/SessionTimer';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-dark-bg text-gray-100">
      {/* Top Banner Ad */}
      <div className="bg-dark-card border-b border-dark-border py-3 px-4 text-center text-sm text-gray-400">
        <span className="text-accent-green">⚡ TradeRisk Toolkit</span> — Free trading risk management tools
      </div>

      {/* Navigation */}
      <nav className="bg-dark-card border-b border-dark-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold">
            <span className="text-accent-green">Trade</span>
            <span className="text-white">Risk</span>
          </div>
          <div className="text-sm text-gray-400">Free Tools for Traders</div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4">
        {/* Hero */}
        <Hero />

        {/* Main Tool Section */}
        <section className="py-12">
          <RiskCalculator />
        </section>

        {/* Session Timer */}
        <section className="py-12">
          <SessionTimer />
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
