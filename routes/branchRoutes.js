const express = require('express');
const router = express.Router();
const Branch = require('../models/Branch');
const User = require('../models/User');
const generateCustomId = require('../utils/generateCustomId');

// Add a new branch (admin only)
router.post('/', async (req, res) => {
  try {
    const { branch_name, region, address, user_id } = req.body;

    const user = await User.findOne({ user_id });
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admin can add branches' });
    }

    const branch_id = await generateCustomId('BRANCH');

    const branch = new Branch({
      branch_id,
      branch_name,
      region,
      address
    });

    await branch.save();
    res.status(201).json({ message: 'Branch created', branch_id });

  } catch (err) {
    res.status(500).json({ error: 'Failed to create branch', details: err.message });
  }
});

// Get all branches
router.get('/', async (req, res) => {
  try {
    const branches = await Branch.find();
    res.json(branches);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch branches', details: err.message });
  }
});

module.exports = router;