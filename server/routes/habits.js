import express from 'express';
import { protect } from '../middleware/auth.js';
import Habit from '../models/Habit.js';
import User from '../models/User.js';

const router = express.Router();

// Get all habits for user
router.get('/', protect, async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id, isActive: true });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create habit
router.post('/', protect, async (req, res) => {
  try {
    const { title, xpReward, timeLock } = req.body;
    
    const habit = await Habit.create({
      user: req.user._id,
      title,
      xpReward: xpReward || 15,
      timeLock: timeLock || 'none'
    });
    
    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Complete habit
router.put('/:id/complete', protect, async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    
    const today = new Date();
    const todayStr = today.toDateString();
    
    // Check if already completed today
    if (habit.lastCompletedDate) {
      const lastCompleted = new Date(habit.lastCompletedDate);
      if (lastCompleted.toDateString() === todayStr) {
        return res.status(400).json({ message: 'Habit already completed today' });
      }
    }
    
    // Check time lock
    if (!habit.canComplete()) {
      return res.status(400).json({ message: 'Cannot complete habit at this time' });
    }
    
    // Update habit
    habit.streak += 1;
    habit.bestStreak = Math.max(habit.bestStreak, habit.streak);
    habit.lastCompletedDate = today;
    habit.completedDates.push(today);
    await habit.save();
    
    // Update user XP
    const user = await User.findById(req.user._id);
    user.xp += habit.xpReward;
    user.totalXp += habit.xpReward;
    user.streak = habit.streak;
    user.bestStreak = Math.max(user.bestStreak, habit.streak);
    user.lastActive = today;
    
    // Calculate level up
    while (user.xp >= user.level * 1000) {
      user.xp -= user.level * 1000;
      user.level += 1;
    }
    
    await user.save();
    
    res.json({ habit, user: { xp: user.xp, level: user.level, streak: user.streak } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete habit
router.delete('/:id', protect, async (req, res) => {
  try {
    await Habit.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: 'Habit deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;