const express = require('express');
const router = express.Router();
const Account = require('../models/Account');
const User = require('../models/User');
const generateCustomId = require('../utils/generateCustomId');

// Create a new account for a user
router.post('/create', async (req, res) => {
  try {
    const { user_id, account_type, balance, currency } = req.body;

    // Validate user
    const user = await User.findOne({ user_id });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const account_id = await generateCustomId('ACC');
    const account_number = `ACCT${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    const newAccount = new Account({
      account_id,
      user_id,
      account_number,
      account_type,
      balance,
      currency
    });

    await newAccount.save();
    res.status(201).json({ message: 'Account created successfully', account_id, account_number });

  } catch (err) {
    res.status(500).json({ error: 'Failed to create account', details: err.message });
  }
});

// Get all accounts
router.get('/', async (req, res) => {
  try {
    const accounts = await Account.find();
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch accounts', details: err.message });
  }
});

// Get account by ID
router.get('/:account_id', async (req, res) => {
  try {
    const account = await Account.findOne({ account_id: req.params.account_id });
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }
    res.json(account);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch account', details: err.message });
  }
});

// Get all accounts for a specific user
router.get('/user/:user_id', async (req, res) => {
  try {
    const user = await User.findOne({ user_id: req.params.user_id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const accounts = await Account.find({ user_id: req.params.user_id });
    res.json({ user_id: req.params.user_id, accounts });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user accounts', details: err.message });
  }
});

// Get account balance
router.get('/:account_id/balance', async (req, res) => {
  try {
    const account = await Account.findOne({ account_id: req.params.account_id });
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    res.json({ account_id: account.account_id, balance: account.balance });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch balance', details: err.message });
  }
});

// Update account by ID
router.put('/:account_id', async (req, res) => {
  try {
    const { account_type, balance, currency } = req.body;

    // Find account by account_id
    const account = await Account.findOne({ account_id: req.params.account_id });
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Update fields if provided
    if (account_type) account.account_type = account_type;
    if (balance !== undefined) account.balance = balance; // Allow balance to be 0
    if (currency) account.currency = currency;

    await account.save();
    res.json({ message: 'Account updated successfully', account });

  } catch (err) {
    res.status(500).json({ error: 'Failed to update account', details: err.message });
  }
});

// Delete account by ID
router.delete('/:account_id', async (req, res) => {
  try {
    const account = await Account.findOne({ account_id: req.params.account_id });
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    await Account.deleteOne({ account_id: req.params.account_id });
    res.json({ message: 'Account deleted successfully', account_id: req.params.account_id });

  } catch (err) {
    res.status(500).json({ error: 'Failed to delete account', details: err.message });
  }
});
module.exports = router;
