import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Send } from 'lucide-react';

export default function ChatInterface({ messages, loading, onSendMessage, profile }) {
  const [input, setInput] = React.useState('');
  const messagesEndRef = React.useRef(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  const dailyRiskPercent = ((profile.dailyLossUsed / profile.accountBalance) * 100).toFixed(1);
  const dailyLimitPercent = ((profile.dailyLossLimit / profile.accountBalance) * 100).toFixed(1);
  const riskRemaining = profile.dailyLossLimit - profile.dailyLossUsed;

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold mb-2">Ask Before You Trade</h2>
            <p className="text-gray-400 max-w-md">
              Tell me about a trade idea and I'll evaluate it against your strategy and risk rules. Be specific about your entry, stop loss, and risk.
            </p>
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} message-enter`}>
              <div className={`max-w-[85%] md:max-w-md ${
                msg.role === 'user'
                  ? 'bg-accent-green text-dark-bg rounded-2xl rounded-tr-none'
                  : 'bg-dark-card border border-dark-border rounded-2xl rounded-tl-none'
              } px-4 py-3`}>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-dark-card border border-dark-border rounded-2xl rounded-tl-none px-4 py-3">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-accent-green rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-accent-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-accent-green rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        <StatCard 
          label="Daily Risk Used" 
          value={`$${profile.dailyLossUsed}`}
          percent={dailyRiskPercent}
          color={parseFloat(dailyRiskPercent) > 80 ? 'red' : parseFloat(dailyRiskPercent) > 50 ? 'yellow' : 'green'}
        />
        <StatCard 
          label="Daily Limit" 
          value={`$${profile.dailyLossLimit}`}
          percent={dailyLimitPercent}
          color="blue"
        />
        <StatCard 
          label="Risk Remaining" 
          value={`$${riskRemaining}`}
          percent={(riskRemaining / profile.dailyLossLimit * 100).toFixed(0)}
          color={riskRemaining < 100 ? 'red' : 'green'}
        />
        <StatCard 
          label="Account Balance" 
          value={`$${profile.accountBalance}`}
          color="blue"
        />
      </div>

      {/* Input Area */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Describe your trade idea... (entry, stop loss, risk %)"
          className="flex-1"
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="bg-accent-green text-dark-bg p-3 rounded-lg hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value, percent, color }) {
  const colorMap = {
    green: { bg: 'bg-green-500/10', text: 'text-accent-green', border: 'border-green-500/30' },
    red: { bg: 'bg-red-500/10', text: 'text-accent-red', border: 'border-red-500/30' },
    yellow: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30' },
    blue: { bg: 'bg-accent-blue/10', text: 'text-accent-blue', border: 'border-blue-500/30' },
  };

  const style = colorMap[color] || colorMap.blue;

  return (
    <div className={`${style.bg} border ${style.border} rounded-lg p-2`}>
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className={`${style.text} font-bold text-sm`}>{value}</p>
      {percent && <p className="text-xs text-gray-500 mt-1">{percent}%</p>}
    </div>
  );
}
