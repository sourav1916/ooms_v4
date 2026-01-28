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

const BASE_URL = 'https://api.ooms.in/api/v1';

const Login = () => {
    const [phase, setPhase] = useState(1); // 1: Credentials, 2: OTP
    const [currentStep, setCurrentStep] = useState(0); // 0: email, 1: password
    const [loading, setLoading] = useState(false);
    const [fullScreenLoading, setFullScreenLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        otp: ''
    });
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');
    const [completedSteps, setCompletedSteps] = useState([]);
    const [otpExpireTime, setOtpExpireTime] = useState(null);
    const [loginResponse, setLoginResponse] = useState(null);
    const [showBranchSelection, setShowBranchSelection] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);

    const inputRefs = {
        email: useRef(null),
        password: useRef(null)
    };

    const steps = [
        { key: 'email', label: 'Email', icon: FiMail, placeholder: 'Enter your email address' },
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
            if (name === 'email') {
                // Validate email format before proceeding
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailRegex.test(value)) {
                    setTimeout(() => handleNextStep(), 300);
                }
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

    const handleSendOtp = async (e) => {
        e.preventDefault();
        
        if (!formData.email || !formData.password) {
            alert('Please enter both email and password');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${BASE_URL}/auth/login/send-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            const result = await response.json();

            if (result.success) {
                setPhase(2);
                setOtpExpireTime(result.expire);
                setCompletedSteps([0, 1]); // Mark both steps as completed
                
                // Show success message
                alert(result.message);
            } else {
                alert(result.message || 'Error sending OTP');
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
            const response = await fetch(`${BASE_URL}/auth/login/email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    otp: parseInt(formData.otp)
                    // Note: According to your API, branch_id is NOT in the payload
                })
            });

            const result = await response.json();

            if (result.success) {
                setLoginResponse(result);
                
                // Store branches from response
                if (result.branches && result.branches.length > 0) {
                    setBranches(result.branches);
                    
                    // If only one branch, auto-select it
                    if (result.branches.length === 1) {
                        setSelectedBranch(result.branches[0].branch_id);
                        // Complete login with the single branch
                        completeLogin(result, result.branches[0].branch_id);
                    } else {
                        // If multiple branches, show selection
                        setShowBranchSelection(true);
                    }
                } else {
                    // No branches in response, just complete login
                    completeLogin(result, '');
                }
            } else {
                alert(result.message || 'Login failed');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            alert('Error verifying OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleBranchSelect = (branchId) => {
        setSelectedBranch(branchId);
        // Complete login with selected branch
        completeLogin(loginResponse, branchId);
    };

    const completeLogin = (result, branchId) => {
        // Store user details and token in localStorage
        localStorage.setItem('user_token', result.token);
        localStorage.setItem('user_email', formData.email);
        localStorage.setItem('user_username', result.username);
        localStorage.setItem('user_branches', JSON.stringify(result.branches || []));
        localStorage.setItem('token_expire', result.expire_date);
        
        if (branchId) {
            localStorage.setItem('branch_id', branchId);
            // Also find and store the selected branch name
            const selectedBranchInfo = result.branches?.find(b => b.branch_id === branchId);
            if (selectedBranchInfo) {
                localStorage.setItem('branch_name', selectedBranchInfo.name);
                localStorage.setItem('branch_owned', selectedBranchInfo.owned ? 'true' : 'false');
            }
        }
        
        setLoginSuccess(true);
        setShowBranchSelection(false);
        
        // Show success message
        alert('Login successful!');
        
        console.log('Login successful:', result);
        console.log('Token stored:', result.token);
        console.log('Selected branch:', branchId);
        
        // You can redirect to dashboard or next page here
        // window.location.href = '/dashboard';
    };

    const handleResendOtp = async () => {
        setLoading(true);

        try {
            const response = await fetch(`${BASE_URL}/auth/login/send-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            const result = await response.json();

            if (result.success) {
                setOtpExpireTime(result.expire);
                alert('OTP has been resent!');
            } else {
                alert(result.message || 'Error resending OTP');
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
                    <h2 className="text-xl font-semibold">Loading...</h2>
                    <p className="text-blue-100 mt-2">Please wait</p>
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
                        {showBranchSelection ? 'Select Branch' : 
                         loginSuccess ? 'Login Successful' :
                         phase === 1 ? 'Welcome Back' : 'Verify Identity'}
                    </h1>
                    <p className="text-blue-100 text-sm mt-1">
                        {showBranchSelection ? 'Choose your branch to continue' : 
                         loginSuccess ? 'You have successfully logged in' :
                         phase === 1 ? 'Enter your credentials to continue' : 'Enter OTP sent to your email'}
                    </p>
                </div>

                {/* Progress Steps */}
                {phase === 1 && !showBranchSelection && !loginSuccess && (
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
                    {/* Phase 1: Email and Password */}
                    {phase === 1 && !showBranchSelection && !loginSuccess && (
                        <form onSubmit={handleSendOtp} className="space-y-6">
                            {/* Current Input Field */}
                            <div className="space-y-3">
                                <label className="block text-sm font-semibold text-gray-700">
                                    {steps[currentStep].label}
                                </label>
                                <div className="relative">
                                    <input
                                        ref={inputRefs[steps[currentStep].key]}
                                        type={currentStep === 1 ? (showPassword ? 'text' : 'password') : 'email'}
                                        name={steps[currentStep].key}
                                        value={formData[steps[currentStep].key]}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-3 border-2 border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200"
                                        placeholder={steps[currentStep].placeholder}
                                        required
                                    />

                                    {/* Icon */}
                                    {React.createElement(steps[currentStep].icon, {
                                        className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    })}

                                    {/* Password visibility toggle */}
                                    {currentStep === 1 && (
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <FiEyeOff /> : <FiEye />}
                                        </button>
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
                                        disabled={loading || !formData.email || !formData.password}
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

                    {/* Branch Selection Screen */}
                    {showBranchSelection && (
                        <div className="space-y-6">
                            <div className="bg-blue-50 rounded-lg p-4 text-center">
                                <FiCheckCircle className="text-green-600 mx-auto mb-2 text-xl" />
                                <p className="text-green-800 text-sm font-medium">OTP Verified Successfully!</p>
                                <p className="text-blue-700 text-xs mt-1">Please select your branch to continue</p>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Select Branch
                                </label>
                                <div className="space-y-2">
                                    {branches.map((branch) => (
                                        <button
                                            key={branch.branch_id}
                                            type="button"
                                            onClick={() => handleBranchSelect(branch.branch_id)}
                                            disabled={loading}
                                            className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 flex items-center justify-between
                                                ${selectedBranch === branch.branch_id ? 
                                                    'border-green-500 bg-green-50' : 
                                                    'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                                                }`}
                                        >
                                            <div>
                                                <p className="font-medium text-gray-800">{branch.name}</p>
                                                <p className="text-sm text-gray-600">
                                                    ID: {branch.branch_id} 
                                                    {branch.owned && <span className="ml-2 text-green-600">• Owned</span>}
                                                </p>
                                            </div>
                                            {selectedBranch === branch.branch_id && (
                                                <FiCheckCircle className="text-green-600" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex space-x-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowBranchSelection(false);
                                        setPhase(2);
                                    }}
                                    className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
                                >
                                    <FiArrowLeft className="mr-2" />
                                    Back to OTP
                                </button>
                                <button
                                    type="button"
                                    onClick={() => selectedBranch && handleBranchSelect(selectedBranch)}
                                    disabled={!selectedBranch || loading}
                                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
                                >
                                    {loading ? (
                                        <>
                                            <FiRefreshCw className="animate-spin mr-2" />
                                            Continuing...
                                        </>
                                    ) : (
                                        <>
                                            Continue
                                            <FiArrowRight className="ml-2" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Phase 2: OTP Verification */}
                    {phase === 2 && !showBranchSelection && !loginSuccess && (
                        <form onSubmit={handleOtpSubmit} className="space-y-6">
                            {/* Success Message */}
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                                <FiCheckCircle className="text-green-600 mx-auto mb-2 text-xl" />
                                <p className="text-green-800 text-sm font-medium">OTP Sent Successfully!</p>
                                <p className="text-green-700 text-xs mt-1">OTP sent to {formData.email}</p>
                                {otpExpireTime && (
                                    <p className="text-green-600 text-xs mt-1">Expires: {otpExpireTime}</p>
                                )}
                            </div>

                            {/* User Info Summary */}
                            <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Email:</span>
                                    <span className="font-medium">{formData.email}</span>
                                </div>
                            </div>

                            {/* OTP Input */}
                            <div className="space-y-3">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Enter 6-digit OTP
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
                                            Verify OTP
                                            <FiCheckCircle className="ml-2" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Login Success Display */}
                    {loginSuccess && (
                        <div className="space-y-6">
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiCheckCircle className="text-green-600 text-2xl" />
                                </div>
                                <h3 className="font-semibold text-green-800 text-lg">Login Successful!</h3>
                                <p className="text-green-700 text-sm mt-1">Welcome back, {loginResponse?.username || formData.email}</p>
                            </div>

                            <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Email:</span>
                                    <span className="font-medium">{formData.email}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Username:</span>
                                    <span className="font-medium">{loginResponse?.username || 'N/A'}</span>
                                </div>
                                {selectedBranch && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Selected Branch:</span>
                                        <span className="font-medium">
                                            {branches.find(b => b.branch_id === selectedBranch)?.name}
                                        </span>
                                    </div>
                                )}
                                {/* <div className="mt-3 pt-3 border-t border-blue-200">
                                    <p className="text-gray-600 text-sm">Token stored in localStorage</p>
                                    <div className="mt-1 p-2 bg-gray-100 rounded text-xs font-mono overflow-x-auto">
                                        {loginResponse?.token?.substring(0, 30)}...
                                    </div>
                                </div> */}
                            </div>

                            {branches.length > 0 && (
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                                        <FiGitBranch className="mr-2" />
                                        Your Branches
                                    </h4>
                                    <div className="space-y-2">
                                        {branches.map((branch) => (
                                            <div 
                                                key={branch.branch_id}
                                                className={`p-3 rounded border ${selectedBranch === branch.branch_id ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium">{branch.name}</span>
                                                    {selectedBranch === branch.branch_id && (
                                                        <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">Selected</span>
                                                    )}
                                                </div>
                                                <div className="text-sm text-gray-600 mt-1">
                                                    ID: {branch.branch_id}
                                                    {branch.owned && <span className="ml-2 text-green-600">• Owned</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        // Reset for new login
                                        setLoginSuccess(false);
                                        setPhase(1);
                                        setCurrentStep(0);
                                        setFormData({ email: '', password: '', otp: '' });
                                        setBranches([]);
                                        setSelectedBranch('');
                                        setCompletedSteps([]);
                                        setLoginResponse(null);
                                    }}
                                    className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
                                >
                                    <FiUser className="mr-2" />
                                    Login as Another User
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        // Redirect to dashboard
                                        window.location.href = '/dashboard';
                                    }}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
                                >
                                    Go to Dashboard
                                    <FiArrowRight className="ml-2" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    {!loginSuccess && (
                        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                            <p className="text-gray-600 text-sm">
                                Don't have an account?{' '}
                                <button className="text-blue-600 hover:text-blue-700 font-medium">
                                    Sign up
                                </button>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;