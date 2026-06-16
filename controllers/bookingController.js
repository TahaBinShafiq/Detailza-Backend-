const Booking = require('../models/booking');
const connectDB = require('../config/db');
const axios = require('axios');

const createBooking = async (req, res) => {
  try {
    await connectDB();

    const bookingData = req.body;
    const savedBooking = await Booking.create(bookingData);
    if (process.env.SLACK_WEBHOOK_URL) {
      try {
        const slackMessage = `🚨 *New Booking Received!* 🚨\n\n` +
          `*Name:* ${savedBooking.fullName}\n` +
          `*Date:* ${savedBooking.bookingDate}\n` +
          `*Time:* ${savedBooking.timeSlot}\n` +
          `*Phone:* ${savedBooking.phone}\n` +
          `*Address:* ${savedBooking.address}, ZIP: ${savedBooking.zipCode}\n` +
          `*Email:* ${savedBooking.email || "N/A"}\n` +
          `*Vehicle:* ${savedBooking.vehicleType} (${savedBooking.carModel})\n` +
          `*Package:* ${savedBooking.packageName}\n` +
          `*Extra Services:* ${savedBooking.extraServices?.length ? savedBooking.extraServices.join(", ") : "None"}\n` +
          `*Base Price:* $${savedBooking.basePrice}\n` +
          `*Total Bill:* $${savedBooking.totalBill}\n` +
          `*Site Setup:* ${savedBooking.siteSetup}\n` +
          `*Note:* ${savedBooking.notes || "No notes provided"}`;

        await axios.post(process.env.SLACK_WEBHOOK_URL, {
          text: slackMessage
        }, {
          headers: { 'Content-Type': 'application/json' }
        });
        console.log("Slack notification sent successfully!");
      } catch (slackError) {
        console.error("Slack notification failed:", slackError.response?.data || slackError.message);
      }
    } else {
      console.warn("Slack Webhook URL missing in Env variables!");
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