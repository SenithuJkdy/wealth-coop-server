const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  transaction_id: { type: String, unique: true, required: true },
  account_id: String,
  amount: Number,
  type: String,
  date: Date,
  status: String
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
