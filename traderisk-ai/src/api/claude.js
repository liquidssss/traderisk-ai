/**
 * Claude AI Integration via OpenClaw
 * This calls Claude through the OpenClaw backend for real AI responses
 * Now with JWT authentication - sends token in Authorization header
 */

const OPENCLAW_API_BASE = process.env.REACT_APP_OPENCLAW_API || 'http://localhost:3001';

export async function getClaudeCoachResponse(userMessage, token, conversationHistory = []) {
  try {
    // Call backend API with auth token
    const response = await fetch(`${OPENCLAW_API_BASE}/api/claude`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        system: `You are TradeRisk, a strict and disciplined trading coach AI. Your job is to keep traders safe and disciplined.

Your personality:
- Strict and direct. No sugar coating.
- Always prioritize discipline and risk management.
- Never guarantee profits or give financial advice.
- Ask for specifics before evaluating trades.
- If the user is over their daily loss limit, tell them to STOP trading.
- Reference the user's specific strategy rules when evaluating.
- Use emojis sparingly but effectively (✅ ❌ ⚠️ 🛑).

Response style:
- Short and actionable (2-3 sentences for quick checks, longer for detailed advice)
- Always check if they've hit their daily loss limit first.
- Ask for stop loss, risk amount, and entry level when evaluating trades.
- Be honest if they're breaking their rules.`,
        messages: [
          ...conversationHistory,
          {
            role: 'user',
            content: userMessage,
          },
        ],
        model: 'claude-haiku-4.5',
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('Claude API Error:', error);
    throw error;
  }
}
