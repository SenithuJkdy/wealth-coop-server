const express = require('express');
const router = express.Router();
const generateCustomId = require('../utils/generateCustomId');
const acc_id = await generateCustomId('ACC');
