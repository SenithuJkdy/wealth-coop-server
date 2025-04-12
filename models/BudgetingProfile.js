const mongoose = require('mongoose');

const BudgetingProfileSchema = new mongoose.Schema({
  profile_id: { type: String, unique: true, required: true },
  user_id: String,
  monthly_income: Number,
  savings_goal: Number,
  monthly_expenses: Number,
  financial_tips: String
}, { timestamps: true });

module.exports = mongoose.model('BudgetingProfile', BudgetingProfileSchema);
