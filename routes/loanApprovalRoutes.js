const express = require("express");
const router = express.Router();
const LoanApproval = require("../models/LoanApproval");
const LoanApplication = require("../models/LoanApplication");
const Notification = require("../models/Notification");
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

  


// Approve a loan
router.post("/", async (req, res) => {
  try {
    const { loan_id, staff_id, approval_status } = req.body;

    const application = await LoanApplication.findOne({ loan_id });
    if (!application) {
      return res.status(404).json({ error: "Loan application not found" });
    }

    // Update application status
    application.status = approval_status;
    await application.save();

    const approval_id = await generateCustomId("APPROVAL");
    const approval = new LoanApproval({
      approval_id,
      loan_id,
      staff_id,
      approval_status,
      approval_date: new Date(),
    });

    await approval.save();

    // Send notification
    const notification_id = await generateCustomId("NOTI");
    const message = `Your loan ${loan_id} has been ${approval_status.toLowerCase()}`;
    const notification = new Notification({
      notification_id,
      cus_id: application.cus_id,
      message,
      date: new Date(),
    });

    await notification.save();

    res
      .status(201)
      .json({ message: "Loan processed and notification sent", approval_id });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to approve loan", details: err.message });
  }
});

module.exports = router;
