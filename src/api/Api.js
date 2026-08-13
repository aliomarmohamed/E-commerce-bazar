import axios from "axios";
import sampleProducts from "../data/sampleProducts.js";

// 1. دالة جلب المنتجات (يحاول جلبها من fakestore, وعلى الفشل يستخدم بيانات محلية)
export async function productsData() {
  try {
    const products = await axios.get("https://fakestoreapi.com/products");
    // Normalize products to include `_id` (used across the app) and
    // replace images with neutral placeholders to avoid photos of people
    if (products && Array.isArray(products.data)) {
      products.data = products.data.map((p, i) => ({
        ...p,
        _id: p.id || p._id || String(Math.random()).slice(2),
        // Use local product SVG placeholders from /public/images
        image: `${process.env.PUBLIC_URL || ''}/images/kids-prod${(i % 3) + 1}.svg`,
      }));
    }
    return products;
  } catch (error) {
    console.error("Error fetching products, falling back to local data:", error && error.message ? error.message : error);
    // Use local sample products as a fallback so the UI remains functional
    return { data: sampleProducts.map((p) => ({ ...p, _id: p.id })) };
  }
}

// 2. أداة الاتصال الموحدة بالسيرفر المحلي والـ Vercel لاحقاً
const API_BASE = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');

const localAPI = axios.create({
  baseURL: API_BASE,
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
