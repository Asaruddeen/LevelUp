import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ user, onLogout }) => {
  const xpNeeded = user.level * 1000;
  const xpProgress = (user.xp / xpNeeded) * 100;

  return (
    <div className="glass-card">
      <div className="flex items-center gap-3">
        <span className="text-4xl bg-purple-900/70 p-2 rounded-full shadow-[0_0_15px_#a855f7]">
          🧑
        </span>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg text-purple-300">
              {user?.username?.toUpperCase()}
            </span>
            <div className="flex gap-2">
              <Link 
                to="/leaderboard"
                className="text-xs bg-purple-800/60 px-3 py-1 rounded-full hover:bg-purple-700"
              >
                🏆 Leaderboard
              </Link>
              <button
                onClick={onLogout}
                className="text-xs bg-red-900/60 px-2 py-1 rounded-full hover:bg-red-800"
              >
                Logout
              </button>
            </div>
          </div>
          <div className="h-3 bg-black/70 rounded-full border border-purple-700/80 mt-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-600 to-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${xpProgress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] text-purple-400 mt-1">
            <span>{user.xp} / {xpNeeded} XP</span>
            <span className="text-blue-300">⬆️ Level {user.level}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;