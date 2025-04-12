const express = require('express');
const router = express.Router();
const LoanApplication = require('../models/LoanApplication');
const User = require('../models/User');
const Account = require('../models/Account');
const generateCustomId = require('../utils/generateCustomId');

// Apply for a loan
router.post('/', async (req, res) => {
    try {
      const { cus_id, account_id, amount } = req.body;
  
      // Check if customer exists
      const customerExists = await Customer.findOne({ cus_id });
      if (!customerExists) {
        return res.status(400).json({ error: 'Customer not found' });
      }
  
      // Check if account exists and belongs to the customer
      const account = await Account.findOne({ account_id, cus_id });
      if (!account) {
        return res.status(400).json({ error: 'Account does not belong to the customer or does not exist' });
      }
  
      const loan_id = await generateCustomId('LOAN');
      const application = new LoanApplication({
        loan_id,
        cus_id,
        account_id,
        amount,
        status: 'pending',
        application_date: new Date()
      });
  
      await application.save();
      res.status(201).json({ message: 'Loan application submitted', loan_id });
  
    } catch (err) {
      res.status(500).json({ error: 'Failed to apply for loan', details: err.message });
    }
  });
  
// Update a loan application
router.put('/:loan_id', async (req, res) => {
    try {
      const { loan_id } = req.params;
      const updateFields = req.body;
  
      const updatedLoan = await LoanApplication.findOneAndUpdate(
        { loan_id },
        { $set: updateFields },
        { new: true }
      );
  
      if (!updatedLoan) {
        return res.status(404).json({ error: 'Loan application not found' });
      }
  
      res.json({ message: 'Loan application updated', updatedLoan });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update loan application', details: err.message });
    }
  });


// Delete a loan application
router.delete('/:loan_id', async (req, res) => {
    try {
      const { loan_id } = req.params;
  
      const deletedLoan = await LoanApplication.findOneAndDelete({ loan_id });
  
      if (!deletedLoan) {
        return res.status(404).json({ error: 'Loan application not found' });
      }
  
      res.json({ message: 'Loan application deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete loan application', details: err.message });
    }
});
  
// Get all loan applications
router.get('/', async (req, res) => {
  try {
    const applications = await LoanApplication.find();
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch loan applications', details: err.message });
  }
});

module.exports = router;
