const express = require('express');
const router = express.Router();
const { createBooking } = require('../controllers/bookingController');

// POST request handling
router.post('/', createBooking);

module.exports = router;