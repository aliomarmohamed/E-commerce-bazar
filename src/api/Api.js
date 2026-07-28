import axios from "axios";

// 1. الدالة القديمة الخاصة بجلب المنتجات (تُركت كما هي لضمان عدم حدوث أي خطأ في الموقع)
export async function productsData() {
  const products = await axios.get(
    "https://reactbd.com"
  );
  return products;
}

// 2. أداة الاتصال الموحدة بالسيرفر المحلي والـ Vercel لاحقاً
const localAPI = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001',
  headers: { 'Content-Type': 'application/json' },
});

// 3. الدالة الجديدة والمسؤولة عن إرسال طلبات بوابة دفع Stripe و Fawry
export const requestPayment = async (endpoint, data) => {
  try {
    const response = await localAPI.post(`/api/payments/${endpoint}`, data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('فشل الاتصال بالخادم');
  }
};
