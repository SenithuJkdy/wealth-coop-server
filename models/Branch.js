const mongoose = require('mongoose');

const BranchSchema = new mongoose.Schema({
  branch_id: { type: String, unique: true, required: true },
  branch_name: String,
  region: String,
  address: String
}, { timestamps: true });

module.exports = mongoose.model('Branch', BranchSchema);
