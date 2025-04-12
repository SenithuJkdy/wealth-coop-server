const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  transaction_id: { type: String, unique: true, required: true },
  account_id: String,
  transaction_type: { type: String, enum: ['Deposit', 'Withdrawal'], required: true },
  amount: Number,
  recipient_account: String, // optional, for future transfer support
  status: { type: String, enum: ['Completed', 'Failed'], default: 'Completed' },
  transaction_date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
