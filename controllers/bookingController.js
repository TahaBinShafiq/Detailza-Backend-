const Booking = require('../models/booking');
const connectDB = require('../config/db');

const createBooking = async (req, res) => {
  try {
    await connectDB();

    const bookingData = req.body;

    const newBooking = new Booking(bookingData);
    const savedBooking = await newBooking.save();

    res.status(201).json({
      success: true,
      message: 'Booking successfully created!',
      data: savedBooking
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Booking failed to create',
      error: error.message
    });
  }
};

module.exports = { createBooking };