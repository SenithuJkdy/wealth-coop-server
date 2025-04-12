const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");
const generateCustomId = require("../utils/generateCustomId"); // generic utility
const bcrypt = require("bcrypt");

// Register a new customer
router.post("/register", async (req, res) => {
  try {
    const { name, email, address, phone, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const cus_id = await generateCustomId("CUST");

    const newCustomer = new Customer({
      cus_id,
      name,
      email,
      address,
      phone,
      password: hashedPassword,
    });

    await newCustomer.save();
    res
      .status(201)
      .json({ message: "Customer registered successfully", cus_id });
  } catch (err) {
    res.status(500).json({
      error: "Failed to register customer",
      details: err.message,
    });
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const customer = await Customer.findOne({ email });
    if (!customer || !(await bcrypt.compare(password, customer.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.json({
      cus_id: customer.cus_id,
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// DELETE customer by ID
router.delete("/:cus_id", async (req, res) => {
  try {
    const { cus_id } = req.params;
    const deletedCustomer = await Customer.findOneAndDelete({ cus_id });

    if (!deletedCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json({ message: "Customer deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete customer", details: err.message });
  }
});

// UPDATE customer by ID
router.put("/:cus_id", async (req, res) => {
  try {
    const { cus_id } = req.params;
    const updateData = req.body;

    // Optional: Hash password if it's being updated
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedCustomer = await Customer.findOneAndUpdate(
      { cus_id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json({ message: "Customer updated successfully", updatedCustomer });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update customer", details: err.message });
  }
});

// Get customer by ID
router.get('/:cus_id', async (req, res) => {
  try {
    const customer = await Customer.findOne({ cus_id: req.params.cus_id });

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(customer);
  } catch (err) {
    res.status(500).json({
      error: 'Failed to fetch customer',
      details: err.message
    });
  }
});

// Get all customers
router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch customers", details: err.message });
  }
});

module.exports = router;
