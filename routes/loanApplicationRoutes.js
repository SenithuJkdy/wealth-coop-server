const express = require('express');
const router = express.Router();
const LoanApplication = require('../models/LoanApplication');
const User = require('../models/User');
const Account = require('../models/Account');
const generateCustomId = require('../utils/generateCustomId');

// Apply for a loan
router.post('/apply', async (req, res) => {
  try {
    const {
      user_id,
      account_id,
      loan_amount,
      interest_rate,
      credit_score,
      income,
      loan_limit
    } = req.body;

    // Check user
    const user = await User.findOne({ user_id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check account and match with user
    const account = await Account.findOne({ account_id, user_id });
    if (!account) {
      return res.status(404).json({ error: 'Account does not belong to this user or does not exist' });
    }

    const loan_id = await generateCustomId('LOAN');

    const newLoanApp = new LoanApplication({
      loan_id,
      user_id,
      account_id,
      loan_amount,
      interest_rate,
      credit_score,
      income,
      loan_limit,
      prediction_time: new Date(),
      status: 'pending'
    });

    await newLoanApp.save();
    res.status(201).json({ message: 'Loan application submitted', loan_id });

  } catch (err) {
    res.status(500).json({ error: 'Failed to submit loan application', details: err.message });
  }
});

// Get all loan applications
router.get('/', async (req, res) => {
  try {
    const loans = await LoanApplication.find();
    res.json(loans);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch loans', details: err.message });
  }
});

// Get loan by ID
router.get('/:loan_id', async (req, res) => {
  try {
    const loan = await LoanApplication.findOne({ loan_id: req.params.loan_id });
    if (!loan) return res.status(404).json({ error: 'Loan not found' });
    res.json(loan);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch loan', details: err.message });
  }
});

// Get all pending loans or by user/account
router.get('/pending/search', async (req, res) => {
  try {
    const { user_id, account_id } = req.query;
    if (!user_id && !account_id) {
      return res.status(400).json({ error: 'Provide user_id or account_id' });
    }

    const filter = { status: 'pending' };
    if (user_id) filter.user_id = user_id;
    if (account_id) filter.account_id = account_id;

    const loans = await LoanApplication.find(filter);
    res.json(loans);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pending loans', details: err.message });
  }
});

// Update loan application (e.g., to edit amount before approval)
router.put('/:loan_id', async (req, res) => {
  try {
    const updated = await LoanApplication.findOneAndUpdate(
      { loan_id: req.params.loan_id },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Loan application not found' });
    }

    res.json({ message: 'Loan application updated', updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update loan', details: err.message });
  }
});

// Delete loan application
router.delete('/:loan_id', async (req, res) => {
  try {
    const deleted = await LoanApplication.findOneAndDelete({ loan_id: req.params.loan_id });
    if (!deleted) {
      return res.status(404).json({ error: 'Loan application not found' });
    }
    res.json({ message: 'Loan application deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete loan', details: err.message });
  }
});

router.get("/all/:account_id", async (req, res) => {
  try {
    const { account_id } = req.params;

    if (!account_id) {
      return res.status(400).json({ error: "Provide account_id in query" });
    }

    // Fetch all loans with their approval remarks
    const loans = await LoanApplication.aggregate([
      { $match: { account_id } },
      {
        $lookup: {
          from: "loanapprovals", // collection name
          localField: "loan_id",
          foreignField: "loan_id",
          as: "approval_details",
        },
      },
      {
        $addFields: {
          remarks: { $arrayElemAt: ["$approval_details.remarks", 0] },
        },
      },
      { $project: { approval_details: 0 } }, // remove the full approval details
    ]);

    res.json(loans);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch loans", details: err.message });
  }
});

module.exports = router;
