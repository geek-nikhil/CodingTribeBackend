const mongoose = require('mongoose');

// Message Sub-Schema
const Message = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Members Sub-Schema
const Members = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
});

// Completed Task Sub-Schema (Placeholder)
const Completed = new mongoose.Schema({
   username: {
    type: String,
    required: true,
  }
});

// Task Sub-Schema (Placeholder)
// const Task = new mongoose.Schema({
//   description: {
//     type: String,
//     required: true,
//   }
// });

// Main Group Schema
const GroupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
    unique: true,
  },
  messages: [Message],
  members: [Members],
  task: {
    completed: [Completed],
    date: {
      type: Date,
    },
      tasks : {
        type: Number,
        // required: true,
      }
  }
});

module.exports = mongoose.model('Group', GroupSchema);
