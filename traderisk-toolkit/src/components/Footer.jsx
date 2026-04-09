import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-dark-card border-t border-dark-border mt-20 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-accent-green mb-3">TradeRisk</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Free tools for traders. Manage risk, pass prop firm challenges, and trade smarter.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-gray-300 mb-3">Quick Links</h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li><a href="#" className="hover:text-accent-green transition">Home</a></li>
              <li><a href="#" className="hover:text-accent-green transition">Tools</a></li>
              <li><a href="#" className="hover:text-accent-green transition">Blog</a></li>
              <li><a href="#" className="hover:text-accent-green transition">Contact</a></li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h4 className="font-bold text-gray-300 mb-3">Legal</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              <strong>Not financial advice.</strong> These tools are for educational purposes only. Always consult a financial advisor.
            </p>
          </div>
        </div>

        <div className="border-t border-dark-border pt-6 text-center text-gray-500 text-sm">
          <p>&copy; 2026 TradeRisk Toolkit. All rights reserved.</p>
          <p className="mt-2">Free tools for traders | Risk management made simple</p>
        </div>
      </div>
    </footer>
  );
}
