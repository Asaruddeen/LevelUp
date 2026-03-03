import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import api from '../services/api'; // use the configured instance with interceptors
import HabitList from '../components/HabitList';
import TaskList from '../components/TaskList';
import ReminderList from '../components/ReminderList';
import Stats from '../components/Stats';
import RecoveryBanner from '../components/RecoveryBanner';
import MotivationQuote from '../components/MotivationQuote';
import Header from '../components/Header';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [habits, setHabits] = useState([]); // Initialize as empty array
  const [tasks, setTasks] = useState([]); // Initialize as empty array
  const [reminders, setReminders] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [motivation, setMotivation] = useState('');
  const [error, setError] = useState(null);

  // only fetch once we know the user is authenticated; prevents early 401s
  useEffect(() => {
    if (!user) return; // don't try to load anything if there is no user yet

    fetchAllData();
    checkMissedTasks();
    fetchMotivation();

    const interval = setInterval(() => {
      checkMissedTasks();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all data with error handling for each
      let habitsData = [];
      let tasksData = [];
      let remindersData = [];
      
      try {
        const habitsRes = await api.get('/habits');
        habitsData = Array.isArray(habitsRes.data) ? habitsRes.data : [];
      } catch (err) {
        // api interceptor will show a more helpful message (401 => redirect, etc.)
        console.error('Failed to fetch habits:', err);
        if (!err.response || err.response.status !== 401) {
          toast.error('Failed to load habits');
        }
      }
      
      try {
        const tasksRes = await api.get('/tasks');
        tasksData = Array.isArray(tasksRes.data) ? tasksRes.data : [];
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
        if (!err.response || err.response.status !== 401) {
          toast.error('Failed to load tasks');
        }
      }
      
      try {
        const remindersRes = await api.get('/reminders');
        remindersData = Array.isArray(remindersRes.data) ? remindersRes.data : [];
      } catch (err) {
        console.error('Failed to fetch reminders:', err);
      }
      
      setHabits(habitsData);
      setTasks(tasksData);
      setReminders(remindersData);
      
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setError('Failed to load dashboard data');
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const fetchMotivation = async () => {
    try {
      const response = await api.get('/users/motivation');
      setMotivation(response.data.motivation || 'Stay consistent!');
    } catch (error) {
      console.error('Failed to fetch motivation');
      setMotivation('Stay consistent and keep leveling up!');
    }
  };

  const checkMissedTasks = async () => {
    try {
      await api.post('/tasks/check-missed');
      // Refresh tasks after checking
      const tasksRes = await api.get('/tasks');
      setTasks(Array.isArray(tasksRes.data) ? tasksRes.data : []);
    } catch (error) {
      console.error('Failed to check missed tasks:', error);
      // Don't show toast for this, it's a background operation
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Calculate missed count safely
  const missedCount = Array.isArray(tasks) 
    ? tasks.filter(t => !t.completed && new Date(t.deadline) < new Date()).length 
    : 0;
    
  const recoveryNeeded = Math.max(0, 3 - missedCount);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card text-center">
          <h2 className="text-xl text-red-400 mb-4">Error Loading Dashboard</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={fetchAllData}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a12]">
      <div className="max-w-md mx-auto w-full px-3 py-4 space-y-4">
        <Header user={user} onLogout={handleLogout} />
        <MotivationQuote quote={motivation} />
        <Stats 
          user={user} 
          missedCount={missedCount}
          habitsCount={habits.length}
          tasksCount={tasks.length}
        />
        <RecoveryBanner 
          missedCount={missedCount} 
          recoveryNeeded={recoveryNeeded}
        />
        <HabitList 
          habits={habits} 
          setHabits={setHabits}
          onUpdate={fetchAllData}
        />
        <TaskList 
          tasks={tasks} 
          setTasks={setTasks}
          onUpdate={fetchAllData}
        />
        <ReminderList 
          reminders={reminders} 
          setReminders={setReminders}
        />
      </div>
    </div>
  );
};

export default Dashboard;