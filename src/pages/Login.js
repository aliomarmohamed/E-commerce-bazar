import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "../redux/bazarSlice";
import { useNavigate } from "react-router-dom";
import { requestAuth } from "../api/Api"; // استدعاء دالة الاتصال بالباك إند وقاعدة البيانات

const Login = () => {
    const userInfo = useSelector((state) => state.bazar.userInfo);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // حالات حفظ بيانات النموذج الموحد
    const [isRegister, setIsRegister] = useState(false); // للتبديل بين الدخول وإنشاء حساب
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);

    // معالجة إرسال البيانات إلى السيرفر المونجو دي بي
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password || (isRegister && !name)) {
            toast.error("Please fill in all required fields!");
            return;
        }

        setLoading(true);
        const endpoint = isRegister ? "register" : "login";
        const payload = isRegister ? { name, email, password, phone } : { email, password };

        try {
            const response = await requestAuth(endpoint, payload);
            
            if (response.success) {
                toast.success(isRegister ? "Account Created Successfully!" : "Logged In Successfully!");
                
                // حفظ بيانات العميل داخل Redux State
                dispatch(
                    addUser({
                        name: response.user.name,
                        email: response.user.email,
                        phone: response.user.phone,
                    })
                );

                // توجيه العميل للصفحة الرئيسية بعد نجاح الدخول
                setTimeout(() => {
                    navigate("/");
                }, 1500);
            }
        } catch (error) {
            toast.error(error.error || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // معالجة تسجيل الخروج وحذف البيانات من المتجر
    const handleSignOut = () => {
        dispatch(removeUser());
        toast.success("Logged Out Successfully!");
    };

    return (
        <div className="w-full flex flex-col items-center justify-center gap-10 py-20 bg-gray-50">
            {!userInfo ? (
                <div className="w-full max-w-md bg-white border p-8 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-titleFont font-bold text-center mb-6">
                        {isRegister ? "Create an Account" : "Sign In to Bazar"}
                    </h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {isRegister && (
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-semibold text-gray-700">Full Name</label>
                                <input 
                                    type="text" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full h-11 border px-3 rounded-md focus:border-black outline-none duration-300"
                                    placeholder="John Doe"
                                />
                            </div>
                        )}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-700">Email Address</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-11 border px-3 rounded-md focus:border-black outline-none duration-300"
                                placeholder="example@email.com"
                                required
                            />
                        </div>
                        {isRegister && (
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-semibold text-gray-700">Phone Number (Optional)</label>
                                <input 
                                    type="text" 
                                    value={phone} 
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full h-11 border px-3 rounded-md focus:border-black outline-none duration-300"
                                    placeholder="01000000000"
                                />
                            </div>
                        )}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-700">Password</label>
                            <input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-11 border px-3 rounded-md focus:border-black outline-none duration-300"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-black text-white text-base font-semibold tracking-wide rounded-md hover:bg-gray-800 duration-300 disabled:bg-gray-400 mt-2"
                        >
                            {loading ? "Processing..." : isRegister ? "Sign Up" : "Sign In"}
                        </button>
                    </form>
                    <p className="text-sm text-center text-gray-600 mt-4">
                        {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
                        <span 
                            onClick={() => setIsRegister(!isRegister)}
                            className="text-black font-semibold underline cursor-pointer ml-1"
                        >
                            {isRegister ? "Sign In" : "Sign Up Now"}
                        </span>
                    </p>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-4 bg-white border p-8 rounded-lg shadow-sm max-w-sm w-full text-center">
                    <p className="text-lg font-semibold">Welcome back, <br/><span className="text-xl font-bold">{userInfo.name}</span>!</p>
                    <p className="text-sm text-gray-500">{userInfo.email}</p>
                    <button
                        onClick={handleSignOut}
                        className="bg-black text-white text-base py-3 w-full tracking-wide rounded-md hover:bg-gray-800 duration-300 mt-2"
                    >
                        Sign Out
                    </button>
                </div>
            )}
            <ToastContainer
                position="top-left"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </div>
    );
};

export default Login;
