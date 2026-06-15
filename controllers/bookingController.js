const Booking = require('../models/booking');
const connectDB = require('../config/db');
const axios = require('axios');

const createBooking = async (req, res) => {
  try {
    // DB connection
    await connectDB();

    const bookingData = req.body;

    // Save booking
    const savedBooking = await Booking.create(bookingData);

    // Slack notification (non-blocking safe way)
    try {
      await axios.post(process.env.SLACK_WEBHOOK_URL, {
        text: `
        Name: ${savedBooking.fullName}
        Date: ${savedBooking.bookingDate}
        Time: ${savedBooking.timeSlot}
        Phone: ${savedBooking.phone}
        Address: ${savedBooking.address}
        ZIP: ${savedBooking.zipCode}
        Email: ${savedBooking.email || "N/A"}
        Type: ${savedBooking.vehicleType}
        Model: ${savedBooking.carModel}
        Package: ${savedBooking.packageName}
        Extra Services: ${savedBooking.extraServices?.length
            ? savedBooking.extraServices.join(", ")
            : "None"
          }
        Base Price: $${savedBooking.basePrice}
        otal Bill: $${savedBooking.totalBill}
        Site Setup: ${savedBooking.siteSetup}
        Note: ${savedBooking.notes || "No notes provided"}
        `,
      });
    } catch (slackError) {
      console.error("Slack notification failed:", slackError.message);
    }

    // Response
    res.status(201).json({
      success: true,
      message: "Booking successfully created!",
      data: savedBooking,
    });
  } catch (error) {
    console.error("Booking creation error:", error);

    res.status(500).json({
      success: false,
      message: "Booking failed to create",
      error: error.message,
    });
  }
};

module.exports = { createBooking };