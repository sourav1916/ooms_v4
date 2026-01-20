import React, { useState, useEffect } from 'react';
import { Sidebar, Header } from '../components/header';
import {
    FiUser,
    FiMail,
    FiPhone,
    FiCalendar,
    FiMapPin,
    FiHome,
    FiBriefcase,
    FiDollarSign,
    FiUsers,
    FiFileText,
    FiPlus,
    FiArrowRight,
    FiArrowLeft,
    FiUpload,
    FiCheck,
    FiX
} from 'react-icons/fi';
import { FaCheckCircle } from "react-icons/fa";
import { motion } from 'framer-motion';

const CreateClient = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(() => {
        const saved = localStorage.getItem('sidebarMinimized');
        return saved ? JSON.parse(saved) : false;
    });
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [transitionDirection, setTransitionDirection] = useState('next');

    // Form data state
    const [formData, setFormData] = useState({
        // Step 1: Basic Details
        name: '',
        guardian_type: 'father',
        guardian_name: '',
        mobile_country_code: '91',
        mobile: '',
        email: '',
        dob: '',
        gender: 'male',
        image: null,

        // Step 2: Contact Details
        state: '',
        dist: '',
        town: '',
        pincode: '',
        address_line_1: '',
        address_line_2: '',

        // Step 3: Business Details
        firm_type: 'individual',
        pan: '',
        firm_name: '',
        gst: '',
        tan: '',
        vat: '',
        cin: '',
        file_no: '',
        state_business: '',
        dist_business: '',
        town_business: '',
        pincode_business: '',
        address_line_1_business: '',
        address_line_2_business: '',
        group: [],

        // Step 4: Opening Balance
        opening_balance: '',
        opeing_balance_type: '0',
        opening_balance_date: new Date().toISOString().split('T')[0]
    });

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

    // Dummy data arrays
    const [guardianTypes] = useState([
        { value: 'father', name: 'Father' },
        { value: 'mother', name: 'Mother' },
        { value: 'husband', name: 'Husband' },
        { value: 'wife', name: 'Wife' },
        { value: 'guardian', name: 'Guardian' },
        { value: 'director', name: 'Director' }
    ]);

    const [countryCodes] = useState([
        { value: '91', name: 'India' },
        { value: '1', name: 'USA' },
        { value: '44', name: 'UK' },
        { value: '61', name: 'Australia' }
    ]);

    const [genders] = useState([
        { value: 'male', name: 'Male' },
        { value: 'female', name: 'Female' },
        { value: 'other', name: 'Other' }
    ]);

    const [states] = useState([
        { state: 'Delhi', districts: ['Central Delhi', 'New Delhi', 'North Delhi', 'South Delhi'] },
        { state: 'Maharashtra', districts: ['Mumbai', 'Pune', 'Nagpur', 'Thane'] },
        { state: 'Karnataka', districts: ['Bangalore', 'Mysore', 'Hubli', 'Mangalore'] },
        { state: 'Tamil Nadu', districts: ['Chennai', 'Coimbatore', 'Madurai', 'Salem'] }
    ]);

    const [firmTypes] = useState([
        { value: 'individual', name: 'Individual' },
        { value: 'proprietorship', name: 'Proprietorship' },
        { value: 'partnership', name: 'Partnership' },
        { value: 'llp', name: 'LLP' },
        { value: 'pvt_ltd', name: 'Private Limited' },
        { value: 'ltd', name: 'Public Limited' }
    ]);

    const [groups, setGroups] = useState([
        { group_id: '1', name: 'Corporate Clients', selected: false },
        { group_id: '2', name: 'Small Business', selected: false },
        { group_id: '3', name: 'Startup Portfolio', selected: false },
        { group_id: '4', name: 'Enterprise Solutions', selected: false },
        { group_id: '5', name: 'Government Projects', selected: false },
        { group_id: '6', name: 'VIP Clients', selected: false },
        { group_id: '7', name: 'International', selected: false },
        { group_id: '8', name: 'Local Business', selected: false }
    ]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file') {
            setFormData(prev => ({
                ...prev,
                [name]: files[0]
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Handle group selection
    const toggleGroup = (groupId) => {
        setGroups(prev => prev.map(group =>
            group.group_id === groupId
                ? { ...group, selected: !group.selected }
                : group
        ));

        setFormData(prev => {
            const currentGroups = [...prev.group];
            if (currentGroups.includes(groupId)) {
                return {
                    ...prev,
                    group: currentGroups.filter(id => id !== groupId)
                };
            } else {
                return {
                    ...prev,
                    group: [...currentGroups, groupId]
                };
            }
        });
    };

    // Select all groups
    const selectAllGroups = () => {
        setGroups(prev => prev.map(group => ({ ...group, selected: true })));
        setFormData(prev => ({
            ...prev,
            group: groups.map(group => group.group_id)
        }));
    };

    // Deselect all groups
    const deselectAllGroups = () => {
        setGroups(prev => prev.map(group => ({ ...group, selected: false })));
        setFormData(prev => ({
            ...prev,
            group: []
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            alert('Client created successfully!');
            // Reset form
            setFormData({
                name: '',
                guardian_type: 'father',
                guardian_name: '',
                mobile_country_code: '91',
                mobile: '',
                email: '',
                dob: '',
                gender: 'male',
                image: null,
                state: '',
                dist: '',
                town: '',
                pincode: '',
                address_line_1: '',
                address_line_2: '',
                firm_type: 'individual',
                pan: '',
                firm_name: '',
                gst: '',
                tan: '',
                vat: '',
                cin: '',
                file_no: '',
                state_business: '',
                dist_business: '',
                town_business: '',
                pincode_business: '',
                address_line_1_business: '',
                address_line_2_business: '',
                group: [],
                opening_balance: '',
                opeing_balance_type: '0',
                opening_balance_date: new Date().toISOString().split('T')[0]
            });
            setGroups(prev => prev.map(group => ({ ...group, selected: false })));
            setCurrentStep(1);
        } catch (error) {
            console.error('Error creating client:', error);
            alert('Error creating client. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Navigation functions with smooth transitions
    const nextStep = () => {
        if (currentStep < 4) {
            setTransitionDirection('next');
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setTransitionDirection('prev');
            setCurrentStep(currentStep - 1);
        }
    };

    // Get current districts based on selected state
    const getCurrentDistricts = () => {
        const selectedState = states.find(state => state.state === formData.state);
        return selectedState ? selectedState.districts : [];
    };

    const getBusinessDistricts = () => {
        const selectedState = states.find(state => state.state === formData.state_business);
        return selectedState ? selectedState.districts : [];
    };

    // Step configurations
    const steps = [
        { number: 1, title: 'Basic Details', subtitle: 'Setup Basic Details' },
        { number: 2, title: 'Contact Details', subtitle: 'Add Contact Details' },
        { number: 3, title: 'Business Details', subtitle: 'Add Business Details' },
        { number: 4, title: 'Opening Balance', subtitle: 'Set Opening Balance' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 overflow-x-hidden">
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
                    {/* Main Card */}
                    <motion.div 
                        className="bg-white rounded-lg shadow-sm border border-gray-200"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Card Header */}
                        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 text-white rounded-t-lg">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg font-semibold">Create New Client</h2>
                                    <p className="text-indigo-100 text-sm mt-1">Fill in the client details below</p>
                                </div>
                                <motion.button 
                                    className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-sm"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FiUpload className="w-4 h-4" />
                                    <span>Bulk Import</span>
                                </motion.button>
                            </div>
                        </div>

                        <div className="p-4">
                            {/* Enhanced Stepper */}
                            <div className="flex justify-center mb-8">
                                <div className="flex items-center space-x-6">
                                    {steps.map((step, index) => (
                                        <div key={step.number} className="flex items-center">
                                            <div className={`flex flex-col items-center transition-all duration-300 ${step.number === currentStep ? 'scale-105' : 'scale-100'
                                                }`}>
                                                <div className={`relative flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold border-2 transition-all duration-300 ${step.number === currentStep
                                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200'
                                                    : step.number < currentStep
                                                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                                                        : 'bg-white border-gray-300 text-gray-500'
                                                    }`}>
                                                    {step.number < currentStep ? <FiCheck className="w-4 h-4" /> : step.number}
                                                    {step.number === currentStep && (
                                                        <div className="absolute -inset-2 bg-indigo-100 rounded-full animate-pulse opacity-50"></div>
                                                    )}
                                                </div>
                                                <div className="mt-3 text-center max-w-32">
                                                    <div className={`text-sm font-semibold transition-colors duration-300 ${step.number === currentStep ? 'text-indigo-600' : step.number < currentStep ? 'text-emerald-600' : 'text-gray-500'
                                                        }`}>
                                                        {step.title}
                                                    </div>
                                                    <div className="text-xs text-gray-400 mt-1">
                                                        {step.subtitle}
                                                    </div>
                                                </div>
                                            </div>
                                            {index < steps.length - 1 && (
                                                <div className={`w-16 h-1 mx-4 rounded-full transition-colors duration-300 ${step.number < currentStep ? 'bg-emerald-500' : 'bg-gray-200'
                                                    }`} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <form onSubmit={handleSubmit}>
                                {/* Step Content with Smooth Transitions */}
                                <div className="relative">
                                    {/* Step 1: Basic Details */}
                                    <div className={`transition-all duration-500 ease-in-out ${currentStep === 1
                                        ? 'opacity-100 translate-x-0 block'
                                        : transitionDirection === 'next'
                                            ? 'opacity-0 -translate-x-full absolute inset-0'
                                            : 'opacity-0 translate-x-full absolute inset-0'
                                        }`}>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                <div className="space-y-1">
                                                    <label className="block text-xs font-medium text-gray-700">
                                                        PAN Number <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            value={formData.pan}
                                                            onChange={handleInputChange}
                                                            className="w-full pl-10 pr-3 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-colors duration-200"
                                                            placeholder="Enter PAN number"
                                                            required
                                                        />
                                                        <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500 text-xs font-medium"><FaCheckCircle /></span>
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <label className="block text-xs font-medium text-gray-700">
                                                        Full Name <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            value={formData.name}
                                                            onChange={handleInputChange}
                                                            className="w-full pl-10 pr-3 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-colors duration-200"
                                                            placeholder="Enter full name"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <label className="block text-xs font-medium text-gray-700">
                                                        Care of <span className="text-red-500">*</span>
                                                    </label>
                                                    <select
                                                        name="guardian_type"
                                                        value={formData.guardian_type}
                                                        onChange={handleInputChange}
                                                        className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-colors duration-200"
                                                        required
                                                    >
                                                        {guardianTypes.map(type => (
                                                            <option key={type.value} value={type.value}>
                                                                {type.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                <div className="space-y-1">
                                                    <label className="block text-xs font-medium text-gray-700">
                                                        Guardian Name <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                                                        <input
                                                            type="text"
                                                            name="guardian_name"
                                                            value={formData.guardian_name}
                                                            onChange={handleInputChange}
                                                            className="w-full pl-10 pr-3 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-colors duration-200"
                                                            placeholder="Enter guardian name"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <label className="block text-xs font-medium text-gray-700">
                                                        Mobile <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                                                        <input
                                                            type="number"
                                                            name="mobile"
                                                            value={formData.mobile}
                                                            onChange={handleInputChange}
                                                            className="w-full pl-10 pr-3 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-colors duration-200"
                                                            placeholder="Mobile number"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <label className="block text-xs font-medium text-gray-700">
                                                        Email <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            value={formData.email}
                                                            onChange={handleInputChange}
                                                            className="w-full pl-10 pr-3 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-colors duration-200"
                                                            placeholder="Enter email address"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                <div className="space-y-1">
                                                    <label className="block text-xs font-medium text-gray-700">
                                                        Date of Birth <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                                                        <input
                                                            type="date"
                                                            name="dob"
                                                            value={formData.dob}
                                                            onChange={handleInputChange}
                                                            className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-colors duration-200"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <label className="block text-xs font-medium text-gray-700">
                                                        Gender <span className="text-red-500">*</span>
                                                    </label>
                                                    <select
                                                        name="gender"
                                                        value={formData.gender}
                                                        onChange={handleInputChange}
                                                        className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-colors duration-200"
                                                        required
                                                    >
                                                        {genders.map(gender => (
                                                            <option key={gender.value} value={gender.value}>
                                                                {gender.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="space-y-1">
                                                    <label className="block text-xs font-medium text-gray-700">
                                                        Image
                                                    </label>
                                                    <input
                                                        type="file"
                                                        name="image"
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-2.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-colors duration-200"
                                                        accept="image/*"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Step 2: Contact Details */}
                                    <div className={`transition-all duration-500 ease-in-out ${currentStep === 2
                                        ? 'opacity-100 translate-x-0 block'
                                        : currentStep > 2
                                            ? 'opacity-0 -translate-x-full absolute inset-0'
                                            : 'opacity-0 translate-x-full absolute inset-0'
                                        }`}>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                    <label className="block text-xs font-medium text-gray-700">
                                                        State <span className="text-red-500">*</span>
                                                    </label>
                                                    <select
                                                        name="state"
                                                        value={formData.state}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-colors duration-200"
                                                        required
                                                    >
                                                        <option value="">Select State</option>
                                                        {states.map(state => (
                                                            <option key={state.state} value={state.state}>
                                                                {state.state}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="space-y-1">
                                                    <label className="block text-xs font-medium text-gray-700">
                                                        District <span className="text-red-500">*</span>
                                                    </label>
                                                    <select
                                                        name="dist"
                                                        value={formData.dist}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-colors duration-200"
                                                        required
                                                    >
                                                        <option value="">Select District</option>
                                                        {getCurrentDistricts().map(district => (
                                                            <option key={district} value={district}>
                                                                {district}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                    <label className="block text-xs font-medium text-gray-700">
                                                        Town/Village <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <FiHome className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                                                        <input
                                                            type="text"
                                                            name="town"
                                                            value={formData.town}
                                                            onChange={handleInputChange}
                                                            className="w-full pl-10 pr-3 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-colors duration-200"
                                                            placeholder="Enter town/village name"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <label className="block text-xs font-medium text-gray-700">
                                                        Pincode <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                                                        <input
                                                            type="text"
                                                            name="pincode"
                                                            value={formData.pincode}
                                                            onChange={handleInputChange}
                                                            className="w-full pl-10 pr-3 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-colors duration-200"
                                                            placeholder="Enter pincode"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <label className="block text-xs font-medium text-gray-700">
                                                        Address Line 1
                                                    </label>
                                                    <div className="relative">
                                                        <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                                                        <input
                                                            type="text"
                                                            name="address_line_1"
                                                            value={formData.address_line_1}
                                                            onChange={handleInputChange}
                                                            className="w-full pl-10 pr-3 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-colors duration-200"
                                                            placeholder="Enter address line 1"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <label className="block text-xs font-medium text-gray-700">
                                                        Address Line 2
                                                    </label>
                                                    <div className="relative">
                                                        <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                                                        <input
                                                            type="text"
                                                            name="address_line_2"
                                                            value={formData.address_line_2}
                                                            onChange={handleInputChange}
                                                            className="w-full pl-10 pr-3 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-colors duration-200"
                                                            placeholder="Enter address line 2"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Step 3: Business Details */}
                                    <div className={`transition-all duration-500 ease-in-out ${currentStep === 3
                                        ? 'opacity-100 translate-x-0 block'
                                        : currentStep > 3
                                            ? 'opacity-0 -translate-x-full absolute inset-0'
                                            : 'opacity-0 translate-x-full absolute inset-0'
                                        }`}>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                    <label className="block text-xs font-medium text-gray-700">
                                                        Business Type <span className="text-red-500">*</span>
                                                    </label>
                                                    <select
                                                        name="firm_type"
                                                        value={formData.firm_type}
                                                        onChange={handleInputChange}
                                                        className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-colors duration-200"
                                                        required
                                                    >
                                                        {firmTypes.map(type => (
                                                            <option key={type.value} value={type.value}>
                                                                {type.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="space-y-1">
                                                    <label className="block text-xs font-medium text-gray-700">
                                                        PAN <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="pan"
                                                        value={formData.pan}
                                                        onChange={handleInputChange}
                                                        className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-colors duration-200"
                                                        placeholder="Enter PAN number"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {formData.firm_type !== 'individual' && (
                                                <>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <div className="space-y-1">
                                                            <label className="block text-xs font-medium text-gray-700">
                                                                Firm Name <span className="text-red-500">*</span>
                                                            </label>
                                                            <div className="relative">
                                                                <FiBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                                                                <input
                                                                    type="text"
                                                                    name="firm_name"
                                                                    value={formData.firm_name}
                                                                    onChange={handleInputChange}
                                                                    className="w-full pl-10 pr-3 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-colors duration-200"
                                                                    placeholder="Enter firm name"
                                                                    required
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="space-y-1">
                                                            <label className="block text-xs font-medium text-gray-700">
                                                                GST
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="gst"
                                                                value={formData.gst}
                                                                onChange={handleInputChange}
                                                                className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-colors duration-200"
                                                                placeholder="Enter GST number"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <div className="space-y-1">
                                                            <label className="block text-xs font-medium text-gray-700">
                                                                TAN
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="tan"
                                                                value={formData.tan}
                                                                onChange={handleInputChange}
                                                                className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-colors duration-200"
                                                                placeholder="Enter TAN number"
                                                            />
                                                        </div>

                                                        <div className="space-y-1">
                                                            <label className="block text-xs font-medium text-gray-700">
                                                                VAT
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="vat"
                                                                value={formData.vat}
                                                                onChange={handleInputChange}
                                                                className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-colors duration-200"
                                                                placeholder="Enter VAT number"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <div className="space-y-1">
                                                            <label className="block text-xs font-medium text-gray-700">
                                                                CIN
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="cin"
                                                                value={formData.cin}
                                                                onChange={handleInputChange}
                                                                className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-colors duration-200"
                                                                placeholder="Enter CIN number"
                                                            />
                                                        </div>

                                                        <div className="space-y-1">
                                                            <label className="block text-xs font-medium text-gray-700">
                                                                File No
                                                            </label>
                                                            <div className="relative">
                                                                <FiFileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                                                                <input
                                                                    type="text"
                                                                    name="file_no"
                                                                    value={formData.file_no}
                                                                    onChange={handleInputChange}
                                                                    className="w-full pl-10 pr-3 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-colors duration-200"
                                                                    placeholder="Enter file number"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <div className="space-y-1">
                                                            <label className="block text-xs font-medium text-gray-700">
                                                                Business State <span className="text-red-500">*</span>
                                                            </label>
                                                            <select
                                                                name="state_business"
                                                                value={formData.state_business}
                                                                onChange={handleInputChange}
                                                                className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-colors duration-200"
                                                                required
                                                            >
                                                                <option value="">Select State</option>
                                                                {states.map(state => (
                                                                    <option key={state.state} value={state.state}>
                                                                        {state.state}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>

                                                        <div className="space-y-1">
                                                            <label className="block text-xs font-medium text-gray-700">
                                                                Business District <span className="text-red-500">*</span>
                                                            </label>
                                                            <select
                                                                name="dist_business"
                                                                value={formData.dist_business}
                                                                onChange={handleInputChange}
                                                                className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-colors duration-200"
                                                                required
                                                            >
                                                                <option value="">Select District</option>
                                                                {getBusinessDistricts().map(district => (
                                                                    <option key={district} value={district}>
                                                                        {district}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <div className="space-y-1">
                                                            <label className="block text-xs font-medium text-gray-700">
                                                                Business Town <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="town_business"
                                                                value={formData.town_business}
                                                                onChange={handleInputChange}
                                                                className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-colors duration-200"
                                                                placeholder="Enter business town"
                                                                required
                                                            />
                                                        </div>

                                                        <div className="space-y-1">
                                                            <label className="block text-xs font-medium text-gray-700">
                                                                Business Pincode <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="pincode_business"
                                                                value={formData.pincode_business}
                                                                onChange={handleInputChange}
                                                                className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-colors duration-200"
                                                                placeholder="Enter business pincode"
                                                                required
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <div className="space-y-1">
                                                            <label className="block text-xs font-medium text-gray-700">
                                                                Business Address Line 1
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="address_line_1_business"
                                                                value={formData.address_line_1_business}
                                                                onChange={handleInputChange}
                                                                className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-colors duration-200"
                                                                placeholder="Enter business address line 1"
                                                            />
                                                        </div>

                                                        <div className="space-y-1">
                                                            <label className="block text-xs font-medium text-gray-700">
                                                                Business Address Line 2
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="address_line_2_business"
                                                                value={formData.address_line_2_business}
                                                                onChange={handleInputChange}
                                                                className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-colors duration-200"
                                                                placeholder="Enter business address line 2"
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            {/* Professional Group Selection - Flexible Width */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <label className="block text-xs font-medium text-gray-700">
                                                        Select Groups
                                                    </label>
                                                    <div className="flex space-x-1">
                                                        <motion.button
                                                            type="button"
                                                            onClick={selectAllGroups}
                                                            className="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded transition-colors duration-200"
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            Select All
                                                        </motion.button>
                                                        <motion.button
                                                            type="button"
                                                            onClick={deselectAllGroups}
                                                            className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded transition-colors duration-200"
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            Deselect All
                                                        </motion.button>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {groups.map((group) => (
                                                        <motion.button
                                                            key={group.group_id}
                                                            type="button"
                                                            onClick={() => toggleGroup(group.group_id)}
                                                            className={`px-3 py-2 text-xs font-medium rounded border transition-all duration-200 whitespace-nowrap ${group.selected
                                                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm transform scale-105'
                                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                                                                }`}
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            {group.name}
                                                        </motion.button>
                                                    ))}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Selected: {formData.group.length} group(s)
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Step 4: Opening Balance */}
                                    <div className={`transition-all duration-500 ease-in-out ${currentStep === 4
                                        ? 'opacity-100 translate-x-0 block'
                                        : 'opacity-0 translate-x-full absolute inset-0'
                                        }`}>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                <div className="space-y-1">
                                                    <label className="block text-xs font-medium text-gray-700">
                                                        Amount <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                                                        <input
                                                            type="number"
                                                            name="opening_balance"
                                                            value={formData.opening_balance}
                                                            onChange={handleInputChange}
                                                            className="w-full pl-10 pr-3 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-colors duration-200"
                                                            placeholder="Enter opening balance"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <label className="block text-xs font-medium text-gray-700">
                                                        Type <span className="text-red-500">*</span>
                                                    </label>
                                                    <select
                                                        name="opeing_balance_type"
                                                        value={formData.opeing_balance_type}
                                                        onChange={handleInputChange}
                                                        className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-colors duration-200"
                                                        required
                                                    >
                                                        <option value="0">Debit</option>
                                                        <option value="1">Credit</option>
                                                    </select>
                                                </div>

                                                <div className="space-y-1">
                                                    <label className="block text-xs font-medium text-gray-700">
                                                        Date <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                                                        <input
                                                            type="date"
                                                            name="opening_balance_date"
                                                            value={formData.opening_balance_date}
                                                            onChange={handleInputChange}
                                                            className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-colors duration-200"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Navigation Buttons */}
                                <div className="flex justify-between pt-6 border-t border-gray-200 mt-6">
                                    {currentStep > 1 ? (
                                        <motion.button
                                            type="button"
                                            onClick={prevStep}
                                            className="flex items-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-sm"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <FiArrowLeft className="w-4 h-4" />
                                            <span>Previous</span>
                                        </motion.button>
                                    ) : (
                                        <div></div>
                                    )}

                                    {currentStep < 4 ? (
                                        <motion.button
                                            type="button"
                                            onClick={nextStep}
                                            className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-lg shadow-indigo-200"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <span>Next Step</span>
                                            <FiArrowRight className="w-4 h-4" />
                                        </motion.button>
                                    ) : (
                                        <motion.button
                                            type="submit"
                                            disabled={loading}
                                            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-lg shadow-emerald-200"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    <span>Creating Client...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <FiPlus className="w-4 h-4" />
                                                    <span>Create Client</span>
                                                </>
                                            )}
                                        </motion.button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default CreateClient;