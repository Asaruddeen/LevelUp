import express from 'express';
import { protect } from '../middleware/auth.js';
import Reminder from '../models/Reminder.js';

const router = express.Router();

// Get all reminders
router.get('/', protect, async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user._id });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create reminder
router.post('/', protect, async (req, res) => {
  try {
    const { title, datetime } = req.body;
    
    const reminder = await Reminder.create({
      user: req.user._id,
      title,
      datetime
    });
    
    res.status(201).json(reminder);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark reminder as completed
router.put('/:id/complete', protect, async (req, res) => {
  try {
    const reminder = await Reminder.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    
    reminder.isCompleted = !reminder.isCompleted;
    await reminder.save();
    
    res.json(reminder);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete reminder
router.delete('/:id', protect, async (req, res) => {
  try {
    await Reminder.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: 'Reminder deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;