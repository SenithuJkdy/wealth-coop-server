const mongoose = require('mongoose');

const LoanApprovalSchema = new mongoose.Schema({
  approval_id: { type: String, unique: true, required: true },
  loan_id: String,
  staff_id: String,
  approval_status: String,
  approval_date: Date
}, { timestamps: true });

module.exports = mongoose.model('LoanApproval', LoanApprovalSchema);

  