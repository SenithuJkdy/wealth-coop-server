const express = require('express');
const router = express.Router();
const AnalyticsResult = require('../models/AnalyticsResult');

// Save analytics result
router.post('/', async (req, res) => {
  try {
    const { analysis_type, data_summary, notes } = req.body;

    const result = new AnalyticsResult({
      analysis_type,
      data_summary,
      notes
    });

    await result.save();
    res.status(201).json({ message: 'Analytics result saved' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save analytics result', details: err.message });
  }
});

// Get all analytics
router.get('/', async (req, res) => {
  const results = await AnalyticsResult.find();
  res.json(results);
});

module.exports = router;
