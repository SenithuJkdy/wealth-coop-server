const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../utils/jwtUtils');
const generateCustomId = require('../utils/generateCustomId');
const logAction = require('../utils/logAction'); // if used

exports.registerUser = async (req, res) => {
  try {
    const { full_name, email, phone, password, role } = req.body;

    if (!email || !password || !full_name || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already used' });

    const user_id = await generateCustomId('USR');
    const password_hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      user_id, full_name, email, phone, password_hash, role
    });

    const token = generateToken(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user_id,
      role,
      full_name,
      email
    });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = generateToken(user);

    await logAction(user.user_id, 'login', 'users', req.ip);

    res.json({
      message: 'Login successful',
      token,
      user_id: user.user_id,
      role: user.role,
      full_name: user.full_name,
      email: user.email
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
};
