const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtAuthMiddleware   = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.secret_key);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  } 
}

const generateToken = (userData) => {
    return jwt.sign(userData , process.env.secret_key)
}

module.exports = {jwtAuthMiddleware, generateToken}