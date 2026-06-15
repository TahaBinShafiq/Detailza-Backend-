const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const bookingRoutes = require('./routes/bookingRoutes');

dotenv.config();

const app = express();

// DB (cached)
let isConnected = false;

const connectDatabase = async (req, res, next) => {
    if (!isConnected) {
        await connectDB();
        isConnected = true;
    }
    next();
};

// CORS
app.use(cors({
    origin: [
        "https://detailza-car-detailing.vercel.app",
        "http://localhost:3000"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
}));

app.use(express.json());
app.use(connectDatabase);

// Routes
app.use('/api/bookings', bookingRoutes);

app.get("/", (req, res) => {
    res.json({ success: true, message: "API running on Vercel" });
});

// ❌ NO app.listen here

if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;