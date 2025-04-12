const mongoose = require('mongoose');

const LoanForecastSchema = new mongoose.Schema({
  forecast_id: { type: String, unique: true, required: true },
  branch_id: String,
  predicted_loan_amount: Number,
  prediction_date: Date,
  model_version: String
}, { timestamps: true });

module.exports = mongoose.model('LoanForecast', LoanForecastSchema);
