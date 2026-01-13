import React, { useState, useEffect } from 'react';
import { FiSettings, FiUpload, FiFileText, FiImage, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Header, Sidebar } from '../../components/header';

const AppSettings = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(() => {
        const saved = localStorage.getItem('sidebarMinimized');
        return saved ? JSON.parse(saved) : false;
    });
    const [loading, setLoading] = useState(true);
    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);

    // App settings state
    const [appSettings, setAppSettings] = useState({
        app_name: '',
        entity_name: '',
        mobile: '',
        email: '',
        description: '',
        address: '',
        state: '',
        dist: '',
        town: '',
        gst_applicable: false,
        gst_number: '',
        gst_rate: ''
    });

    // Invoice settings state
    const [invoiceSettings, setInvoiceSettings] = useState({
        invoice_holder: '',
        invoice_account_no: '',
        invoice_ifsc: ''
    });

    // File upload states
    const [logoFile, setLogoFile] = useState(null);
    const [signFile, setSignFile] = useState(null);

    // Mock data - replace with actual API calls
    const mockAppSettings = {
        app_name: 'My Business App',
        entity_name: 'My Business Entity',
        mobile: '+91 9876543210',
        email: 'contact@mybusiness.com',
        description: 'Business management application',
        address: '123 Business Street, Commercial Area',
        state: 'Maharashtra',
        dist: 'Mumbai',
        town: 'Mumbai',
        gst_applicable: true,
        gst_number: '27ABCDE1234F1Z5',
        gst_rate: '18'
    };

    const mockInvoiceSettings = {
        invoice_holder: 'My Business Name',
        invoice_account_no: '123456789012345',
        invoice_ifsc: 'SBIN0000123'
    };

    // Persist sidebar minimized state
    useEffect(() => {
        localStorage.setItem('sidebarMinimized', JSON.stringify(isMinimized));
    }, [isMinimized]);

    // Lock body scroll when mobile sidebar is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [mobileMenuOpen]);

    // Load initial data
    useEffect(() => {
        fetchSettingsData();
        fetchStatesData();
    }, []);

    const fetchSettingsData = async () => {
        setLoading(true);
        // Simulate API calls
        setTimeout(() => {
            setAppSettings(mockAppSettings);
            setInvoiceSettings(mockInvoiceSettings);
            setLoading(false);
        }, 1500); // Increased timeout to show skeleton
    };

    const fetchStatesData = async () => {
        // Simulate fetching states from JSON file
        const mockStates = [
            {
                state: "Maharashtra",
                districts: ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik"]
            },
            {
                state: "Delhi",
                districts: ["New Delhi", "Central Delhi", "North Delhi", "South Delhi"]
            },
            {
                state: "Karnataka",
                districts: ["Bangalore", "Mysore", "Hubli", "Mangalore"]
            }
        ];
        setStates(mockStates);

        // Set initial districts based on current state
        if (mockAppSettings.state) {
            const stateData = mockStates.find(s => s.state === mockAppSettings.state);
            if (stateData) {
                setDistricts(stateData.districts);
            }
        }
    };

    // Skeleton Loading Component
    const SkeletonLoader = () => (
        <div className="min-h-screen bg-gray-50">
            <Header
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
                isMinimized={isMinimized}
                setIsMinimized={setIsMinimized}
            />
            <Sidebar
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
                isMinimized={isMinimized}
                setIsMinimized={setIsMinimized}
            />

            {/* Main content */}
            <div className={`pt-16 transition-all duration-300 ease-in-out ${isMinimized ? 'md:pl-20' : 'md:pl-72'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column Skeleton */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm animate-pulse">
                                <div className="border-b border-gray-200 px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 bg-gray-200 rounded"></div>
                                        <div className="h-6 bg-gray-200 rounded w-32"></div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {[...Array(8)].map((_, i) => (
                                            <div key={i}>
                                                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                                                <div className="h-10 bg-gray-100 rounded"></div>
                                            </div>
                                        ))}
                                        <div className="flex items-center gap-3">
                                            <div className="w-4 h-4 bg-gray-200 rounded"></div>
                                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                                        </div>
                                        <div className="pt-4">
                                            <div className="h-10 bg-gray-200 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column Skeleton */}
                        <div className="space-y-6">
                            {/* Logo Settings Skeleton */}
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm animate-pulse">
                                <div className="border-b border-gray-200 px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 bg-gray-200 rounded"></div>
                                        <div className="h-6 bg-gray-200 rounded w-40"></div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="text-center mb-4">
                                        <div className="inline-block p-4 bg-gray-100 rounded-lg">
                                            <div className="w-12 h-12 bg-gray-200 rounded"></div>
                                        </div>
                                        <div className="h-4 bg-gray-200 rounded w-24 mx-auto mt-2"></div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                                            <div className="h-10 bg-gray-100 rounded"></div>
                                        </div>
                                        <div className="h-10 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Signature Settings Skeleton */}
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm animate-pulse">
                                <div className="border-b border-gray-200 px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 bg-gray-200 rounded"></div>
                                        <div className="h-6 bg-gray-200 rounded w-48"></div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="text-center mb-4">
                                        <div className="inline-block p-4 bg-gray-100 rounded-lg">
                                            <div className="w-12 h-12 bg-gray-200 rounded"></div>
                                        </div>
                                        <div className="h-4 bg-gray-200 rounded w-32 mx-auto mt-2"></div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="h-4 bg-gray-200 rounded w-36 mb-2"></div>
                                            <div className="h-10 bg-gray-100 rounded"></div>
                                        </div>
                                        <div className="h-10 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Invoice Settings Skeleton */}
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm animate-pulse">
                                <div className="border-b border-gray-200 px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 bg-gray-200 rounded"></div>
                                        <div className="h-6 bg-gray-200 rounded w-40"></div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i}>
                                                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                                                <div className="h-10 bg-gray-100 rounded"></div>
                                            </div>
                                        ))}
                                        <div className="pt-2">
                                            <div className="h-10 bg-gray-200 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const handleAppSettingsChange = (field, value) => {
        setAppSettings(prev => ({
            ...prev,
            [field]: value
        }));

        if (field === 'state') {
            const stateData = states.find(s => s.state === value);
            if (stateData) {
                setDistricts(stateData.districts);
                setAppSettings(prev => ({
                    ...prev,
                    dist: ''
                }));
            }
        }
    };

    const handleInvoiceSettingsChange = (field, value) => {
        setInvoiceSettings(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleGstApplicableChange = (checked) => {
        setAppSettings(prev => ({
            ...prev,
            gst_applicable: checked
        }));
    };

    const handleLogoFileChange = (e) => {
        setLogoFile(e.target.files[0]);
    };

    const handleSignFileChange = (e) => {
        setSignFile(e.target.files[0]);
    };

    const handleAppSettingsSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            alert('App settings updated successfully!');
        }, 1000);
    };

    const handleInvoiceSettingsSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            alert('Invoice settings updated successfully!');
        }, 1000);
    };

    const handleLogoUpload = async (e) => {
        e.preventDefault();
        if (!logoFile) {
            alert('Please select a logo file');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setLogoFile(null);
            alert('Logo uploaded successfully!');
        }, 1000);
    };

    const handleSignUpload = async (e) => {
        e.preventDefault();
        if (!signFile) {
            alert('Please select a signature file');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSignFile(null);
            alert('Signature uploaded successfully!');
        }, 1000);
    };

    // Show skeleton while loading
    if (loading) {
        return <SkeletonLoader />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
                isMinimized={isMinimized}
                setIsMinimized={setIsMinimized}
            />
            <Sidebar
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
                isMinimized={isMinimized}
                setIsMinimized={setIsMinimized}
            />

            {/* Main content */}
            <div className={`pt-16 transition-all duration-300 ease-in-out ${isMinimized ? 'md:pl-20' : 'md:pl-72'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* App Settings Card */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                                <div className="border-b border-gray-200 px-6 py-4">
                                    <h5 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                        <FiSettings className="w-5 h-5" />
                                        App Settings
                                    </h5>
                                </div>
                                <div className="p-6">
                                    <form onSubmit={handleAppSettingsSubmit}>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    App Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={appSettings.app_name}
                                                    onChange={(e) => handleAppSettingsChange('app_name', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                                    placeholder="App Name"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Entity Name <span className="text-gray-500 text-sm">(Shows on invoice)</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={appSettings.entity_name}
                                                    onChange={(e) => handleAppSettingsChange('entity_name', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                                    placeholder="Entity Name"
                                                    required
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Mobile
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={appSettings.mobile}
                                                        onChange={(e) => handleAppSettingsChange('mobile', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                                        placeholder="Mobile number"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Email
                                                    </label>
                                                    <input
                                                        type="email"
                                                        value={appSettings.email}
                                                        onChange={(e) => handleAppSettingsChange('email', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                                        placeholder="Email"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Description
                                                </label>
                                                <textarea
                                                    value={appSettings.description}
                                                    onChange={(e) => handleAppSettingsChange('description', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                                    rows="3"
                                                    placeholder="Business description"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Address
                                                </label>
                                                <textarea
                                                    value={appSettings.address}
                                                    onChange={(e) => handleAppSettingsChange('address', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                                    rows="3"
                                                    placeholder="Full address"
                                                    required
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        State
                                                    </label>
                                                    <select
                                                        value={appSettings.state}
                                                        onChange={(e) => handleAppSettingsChange('state', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                                    >
                                                        <option value="">Select State</option>
                                                        {states.map((stateObj) => (
                                                            <option key={stateObj.state} value={stateObj.state}>
                                                                {stateObj.state}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        District
                                                    </label>
                                                    <select
                                                        value={appSettings.dist}
                                                        onChange={(e) => handleAppSettingsChange('dist', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                                    >
                                                        <option value="">Select District</option>
                                                        {districts.map((district) => (
                                                            <option key={district} value={district}>
                                                                {district}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Village/Town
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={appSettings.town}
                                                        onChange={(e) => handleAppSettingsChange('town', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                                        placeholder="Village/Town"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    id="gst_applicable"
                                                    checked={appSettings.gst_applicable}
                                                    onChange={(e) => handleGstApplicableChange(e.target.checked)}
                                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                />
                                                <label htmlFor="gst_applicable" className="text-sm font-medium text-gray-700">
                                                    GST Applicable
                                                </label>
                                            </div>

                                            {appSettings.gst_applicable && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            GST Number
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={appSettings.gst_number}
                                                            onChange={(e) => handleAppSettingsChange('gst_number', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                                            placeholder="18XXXXX0000X0XX"
                                                            maxLength="15"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            GST Rate (%)
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={appSettings.gst_rate}
                                                            onChange={(e) => handleAppSettingsChange('gst_rate', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                                            placeholder="GST Rate"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            <div className="pt-4">
                                                <motion.button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    {loading ? 'Updating...' : 'Update App Settings'}
                                                </motion.button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Logo, Sign, and Invoice Settings */}
                        <div className="space-y-6">
                            {/* Logo Settings */}
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                                <div className="border-b border-gray-200 px-6 py-4">
                                    <h5 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                        <FiImage className="w-5 h-5" />
                                        Logo Settings
                                    </h5>
                                </div>
                                <div className="p-6">
                                    <div className="text-center mb-4">
                                        <div className="inline-block p-4 bg-gray-100 rounded-lg">
                                            <FiImage className="w-12 h-12 text-gray-400" />
                                        </div>
                                        <p className="text-sm text-gray-500 mt-2">Current Logo</p>
                                    </div>
                                    <form onSubmit={handleLogoUpload}>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Website Logo <span className="text-red-500 text-sm">*1:1 ratio recommended</span>
                                                </label>
                                                <input
                                                    type="file"
                                                    onChange={handleLogoFileChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                                    accept="image/*"
                                                    required
                                                />
                                            </div>
                                            <motion.button
                                                type="submit"
                                                disabled={loading || !logoFile}
                                                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                {loading ? 'Uploading...' : 'Upload Logo'}
                                            </motion.button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* Signature Settings */}
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                                <div className="border-b border-gray-200 px-6 py-4">
                                    <h5 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                        <FiFileText className="w-5 h-5" />
                                        Upload Invoice Sign
                                    </h5>
                                </div>
                                <div className="p-6">
                                    <div className="text-center mb-4">
                                        <div className="inline-block p-4 bg-gray-100 rounded-lg">
                                            <FiFileText className="w-12 h-12 text-gray-400" />
                                        </div>
                                        <p className="text-sm text-gray-500 mt-2">Current Signature</p>
                                    </div>
                                    <form onSubmit={handleSignUpload}>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Upload Signature
                                                </label>
                                                <input
                                                    type="file"
                                                    onChange={handleSignFileChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                                    accept="image/*"
                                                    required
                                                />
                                            </div>
                                            <motion.button
                                                type="submit"
                                                disabled={loading || !signFile}
                                                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                {loading ? 'Uploading...' : 'Upload Signature'}
                                            </motion.button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* Invoice Settings */}
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                                <div className="border-b border-gray-200 px-6 py-4">
                                    <h5 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                        <FiFileText className="w-5 h-5" />
                                        Invoice Settings
                                    </h5>
                                </div>
                                <div className="p-6">
                                    <form onSubmit={handleInvoiceSettingsSubmit}>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Name On Account
                                                </label>
                                                <input
                                                    type="text"
                                                    value={invoiceSettings.invoice_holder}
                                                    onChange={(e) => handleInvoiceSettingsChange('invoice_holder', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                                    placeholder="Account Name"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Account Number
                                                </label>
                                                <input
                                                    type="text"
                                                    value={invoiceSettings.invoice_account_no}
                                                    onChange={(e) => handleInvoiceSettingsChange('invoice_account_no', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                                    placeholder="Account Number"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Account IFSC
                                                </label>
                                                <input
                                                    type="text"
                                                    value={invoiceSettings.invoice_ifsc}
                                                    onChange={(e) => handleInvoiceSettingsChange('invoice_ifsc', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                                    placeholder="Account IFSC Code"
                                                    required
                                                />
                                            </div>

                                            <div className="pt-2">
                                                <motion.button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    {loading ? 'Updating...' : 'Update Invoice Settings'}
                                                </motion.button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppSettings;