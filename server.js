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
    // Agar OPTIONS request hai to DB connect karne ki zaroorat nahi hai
    if (req.method === 'OPTIONS') {
        return next();
    }

    try {
        if (!isConnected) {
            await connectDB();
            isConnected = true;
        }
        next();
    } catch (error) {
        console.error("Database connection error:", error);
        res.status(500).json({ error: "Database connection failed" });
    }
};

// 1. CORS Configuration (Sab se upar hona chahiye)
app.use(cors({
    origin: [
        "https://detailza-car-detailing.vercel.app",
        "http://localhost:3000"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"] // Headers explicitly allow karein
}));

// 2. Preflight Requests ko foran handle karein
app.options('*', cors());

app.use(express.json());
app.use(connectDatabase);

// Routes
app.use('/api/bookings', bookingRoutes);

app.get("/", (req, res) => {
    res.json({ success: true, message: "API running on Vercel" });
});

if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;