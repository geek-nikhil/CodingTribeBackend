const express = require('express');
const router = express.Router();
const User = require('../Schemas/User');
const { jwtAuthMiddleware ,generateToken} = require('../jwt');
router.get('/signup/:Name/:leetcodeUsername/:Email/:Password', async (req, res) => {
  const { Name , Email ,Password ,leetcodeUsername} = req.params;
  try {
    let user = await User.findOne({ username: Name });
        if (user) {
      return res.status(500).json({ error: 'User already exists' });
    }
    console.log(Password);
       user = await User.create({
        username: Name,
        email: Email,
        password: Password,
        leetcodeusername : leetcodeUsername,
      });
     const payload = {
      username: user.username,
      email: user.email,
    };
    const token = generateToken(payload);
   console.log(user);
   return res.status(200).json({ user : user  , token : token})
}catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' })
  }
})

router.get('/login/:Name/:Password', async (req, res) => {
  const { Name , Password } = req.params;
  console.log(Name + " " + Password)
  try{  
  let user = await User.findOne({ username: Name });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  if (user.password === Password) {
    const payload = {
      username: user.username,
      email: user.email,
    };
    const token = generateToken(payload);
    return res.status(200).json({ user : user  , token : token})
  }
  else {
    throw new ({ error: 'Wrong password ' });
  }       
  }catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' })
  }
})


module.exports = router;
