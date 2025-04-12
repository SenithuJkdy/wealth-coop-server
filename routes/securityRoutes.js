const express = require('express');
const router = express.Router();
const SecurityAlert = require('../models/SecurityAlert');
const User = require('../models/User');
const generateCustomId = require('../utils/generateCustomId');

// Create a security alert (e.g. triggered by system)
router.post('/', async (req, res) => {
  try {
    const { user_id, transaction_id, alert_type } = req.body;

    const user = await User.findOne({ user_id });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const alert_id = await generateCustomId('ALERT');

    const alert = new SecurityAlert({
      alert_id,
      user_id,
      transaction_id,
      alert_type
    });

    await alert.save();
    res.status(201).json({ message: 'Security alert created', alert_id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create security alert', details: err.message });
  }
});

// Admin/staff view all alerts
router.get('/', async (req, res) => {
  try {
    const { user_id } = req.query;

    const user = await User.findOne({ user_id });
    if (!user || user.role === 'customer') {
      return res.status(403).json({ error: 'Access denied. Staff/admin only.' });
    }

    const alerts = await SecurityAlert.find().sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch alerts', details: err.message });
  }
});

// Update alert status
router.put('/:alert_id/status', async (req, res) => {
  try {
    const { status, user_id } = req.body;
    const user = await User.findOne({ user_id });

    if (!user || user.role === 'customer') {
      return res.status(403).json({ error: 'Only staff/admin can update alerts' });
    }

    const updated = await SecurityAlert.findOneAndUpdate(
      { alert_id: req.params.alert_id },
      { status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Alert not found' });

    res.json({ message: 'Alert status updated', alert: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update alert', details: err.message });
  }
});

module.exports = router;