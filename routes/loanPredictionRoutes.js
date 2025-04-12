const express = require('express');
const router = express.Router();
const LoanPrediction = require('../models/LoanPrediction');
const LoanApplication = require('../models/LoanApplication');
const generateCustomId = require('../utils/generateCustomId');

// Create a loan prediction (staff only or ML output)
router.post('/', async (req, res) => {
  try {
    const { application_id, predicted_repayment_date } = req.body;

    const loan = await LoanApplication.findOne({ loan_id: application_id });
    if (!loan) {
      return res.status(404).json({ error: 'Loan application not found' });
    }

    const prediction_id = await generateCustomId('PRED');

    const prediction = new LoanPrediction({
      prediction_id,
      application_id,
      predicted_repayment_date
    });

    await prediction.save();
    res.status(201).json({ message: 'Prediction created', prediction_id });

  } catch (err) {
    res.status(500).json({ error: 'Failed to create prediction', details: err.message });
  }
});

// Get all predictions
router.get('/', async (req, res) => {
  try {
    const predictions = await LoanPrediction.find();
    res.json(predictions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch predictions', details: err.message });
  }
});

// Get prediction by loan application ID
router.get('/:application_id', async (req, res) => {
  try {
    const prediction = await LoanPrediction.findOne({ application_id: req.params.application_id });
    if (!prediction) {
      return res.status(404).json({ error: 'Prediction not found for this loan' });
    }
    res.json(prediction);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch prediction', details: err.message });
  }
});

module.exports = router;
