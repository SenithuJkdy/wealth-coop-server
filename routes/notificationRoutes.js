const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const generateCustomId = require('../utils/generateCustomId');

// Send a notification
router.post('/', async (req, res) => {
  try {
    const { receiver_id, message, type } = req.body;

    const notification_id = await generateCustomId('NOTI');

    const newNotification = new Notification({
      notification_id,
      receiver_id,
      message,
      type,
      read: false,
      date: new Date()
    });

    await newNotification.save();
    res.status(201).json({ message: 'Notification sent', notification_id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send notification', details: err.message });
  }
});

// Get all notifications
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications', details: err.message });
  }
});

// Get notifications for a specific receiver (customer or staff)
router.get('/:receiver_id', async (req, res) => {
  try {
    const notifications = await Notification.find({ receiver_id: req.params.receiver_id });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user notifications', details: err.message });
  }
});

module.exports = router;
