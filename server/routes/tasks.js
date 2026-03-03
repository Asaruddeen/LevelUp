import express from 'express';
import { protect } from '../middleware/auth.js';
import Task from '../models/Task.js';
import User from '../models/User.js';

const router = express.Router();

// Get all tasks
router.get('/', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create task
router.post('/', protect, async (req, res) => {
  try {
    const { title, deadline, xpReward, penalty } = req.body;
    
    const task = await Task.create({
      user: req.user._id,
      title,
      deadline,
      xpReward: xpReward || 20,
      penalty: penalty || 10
    });
    
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Complete task
router.put('/:id/complete', protect, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    if (task.completed) {
      return res.status(400).json({ message: 'Task already completed' });
    }
    
    if (task.isMissed()) {
      return res.status(400).json({ message: 'Task deadline has passed' });
    }
    
    task.completed = true;
    task.completedAt = new Date();
    await task.save();
    
    // Update user XP
    const user = await User.findById(req.user._id);
    user.xp += task.xpReward;
    user.totalXp += task.xpReward;
    
    // Calculate level up
    while (user.xp >= user.level * 1000) {
      user.xp -= user.level * 1000;
      user.level += 1;
    }
    
    await user.save();
    
    res.json({ task, user: { xp: user.xp, level: user.level } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// FIX: Add the missing check-missed route
router.post('/check-missed', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ 
      user: req.user._id, 
      completed: false,
      missed: false
    });
    
    let totalPenalty = 0;
    const missedTasks = [];
    
    for (const task of tasks) {
      if (task.isMissed()) {
        task.missed = true;
        await task.save();
        totalPenalty += task.penalty;
        missedTasks.push(task);
      }
    }
    
    if (totalPenalty > 0) {
      const user = await User.findById(req.user._id);
      user.xp = Math.max(0, user.xp - totalPenalty);
      user.missedCount = (user.missedCount || 0) + missedTasks.length;
      await user.save();
      
      return res.json({ 
        totalPenalty, 
        missedCount: missedTasks.length,
        user: { xp: user.xp, level: user.level, missedCount: user.missedCount } 
      });
    }
    
    res.json({ totalPenalty: 0, missedCount: 0 });
  } catch (error) {
    console.error('Check missed tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete task
router.delete('/:id', protect, async (req, res) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;