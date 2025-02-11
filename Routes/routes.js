const express = require('express');
const router = express.Router();
const Month = require('../Schemas/Dayactivity'); // Adjust the path as needed
const User = require('../Schemas/User');

// Helper function to get current date information
const getCurrentDateInfo = () => {
  const now = new Date();
  return {
    day: now.getDate(),
    month: now.getMonth() + 1, // Months are 0-indexed in JavaScript
    year: now.getFullYear(),
  };
};

// POST route to submit activity
router.post('/submit', async (req, res) => {
  let { day, month, year } = getCurrentDateInfo();
  const { username, title } = req.body; // Expecting username and title from request body
  
  try {
    // Step 1: Check for the user, create if not exists
    let user = await User.findOne({ username });
    console.log(username);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Step 2: Check for the month entry
    let monthEntry = await Month.findOne({ username, month });
    console.log(monthEntry);

    // Step 3: If month entry doesn't exist, create a new one
    if (!monthEntry) {
      monthEntry = new Month({
        username,
        month,
        year,
        days: [
          {
            day,
            data: 1,
            title, // Store the title directly
          },
        ],
      });
    } else {
      // Step 4: Check if today's day entry exists
      const dayEntry = monthEntry.days.find((d) => d.day === day);

      if (!dayEntry) {
        // If the day doesn't exist, create a new entry
        monthEntry.days.push({
          day,
          data: 1, // Start count at 1 since it's being created
          title, // Add the title
        });
      } else {
        // If the day already exists, update its data and add the title if not already present
        dayEntry.data += 1; // Increment the existing count by 1
        if (!dayEntry.title) {
          dayEntry.title = title; // Store the title if not already present
        }
      }
    }

    // Save the updated month entry
    await monthEntry.save();

    // Return the month's data, including today's update
    res.json({
      message: 'Month updated successfully',
      monthEntry,
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Server Error');
  }
});

// GET route to return all month entries
router.get('/all/:name', async (req, res) => {
  try {
    const { name } = req.params;
    let user = await User.findOne({ username: name });

    // Check for user existence
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const months = await Month.find({ username: name });
    console.log("Fetched months for user:", name);
    return res.json(months);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
