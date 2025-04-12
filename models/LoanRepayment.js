const mongoose = require('mongoose');

const LoanRepaymentSchema = new mongoose.Schema({
  repayment_id: { type: String, unique: true, required: true },
  loan_id: String,       // loan_id from LoanApplication
  user_id: String,       // user making payment
  amount_paid: Number,
  payment_date: Date
}, { timestamps: true });

module.exports = mongoose.model('LoanRepayment', LoanRepaymentSchema);
