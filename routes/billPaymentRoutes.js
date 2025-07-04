const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const Account = require("../models/Account");
const BillPayment = require("../models/BillPayment");
const generateCustomId = require("../utils/generateCustomId");

// Process bill payment
router.post("/pay", async (req, res) => {
  try {
    const { 
      account_id,
      bill_type,
      provider,
      account_number,
      amount,
      reference_number
    } = req.body;

    // Validate required fields
    if (!account_id || !bill_type || !account_number || !amount) {
      return res.status(400).json({ 
        error: "Missing required fields" 
      });
    }

    // Find payer account
    const payerAccount = await Account.findOne({ account_id });
    if (!payerAccount) {
      return res.status(404).json({ error: "Account not found" });
    }

    // Check minimum balance
    if (payerAccount.balance - amount < 2000) {
      return res.status(400).json({ 
        error: "Insufficient balance: Minimum balance of 2000 must be maintained" 
      });
    }

    // Deduct amount
    payerAccount.balance -= amount;
    await payerAccount.save();

    // Create transaction record
    const transaction_id = await generateCustomId("BP");
    const transaction = new Transaction({
      transaction_id,
      account_id,
      transaction_type: "Bill Payment",
      amount,
      status: "Completed",
      description: `${bill_type} payment to ${provider}`,
      reference_number
    });

    // Create bill payment record
    const billPayment = new BillPayment({
      transaction_id,
      account_id,
      bill_type,
      provider,
      account_number,
      amount,
      reference_number,
      status: "Completed"
    });

    await Promise.all([transaction.save(), billPayment.save()]);

    res.status(201).json({
      message: "Bill payment successful",
      transaction_id,
      new_balance: payerAccount.balance,
      bill_details: {
        type: bill_type,
        provider,
        account_number
      }
    });

  } catch (err) {
    res.status(500).json({ 
      error: "Bill payment failed", 
      details: err.message 
    });
  }
});

// Get bill payment history
router.get("/history/:account_id", async (req, res) => {
  try {
    const payments = await BillPayment.find({
      account_id: req.params.account_id
    }).sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch bill payments",
      details: err.message
    });
  }
});

// Get bill providers by type
router.get("/providers/:bill_type", async (req, res) => {
  try {
    const providers = {
      electricity: ["CEB", "LECO"],
      water: ["Water Board", "Private Supplier"],
      telecom: ["Dialog", "Mobitel", "Hutch"],
      tv: ["PeoTV", "Dialog TV"]
    };

    const typeProviders = providers[req.params.bill_type] || [];
    res.json({ providers: typeProviders });
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch providers",
      details: err.message
    });
  }
});

module.exports = router;