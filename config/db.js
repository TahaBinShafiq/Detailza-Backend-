const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            // Yeh options connection ko stable rakhte hain aur timeout nahi hone dete
            serverSelectionTimeoutMS: 5000, 
            socketTimeoutMS: 45000,
        });
        console.log("✅ MongoDB Connected Successfully!");
    } catch (error) {
        console.log(error);
        // Server ko crash hone se bachane ke liye process.exit(1) ko temporary hata do
    }
};

module.exports = connectDB;