const mongoose = require('mongoose');

// Check if the 'user' model is already compiled, and if so, delete it


// Define the schema
const peopleSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,   // 'unique' index on username
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  }
});

// Export the model
module.exports = mongoose.model('people', peopleSchema);
