const mongoose = require('mongoose');

const SecurityAlertSchema = new mongoose.Schema({
  alert_id: { type: String, unique: true, required: true },
  user_id: String,
  transaction_id: String, // optional — if not using transactions yet, you can allow null
  alert_type: { type: String, enum: ['Fraud', 'LoginAttempt'], required: true },
  status: { type: String, enum: ['Pending', 'Reviewed'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('SecurityAlert', SecurityAlertSchema);
