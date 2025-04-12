const express = require('express');
const router = express.Router();
const LoanForecast = require('../models/LoanForecast');
const Branch = require('../models/Branch');
const User = require('../models/User');
const generateCustomId = require('../utils/generateCustomId');

// Create a loan forecast (admin only)
router.post('/', async (req, res) => {
  try {
    const { branch_id, predicted_loan_amount, prediction_date, model_version, user_id } = req.body;

    const user = await User.findOne({ user_id });
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admin can create loan forecasts' });
    }

    const branch = await Branch.findOne({ branch_id });
    if (!branch) return res.status(404).json({ error: 'Branch not found' });

    const forecast_id = await generateCustomId('FORECAST');

    const forecast = new LoanForecast({
      forecast_id,
      branch_id,
      predicted_loan_amount,
      prediction_date,
      model_version
    });

    await forecast.save();
    res.status(201).json({ message: 'Loan forecast created', forecast_id });

  } catch (err) {
    res.status(500).json({ error: 'Failed to create loan forecast', details: err.message });
  }
});

// Get forecasts by branch
router.get('/branch/:branch_id', async (req, res) => {
  try {
    const forecasts = await LoanForecast.find({ branch_id: req.params.branch_id });
    res.json(forecasts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch forecasts', details: err.message });
  }
});

// Get all forecasts
router.get('/', async (req, res) => {
  try {
    const forecasts = await LoanForecast.find();
    res.json(forecasts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch forecasts', details: err.message });
  }
});

module.exports = router;