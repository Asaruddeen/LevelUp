import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get('/api/users/leaderboard');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getMedal = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a12] p-4">
      <div className="max-w-md mx-auto">
        <div className="glass-card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-purple-400">Leaderboard</h1>
            <Link to="/dashboard" className="text-purple-400 hover:text-purple-300">
              ← Back
            </Link>
          </div>
          
          <div className="space-y-2">
            {users.map((u, index) => (
              <div
                key={u._id}
                className={`flex items-center justify-between p-3 rounded-xl border ${
                  user?._id === u._id 
                    ? 'border-purple-500 bg-purple-900/20' 
                    : 'border-purple-900/40 bg-black/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold w-8">
                    {getMedal(index) || `#${index + 1}`}
                  </span>
                  <div>
                    <p className="font-medium">
                      {u.username}
                      {user?._id === u._id && ' (You)'}
                    </p>
                    <div className="flex gap-3 text-xs text-purple-400">
                      <span>Level {u.level}</span>
                      <span>🔥 {u.streak || 0}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-mono text-purple-300">
                    {u.totalXp || u.xp} XP
                  </p>
                  {u.bestStreak > 0 && (
                    <p className="text-xs text-amber-400">Best: {u.bestStreak}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;