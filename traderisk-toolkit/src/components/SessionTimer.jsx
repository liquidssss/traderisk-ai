import React, { useState, useEffect } from 'react';

const SESSIONS = [
  {
    name: 'Asia',
    start: 20, // 8 PM UTC (Tokyo opens)
    end: 1,   // 1 AM UTC
    color: 'from-purple-500 to-purple-600',
    icon: '🌙',
  },
  {
    name: 'London',
    start: 7,  // 7 AM UTC
    end: 16,   // 4 PM UTC
    color: 'from-blue-500 to-blue-600',
    icon: '☀️',
  },
  {
    name: 'New York',
    start: 13, // 1 PM UTC (9:30 AM EST)
    end: 21,   // 9 PM UTC (5 PM EST)
    color: 'from-amber-500 to-amber-600',
    icon: '🌅',
  },
];

function getActiveSession(hour) {
  for (let session of SESSIONS) {
    if (session.start <= session.end) {
      if (hour >= session.start && hour < session.end) return session;
    } else {
      if (hour >= session.start || hour < session.end) return session;
    }
  }
  return null;
}

function getTimeToNextSession(currentHour) {
  // Find next session start
  let nextStart = null;
  for (let session of SESSIONS) {
    if (session.start > currentHour) {
      nextStart = session.start;
      break;
    }
  }
  
  if (!nextStart) {
    nextStart = SESSIONS[0].start; // First session of next day
  }

  const hoursUntil = nextStart > currentHour ? nextStart - currentHour : 24 - currentHour + nextStart;
  return hoursUntil;
}

export default function SessionTimer() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hour = currentTime.getUTCHours();
  const minute = currentTime.getUTCMinutes();
  const second = currentTime.getUTCSeconds();
  const activeSession = getActiveSession(hour);
  const hoursToNext = getTimeToNextSession(hour);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-accent-green mb-2">Trading Sessions</h2>
        <p className="text-gray-400">Current UTC Time: {String(hour).padStart(2, '0')}:{String(minute).padStart(2, '0')}:{String(second).padStart(2, '0')}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {SESSIONS.map((session, idx) => {
          const isActive = activeSession?.name === session.name;
          return (
            <div
              key={idx}
              className={`rounded-lg p-6 border transition-all ${
                isActive
                  ? `border-accent-green bg-dark-card shadow-glow`
                  : `border-dark-border bg-dark-card`
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{session.name}</h3>
                <span className="text-2xl">{session.icon}</span>
              </div>

              {isActive && (
                <div className="mb-4 inline-block px-3 py-1 bg-accent-green text-dark-bg rounded-full text-xs font-bold">
                  ACTIVE NOW
                </div>
              )}

              <div className="space-y-2 text-sm text-gray-400">
                <p>Opens: <span className="text-gray-200 font-mono">{String(session.start).padStart(2, '0')}:00 UTC</span></p>
                <p>Closes: <span className="text-gray-200 font-mono">{String(session.end).padStart(2, '0')}:00 UTC</span></p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Next Session Info */}
      {!activeSession && (
        <div className="bg-dark-card border border-accent-blue border-opacity-50 rounded-lg p-6 text-center">
          <p className="text-gray-400 mb-2">Next Session in</p>
          <p className="text-4xl font-bold text-accent-blue">
            {Math.floor(hoursToNext)}h {Math.round((hoursToNext % 1) * 60)}m
          </p>
          <p className="text-gray-400 mt-2">{SESSIONS[0].name} opens soon</p>
        </div>
      )}
    </div>
  );
}
