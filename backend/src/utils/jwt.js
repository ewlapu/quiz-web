const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

const generateToken = (userId) => {
  return jwt.sign({ userId }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, jwtConfig.secret);
  } catch (error) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };
