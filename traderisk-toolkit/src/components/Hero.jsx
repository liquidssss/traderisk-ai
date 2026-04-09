import React from 'react';

export default function Hero() {
  return (
    <section className="py-20 text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        Stop Blowing Accounts.
        <br />
        <span className="text-accent-green">Manage Risk Like a Pro.</span>
      </h1>
      <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
        Free tools built for traders and prop firm challenges. Calculate position sizes, manage daily limits, and master your risk.
      </p>
      <button className="bg-accent-green text-dark-bg font-bold py-3 px-8 rounded-lg hover:shadow-glow transition-all">
        Start Calculating
      </button>
    </section>
  );
}
