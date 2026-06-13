const Booking = require('../models/booking');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Public
const createBooking = async (req, res) => {
  try {
    const bookingData = req.body;

    // Database me naya document create ho raha hai
    const newBooking = new Booking(bookingData);
    const savedBooking = await newBooking.save();

    res.status(201).json({
      success: true,
      message: 'Booking successfully created!',
      data: savedBooking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Booking failed to create',
      error: error.message
    });
  }
};

module.exports = { createBooking };