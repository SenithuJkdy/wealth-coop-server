const express = require("express");
const router = express.Router();
const BillPayment = require("../models/BillPayment");
const Account = require("../models/Account");
const { scheduleJob } = require("node-schedule");

// Schedule a bill payment
router.post("/schedule", async (req, res) => {
  try {
    const {
      account_id,
      bill_type,
      provider,
      account_number,
      amount,
      payment_date
    } = req.body;

    // Validate future date
    if (new Date(payment_date) <= new Date()) {
      return res.status(400).json({ 
        error: "Payment date must be in the future" 
      });
    }

    const scheduledPayment = new BillPayment({
      account_id,
      bill_type,
      provider,
      account_number,
      amount,
      status: "Pending",
      scheduled_at: payment_date
    });

    await scheduledPayment.save();

    // Schedule the job
    scheduleJob(new Date(payment_date), async () => {
      try {
        const account = await Account.findOne({ account_id });
        if (account.balance >= amount) {
          account.balance -= amount;
          await account.save();
          scheduledPayment.status = "Completed";
          await scheduledPayment.save();
        } else {
          scheduledPayment.status = "Failed";
          await scheduledPayment.save();
        }
      } catch (err) {
        console.error("Scheduled payment failed:", err);
      }
    });

    res.status(201).json({
      message: "Payment scheduled successfully",
      payment_id: scheduledPayment._id,
      scheduled_at: payment_date
    });

  } catch (err) {
    res.status(500).json({
      error: "Failed to schedule payment",
      details: err.message
    });
  }
});

module.exports = router;