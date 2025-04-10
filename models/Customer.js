const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  cus_id: { type: String, unique: true, required: true },
  name: String,
  email: { type: String, unique: true },
  address: String,
  phone: String,
  password: String // Encrypted
}, { timestamps: true });

module.exports = mongoose.model('Customer', CustomerSchema);