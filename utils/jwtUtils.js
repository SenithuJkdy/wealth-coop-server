const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');

exports.generateToken = (user) => {
  return jwt.sign(
    {
      user_id: user.user_id,
      role: user.role,
      email: user.email
    },
    JWT_SECRET,
    { expiresIn: '2h' }
  );
};
