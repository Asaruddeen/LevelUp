import React, { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { format, isPast } from 'date-fns';

const TaskList = ({ tasks, setTasks, onUpdate }) => {
  const [newTask, setNewTask] = useState({
    title: '',
    deadline: '',
    xpReward: 20,
    penalty: 10
  });

  const handleAddTask = async () => {
    if (!newTask.title.trim() || !newTask.deadline) {
      toast.error('Please enter title and deadline');
      return;
    }

    try {
      const response = await api.post('/tasks', newTask);
      setTasks([...tasks, response.data]);
      setNewTask({ title: '', deadline: '', xpReward: 20, penalty: 10 });
      toast.success('Task added!');
    } catch (error) {
      console.error('Add task error:', error);
      if (error.response) {
        toast.error(error.response.data?.message || `Failed to add task (${error.response.status})`);
      } else if (error.request) {
        toast.error('Network error: could not reach server');
      } else {
        toast.error(error.message || 'Failed to add task');
      }
    }
  };

  const handleCompleteTask = async (task) => {
    try {
      const response = await api.put(`/tasks/${task._id}/complete`);
      
      setTasks(tasks.map(t => 
        t._id === task._id ? response.data.task : t
      ));
      
      toast.success(`+${task.xpReward} XP!`);
      onUpdate();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to complete task');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const isTaskMissed = (task) => {
    return !task.completed && isPast(new Date(task.deadline));
  };

  return (
    <div className="glass-card">
      <div className="flex items-center gap-2 border-b border-blue-800/40 pb-2 mb-3">
        <span className="text-2xl">📋</span>
        <span className="font-bold text-lg">Tasks</span>
        <span className="ml-auto text-[10px] bg-blue-900/60 px-2 py-0.5 rounded-full">
          Penalty -10xp
        </span>
      </div>

      <div className="space-y-3 max-h-72 overflow-y-auto pr-1 scroll-custom">
        {tasks.map((task) => {
          const missed = isTaskMissed(task);
          
          return (
            <div
              key={task._id}
              className={`flex items-center justify-between p-3 rounded-xl border ${
                missed ? 'border-red-700 bg-red-900/20' :
                task.completed ? 'border-green-700 bg-green-900/20' :
                'border-blue-900/40 bg-black/30'
              }`}
            >
              <div>
                <p className="font-medium text-sm">{task.title}</p>
                <div className="flex gap-2 text-[10px]">
                  <span className="text-blue-400">
                    due {format(new Date(task.deadline), 'MMM d, h:mm a')}
                  </span>
                  <span className="text-green-400">⚡{task.xpReward}</span>
                  {missed && <span className="text-red-400">-{task.penalty}XP</span>}
                </div>
              </div>
              <div className="flex gap-1">
                {!task.completed && !missed && (
                  <button
                    onClick={() => handleCompleteTask(task)}
                    className="text-xs bg-green-900/70 hover:bg-green-800 px-3 py-1 rounded border border-green-500"
                  >
                    ✔
                  </button>
                )}
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="text-xs bg-red-900/70 hover:bg-red-800 px-3 py-1 rounded border border-red-500"
                >
                  🗑
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 space-y-2">
        <div className="grid grid-cols-4 gap-1">
          <input
            type="text"
            placeholder="task"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="col-span-2 input-field"
          />
          <input
            type="datetime-local"
            value={newTask.deadline}
            onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
            className="col-span-2 input-field text-xs"
          />
        </div>
        
        <div className="grid grid-cols-3 gap-1">
          <input
            type="number"
            value={newTask.xpReward}
            onChange={(e) => setNewTask({ ...newTask, xpReward: parseInt(e.target.value) || 20 })}
            placeholder="xp"
            className="col-span-1 input-field"
          />
          <input
            type="number"
            value={newTask.penalty}
            onChange={(e) => setNewTask({ ...newTask, penalty: parseInt(e.target.value) || 10 })}
            placeholder="penalty"
            className="col-span-1 input-field"
          />
          <span className="col-span-1 text-[9px] text-blue-400/70 self-center">
            Missed = -{newTask.penalty}xp
          </span>
        </div>
        
        <button
          onClick={handleAddTask}
          className="w-full btn-secondary text-sm font-semibold"
        >
          + Add Task
        </button>
      </div>
    </div>
  );
};

export default TaskList;