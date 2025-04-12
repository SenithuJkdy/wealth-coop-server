const mongoose = require('mongoose');

const LoanPredictionSchema = new mongoose.Schema({
  prediction_id: { type: String, unique: true, required: true },
  application_id: String, // loan_id
  predicted_repayment_date: Date
}, { timestamps: true });

module.exports = mongoose.model('LoanPrediction', LoanPredictionSchema);
