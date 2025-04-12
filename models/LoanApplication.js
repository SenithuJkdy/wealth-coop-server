const mongoose = require('mongoose');

const LoanApplicationSchema = new mongoose.Schema({
  loan_id: { type: String, unique: true, required: true },
  user_id: String, // Replaces cus_id
  account_id: String,
  loan_amount: Number,
  interest_rate: Number,
  credit_score: Number,
  income: Number,
  loan_limit: { type: String, enum: ['CF', 'NCF'] },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  prediction_time: Date
}, { timestamps: true });

module.exports = mongoose.model('LoanApplication', LoanApplicationSchema);
