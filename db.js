const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://nikhilraikwar846:iB7DrCv2H6aqtRFm@cluster0.a8u4r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {

})
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));