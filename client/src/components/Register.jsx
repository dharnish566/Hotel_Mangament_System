import React, { useState } from 'react';
import { Check, Eye, EyeOff } from 'lucide-react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'


const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        photo: ''
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agree, setAgree] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const errors = {};

        if (!formData.name) errors.name = 'Full name is required';
        if (!formData.email) errors.email = 'Email is required';
        if (!formData.password) errors.password = 'Password is required';
        if (!confirmPassword) errors.confirmPassword = 'Please confirm your password';
        if (formData.password && confirmPassword && formData.password !== confirmPassword) {
            errors.general = 'Passwords do not match';  // 👈 custom key for general error
        }
        if (!agree) errors.agree = 'You must agree to the terms';

        setFieldErrors(errors);

        if (Object.keys(errors).length > 0) return;

        if (formData.password !== confirmPassword) {
            setFieldErrors({ confirmPassword: 'Passwords do not match' });
            return;
        }

        const role = formData.email === "dharnish144@gmail.com" ? "admin" : "user";
        setIsLoading(true);

        console.log("Entering..")

        try {
            const response = await axios.post("http://localhost:3000/api/auth/register", {
                ...formData,
                role,
                isGoogleUser: location.state?.isGoogleUser || false,
            });


            console.log("response..",response)
            const { token, user } = response.data;
            login(user, token);

            alert('Registration successful!');
            navigate('/');
            
            console.log("naviagted..")
        } catch (err) {
            const msg = err.response?.data?.message || "Registration failed!";
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };


    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state?.isGoogleUser) {
            const { email, name, picture } = location.state;
            setFormData(prev => ({
                ...prev,
                email,
                name,
                photo: picture,
            }));
        }
    }, [location.state]);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Google Logo */}
                <div className="flex justify-center mb-8">
                    <img
                        src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
                        alt="Google"
                        className="h-12"
                    />
                </div>

                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                    <p className="text-gray-600">Please fill in the information below to create your account</p>
                </div>

                {/* Form Container */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-8">
                    {/* Profile Section */}
                    {formData.photo && (
                        <div className="flex justify-center mb-8">
                            <div className="relative">
                                <img
                                    src={formData.photo}
                                    alt="Profile"
                                    className="w-20 h-20 rounded-full border-2 border-gray-300 object-cover"
                                />
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-800 rounded-full border-2 border-white flex items-center justify-center">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <div className="space-y-6">
                        {/* Personal Information */}
                        <Box
                            component="div"
                            sx={{ '& .MuiTextField-root': { mb: 3 } }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <TextField
                                    name="name"
                                    label="Full Name"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    variant="outlined"
                                    fullWidth
                                    InputLabelProps={{
                                        sx: {
                                            "& .MuiFormLabel-asterisk": {
                                                color: "red",
                                            },
                                        },
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#d1d5db',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#6b7280',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#374151',
                                            },
                                        },
                                    }}
                                />

                                <TextField
                                    name="email"
                                    label="Email Address"
                                    placeholder="Enter your email address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    type="email"
                                    disabled={location.state?.isGoogleUser}
                                    variant="outlined"
                                    fullWidth
                                    InputLabelProps={{
                                        sx: {
                                            "& .MuiFormLabel-asterisk": {
                                                color: "red",
                                            },
                                        },
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#d1d5db',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#6b7280',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#374151',
                                            },
                                        },
                                    }}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <TextField
                                    name="password"
                                    label="Password"
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    error={!!fieldErrors.password}
                                    helperText={fieldErrors.password}
                                    required
                                    type={showPassword ? 'text' : 'password'}
                                    variant="outlined"
                                    fullWidth
                                    InputLabelProps={{
                                        sx: {
                                            "& .MuiFormLabel-asterisk": {
                                                color: "red",
                                            },
                                        },
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                    sx={{ color: '#6b7280' }}
                                                >
                                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#d1d5db',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#6b7280',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#374151',
                                            },
                                        },
                                    }}
                                />

                                <TextField
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    placeholder="Re-enter your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    variant="outlined"
                                    error={!!fieldErrors.password}
                                    helperText={fieldErrors.password}
                                    fullWidth
                                    InputLabelProps={{
                                        sx: {
                                            "& .MuiFormLabel-asterisk": {
                                                color: "red",
                                            },
                                        },
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    edge="end"
                                                    sx={{ color: '#6b7280' }}
                                                >
                                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#d1d5db',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#6b7280',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#374151',
                                            },
                                        },
                                    }}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <TextField
                                    name="phone"
                                    label="Phone Number"
                                    placeholder="Enter your phone number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    type="tel"
                                    variant="outlined"
                                    fullWidth
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#d1d5db',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#6b7280',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#374151',
                                            },
                                        },
                                    }}
                                />

                                <TextField
                                    name="address"
                                    label="Address"
                                    placeholder="Enter your address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    variant="outlined"
                                    fullWidth
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#d1d5db',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#6b7280',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#374151',
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </Box>

                        {/* Terms and Conditions */}
                        <div className="border-t border-gray-200 pt-6">
                            <div className="flex items-start space-x-3">
                                <input
                                    type="checkbox"
                                    id="agree"
                                    checked={agree}
                                    onChange={() => setAgree(!agree)}
                                    className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500 focus:ring-2 mt-1"
                                />
                                <label htmlFor="agree" className="text-sm text-gray-700 leading-5">
                                    I agree to the{' '}
                                    <button type="button" className="text-gray-900 underline hover:text-gray-700">
                                        Terms and Conditions
                                    </button>{' '}
                                    and{' '}
                                    <button type="button" className="text-gray-900 underline hover:text-gray-700">
                                        Privacy Policy
                                    </button>
                                </label>
                            </div>
                        </div>

                        {/* password check message */}
                        {fieldErrors.general && (
                            <p className="text-sm text-red-600 mt-1 ml-7">{fieldErrors.general}</p>
                        )}

                        {/* Error Message */}
                        {fieldErrors.agree && (
                            <p className="text-sm text-red-600 mt-1 ml-7">{fieldErrors.agree}</p>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white py-3 px-6 rounded-md font-medium transition duration-200 cursor-pointer"
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>

                        {/* Sign In Link */}
                        <div className="text-center pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <button
                                    type="button"
                                    className="text-gray-900 font-medium hover:text-gray-700 underline cursor-pointer"
                                    onClick={() => navigate('/login')}
                                >
                                    Sign in here
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;