const mongoose = require("mongoose");

const BillPaymentSchema = new mongoose.Schema({
  transaction_id: {
    type: String,
    required: true,
    unique: true
  },
  account_id: {
    type: String,
    required: true
  },
  bill_type: {
    type: String,
    enum: ["electricity", "water", "telecom", "tv", "other"],
    required: true
  },
  provider: {
    type: String,
    required: true
  },
  account_number: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 1
  },
  reference_number: String,
  status: {
    type: String,
    enum: ["Pending", "Completed", "Failed"],
    default: "Pending"
  },
  scheduled_at: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("BillPayment", BillPaymentSchema);