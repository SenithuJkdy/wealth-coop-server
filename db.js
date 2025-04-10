const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Customer = require('./models/Customer');
const BankStaff = require('./models/BankStaff');
const Account = require('./models/Account');
const Transaction = require('./models/Transaction');
const LoanApplication = require('./models/LoanApplication');
const LoanApproval = require('./models/LoanApproval');
const AnalyticsResult = require('./models/AnalyticsResult');
const Notification = require('./models/Notification');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log('✅ MongoDB Connected Successfully');

        // Create collections from models (placeholders)
        await Promise.all([
            Customer.createCollection(),
            BankStaff.createCollection(),
            Account.createCollection(),
            Transaction.createCollection(),
            LoanApplication.createCollection(),
            LoanApproval.createCollection(),
            AnalyticsResult.createCollection(),
            Notification.createCollection()
        ]);

        // console.log('📁 All model collections initialized (if not existing)');

    } catch (err) {
        console.error('❌ MongoDB Connection Failed:', err);
        process.exit(1);
    }
};

module.exports = connectDB;
