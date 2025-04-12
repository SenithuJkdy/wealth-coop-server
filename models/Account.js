const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  account_id: { type: String, unique: true, required: true },
  user_id: { type: String, required: true }, 
  account_number: { type: String, unique: true },
  account_type: {type: String,  enum: ['Savings', 'Current']},  // 'Savings', 'Current', etc.
  balance: { type: Number, default: 0 },
  currency: { type: String, default: 'LKR' }
}, { timestamps: true });

module.exports = mongoose.model('Account', AccountSchema);
