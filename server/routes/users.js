import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Get leaderboard (top users by level and XP)
router.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.find()
      .select('username level xp totalXp streak bestStreak')
      .sort({ level: -1, totalXp: -1 })
      .limit(50);
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get daily motivation
router.get('/motivation', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const now = new Date();
    
    const motivations = [
      "The only bad workout is the one that didn't happen.",
      "Small progress is still progress.",
      "Discipline is choosing what you want now for what you want most.",
      "Your future self is watching you right now.",
      "Don't stop when you're tired, stop when you're done.",
      "Every expert was once a beginner.",
      "The habit you're avoiding today is the success you'll miss tomorrow.",
      "Wake up with determination, go to bed with satisfaction.",
      "Consistency is more important than perfection.",
      "Your only competition is who you were yesterday."
    ];
    
    // Check if we need a new motivation (24 hours passed)
    if (!user.lastMotivationDate || (now - new Date(user.lastMotivationDate)) > 24 * 60 * 60 * 1000) {
      const randomIndex = Math.floor(Math.random() * motivations.length);
      user.dailyMotivation = motivations[randomIndex];
      user.lastMotivationDate = now;
      await user.save();
    }
    
    res.json({ motivation: user.dailyMotivation });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;