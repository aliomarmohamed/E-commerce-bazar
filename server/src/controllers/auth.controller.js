const User = require('../models/user.model');
const crypto = require('crypto'); // مكتبة مدمجة لتشفير كلمات المرور

// دالة تشفير بسيطة وآمنة
const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
};

// 1. تسجيل حساب جديد
exports.register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "هذا البريد الإلكتروني مسجل بالفعل" });

        const newUser = new User({
            name,
            email,
            password: hashPassword(password),
            phone: phone || "01000000000"
        });

        await newUser.save();
        res.status(201).json({ success: true, user: { name: newUser.name, email: newUser.email, phone: newUser.phone } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. تسجيل الدخول
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.password !== hashPassword(password)) {
            return res.status(401).json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
        }

        res.status(200).json({ success: true, user: { name: user.name, email: user.email, phone: user.phone } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
