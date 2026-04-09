import React, { useState, useEffect } from 'react';
import { Menu, Send, Settings, LogOut } from 'lucide-react';
import ChatInterface from '../components/ChatInterface';
import Sidebar from '../components/Sidebar';
import AccountHealth from '../components/AccountHealth';
import { getClaudeCoachResponse } from '../api/claude';
import { useAuth } from '../context/AuthContext';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export default function ChatPage() {
  const { user, token, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Load user's trading profile on mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to load profile');

      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleSendMessage = async (message) => {
    if (!message.trim() || !profile) return;

    // Add user message
    const userMsg = { role: 'user', content: message, id: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Call Claude via authenticated API
      const aiResponse = await getClaudeCoachResponse(
        message,
        token,
        messages.map(m => ({
          role: m.role,
          content: m.content
        }))
      );
      
      // Save message to database
      await Promise.all([
        fetch(`${API_BASE}/api/chat-message`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ role: 'user', content: message }),
        }),
        fetch(`${API_BASE}/api/chat-message`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ role: 'assistant', content: aiResponse }),
        }),
      ]);
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: aiResponse,
        id: Date.now() + 1
      }]);
    } catch (error) {
      console.error('Failed to get Claude response:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '⚠️ Coach is temporarily unavailable. Please try again.',
        id: Date.now() + 1
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (updates) => {
    try {
      const response = await fetch(`${API_BASE}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      const updated = await response.json();
      setProfile(updated);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent-green"></div>
          <p className="mt-4 text-gray-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">Failed to load profile</p>
          <button
            onClick={logout}
            className="mt-4 px-4 py-2 bg-accent-green text-dark-bg rounded hover:shadow-glow"
          >
            Log Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-dark-bg">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        profile={profile}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-dark-border bg-dark-card px-4 py-3 flex items-center justify-between sticky top-0 z-40">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 hover:bg-dark-accent rounded"
          >
            <Menu size={20} />
          </button>

          <div>
            <h1 className="text-lg font-bold">
              <span className="text-accent-green">TradeRisk</span> AI Coach
            </h1>
            <p className="text-xs text-gray-400">{user?.username}</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-dark-accent rounded"
            >
              <Settings size={20} />
            </button>
            <button
              onClick={logout}
              className="p-2 hover:bg-dark-accent rounded"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 flex gap-4 overflow-hidden p-4">
          {/* Account Health (right sidebar on desktop) */}
          <div className="hidden lg:block w-80">
            <AccountHealth profile={profile} onUpdateProfile={handleUpdateProfile} />
          </div>

          {/* Chat */}
          <div className="flex-1 flex flex-col">
            <ChatInterface
              messages={messages}
              loading={loading}
              onSendMessage={handleSendMessage}
              profile={profile}
            />
          </div>
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <SettingsModal profile={profile} onUpdateProfile={handleUpdateProfile} onClose={() => setShowSettings(false)} />
          </div>
        )}
      </div>
    </div>
  );
}

function SettingsModal({ profile, onUpdateProfile, onClose }) {
  const [formData, setFormData] = useState(profile);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdateProfile(formData);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-dark-card border border-dark-border rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-accent-green">Settings</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Account Balance ($)</label>
          <input
            type="number"
            value={formData.account_balance}
            onChange={(e) => setFormData({ ...formData, account_balance: parseFloat(e.target.value) })}
            className="w-full px-3 py-2 bg-dark-accent border border-dark-border rounded text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Daily Loss Limit ($)</label>
          <input
            type="number"
            value={formData.daily_loss_limit}
            onChange={(e) => setFormData({ ...formData, daily_loss_limit: parseFloat(e.target.value) })}
            className="w-full px-3 py-2 bg-dark-accent border border-dark-border rounded text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Daily Loss Used ($)</label>
          <input
            type="number"
            value={formData.daily_loss_used}
            onChange={(e) => setFormData({ ...formData, daily_loss_used: parseFloat(e.target.value) })}
            className="w-full px-3 py-2 bg-dark-accent border border-dark-border rounded text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Strategy Name</label>
          <input
            type="text"
            value={formData.strategy_name}
            onChange={(e) => setFormData({ ...formData, strategy_name: e.target.value })}
            className="w-full px-3 py-2 bg-dark-accent border border-dark-border rounded text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Strategy Rules</label>
          <textarea
            value={formData.strategy_rules}
            onChange={(e) => setFormData({ ...formData, strategy_rules: e.target.value })}
            className="w-full h-24 px-3 py-2 bg-dark-accent border border-dark-border rounded text-white"
            placeholder="Define your trading strategy rules..."
          />
        </div>

        <div className="flex gap-2 pt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-accent-green text-dark-bg font-bold py-2 rounded hover:shadow-glow disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-dark-accent text-white font-bold py-2 rounded hover:bg-dark-border"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
