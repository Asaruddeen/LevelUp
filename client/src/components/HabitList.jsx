import React, { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const HabitList = ({ habits = [], setHabits, onUpdate }) => {
  const [newHabit, setNewHabit] = useState({
    title: '',
    xpReward: 15,
    timeLock: 'none'
  });

  // Safety check - ensure habits is an array
  const habitsList = Array.isArray(habits) ? habits : [];

  const handleAddHabit = async () => {
    if (!newHabit.title.trim()) {
      toast.error('Please enter a habit title');
      return;
    }

    try {
      const response = await api.post('/habits', newHabit);
      setHabits([...habitsList, response.data]);
      setNewHabit({ title: '', xpReward: 15, timeLock: 'none' });
      toast.success('Habit added!');
    } catch (error) {
      console.error('Add habit error:', error);
      if (error.response) {
        // server responded with a status outside 2xx
        toast.error(error.response.data?.message || `Failed to add habit (${error.response.status})`);
      } else if (error.request) {
        // no response received
        toast.error('Network error: could not reach server');
      } else {
        toast.error(error.message || 'Failed to add habit');
      }
    }
  };

  const handleCompleteHabit = async (habit) => {
    try {
      const response = await api.put(`/habits/${habit._id}/complete`);
      
      setHabits(habitsList.map(h => 
        h._id === habit._id ? response.data.habit : h
      ));
      
      toast.success(`+${habit.xpReward} XP!`);
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to complete habit');
    }
  };

  const handleDeleteHabit = async (id) => {
    try {
      await api.delete(`/habits/${id}`);
      setHabits(habitsList.filter(h => h._id !== id));
      toast.success('Habit deleted');
    } catch (error) {
      toast.error('Failed to delete habit');
    }
  };

  // If no habits, show empty state
  if (habitsList.length === 0) {
    return (
      <div className="glass-card">
        <div className="flex items-center gap-2 border-b border-purple-800/40 pb-2 mb-3">
          <span className="text-2xl">🔥</span>
          <span className="font-bold text-lg">Daily Habits</span>
        </div>
        <p className="text-center text-gray-400 py-4">No habits yet. Add your first habit below!</p>
        
        <div className="mt-4 grid grid-cols-4 gap-1">
          <input
            type="text"
            placeholder="new habit"
            value={newHabit.title}
            onChange={(e) => setNewHabit({ ...newHabit, title: e.target.value })}
            className="col-span-2 input-field"
          />
          <input
            type="number"
            value={newHabit.xpReward}
            onChange={(e) => setNewHabit({ ...newHabit, xpReward: parseInt(e.target.value) || 15 })}
            min="1"
            className="col-span-1 input-field"
          />
          <button
            onClick={handleAddHabit}
            className="col-span-1 bg-purple-900 hover:bg-purple-700 rounded-lg border border-purple-400 text-xl"
          >
            ➕
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card">
      <div className="flex items-center gap-2 border-b border-purple-800/40 pb-2 mb-3">
        <span className="text-2xl">🔥</span>
        <span className="font-bold text-lg">Daily Habits</span>
        <span className="ml-auto text-[10px] bg-purple-900/60 px-2 py-0.5 rounded-full">
          Time-lock
        </span>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto pr-1 scroll-custom">
        {habitsList.map((habit) => (
          <div
            key={habit._id}
            className="flex items-center justify-between p-3 rounded-xl border border-purple-900/40 bg-black/30"
          >
            <div>
              <p className="font-medium text-sm">{habit.title}</p>
              <div className="flex gap-2 text-[10px]">
                <span className="text-purple-400">streak {habit.streak || 0}</span>
                <span className="text-blue-400">⚡{habit.xpReward}</span>
              </div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => handleCompleteHabit(habit)}
                className="text-xs bg-green-900/70 hover:bg-green-800 px-3 py-1 rounded border border-green-500"
              >
                ✔
              </button>
              <button
                onClick={() => handleDeleteHabit(habit._id)}
                className="text-xs bg-red-900/70 hover:bg-red-800 px-3 py-1 rounded border border-red-500"
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-4 gap-1">
        <input
          type="text"
          placeholder="new habit"
          value={newHabit.title}
          onChange={(e) => setNewHabit({ ...newHabit, title: e.target.value })}
          className="col-span-2 input-field"
        />
        <input
          type="number"
          value={newHabit.xpReward}
          onChange={(e) => setNewHabit({ ...newHabit, xpReward: parseInt(e.target.value) || 15 })}
          min="1"
          className="col-span-1 input-field"
        />
        <button
          onClick={handleAddHabit}
          className="col-span-1 bg-purple-900 hover:bg-purple-700 rounded-lg border border-purple-400 text-xl"
        >
          ➕
        </button>
      </div>
    </div>
  );
};

export default HabitList;