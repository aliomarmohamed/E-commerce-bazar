import React, { useState } from 'react';
import { requestPayment } from '../api/Api'; // استدعاء الدالة الموحدة من ملف Api.js

function CheckoutForm({ totalAmount, userEmail, userMobile }) {
  const [method, setMethod] = useState('stripe'); 
  const [loading, setLoading] = useState(false);
  const [fawryCode, setFawryCode] = useState(null);

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFawryCode(null);

    try {
      if (method === 'stripe') {
        // طلب مفتاح السر من الباك إند لسترايب
        const response = await requestPayment('create-payment-intent', {
          amount: totalAmount,
          currency: 'usd'
        });
        if (response.clientSecret) {
          alert('تم إنشاء عملية Stripe بنجاح! الـ Secret هو: ' + response.clientSecret);
        }
      } else if (method === 'fawry') {
        // طلب فاتورة الدفع من فوري المجاني
        const response = await requestPayment('create-fawry-charge', {
          amount: totalAmount,
          userEmail: userEmail || 'customer@email.com',
          userMobile: userMobile || '01000000000',
          itemId: 'PROD-100',
          itemName: 'E-commerce Bazar Order'
        });
        if (response.referenceNumber) {
          setFawryCode(response.referenceNumber);
        }
      }
    } catch (err) {
      alert('حدث خطأ في المعالجة: ' + (err.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white border rounded-lg shadow-sm">
      <h3 className="text-xl font-bold mb-4 text-center">إجمالي المطلوب: ${totalAmount}</h3>
      <form onSubmit={handleProcessPayment} className="space-y-4">
        <div className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
          <label className="flex items-center gap-2 cursor-pointer w-full">
            <input type="radio" value="stripe" checked={method === 'stripe'} onChange={() => setMethod('stripe')} />
            <span className="font-semibold text-gray-800">💳 دفع دولي بالبطاقة (Stripe)</span>
          </label>
        </div>
        <div className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
          <label className="flex items-center gap-2 cursor-pointer w-full">
            <input type="radio" value="fawry" checked={method === 'fawry'} onChange={() => setMethod('fawry')} />
            <span className="font-semibold text-gray-800">🏪 دفع محلي كشك/محفظة (Fawry)</span>
          </label>
        </div>

        <button type="submit" disabled={loading} className="w-full py-3 bg-black text-white font-bold rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400">
          {loading ? 'جاري الاتصال بالبوابة...' : 'تأكيد ودفع'}
        </button>
      </form>

      {fawryCode && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-md text-center">
          <p className="mb-2">توجه لأقرب كشك فوري واستخدم كود الدفع التالي:</p>
          <strong className="text-2xl font-mono text-green-600 tracking-wider">{fawryCode}</strong>
        </div>
      )}
    </div>
  );
}

export default CheckoutForm;
