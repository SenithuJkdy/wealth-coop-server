const express = require('express');
const router = express.Router();
const Staff  =  require('../models/BankStaff')
const generateCustomId = require('../utils/generateCustomerId');


// Register a new staff member
router.post('/register', async (req,res) => {
    try {
        const { name, role, email, contact_number, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'email and password are required' })
        } 

        const staff_id = await generateCustomId('STAFF')

        const newStaffMember = new Staff({
            staff_id,
            name,
            role,
            email,
            contact_number,
            password
        })

        await newStaffMember.save()
        res.status(201).json({ messege: `Staff member (${role}) registerd successfully`, staff_id})
    } catch (error) {
        res.status(500).json({
            error: 'Failed to register staff member',
            details: error.messege
        })
    }
})

// Get all staff members
router.get('/', async (req,res)=>{
    try {
        const staffMembers = await Staff.find();
        res.json(staffMembers)
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch staff members', details: err.message});
    }
});

module.exports = router;