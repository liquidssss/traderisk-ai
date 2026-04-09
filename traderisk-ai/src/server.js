/**
 * TradeRisk Backend API with Authentication
 * Runs on localhost:3001
 * 
 * Features:
 * - User signup/login
 * - JWT authentication
 * - User-specific data storage
 * - Claude coach with user context
 */

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase (PostgreSQL database)
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// ============== AUTH ROUTES ==============

/**
 * POST /api/auth/signup
 * Create new user account
 */
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert([{
        email,
        username,
        password_hash: hashedPassword,
        created_at: new Date(),
      }])
      .select()
      .single();

    if (createError) throw createError;

    // Create default trading profile
    await supabase
      .from('trading_profiles')
      .insert([{
        user_id: newUser.id,
        strategy_name: 'IFVG Trading',
        strategy_rules: 'Look for Invalid FVG setups on 15m/1h. Max 2% risk per trade. Max 3 trades per day.',
        account_balance: 10000,
        daily_loss_limit: 200,
        daily_loss_used: 0,
        created_at: new Date(),
      }]);

    // Generate JWT
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Signup failed' });
  }
});

/**
 * POST /api/auth/login
 * Authenticate user
 */
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Get user
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (fetchError || !user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ============== AUTH MIDDLEWARE ==============

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// ============== USER DATA ROUTES ==============

/**
 * GET /api/profile
 * Get user's trading profile
 */
app.get('/api/profile', authMiddleware, async (req, res) => {
  try {
    const { data: profile, error } = await supabase
      .from('trading_profiles')
      .select('*')
      .eq('user_id', req.userId)
      .single();

    if (error) throw error;

    res.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

/**
 * PUT /api/profile
 * Update user's trading profile
 */
app.put('/api/profile', authMiddleware, async (req, res) => {
  try {
    const updates = req.body;

    const { data: profile, error } = await supabase
      .from('trading_profiles')
      .update(updates)
      .eq('user_id', req.userId)
      .select()
      .single();

    if (error) throw error;

    res.json(profile);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// ============== CHAT HISTORY ROUTES ==============

/**
 * GET /api/chat-history
 * Get user's chat history
 */
app.get('/api/chat-history', authMiddleware, async (req, res) => {
  try {
    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    res.json(messages || []);
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({ error: 'Failed to get chat history' });
  }
});

/**
 * POST /api/chat-message
 * Save a chat message
 */
app.post('/api/chat-message', authMiddleware, async (req, res) => {
  try {
    const { role, content } = req.body;

    const { data: message, error } = await supabase
      .from('chat_messages')
      .insert([{
        user_id: req.userId,
        role,
        content,
        created_at: new Date(),
      }])
      .select()
      .single();

    if (error) throw error;

    res.json(message);
  } catch (error) {
    console.error('Save message error:', error);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

// ============== CLAUDE API ROUTE ==============

/**
 * POST /api/claude
 * Call Claude with user context
 */
app.post('/api/claude', authMiddleware, async (req, res) => {
  try {
    const { system, messages, model = 'claude-haiku-4.5', max_tokens = 300 } = req.body;

    if (!system || !messages) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get user's profile for context
    const { data: profile } = await supabase
      .from('trading_profiles')
      .select('*')
      .eq('user_id', req.userId)
      .single();

    // Enhance system prompt with user's specific data
    const enhancedSystem = `${system}

**User's Current Profile:**
- Account Balance: $${profile.account_balance}
- Daily Loss Limit: $${profile.daily_loss_limit}
- Daily Loss Used: $${profile.daily_loss_used}
- Strategy: ${profile.strategy_name}
- Rules: ${profile.strategy_rules}`;

    // Call Claude via OpenClaw
    const response = await fetch('http://localhost:3000/api/claude', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        system: enhancedSystem,
        messages,
        max_tokens,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenClaw API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.content || data.message?.content || '';

    res.json({ content });
  } catch (error) {
    console.error('Claude API error:', error);
    res.status(500).json({ error: 'Failed to get Claude response' });
  }
});

// ============== HEALTH CHECK ==============

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'TradeRisk Backend' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 TradeRisk Backend running on http://localhost:${PORT}`);
  console.log(`🔐 Authentication enabled`);
  console.log(`💬 Claude API endpoint: http://localhost:${PORT}/api/claude`);
  console.log(`📦 Database: Supabase PostgreSQL\n`);
});
