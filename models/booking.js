const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true },
    email: { type: String, required: false },
    address: { type: String, required: true },
    zipCode: { type: String, required: true },
    carModel: { type: String, required: true },
    vehicleType: { type: String, required: true },
    packageId: { type: String, required: true },
    packageName: { type: String, required: true },
    basePrice: { type: Number, required: true },
    extraServices: { type: [String], default: [] },
    totalBill: { type: Number, required: true },
    bookingDate: { type: String, required: true },
    timeSlot: { type: String, required: true },
    siteSetup: { type: String },
    notes: { type: String }
}, {
    timestamps: true // Isse createdAt aur updatedAt khud ban jayenge
});

module.exports = mongoose.model('Booking', bookingSchema);