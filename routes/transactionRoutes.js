const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Account = require('../models/Account');
const generateCustomId = require('../utils/generateCustomId');

// Create a transaction (Deposit or Withdrawal)
router.post('/', async (req, res) => {
  try {
    const { account_id, transaction_type, amount } = req.body;

    const account = await Account.findOne({ account_id });
    if (!account) return res.status(404).json({ error: 'Account not found' });

    if (transaction_type === 'Withdrawal') {
      if (account.balance < amount) {
        return res.status(400).json({ error: 'Insufficient balance for withdrawal' });
      }
      account.balance -= amount;
    } else if (transaction_type === 'Deposit') {
      account.balance += amount;
    } else {
      return res.status(400).json({ error: 'Invalid transaction type' });
    }

    await account.save();

    const transaction_id = await generateCustomId('TXN');
    const transaction = new Transaction({
      transaction_id,
      account_id,
      transaction_type,
      amount,
      status: 'Completed'
    });

    await transaction.save();

    res.status(201).json({
      message: `${transaction_type} successful`,
      transaction_id,
      new_balance: account.balance
    });

  } catch (err) {
    res.status(500).json({ error: 'Transaction failed', details: err.message });
  }
});

// Get all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transactions', details: err.message });
  }
});

// Get transactions for an account
router.get('/account/:account_id', async (req, res) => {
  try {
    const transactions = await Transaction.find({ account_id: req.params.account_id }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch account transactions', details: err.message });
  }
});

module.exports = router;