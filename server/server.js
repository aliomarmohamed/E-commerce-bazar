require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

const app = express();

// 🚀 تحسينات الحماية والأداء للـ ATS لعام 2026
app.use(helmet()); 
app.use(compression()); 

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: "Too many requests, please try again later."
});
app.use("/api/", limiter);

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true 
}));
const paymentRoutes = require("./src/routes/payment.routes");
app.use("/api/payments", paymentRoutes);

app.get("/", (req, res) => {
    res.send("Bazar E-Commerce Production-Ready API");
});

app.use(express.json());

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`🚀 Server is running on Port ${port}`);
});
