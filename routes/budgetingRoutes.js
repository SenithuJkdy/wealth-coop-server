const express = require('express');
const router = express.Router();
const BudgetingProfile = require('../models/BudgetingProfile');
const User = require('../models/User');
const generateCustomId = require('../utils/generateCustomId');

// Create or update budgeting profile
router.post('/', async (req, res) => {
  try {
    const { user_id, monthly_income, savings_goal, monthly_expenses, financial_tips } = req.body;

    const user = await User.findOne({ user_id });
    if (!user) return res.status(404).json({ error: 'User not found' });

    let profile = await BudgetingProfile.findOne({ user_id });

    if (profile) {
      // Update existing
      profile.monthly_income = monthly_income;
      profile.savings_goal = savings_goal;
      profile.monthly_expenses = monthly_expenses;
      profile.financial_tips = financial_tips;
    } else {
      // Create new
      const profile_id = await generateCustomId('BUDGET');
      profile = new BudgetingProfile({
        profile_id,
        user_id,
        monthly_income,
        savings_goal,
        monthly_expenses,
        financial_tips
      });
    }

    await profile.save();
    res.status(200).json({ message: 'Budgeting profile saved', profile });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save budgeting profile', details: err.message });
  }
});

// Get a user's budgeting profile
router.get('/:user_id', async (req, res) => {
  try {
    const profile = await BudgetingProfile.findOne({ user_id: req.params.user_id });
    if (!profile) return res.status(404).json({ error: 'Budgeting profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch budgeting profile', details: err.message });
  }
});

module.exports = router;
