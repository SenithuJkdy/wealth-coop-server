const express = require("express");
const router = express.Router();
const Account = require("../models/Account");
const User = require('../models/User');
const generateCustomId = require("../utils/generateCustomId"); 

// Create a new account
router.post('/create', async (req, res) => {
    try {
        const { cus_id, account_type, balance } = req.body;

        // 1. Check if the customer exists
        const existingCustomer = await Customer.findOne({ cus_id });

        if (!existingCustomer) {
            return res.status(404).json({
                error: `Customer with ID ${cus_id} does not exist`
            });
        }

        // 2. Generate a unique account_id
        const account_id = await generateCustomId('ACC');

        // 3. Create the account
        const newAccount = new Account({
            account_id,
            cus_id,
            account_type,
            balance
        });

        await newAccount.save();

        res.status(201).json({ message: 'Account created successfully', account_id });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create account', details: err.message });
    }
});

// Get account and customer by account_id
router.get("/:account_id", async (req, res) => {
    try {
      const account = await Account.findOne({
        account_id: req.params.account_id,
      });
  
      if (!account) {
        return res.status(404).json({ error: "Account not found" });
      }
  
      // Find the customer using cus_id from the account
      const customer = await Customer.findOne({ cus_id: account.cus_id });
  
      if (!customer) {
        return res.status(404).json({ error: "Customer linked to this account not found" });
      }
  
      res.json({
        account,
        customer
      });
    } catch (err) {
      res.status(500).json({
        error: "Failed to get account and customer details",
        details: err.message
      });
    }
  });
  
// Update account
router.put("/:account_id", async (req, res) => {
  try {
    const updated = await Account.findOneAndUpdate(
      { account_id: req.params.account_id },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Account not found" });
    }

    res.json({ message: "Account updated successfully", updated });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update account", details: err.message });
  }
});

// Delete account
router.delete("/:account_id", async (req, res) => {
  try {
    const deleted = await Account.findOneAndDelete({
      account_id: req.params.account_id,
    });

    if (!deleted) {
      return res.status(404).json({ error: "Account not found" });
    }

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete account", details: err.message });
  }
});

// Get all accounts
router.get("/", async (req, res) => {
    try {
      const accounts = await Account.find();
      res.json(accounts);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Failed to fetch accounts", details: err.message });
    }
  });

router.get('/:account_id/balance', async (req, res) => {
    const account = await Account.findOne({ account_id: req.params.account_id });
    if (!account) return res.status(404).json({ error: 'Account not found' });
    res.json({ balance: account.balance });
  });
  

module.exports = router;
