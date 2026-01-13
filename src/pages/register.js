import React, { useState } from 'react';
import {
    FiUser,
    FiMail,
    FiPhone,
    FiBriefcase,
    FiArrowRight,
    FiArrowLeft,
    FiRefreshCw,
    FiCheckCircle,
    FiSmartphone
} from 'react-icons/fi';

const Register = () => {
    const [step, setStep] = useState(1); // 1: Basic, 2: Business, 3: OTP
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        // Step 1 - Basic Details
        name: '',
        email: '',
        mobile: '',

        // Step 2 - Business Details
        firmNameShort: '',
        firmNameLong: '',

        // Step 3 - OTP
        otp: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNext = (e) => {
        e.preventDefault();
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const handleBasicSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setStep(2);
        }, 1000);
    };

    const handleBusinessSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setStep(3);
        }, 1000);
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate OTP verification
        setTimeout(() => {
            setLoading(false);
            alert('Registration successful!');
        }, 1500);
    };

    const handleResendOtp = () => {
        alert('OTP has been resent to your mobile!');
    };

    // Progress Steps
    const steps = [
        { number: 1, title: 'Basic Details' },
        { number: 2, title: 'Business Details' },
        { number: 3, title: 'Verify OTP' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">

                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <span className="text-white font-bold text-lg">LM</span>
                    </div>
                    <h1 className="text-xl font-bold">Register to OOMS! 👋</h1>
                    <p className="text-blue-100 text-sm mt-1">Complete your registration in 3 simple steps</p>
                </div>

                {/* Progress Steps */}
                <div className="px-6 pt-4">
                    <div className="flex justify-between items-center mb-6">
                        {steps.map((stepItem, index) => (
                            <div key={stepItem.number} className="flex flex-col items-center flex-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= stepItem.number
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-300 text-gray-600'
                                    }`}>
                                    {step > stepItem.number ? <FiCheckCircle className="text-xs" /> : stepItem.number}
                                </div>
                                <span className={`text-xs mt-1 hidden sm:block ${step >= stepItem.number ? 'text-blue-600 font-medium' : 'text-gray-500'
                                    }`}>
                                    {stepItem.title}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form */}
                <div className="p-6">
                    {/* Step 1: Basic Details */}
                    {step === 1 && (
                        <form onSubmit={handleBasicSubmit} className="space-y-4">
                            <div className="space-y-3">
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                        placeholder="Enter your name"
                                        required
                                    />
                                    <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>

                                <div className="relative">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                        placeholder="Enter your email"
                                        required
                                    />
                                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>

                                <div className="relative">
                                    <input
                                        type="tel"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                        placeholder="Enter your mobile"
                                        required
                                    />
                                    <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
                            >
                                {loading ? (
                                    <>
                                        <FiRefreshCw className="animate-spin mr-2" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Continue
                                        <FiArrowRight className="ml-2" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {/* Step 2: Business Details */}
                    {step === 2 && (
                        <form onSubmit={handleBusinessSubmit} className="space-y-4">
                            <div className="space-y-3">
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="firmNameShort"
                                        value={formData.firmNameShort}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                        placeholder="Enter your firm name (Short)"
                                        required
                                    />
                                    <FiBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>

                                <div className="relative">
                                    <input
                                        type="text"
                                        name="firmNameLong"
                                        value={formData.firmNameLong}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                        placeholder="Enter your firm name (Long)"
                                        required
                                    />
                                    <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
                                >
                                    <FiArrowLeft className="mr-2" />
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
                                >
                                    {loading ? (
                                        <>
                                            <FiRefreshCw className="animate-spin mr-2" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            Continue
                                            <FiArrowRight className="ml-2" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Step 3: OTP Verification */}
                    {step === 3 && (
                        <form onSubmit={handleOtpSubmit} className="space-y-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                                <FiSmartphone className="text-blue-600 mx-auto mb-2 text-xl" />
                                <p className="text-blue-800 text-sm font-medium">OTP sent to your mobile</p>
                                <p className="text-blue-700 text-xs mt-1">+91 {formData.mobile}</p>
                            </div>

                            <div className="space-y-3">
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="otp"
                                        value={formData.otp}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-center text-lg font-mono tracking-widest"
                                        placeholder="Enter 6-digit OTP"
                                        maxLength="6"
                                        required
                                    />
                                    <FiSmartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Didn't receive code?</span>
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                                >
                                    <FiRefreshCw className="mr-1" />
                                    Resend OTP
                                </button>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
                                >
                                    <FiArrowLeft className="mr-2" />
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || formData.otp.length !== 6}
                                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
                                >
                                    {loading ? (
                                        <>
                                            <FiRefreshCw className="animate-spin mr-2" />
                                            Verifying...
                                        </>
                                    ) : (
                                        <>
                                            Complete
                                            <FiCheckCircle className="ml-2" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Footer */}
                    <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                        <p className="text-gray-600 text-sm">
                            Already have an account?{' '}
                            <button
                                onClick={() => window.location.href = '/login'}
                                className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Sign in
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;