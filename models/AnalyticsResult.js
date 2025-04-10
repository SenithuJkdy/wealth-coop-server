const mongoose = require('mongoose');

const AnalyticsResultSchema = new mongoose.Schema({
    result_id: { type: String, unique: true, required: true },
    loan_id: String,
    forecasted_amount: Number,
    predicted_payment: Number,
    default_score: Number
  }, { timestamps: true });

module.exports = mongoose.model('AnalyticsResult', AnalyticsResultSchema);