require('dotenv').config();

const express = require("express");
const cors = require('cors')
const connectDB =  require('./db')

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors({
    // origin: process.env.ORIGIN,
    methods: ['GET','POST','PUT','DELETE']
}))

app.use(express.json()) // TO parse JSON data must include this line
app.use(express.urlencoded({ extended: true })); // Enable form data parsing

connectDB();

// Route imports
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/accounts', require('./routes/accountRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/loans', require('./routes/loanApplicationRoutes'));
app.use('/api/approvals', require('./routes/loanApprovalRoutes'));
app.use('/api/prediction', require('./routes/loanPredictionRoutes'));
app.use('/api/repayments', require('./routes/loanRepaymentRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/logs',require('./routes/auditLogRoutes'));
app.use('/api/support',require('./routes/supportRoutes'));
app.use('/api/branch',require('./routes/branchRoutes'));


app.get("/", (req, res) => res.send("Hello World !"));

app.get("/test", (req,res) => res.json({
    Result: "Working"
}))

app.post('/test', (req,res)=> {
    console.log(req.body);
    res.json({ received: req.body })
})

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`)
});
