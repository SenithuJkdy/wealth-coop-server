const express = require('express');
const router = express.Router();
const SupportTicket = require('../models/SupportTicket');
const User = require('../models/User');
const generateCustomId = require('../utils/generateCustomId');

// Submit a support ticket
router.post('/', async (req, res) => {
  try {
    const { user_id, issue_category, description } = req.body;

    const user = await User.findOne({ user_id });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const ticket_id = await generateCustomId('TICKET');

    const ticket = new SupportTicket({
      ticket_id,
      user_id,
      issue_category,
      description
    });

    await ticket.save();
    res.status(201).json({ message: 'Ticket submitted', ticket_id });

  } catch (err) {
    res.status(500).json({ error: 'Failed to submit ticket', details: err.message });
  }
});

// Admin/Staff: View all tickets
router.get('/', async (req, res) => {
  try {
    const { user_id } = req.query;

    const user = await User.findOne({ user_id });
    if (!user || user.role === 'customer') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const tickets = await SupportTicket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tickets', details: err.message });
  }
});

// Update ticket status (admin/staff)
router.put('/:ticket_id/status', async (req, res) => {
  try {
    const { ticket_id } = req.params;
    const { status, user_id } = req.body;

    const user = await User.findOne({ user_id });
    if (!user || user.role === 'customer') {
      return res.status(403).json({ error: 'Only staff/admin can update tickets' });
    }

    const ticket = await SupportTicket.findOneAndUpdate(
      { ticket_id },
      { status },
      { new: true }
    );

    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

    res.json({ message: 'Ticket updated', ticket });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update ticket', details: err.message });
  }
});

module.exports = router;