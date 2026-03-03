import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const ReminderList = ({ reminders, setReminders }) => {
  const [newReminder, setNewReminder] = useState({
    title: '',
    datetime: ''
  });

  const handleAddReminder = async () => {
    if (!newReminder.title.trim() || !newReminder.datetime) {
      toast.error('Please enter reminder name and date');
      return;
    }

    try {
      const response = await axios.post('/api/reminders', newReminder);
      setReminders([...reminders, response.data]);
      setNewReminder({ title: '', datetime: '' });
      toast.success('Reminder set!');
    } catch (error) {
      toast.error('Failed to add reminder');
    }
  };

  const handleDeleteReminder = async (id) => {
    try {
      await axios.delete(`/api/reminders/${id}`);
      setReminders(reminders.filter(r => r._id !== id));
      toast.success('Reminder deleted');
    } catch (error) {
      toast.error('Failed to delete reminder');
    }
  };

  const handleToggleComplete = async (reminder) => {
    try {
      const response = await axios.put(`/api/reminders/${reminder._id}/complete`);
      setReminders(reminders.map(r => 
        r._id === reminder._id ? response.data : r
      ));
    } catch (error) {
      toast.error('Failed to update reminder');
    }
  };

  return (
    <div className="glass-card">
      <div className="flex items-center gap-2 border-b border-amber-700/40 pb-2 mb-3">
        <span className="text-2xl">⏰</span>
        <span className="font-bold text-lg">Reminders</span>
        <span className="ml-auto text-[10px] bg-amber-900/60 px-2 py-0.5 rounded-full">
          Just notify
        </span>
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scroll-custom">
        {reminders.map((reminder) => (
          <div
            key={reminder._id}
            className={`flex items-center justify-between p-2 rounded-lg border border-amber-800/50 bg-black/40 ${
              reminder.isCompleted ? 'opacity-50' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={reminder.isCompleted}
                onChange={() => handleToggleComplete(reminder)}
                className="w-4 h-4 accent-amber-500"
              />
              <div>
                <span className={`text-sm font-medium ${reminder.isCompleted ? 'line-through' : ''}`}>
                  ⏰ {reminder.title}
                </span>
                <p className="text-[9px] text-amber-400">
                  {format(new Date(reminder.datetime), 'MMM d, yyyy h:mm a')}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleDeleteReminder(reminder._id)}
              className="text-xs bg-red-900/70 px-3 py-1 rounded border border-red-500"
            >
              🗑
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        <div className="grid grid-cols-4 gap-1">
          <input
            type="text"
            placeholder="reminder"
            value={newReminder.title}
            onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
            className="col-span-2 input-field"
          />
          <input
            type="datetime-local"
            value={newReminder.datetime}
            onChange={(e) => setNewReminder({ ...newReminder, datetime: e.target.value })}
            className="col-span-2 input-field text-xs"
          />
        </div>
        
        <button
          onClick={handleAddReminder}
          className="w-full bg-amber-900 hover:bg-amber-700 py-2 rounded-lg border border-amber-500 text-sm font-semibold"
        >
          + Set Reminder
        </button>
        
        <p className="text-[9px] text-amber-400/60">
          Reminders don't affect XP — just so you never forget
        </p>
      </div>
    </div>
  );
};

export default ReminderList;