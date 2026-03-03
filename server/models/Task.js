import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  xpReward: {
    type: Number,
    default: 20
  },
  penalty: {
    type: Number,
    default: 10
  },
  deadline: {
    type: Date,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: null
  },
  missed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Check if task is missed
taskSchema.methods.isMissed = function() {
  if (this.completed) return false;
  return new Date() > new Date(this.deadline);
};

// Apply penalty if missed
taskSchema.methods.applyPenalty = async function() {
  if (this.isMissed() && !this.missed) {
    this.missed = true;
    return this.penalty;
  }
  return 0;
};

const Task = mongoose.model('Task', taskSchema);
export default Task;