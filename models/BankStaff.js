const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
  staff_id: { type: String, unique: true, required: true },
  name: String,
  role: String,
  email: { type: String, unique: true },
  contact_number: String,
  password: String
}, { timestamps: true });

module.exports = mongoose.model('BankStaff', StaffSchema);

