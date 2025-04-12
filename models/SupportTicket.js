const mongoose = require('mongoose');

const SupportTicketSchema = new mongoose.Schema({
  ticket_id: { type: String, unique: true, required: true },
  user_id: { type: String, required: true },
  issue_category: String,  // e.g., 'Login', 'Loan', 'Repayment'
  description: String,
  status: { type: String, enum: ['Open', 'In Progress', 'Resolved'], default: 'Open' },
}, { timestamps: true });

module.exports = mongoose.model('SupportTicket', SupportTicketSchema);
