require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const mongoose = require('mongoose'); // 1. استدعاء مكتبة قاعدة البيانات

// استدعاء مسارات المشروع الجاهزة
const paymentRoutes = require("./src/routes/payment.routes");
const authRoutes = require('./src/routes/auth.routes'); // 2. استدعاء مسارات الحسابات الجديدة

const app = express();

// الـ Middlewares الرئيسية للحماية والأداء والملفات
app.use(helmet()); 
app.use(compression()); 
app.use(express.json()); // تم نقلها للأعلى لتقرأ البيانات القادمة من الفرونت إند أولاً

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

// 3. ربط المسارات (Routes) بالخادم
app.use("/api/payments", paymentRoutes);
app.use('/api/auth', authRoutes); // ربط مسار التسجيل والدخول البديل لـ Firebase

app.get("/", (req, res) => {
    res.send("Bazar E-Commerce Production-Ready API");
});

// 4. الاتصال بقاعدة بيانات MongoDB وتشغيل السيرفر تلقائياً عند النجاح
const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully! ✅");
    // تشغيل السيرفر فقط بعد نجاح اتصال قاعدة البيانات لضمان عدم حدوث أخطاء
    app.listen(port, () => {
        console.log(`🚀 Server is running on Port ${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error: ❌", err);
  });
