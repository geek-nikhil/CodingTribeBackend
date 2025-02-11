const mongoose = require('mongoose');

// Check if the 'user' model is already compiled, and if so, delete it
if (mongoose.models['user']) {
  mongoose.deleteModel('user');
}

// Define the schema
const personSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,   // 'unique' index on username
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  leetcodeusername: {
    type: String,
  }
});

// Export the model
module.exports = mongoose.model('user', personSchema);
