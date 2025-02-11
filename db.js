const mongoose = require('mongoose');

// Replace 'yourDatabaseName' with the name of your local database
mongoose.connect('mongodb+srv://Nikhil:Anam846@cluster0.tgufu.mongodb.net/condingtribe', {
})
.then(() => {
  console.log('Connected to MongoDB locally!');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

