const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Account = require('../models/Account');
const { registerUser, loginUser } = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);

// Get all users or by role in User Management
router.get('/', async (req, res) => {
  try {
    const filter = req.query.role ? { role: req.query.role } : {};

    const users = await User.aggregate([
      { $match: filter },

      {
        $lookup: {
          from: 'accounts', // must match the actual MongoDB collection name
          localField: 'user_id',
          foreignField: 'user_id',
          as: 'accountInfo',
        },
      },
      {
        $addFields: {
          account_number: {
            $ifNull: [{ $arrayElemAt: ['$accountInfo.account_number', 0] }, null],
          },
        },
      },
      {
        $project: {
          password_hash: 0,
          accountInfo: 0,
        },
      },
    ]);

    res.json(users);
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Failed to fetch users', details: err.message });
  }
});

// Get user by ID
router.get('/:user_id', async (req, res) => {
  try {
    const user = await User.findOne({ user_id: req.params.user_id }).select('-password_hash');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user', details: err.message });
  }
});

// Update user by ID
router.put('/:user_id', async (req, res) => {
  try {
    const { full_name, email, phone, password, role, account_status } = req.body;

    const user = await User.findOne({ user_id: req.params.user_id });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Check if new email is already in use
    if (email && email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ error: 'Email already in use' });
    }

    // Update only provided fields
    if (full_name) user.full_name = full_name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (role) user.role = role;
    if (account_status) user.account_status = account_status;
    if (password) user.password_hash = await bcrypt.hash(password, 10);

    await user.save();

    const updatedUser = await User.findOne({ user_id: req.params.user_id }).select('-password_hash');
    res.json({ message: 'User updated successfully', user: updatedUser });

  } catch (err) {
    res.status(500).json({ error: 'Failed to update user', details: err.message });
  }
});

  
  // Delete user by ID
router.delete('/:user_id', async (req, res) => {
  try {
    const user = await User.findOne({ user_id: req.params.user_id });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Find and delete the related account
    const account = await Account.findOne({ user_id: req.params.user_id });
    if (account) {
      await Account.deleteOne({ user_id: req.params.user_id });
    }

    await User.deleteOne({ user_id: req.params.user_id });

    res.json({
      message: 'User and associated account deleted successfully',
      user_id: req.params.user_id,
      account_number: account ? account.account_number : null
    });

  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user', details: err.message });
  }
});
  
module.exports = router;
