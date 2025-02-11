const express = require('express');
const app = express();
const port = 3000;
const routes = require('./Routes/routes');
const db = require('./db'); // Assuming this establishes a connection to a database
const cors = require('cors');
const userRoutes = require('./Routes/User'); // Changed variable name for clarity
const { jwtAuthMiddleware, generateToken } = require('./jwt');
const { Server } = require("socket.io");
const http = require('http');
const group = require('./Routes/GroupRoute');
const mess = require('./Schemas/Groups')
const scrapeLeetCode  = require('./webScrape/request');
// Create HTTP server
const server = http.createServer(app);
// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());
// Initialize Socket.io with CORS settings
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Update this to your frontend URL
    methods: ["GET", "POST"]
  }
});

// Handle Socket.io connections
// Handle Socket.io connections
io.on("connection", (socket) => {
  console.log("New client connected: " + socket.id);

  socket.on('message', async (content) => {
    console.log(content);
    try {
      // Find the group where the message should be added
      const groupName = 'Main'; // Use the appropriate group name or pass it from the client
      const group = await mess.findOne({ groupName : content.groupName });
      // console.log(group)
      if (group) {
        // Add the new message to the messages array of the found group
        group.messages.push({
          message : content.message,
          sender : content.sender,
          timestamp: new Date(),
        });
      
        // Save the updated group document
        await group.save();

        // Emit the message to all connected clients
        io.emit('message', { sender : content.sender, message : content.message, timestamp: new Date() });
      } else {
        console.error('Group not found');
      }
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log("Client disconnected: " + socket.id);
  });
});

// API endpoint to scrape submission times
app.post('/scrape', async (req, res) => {
  const { username } = req.body;
  if (!username) {
      return res.status(400).send('Username is required.');
  }
     console.log(username)
  try {
      // Call the scrape function
      const submissionTimes = await scrapeLeetCode(username);
        // if(submissionTimes[0])
       const bool  = submissionTimes
  
      res.status(200).json(bool);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Error scraping data.');
  }
});


app.use('/group' , group);
// Registering routes
app.use('/activity', jwtAuthMiddleware, routes); // Handles activity-related routes
app.use('/', userRoutes); // Handles user-related routes

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
});
