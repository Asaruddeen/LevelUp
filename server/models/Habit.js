import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  xpReward: {
    type: Number,
    default: 15
  },
  streak: {
    type: Number,
    default: 0
  },
  bestStreak: {
    type: Number,
    default: 0
  },
  timeLock: {
    type: String,
    default: 'none'
  },
  lastCompletedDate: {
    type: Date,
    default: null
  },
  completedDates: [{
    type: Date
  }],
  missedDates: [{
    type: Date
  }],
  penalty: {
    type: Number,
    default: 5
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Check if habit can be completed (time-based logic)
habitSchema.methods.canComplete = function() {
  if (this.timeLock === 'none') return true;
  
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const [lockHour, lockMinute] = this.timeLock.split(':').map(Number);
  
  // For wake-up habits (before specific time)
  if (this.title.toLowerCase().includes('wake')) {
    return (currentHours < lockHour) || (currentHours === lockHour && currentMinutes < lockMinute);
  }
  
  // For sleep habits (after specific time)
  if (this.title.toLowerCase().includes('sleep')) {
    return (currentHours > lockHour) || (currentHours === lockHour && currentMinutes > lockMinute);
  }
  
  return true;
};

// Check if habit is missed
habitSchema.methods.isMissed = function() {
  if (!this.timeLock || this.timeLock === 'none') return false;
  if (this.lastCompletedDate) {
    const lastCompleted = new Date(this.lastCompletedDate);
    const today = new Date();
    if (lastCompleted.toDateString() === today.toDateString()) return false;
  }
  
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const [lockHour, lockMinute] = this.timeLock.split(':').map(Number);
  
  // Check if time has passed for the habit
  if (this.title.toLowerCase().includes('wake')) {
    return (currentHours > lockHour) || (currentHours === lockHour && currentMinutes > lockMinute);
  }
  
  if (this.title.toLowerCase().includes('sleep')) {
    return (currentHours < lockHour) || (currentHours === lockHour && currentMinutes < lockMinute);
  }
  
  return false;
};

const Habit = mongoose.model('Habit', habitSchema);
export default Habit;