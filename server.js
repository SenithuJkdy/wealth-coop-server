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
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/staff', require('./routes/staffRoutes'));
app.use('/api/accounts', require('./routes/accountRoutes'));
// app.use('/api/transactions', require('./routes/transactionRoutes'));
// app.use('/api/loans', require('./routes/loanApplicationRoutes'));
// app.use('/api/approvals', require('./routes/loanApprovalRoutes'));
// app.use('/api/analytics', require('./routes/analyticsRoutes'));
// app.use('/api/notifications', require('./routes/notificationRoutes'));


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
