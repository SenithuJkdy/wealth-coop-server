const express = require('express');
const router = express.Router();
const Staff  =  require('../models/BankStaff')
const generateCustomId = require('../utils/generateCustomerId');
const bcrypt = require('bcrypt');


// Register a new staff member
router.post('/register', async (req,res) => {
    try {
        const { name, role, email, contact_number, password } = req.body;

        // validate role
        // if (!['loan_officer'].includes(role)) {
        //     return res.status(400).json({ error: 'Invalid role' });
        // }

        // this will save the role as "loan_officer" by default without validating role
        // db schema has enum and default is "loan_officer"

        if (!email || !password) {
            return res.status(400).json({ error: 'email and password are required' })
        } 

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const staff_id = await generateCustomId('STAFF')

        const newStaffMember = new Staff({
            staff_id,
            name,
            role,
            email,
            contact_number,
            password: hashedPassword
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

// Staff login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find staff by email
        const staff = await Staff.findOne({ email });

        // Validate staff and password
        if (!staff || !(await bcrypt.compare(password, staff.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Send response with staff_id and role
        res.json({
            staff_id: staff.staff_id,
            role: staff.role
        });

    } catch (err) {
        res.status(500).json({ error: 'Login failed', details: err.message });
    }
});



// Update staff member
router.put('/:staff_id', async (req, res) => {
    try {
        const { staff_id } = req.params;
        const updateData = req.body;

        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        const updatedStaff = await Staff.findOneAndUpdate({ staff_id }, updateData, { new: true });

        if (!updatedStaff) {
            return res.status(404).json({ error: 'Staff member not found' });
        }

        res.json({ message: 'Staff member updated successfully', updatedStaff });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update staff member', details: err.message });
    }
});

// Delete staff member
router.delete('/:staff_id', async (req, res) => {
    try {
        const { staff_id } = req.params;
        const deletedStaff = await Staff.findOneAndDelete({ staff_id });

        if (!deletedStaff) {
            return res.status(404).json({ error: 'Staff member not found' });
        }

        res.json({ message: 'Staff member deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete staff member', details: err.message });
    }
});

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