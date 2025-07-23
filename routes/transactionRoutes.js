const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const Account = require("../models/Account");
const generateCustomId = require("../utils/generateCustomId");

// Create a transaction (Deposit or Withdrawal)
router.post("/withdraw/:receiver_acc_no", async (req, res) => {
  try {
    const { 
      account_id, 
      amount, 
      beneficiary_bank,
      beneficiary_name,
      purpose,
      description 
    } = req.body;
    const receiver_acc_no = req.params.receiver_acc_no;

    // Find sender account
    const senderAccount = await Account.findOne({ account_id });
    if (!senderAccount)
      return res.status(404).json({ error: "Sender Account not found" });

    // Find receiver account
    const receiverAccount = await Account.findOne({ account_number: receiver_acc_no });
    if (!receiverAccount)
      return res.status(404).json({ error: "Receiver Account not found" });

    // Check if transaction would reduce balance below 2000
    if (senderAccount.balance - amount < 2000) {
      return res.status(400).json({ 
        error: "Insufficient balance: Minimum balance of 2000 must be maintained" 
      });
    }

    // Validate required fields
    if (!beneficiary_bank || !beneficiary_name) {
      return res.status(400).json({ 
        error: "Beneficiary bank and name are required" 
      });
    }

    // Perform the transfer
    senderAccount.balance -= amount;
    receiverAccount.balance += amount;

    await senderAccount.save();
    await receiverAccount.save();

    const transaction_id = await generateCustomId("TXN");
    const transaction = new Transaction({
      transaction_id,
      account_id,
      transaction_type: "Withdrawal",
      amount,
      status: "Completed",
      beneficiary_bank,
      beneficiary_name,
      purpose: purpose || "Personal",
      description,
      receiver_account: receiver_acc_no
    });

    await transaction.save();

    res.status(201).json({
      message: "Transfer successful",
      transaction_id,
      new_balance: senderAccount.balance,
      beneficiary_name,
      beneficiary_bank
    });
  } catch (err) {
    res.status(500).json({ 
      error: "Transaction failed", 
      details: err.message 
    });
  }
});

// Deposit endpoint (unchanged)
router.post("/deposit/:account_id", async (req, res) => {
  try {
    const { amount } = req.body;
    const account_id = req.params.account_id;

    const account = await Account.findOne({ account_id });
    if (!account)
      return res.status(404).json({ error: "Account not found" });

    account.balance += amount;
    await account.save();

    const transaction_id = await generateCustomId("TXN");
    const transaction = new Transaction({
      transaction_id,
      account_id,
      transaction_type: "Deposit",
      amount,
      status: "Completed",
    });
    await transaction.save();

    res.status(201).json({
      message: "Deposit successful",
      transaction_id,
      new_balance: account.balance,
    });
  } catch (err) {
    res.status(500).json({ error: "Deposit failed", details: err.message });
  }
});

// Get all transactions with additional fields
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .select('transaction_id account_id amount transaction_type status createdAt beneficiary_bank beneficiary_name purpose description receiver_account');
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ 
      error: "Failed to fetch transactions", 
      details: err.message 
    });
  }
});

// Get transactions for an account with additional fields
router.get("/account/:account_id", async (req, res) => {
  try {
    const transactions = await Transaction.find({
      account_id: req.params.account_id,
    })
    .sort({ createdAt: -1 })
    .select('transaction_id amount transaction_type status createdAt beneficiary_bank beneficiary_name purpose description receiver_account');
    
    res.json(transactions);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch account transactions",
      details: err.message,
    });
  }
});

module.exports = router;