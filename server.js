const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const bookingRoutes = require('./routes/bookingRoutes');

dotenv.config();

const app = express();

// 1. Allowed Origins List
const allowedOrigins = [
    "https://detailza-car-detailing.vercel.app",
    "http://localhost:3000"
];

// 2. CORS Middleware Configuration
app.use(cors({
    origin: function (origin, callback) {
        // local requests ya bina origin (jaise Postman) ko allow karne ke liye
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Accept"]
}));

// 3. Preflight (OPTIONS) Requests ko foran bypass karein
app.options('*', (req, res) => {
    res.sendStatus(200);
});

// 4. Body Parser
app.use(express.json());

// 5. Safe Database Connection Middleware (With Try/Catch)
let isConnected = false;
const connectDatabase = async (req, res, next) => {
    if (isConnected) {
        return next();
    }
    try {
        console.log("Connecting to MongoDB...");
        await connectDB();
        isConnected = true;
        console.log("MongoDB Connected Successfully!");
        next();
    } catch (error) {
        console.error("❌ DB Connection Failed:", error.message);
        // Server crash karne ke bajaye response bhejrein taake 500 error handle ho sky
        return res.status(500).json({ 
            success: false, 
            message: "Database connection failed", 
            error: error.message 
        });
    }
};

// Database middleware apply karein
app.use(connectDatabase);

// 6. Routes
app.use('/api/bookings', bookingRoutes);

app.get("/", (req, res) => {
    res.json({ success: true, message: "API running on Vercel" });
});

// Local environment ke liye listen (Vercel isko ignore karega)
if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;