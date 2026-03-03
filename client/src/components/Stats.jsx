import React from 'react';

const Stats = ({ user, missedCount, habitsCount, tasksCount }) => {
  const completionRate = habitsCount + tasksCount > 0
    ? Math.round(((user.streak || 0) / (habitsCount + tasksCount)) * 100)
    : 0;

  return (
    <div className="glass-card">
      <div className="flex items-center gap-2 border-b border-purple-800/40 pb-2 mb-3">
        <span className="text-xl">📊</span>
        <span className="font-bold">Analytics Snapshot</span>
      </div>
      
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="stat-card">
          <div className="text-purple-400 text-[10px]">LEVEL</div>
          <div className="text-base font-mono text-purple-200">{user.level}</div>
        </div>
        <div className="stat-card">
          <div className="text-purple-400 text-[10px]">TOTAL XP</div>
          <div className="text-base font-mono text-purple-200">{user.totalXp || user.xp}</div>
        </div>
        <div className="stat-card">
          <div className="text-purple-400 text-[10px]">STREAK</div>
          <div className="text-base text-amber-400">{user.streak || 0}</div>
        </div>
        <div className="stat-card">
          <div className="text-purple-400 text-[10px]">MISSED</div>
          <div className="text-base text-red-400">{missedCount}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mt-2">
        <div className="stat-card flex justify-between">
          <span className="text-xs text-purple-300">Habits</span>
          <span className="text-sm text-green-400">{habitsCount}</span>
        </div>
        <div className="stat-card flex justify-between">
          <span className="text-xs text-purple-300">Tasks</span>
          <span className="text-sm text-green-400">{tasksCount}</span>
        </div>
      </div>
      
      <div className="mt-3 grid grid-cols-3 gap-1 text-center text-[10px] bg-purple-900/20 p-2 rounded-xl">
        <div>
          <span className="text-purple-400">Best Streak</span>
          <br />
          <span className="text-white font-bold">{user.bestStreak || 0}</span>
        </div>
        <div>
          <span className="text-purple-400">Completion</span>
          <br />
          <span className="text-green-400">{completionRate}%</span>
        </div>
        <div>
          <span className="text-purple-400">Tasks Left</span>
          <br />
          <span className="text-amber-400">{tasksCount}</span>
        </div>
      </div>
    </div>
  );
};

export default Stats;