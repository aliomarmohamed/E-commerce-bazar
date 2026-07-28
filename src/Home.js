import React, { useEffect, useState } from "react";
import Banner from "./components/Banner";
import Products from "./components/Products";
import { productsData } from "./api/Api"; // استدعاء دالة جلب المنتجات مباشرة من ملف الـ Api

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // جلب المنتجات في الخلفية بعد أن تفتح واجهة الموقع فوراً لمنع الشاشة البيضاء
                const res = await productsData();
                if (res && res.data) {
                    setProducts(res.data);
                }
            } catch (error) {
                console.error("Failed to load products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div>
            <Banner />
            {loading ? (
                // رسالة انتظار بسيطة ومحترفة لحين تحميل المنتجات دون حجب الشاشة كاملة
                <div className="text-center py-10 font-bold text-xl text-gray-600">
                    Loading Products...
                </div>
            ) : (
                <Products products={products} />
            )}
        </div>
    );
};

export default Home;
