const mongoose = require('mongoose');

// Replace 'yourDatabaseName' with the name of your local database
mongoose.connect('mongodb://127.0.0.1:27017/backend', {
})
.then(() => {
  console.log('Connected to MongoDB locally!');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

