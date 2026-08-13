import axios from "axios";

// 1. دالة جلب المنتجات (تم إرجاع الرابط البرمجي الصحيح والشغال للمنتجات)
export async function productsData() {
  try {
    const products = await axios.get("https://fakestoreapi.com/products");
    // Normalize products to include `_id` (used across the app) and
    // replace images with neutral placeholders to avoid photos of people
    if (products && Array.isArray(products.data)) {
      products.data = products.data.map((p) => ({
        ...p,
        _id: p.id || p._id || String(Math.random()).slice(2),
        // Replace external images with a deterministic placeholder
        image: `https://placehold.co/400x400?text=${encodeURIComponent(p.title)}`,
      }));
    }
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

// 2. أداة الاتصال الموحدة بالسيرفر المحلي والـ Vercel لاحقاً
const localAPI = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001',
  headers: { 'Content-Type': 'application/json' },
});

// 3. دالة إرسال طلبات بوابات الدفع (Stripe + Fawry)
export const requestPayment = async (endpoint, data) => {
  try {
    const response = await localAPI.post(`/api/payments/${endpoint}`, data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('فشل الاتصال بالخادم');
  }
};

// 4. دالة إرسال طلبات الحسابات البديلة لـ Firebase (تسجيل ودخول) إلى MongoDB
export const requestAuth = async (endpoint, data) => {
  try {
    const response = await localAPI.post(`/api/auth/${endpoint}`, data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('حدث خطأ في عملية الحساب');
  }
};
