import React, { useState, useEffect, useRef } from 'react';
import {
    FiUser,
    FiLock,
    FiMail,
    FiArrowRight,
    FiArrowLeft,
    FiRefreshCw,
    FiSmartphone,
    FiCheckCircle,
    FiEye,
    FiEyeOff,
    FiBriefcase,
    FiGitBranch,
    FiCheck
} from 'react-icons/fi';

const Login = () => {
    const [phase, setPhase] = useState(1); // 1: Credentials, 2: OTP
    const [currentStep, setCurrentStep] = useState(0); // 0: username, 1: app, 2: branch, 3: password
    const [loading, setLoading] = useState(false);
    const [fullScreenLoading, setFullScreenLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        app_id: '',
        branch_id: '',
        password: '',
        otp: ''
    });
    const [apps, setApps] = useState([]);
    const [branches, setBranches] = useState([]);
    const [completedSteps, setCompletedSteps] = useState([]);

    const inputRefs = {
        username: useRef(null),
        app_id: useRef(null),
        branch_id: useRef(null),
        password: useRef(null)
    };

    const steps = [
        { key: 'username', label: 'Username/Email', icon: FiUser, placeholder: 'Enter your username or email' },
        { key: 'app_id', label: 'Application', icon: FiBriefcase, placeholder: 'Select your application' },
        { key: 'branch_id', label: 'Branch', icon: FiGitBranch, placeholder: 'Select your branch' },
        { key: 'password', label: 'Password', icon: FiLock, placeholder: 'Enter your password', type: 'password' }
    ];

    useEffect(() => {
        // Focus on current input when step changes
        if (phase === 1) {
            const currentKey = steps[currentStep].key;
            setTimeout(() => {
                inputRefs[currentKey]?.current?.focus();
            }, 100);
        }
    }, [currentStep, phase]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Auto-advance if current field is filled
        if (phase === 1 && name === steps[currentStep].key && value.trim()) {
            if (name === 'username') {
                handleUsernameSubmit(value);
            } else if (name === 'app_id') {
                handleAppSelect(value);
            } else if (name === 'branch_id') {
                setTimeout(() => handleNextStep(), 300);
            }
        }
    };

    const handleNextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
            setCompletedSteps(prev => [...prev, currentStep]);
        }
    };

    const handlePrevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            setCompletedSteps(prev => prev.filter(step => step !== currentStep - 1));
        }
    };

    const handleUsernameSubmit = async (username = formData.username) => {
        if (!username.trim()) return;

        setFullScreenLoading(true);

        try {
            const formDataObj = new FormData();
            formDataObj.append('login_id', username);

            const response = await fetch('https://ooms.in/api/auth?fetch_apps', {
                method: 'POST',
                body: formDataObj
            });

            const result = await response.json();

            if (result.apps && result.apps.length > 0) {
                setApps(result.apps);
                handleNextStep();
            } else {
                alert('No apps found for this username/email');
            }
        } catch (error) {
            console.error('Error fetching apps:', error);
            alert('Error fetching apps. Please try again.');
        } finally {
            setFullScreenLoading(false);
        }
    };

    const handleAppSelect = async (appId = formData.app_id) => {
        if (!appId) return;

        setLoading(true);

        try {
            const formDataObj = new FormData();
            formDataObj.append('app_id', appId);
            formDataObj.append('login_id', formData.username);

            const response = await fetch('https://ooms.in/api/auth?fetch_branches', {
                method: 'POST',
                body: formDataObj
            });

            const result = await response.json();

            if (result.branches && result.branches.length > 0) {
                setBranches(result.branches);
                handleNextStep();
            } else {
                alert('No branches found for this app');
            }
        } catch (error) {
            console.error('Error fetching branches:', error);
            alert('Error fetching branches. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCredentialsSubmit = async (e) => {
        e.preventDefault();
        if (!formData.password) {
            alert('Please enter password');
            return;
        }

        setLoading(true);

        try {
            const formDataObj = new FormData();
            formDataObj.append('login_id', formData.username);
            formDataObj.append('app_id', formData.app_id);
            formDataObj.append('branch_id', formData.branch_id);
            formDataObj.append('password', formData.password);

            const response = await fetch('https://ooms.in/api/auth?send_login_otp', {
                method: 'POST',
                body: formDataObj
            });

            const result = await response.json();

            if (result.msg === "OTP generated successfully") {
                setPhase(2);
                setCompletedSteps([0, 1, 2, 3]); // Mark all steps as completed
            } else {
                alert(result.error || 'Error generating OTP');
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            alert('Error sending OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        if (formData.otp.length !== 6) {
            alert('Please enter 6-digit OTP');
            return;
        }

        setLoading(true);

        try {
            const formDataObj = new FormData();
            formDataObj.append('login_id', formData.username);
            formDataObj.append('app_id', formData.app_id);
            formDataObj.append('branch_id', formData.branch_id);
            formDataObj.append('password', formData.password);
            formDataObj.append('otp', formData.otp);

            const response = await fetch('https://ooms.in/api/auth?application_login', {
                method: 'POST',
                body: formDataObj
            });

            const result = await response.json();

            if (result.msg) {
                alert('Login successful!');
                // Handle successful login (store tokens, redirect, etc.)
                console.log('Login successful:', result);
            } else {
                alert(result.error || 'Login failed');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            alert('Error verifying OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setLoading(true);

        try {
            const formDataObj = new FormData();
            formDataObj.append('login_id', formData.username);
            formDataObj.append('app_id', formData.app_id);
            formDataObj.append('branch_id', formData.branch_id);
            formDataObj.append('password', formData.password);

            const response = await fetch('https://ooms.in/api/auth?send_login_otp', {
                method: 'POST',
                body: formDataObj
            });

            const result = await response.json();

            if (result.msg === "OTP generated successfully") {
                alert('OTP has been resent!');
            } else {
                alert(result.error || 'Error resending OTP');
            }
        } catch (error) {
            console.error('Error resending OTP:', error);
            alert('Error resending OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleStepClick = (stepIndex) => {
        if (completedSteps.includes(stepIndex)) {
            setCurrentStep(stepIndex);
        }
    };

    const getStepStatus = (stepIndex) => {
        if (stepIndex === currentStep) return 'current';
        if (completedSteps.includes(stepIndex)) return 'completed';
        return 'pending';
    };

    // Full Screen Loading Component
    if (fullScreenLoading) {
        return (
            <div className="min-h-screen bg-blue-600 flex items-center justify-center">
                <div className="text-center text-white">
                    <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold">Loading Apps...</h2>
                    <p className="text-blue-100 mt-2">Please wait while we fetch your applications</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">

                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <span className="text-white font-bold text-lg">LM</span>
                    </div>
                    <h1 className="text-xl font-bold">
                        {phase === 1 ? 'Welcome Back' : 'Verify Identity'}
                    </h1>
                    <p className="text-blue-100 text-sm mt-1">
                        {phase === 1 ? 'Enter your credentials to continue' : 'Enter OTP sent to your device'}
                    </p>
                </div>

                {/* Progress Steps */}
                {phase === 1 && (
                    <div className="px-6 pt-4">
                        <div className="flex justify-between items-center mb-6">
                            {steps.map((step, index) => {
                                const status = getStepStatus(index);
                                const Icon = step.icon;

                                return (
                                    <div
                                        key={step.key}
                                        className="flex flex-col items-center flex-1 cursor-pointer"
                                        onClick={() => handleStepClick(index)}
                                    >
                                        <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200
                      ${status === 'completed' ? 'bg-green-500 text-white' :
                                                status === 'current' ? 'bg-blue-600 text-white ring-2 ring-blue-300' :
                                                    'bg-gray-300 text-gray-600'}
                    `}>
                                            {status === 'completed' ? <FiCheck className="text-xs" /> : <Icon className="text-xs" />}
                                        </div>
                                        <span className={`
                      text-xs mt-1 hidden sm:block text-center transition-colors
                      ${status === 'completed' ? 'text-green-600 font-medium' :
                                                status === 'current' ? 'text-blue-600 font-medium' :
                                                    'text-gray-500'}
                    `}>
                                            {step.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Form */}
                <div className="p-6">
                    {/* Phase 1: Sequential Credentials */}
                    {phase === 1 && (
                        <form onSubmit={handleCredentialsSubmit} className="space-y-6">
                            {/* Current Input Field */}
                            <div className="space-y-3">
                                <label className="block text-sm font-semibold text-gray-700">
                                    {steps[currentStep].label}
                                </label>
                                <div className="relative">
                                    {steps[currentStep].key === 'app_id' ? (
                                        <select
                                            ref={inputRefs.app_id}
                                            name="app_id"
                                            value={formData.app_id}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 border-2 border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200"
                                            required
                                        >
                                            <option value="">Select application...</option>
                                            {apps.map(app => (
                                                <option key={app.app_id} value={app.app_id}>
                                                    {app.name} ({app.app_id})
                                                </option>
                                            ))}
                                        </select>
                                    ) : steps[currentStep].key === 'branch_id' ? (
                                        <select
                                            ref={inputRefs.branch_id}
                                            name="branch_id"
                                            value={formData.branch_id}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 border-2 border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200"
                                            disabled={loading || branches.length === 0}
                                            required
                                        >
                                            <option value="">{loading ? 'Loading branches...' : 'Select branch...'}</option>
                                            {branches.map(branch => (
                                                <option key={branch.branch_id} value={branch.branch_id}>
                                                    {branch.name} ({branch.branch_id})
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            ref={inputRefs[steps[currentStep].key]}
                                            type={steps[currentStep].type || 'text'}
                                            name={steps[currentStep].key}
                                            value={formData[steps[currentStep].key]}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 border-2 border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200"
                                            placeholder={steps[currentStep].placeholder}
                                            required
                                        />
                                    )}

                                    {/* Icon */}
                                    {React.createElement(steps[currentStep].icon, {
                                        className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    })}

                                    {/* Password visibility toggle */}
                                    {steps[currentStep].key === 'password' && (
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <FiEyeOff /> : <FiEye />}
                                        </button>
                                    )}

                                    {/* Loading indicator for branch select */}
                                    {steps[currentStep].key === 'branch_id' && loading && (
                                        <FiRefreshCw className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 animate-spin" />
                                    )}
                                </div>
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handlePrevStep}
                                    disabled={currentStep === 0}
                                    className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    <FiArrowLeft className="mr-2" />
                                    Back
                                </button>

                                {currentStep === steps.length - 1 ? (
                                    <button
                                        type="submit"
                                        disabled={loading || !formData.password}
                                        className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
                                    >
                                        {loading ? (
                                            <>
                                                <FiRefreshCw className="animate-spin mr-2" />
                                                Sending OTP...
                                            </>
                                        ) : (
                                            <>
                                                Send OTP
                                                <FiArrowRight className="ml-2" />
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleNextStep}
                                        disabled={!formData[steps[currentStep].key]}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
                                    >
                                        Continue
                                        <FiArrowRight className="ml-2" />
                                    </button>
                                )}
                            </div>
                        </form>
                    )}

                    {/* Phase 2: OTP Verification */}
                    {phase === 2 && (
                        <form onSubmit={handleOtpSubmit} className="space-y-6">
                            {/* Success Message */}
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                                <FiCheckCircle className="text-green-600 mx-auto mb-2 text-xl" />
                                <p className="text-green-800 text-sm font-medium">Credentials Verified!</p>
                                <p className="text-green-700 text-xs mt-1">OTP sent to your registered device</p>
                            </div>

                            {/* User Info Summary */}
                            <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Username:</span>
                                    <span className="font-medium">{formData.username}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">App:</span>
                                    <span className="font-medium">
                                        {apps.find(app => app.app_id === formData.app_id)?.name} ({formData.app_id})
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Branch:</span>
                                    <span className="font-medium">
                                        {branches.find(branch => branch.branch_id === formData.branch_id)?.name} ({formData.branch_id})
                                    </span>
                                </div>
                            </div>

                            {/* OTP Input */}
                            <div className="space-y-3">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Enter OTP
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="otp"
                                        value={formData.otp}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-3 border-2 border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-center text-lg font-mono tracking-widest transition-all duration-200"
                                        placeholder="Enter 6-digit OTP"
                                        maxLength="6"
                                        required
                                        autoFocus
                                    />
                                    <FiSmartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>

                            {/* OTP Actions */}
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Didn't receive code?</span>
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={loading}
                                    className="text-blue-600 hover:text-blue-700 font-medium flex items-center disabled:text-gray-400"
                                >
                                    <FiRefreshCw className="mr-1" />
                                    Resend OTP
                                </button>
                            </div>

                            {/* OTP Buttons */}
                            <div className="flex space-x-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setPhase(1)}
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
                                            Verify & Login
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
                            Don't have an account?{' '}
                            <button className="text-blue-600 hover:text-blue-700 font-medium">
                                Sign up
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;