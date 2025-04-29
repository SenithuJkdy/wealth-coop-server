const express = require('express');
const router = express.Router();
const LoanRepayment = require('../models/LoanRepayment');
const LoanApplication = require('../models/LoanApplication');
const User = require('../models/User');
const generateCustomId = require('../utils/generateCustomId');
const Account = require("../models/Account");

// POST: Make a repayment and deduct from account balance
router.post("/", async (req, res) => {
  try {
    const { loan_id, user_id, amount_paid } = req.body;

    const loan = await LoanApplication.findOne({ loan_id });
    if (!loan) {
      return res.status(404).json({ error: "Loan application not found" });
    }

    if (loan.status !== "approved") {
      return res.status(400).json({ error: "Loan is not approved for repayment" });
    }

    // Find the user's account
    const account = await Account.findOne({ user_id });
    if (!account) {
      return res.status(404).json({ error: "Account not found for the user" });
    }

    if (account.balance < amount_paid) {
      return res.status(400).json({ error: "Insufficient account balance" });
    }

    if (loan.loan_amount < amount_paid) {
      return res.status(400).json({ error: "Repayment exceeds remaining loan amount" });
    }

    // Deduct from account balance
    account.balance -= amount_paid;
    await account.save();

    // Deduct from loan amount
    loan.loan_amount -= amount_paid;
    if (loan.loan_amount === 0) {
      loan.status = "rejected"; // Optional status update
    }
    await loan.save();

    const repayment_id = await generateCustomId("REPAY");
    const repayment = new LoanRepayment({
      repayment_id,
      loan_id,
      user_id,
      amount_paid,
      payment_date: new Date(),
    });

    await repayment.save();

    res.status(201).json({
      message: "Repayment successful",
      repayment_id,
      remaining_loan_balance: loan.loan_amount,
      updated_account_balance: account.balance,
    });
  } catch (err) {
    res.status(500).json({ error: "Repayment failed", details: err.message });
  }
});

  
// Get all repayments
router.get('/', async (req, res) => {
  try {
    const repayments = await LoanRepayment.find();
    res.json(repayments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch repayments', details: err.message });
  }
});

// Get repayments for a specific user
router.get('/user/:user_id', async (req, res) => {
  try {
    const repayments = await LoanRepayment.find({ user_id: req.params.user_id });
    res.json(repayments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user repayments', details: err.message });
  }
});

// Get repayments for a specific loan
router.get('/loan/:loan_id', async (req, res) => {
  try {
    const repayments = await LoanRepayment.find({ loan_id: req.params.loan_id });
    res.json(repayments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch loan repayments', details: err.message });
  }
});

module.exports = router;
