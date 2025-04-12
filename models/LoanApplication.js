const mongoose = require('mongoose');

const LoanApplicationSchema = new mongoose.Schema({
  loan_id: { type: String, unique: true, required: true },
  cus_id: String,
  account_id: String,
  application_date: Date,
  amount: Number,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('LoanApplication', LoanApplicationSchema);
