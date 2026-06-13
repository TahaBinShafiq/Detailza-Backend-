const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const bookingRoutes = require('./routes/bookingRoutes');

dotenv.config();

connectDB();

const app = express();

// CORS Policy
app.use(
    cors({
        origin: [
            'https://detailza-backend.vercel.app',
            'http://localhost:3000',
        ],
        methods: ['POST'],
        credentials: true,
    })
);

// Middlewares
app.use(express.json());

// Routes
app.use('/api/bookings', bookingRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});