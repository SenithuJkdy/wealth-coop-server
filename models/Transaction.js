const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  transaction_id: { type: String, unique: true, required: true },
  account_id: String,
  transaction_type: { 
    type: String, 
    enum: ['Deposit', 'Withdrawal', 'Bill Payment'],
    required: true 
  },
  amount: Number,
  recipient_account: String,
  status: { 
    type: String, 
    enum: ['Completed', 'Failed', 'Pending'],
    default: 'Completed' 
  },
  transaction_date: { type: Date, default: Date.now },
  bill_details: {
    bill_type: {
      type: String,
      enum: ['electricity', 'water', 'telecom', 'tv', 'other']
    },
    provider: String,
    account_number: String
  },
  reference_number: String,
  beneficiary_details: {
    beneficiary_name: String,
    beneficiary_bank: String,
    purpose: String,
    description: String
  }
}, { 
  timestamps: true,
  indexes: [
    { fields: { account_id: 1 } },
    { fields: { transaction_date: -1 } },
    { fields: { transaction_type: 1 } }
  ]
});

TransactionSchema.pre('save', async function(next) {
  if (!this.transaction_id) {
    this.transaction_id = await generateTransactionId(this.transaction_type);
  }
  next();
});

TransactionSchema.virtual('formatted_date').get(function() {
  return this.transaction_date.toLocaleString();
});

module.exports = mongoose.model('Transaction', TransactionSchema);

async function generateTransactionId(type) {
  const prefix = type === 'Bill Payment' ? 'BP' : 'TXN';
  const count = await mongoose.models.Transaction.countDocuments();
  return `${prefix}-${(count + 1).toString().padStart(6, '0')}`;
}