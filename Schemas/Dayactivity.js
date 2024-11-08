const mongoose = require('mongoose');

// Schema for individual day activity
const daySchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true,
  },
  data: {
    type: Number,
    required: true,
    default: 0,
  },
  title:{
    type: String
  }
});

// Schema for the month's activity data
const activitySchema = new mongoose.Schema({
  username: {
    type: String,
    ref: 'User', // Reference to the User model
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  days: [daySchema], // Array of day activity objects
});

module.exports = mongoose.model('Activity', activitySchema);
