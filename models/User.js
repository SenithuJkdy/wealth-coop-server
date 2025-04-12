const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  user_id: { type: String, unique: true, required: true }, // Use 'USR001' style IDs
  full_name: String,
  email: { type: String, unique: true },
  phone: { type: String, unique: true },
  password_hash: String,
  role: { type: String, enum: ['customer', 'staff', 'admin'] },
  account_status: { type: String, enum: ['Active', 'Suspended'], default: 'Active' },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
