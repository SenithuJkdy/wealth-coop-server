const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  account_id: { type: String, unique: true, required: true },
  cus_id: String,
  account_type: String,
  balance: Number
}, { timestamps: true });

module.exports = mongoose.model('Account', AccountSchema);
