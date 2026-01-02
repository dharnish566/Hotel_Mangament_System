import React, { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const cn = (...classes) => {
    return classes.filter(Boolean).join(" ");
};

const Button = ({ children, variant = "default", className = "", ...props }) => {
    const baseStyles =
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    const variantStyles = {
        default: "bg-primary bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    };

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

const Input = ({ className = "", ...props }) => {
    return (
        <input
            className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm text-gray-800 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
            {...props}
        />
    );
};

const RightSection = () => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isHovered, setIsHovered] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
                email,
                password,
            });

            login(res.data.user, res.data.token);

            if (res.data.user.role === "admin") navigate("/owner");
            else navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed!");
        }
    };

    const handleGoogleLogin = async (credentialResponse) => {
        setError("");

        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/google` , {
                credential: credentialResponse.credential,
            });

            login(res.data.user, res.data.token);

            if (res.data.user.role === "admin") navigate("/owner");
            else navigate("/");
        } catch (err) {
            if (err.response?.status === 404) {
                const { email, name, picture, role } = err.response.data;
                navigate("/register", {
                    state: { email, name, picture, role, isGoogleUser: true },
                });
            } else {
                setError(err.response?.data?.message || "Google login failed!");
            }
        }
    };

    return (
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center bg-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-2xl md:text-3xl font-bold mb-1 text-gray-800">Welcome back</h1>
                <p className="text-gray-500 mb-6">Sign in to your account</p>

                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                {/* Google Login */}
                <div className="mb-6 flex justify-center">
                    <GoogleLogin
                        onSuccess={handleGoogleLogin}
                        onError={() => setError("Google sign-in error")}
                    />
                </div>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">or</span>
                    </div>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-1">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-base font-medium text-gray-700 mb-1">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={isPasswordVisible ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                className="pr-10"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                            >
                                {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onHoverStart={() => setIsHovered(true)}
                        onHoverEnd={() => setIsHovered(false)}
                        className="pt-2"
                    >
                        <Button
                            type="submit"
                            className={cn("w-full", isHovered ? "shadow-lg shadow-blue-200" : "")}
                        >
                            <span className="flex items-center justify-center py-2.5">
                                Sign in
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </span>
                            {isHovered && (
                                <motion.span
                                    initial={{ left: "-20%" }}
                                    animate={{ left: "100%" }}
                                    transition={{ duration: 1, ease: "easeInOut" }}
                                    className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                    style={{ filter: "blur(8px)" }}
                                />
                            )}
                        </Button>
                    </motion.div>

                    <p className="text-sm text-center text-gray-600">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        >
                            Sign Up
                        </Link>
                    </p>


                    <div className="text-center mt-2">
                        <Link to="/forgot-password" className="text-blue-600 hover:text-blue-700 text-sm transition-colors">
                            Forgot password?
                        </Link>
                    </div>


                </form>
            </motion.div>
        </div>
    );
};

export default RightSection;
