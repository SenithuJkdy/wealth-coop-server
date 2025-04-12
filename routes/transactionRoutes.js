const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Account = require('../models/Account');
const generateCustomId = require('../utils/generateCustomId');

// Create a new transaction and update account balance
router.post('/create', async (req, res) => {
    try {
      const { account_id, amount, type, status } = req.body;
  
      // Validate account
      const account = await Account.findOne({ account_id });
      if (!account) {
        return res.status(400).json({ error: 'Account does not exist' });
      }
  
      // Update account balance based on transaction type
      if (type === 'deposit') {
        account.balance += amount;
      } else if (type === 'withdrawal') {
        if (account.balance < amount) {
          return res.status(400).json({ error: 'Insufficient balance for withdrawal' });
        }
        account.balance -= amount;
      } else {
        return res.status(400).json({ error: 'Invalid transaction type' });
      }
  
      await account.save(); // Save updated balance
  
      // Create transaction record
      const transaction_id = await generateCustomId('TXN');
      const newTransaction = new Transaction({
        transaction_id,
        account_id,
        amount,
        type,
        status,
        date: new Date()
      });
  
      await newTransaction.save();
      res.status(201).json({ message: 'Transaction successful', transaction_id, new_balance: account.balance });
  
    } catch (err) {
      res.status(500).json({
        error: 'Failed to process transaction',
        details: err.message
      });
    }
  });

// Get all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (err) {
    res.status(500).json({
      error: 'Failed to fetch transactions',
      details: err.message
    });
  }
});

// Get transaction by ID
router.get('/:transaction_id', async (req, res) => {
  try {
    const txn = await Transaction.findOne({ transaction_id: req.params.transaction_id });

    if (!txn) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(txn);
  } catch (err) {
    res.status(500).json({
      error: 'Failed to fetch transaction',
      details: err.message
    });
  }
});

// get all transactions of an account
router.get('/account/:account_id', async (req, res) => {
    try {
      const transactions = await Transaction.find({ account_id: req.params.account_id });
      res.json(transactions);
    } catch (err) {
      res.status(500).json({ error: 'Failed to get transactions', details: err.message });
    }
  });
  
module.exports = router;
