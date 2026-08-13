import axios from "axios";
import sampleProducts from "../data/sampleProducts.js";

// 1. دالة جلب المنتجات (يحاول جلبها من fakestore, وعلى الفشل يستخدم بيانات محلية)
export async function productsData() {
  // By default use local sample products to avoid external network errors and
  // to guarantee our images are always neutral and available. Set
  // `REACT_APP_USE_REMOTE_PRODUCTS=true` in env to attempt fetching remote
  // products (not recommended for production without guarantees).
  const allowRemote = process.env.REACT_APP_USE_REMOTE_PRODUCTS === "true";
  if (!allowRemote) {
    return { data: sampleProducts.map((p, i) => ({ ...p, _id: p.id || String(i + 1), image: `${process.env.PUBLIC_URL || ''}/images/kids-prod${(i % 3) + 1}.svg` })) };
  }

  try {
    const products = await axios.get("https://fakestoreapi.com/products");
    if (products && Array.isArray(products.data)) {
      products.data = products.data.map((p, i) => ({
        ...p,
        _id: p.id || p._id || String(Math.random()).slice(2),
        image: `${process.env.PUBLIC_URL || ''}/images/kids-prod${(i % 3) + 1}.svg`,
      }));
    }
    return products;
  } catch (error) {
    console.error("Error fetching products, falling back to local data:", error && error.message ? error.message : error);
    return { data: sampleProducts.map((p, i) => ({ ...p, _id: p.id || String(i + 1), image: `${process.env.PUBLIC_URL || ''}/images/kids-prod${(i % 3) + 1}.svg` })) };
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
