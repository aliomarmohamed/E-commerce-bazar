require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const mongoose = require('mongoose');

const paymentRoutes = require("./src/routes/payment.routes");
const authRoutes = require('./src/routes/auth.routes');

const app = express();

app.use(helmet({ contentSecurityPolicy: false })); 
app.use(compression()); 
app.use(express.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: "Too many requests, please try again later."
});
app.use("/api/", limiter);

app.use(cors({
    origin: true,
    credentials: true 
}));

app.use("/api/payments", paymentRoutes);
app.use('/api/auth', authRoutes);

app.get("/api", (req, res) => {
    res.json({ message: "Bazar E-Commerce Production-Ready API" });
});

app.get("/", (req, res) => {
    res.send("Bazar E-Commerce Production-Ready API");
});

// Cache MongoDB connection for serverless invocations
let isConnected = false;
const connectDB = async () => {
    if (isConnected || mongoose.connection.readyState === 1) {
        isConnected = true;
        return;
    }
    if (process.env.MONGO_URI) {
        try {
            await mongoose.connect(process.env.MONGO_URI);
            isConnected = true;
            console.log("Connected to MongoDB successfully! ✅");
        } catch (err) {
            console.error("MongoDB connection error: ❌", err);
        }
    }
};

app.use(async (req, res, next) => {
    await connectDB();
    next();
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const port = process.env.PORT || 5000;
    connectDB().then(() => {
        app.listen(port, () => {
            console.log(`🚀 Server is running on Port ${port}`);
        });
    });
}

module.exports = app;
