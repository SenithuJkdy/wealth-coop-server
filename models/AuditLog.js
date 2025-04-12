const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  log_id: { type: String, unique: true, required: true },
  user_id: String,
  action: String,           // e.g. 'login', 'loan_approval'
  target_table: String,     // e.g. 'loan_applications'
  ip_address: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
