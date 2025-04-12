const express = require("express");
const router = express.Router();
const LoanApproval = require("../models/LoanApproval");
const LoanApplication = require("../models/LoanApplication");
const User = require('../models/User');
const generateCustomId = require("../utils/generateCustomId");

// Get all pending Loan Applications
router.get("/pending", async (req, res) => {
  try {
    const pendingLoans = await LoanApplication.find({ status: "pending" });
    res.json(pendingLoans);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch pending loans", details: err.message });
  }
});

// Get Pending Loan Applications by Customer ID or Account ID
router.get("/pending/search", async (req, res) => {
    try {
      const { cus_id, account_id } = req.query;
  
      if (!cus_id && !account_id) {
        return res
          .status(400)
          .json({ error: "Provide either cus_id or account_id" });
      }
  
      const filter = { status: "pending" };
      if (cus_id) filter.cus_id = cus_id;
      if (account_id) filter.account_id = account_id;
  
      const loans = await LoanApplication.find(filter);
      res.json(loans);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Failed to fetch loans", details: err.message });
    }
  });


  // Get all approved Loan Applications
router.get("/approved", async (req, res) => {
    try {
      const approvedLoans = await LoanApplication.find({ status: "approved" });
      res.json(approvedLoans);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Failed to fetch approved loans", details: err.message });
    }
  });

// Get all rejected Loan Applications
router.get("/rejected", async (req, res) => {
    try {
      const rejectedLoans = await LoanApplication.find({ status: "rejected" });
      res.json(rejectedLoans);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Failed to fetch rejected loans", details: err.message });
    }
  });

  
// Staff approves/rejects loan
router.post('/', async (req, res) => {
  try {
    const { loan_id, staff_id, approval_status, remarks } = req.body;

    // Validate staff
    const staff = await User.findOne({ user_id: staff_id, role: 'staff' });
    if (!staff) {
      return res.status(400).json({ error: 'Invalid staff_id or not authorized' });
    }

    const loan = await LoanApplication.findOne({ loan_id });
    if (!loan || loan.status !== 'pending') {
      return res.status(400).json({ error: 'Loan not found or already processed' });
    }

    const approval_id = await generateCustomId('APR');
    const approval = new LoanApproval({
      approval_id,
      loan_id,
      staff_id,
      approval_status,
      remarks,
      approval_date: new Date()
    });

    await approval.save();

    // Update loan status
    loan.status = approval_status;
    await loan.save();

    res.status(201).json({ message: `Loan ${approval_status}`, approval_id });
  } catch (err) {
    res.status(500).json({ error: 'Loan approval failed', details: err.message });
  }
});

module.exports = router;
