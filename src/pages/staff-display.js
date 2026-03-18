import React, { useState, useEffect, memo } from 'react';
import {
    FiSearch,
    FiSettings,
    FiUserCheck,
    FiDollarSign,
    FiGift,
    FiCreditCard,
    FiTrendingUp,
    FiUser,
    FiPlus,
    FiEdit,
    FiTrash2,
    FiMail,
    FiPhone,
    FiCalendar,
    FiMapPin,
    FiUsers,
    FiBriefcase,
    FiChevronRight,
    FiChevronDown,
    FiChevronUp,
    FiChevronLeft,
    FiChevronRight as FiChevronRightIcon,
    FiRefreshCw
} from 'react-icons/fi';
import { IoTrash } from "react-icons/io5";
import { motion, AnimatePresence } from 'framer-motion';
import { Header, Sidebar } from '../components/header';
import getHeaders from "../utils/get-headers";
import BASE_URL from "../utils/api-controller";



// Memoized ModalWrapper component to prevent re-renders
const ModalWrapper = memo(({ isOpen, onClose, title, children, size = 'max-w-md' }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={(e) => {
                    if (e.target === e.currentTarget) onClose();
                }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    className={`relative w-full ${size} bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh]`}
                >
                    <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50 text-slate-800 rounded-t-xl">
                        <h2 className="text-xl font-bold">{title}</h2>
                        <button
                            onClick={onClose}
                            className="text-slate-500 hover:text-slate-800 p-1.5 rounded-lg transition-colors hover:bg-slate-100"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    {children}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
});

ModalWrapper.displayName = 'ModalWrapper';

// Memoized AddStaffModal component with API integration
const AddStaffModal = memo(({ 
    isOpen, 
    onClose, 
    onSubmit, 
    formData, 
    onFormChange,
    isSubmitting,
    mode = 'add',
    userDetails,
    onFindUser,
    isFindingUser,
    isUserFound,
    resetUserDetails
}) => {
    const [step, setStep] = useState(1); // 1: Find User, 2: Add Details
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (step === 1) {
            onFindUser(email);
        } else {
            onSubmit(e);
        }
    };

    const handleInputChange = (field, value) => {
        onFormChange({ ...formData, [field]: value });
    };

    const handleBack = () => {
        setStep(1);
        setEmail('');
        resetUserDetails();
    };

    // Reset step when modal closes
    useEffect(() => {
        if (!isOpen) {
            setStep(1);
            setEmail('');
        }
    }, [isOpen]);

    // Auto advance to step 2 when user is found
    useEffect(() => {
        if (isUserFound && userDetails) {
            setStep(2);
        }
    }, [isUserFound, userDetails]);

    return (
        <ModalWrapper
            isOpen={isOpen}
            onClose={onClose}
            title={step === 1 ? "Find Staff Member" : "Add Staff Details"}
            size="max-w-md"
        >
            <div className="flex-1 overflow-y-auto p-6">
                {step === 1 ? (
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <div className="text-center mb-4">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-200">
                                    <FiMail className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-800 mb-2">Find Staff by Email</h3>
                                <p className="text-slate-600 text-sm">
                                    Enter the email address to check if the user exists in our system.
                                </p>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300 transition-colors bg-white shadow-sm"
                                    placeholder="email@company.com"
                                    required
                                />
                            </div>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg p-4 mb-4">
                                <div className="flex items-start">
                                    <div className="p-1.5 bg-emerald-100 rounded-lg mr-3">
                                        <FiUserCheck className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-semibold text-emerald-800 mb-1">User Found</h4>
                                        <p className="text-emerald-600 text-xs mb-3">
                                            User details fetched successfully. Please add designation below.
                                        </p>
                                        {userDetails && (
                                            <div className="grid grid-cols-1 gap-2 text-xs">
                                                <div>
                                                    <span className="text-slate-500">Name:</span>
                                                    <span className="ml-2 font-medium text-slate-800">{userDetails.name || 'N/A'}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-500">Email:</span>
                                                    <span className="ml-2 font-medium text-slate-800">{userDetails.email || 'N/A'}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-500">Mobile:</span>
                                                    <span className="ml-2 font-medium text-slate-800">+{userDetails.country_code || '91'} {userDetails.mobile || 'N/A'}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-500">Username:</span>
                                                    <span className="ml-2 font-medium text-slate-800">{userDetails.username || 'N/A'}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Designation <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.designation}
                                    onChange={(e) => handleInputChange('designation', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300 transition-colors bg-white shadow-sm"
                                    required
                                >
                                    <option value="">Select Designation</option>
                                    <option value="Developer">Developer</option>
                                    <option value="Senior Developer">Senior Developer</option>
                                    <option value="Project Manager">Project Manager</option>
                                    <option value="UI/UX Designer">UI/UX Designer</option>
                                    <option value="Quality Assurance">Quality Assurance</option>
                                    <option value="DevOps Engineer">DevOps Engineer</option>
                                    <option value="Frontend Developer">Frontend Developer</option>
                                    <option value="Backend Developer">Backend Developer</option>
                                    <option value="HR Manager">HR Manager</option>
                                    <option value="Sales Executive">Sales Executive</option>
                                    <option value="Accountant">Accountant</option>
                                </select>
                            </div>
                        </div>
                    </form>
                )}
            </div>

            <div className="flex-shrink-0 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 p-6 rounded-b-xl">
                <div className="flex justify-between gap-3">
                    {step === 2 ? (
                        <button
                            type="button"
                            onClick={handleBack}
                            disabled={isSubmitting}
                            className="px-6 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors disabled:opacity-50 shadow-sm"
                        >
                            Back
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting || isFindingUser}
                            className="px-6 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors disabled:opacity-50 shadow-sm"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isSubmitting || isFindingUser}
                        className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 border border-emerald-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center min-w-[120px] justify-center shadow-sm"
                    >
                        {(isSubmitting || isFindingUser) ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {step === 1 ? 'Finding...' : 'Adding...'}
                            </>
                        ) : (
                            step === 1 ? 'Find User' : 'Add Staff Member'
                        )}
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
});

AddStaffModal.displayName = 'AddStaffModal';

// Memoized StaffFormModal component for editing
const StaffFormModal = memo(({ 
    isOpen, 
    onClose, 
    onSubmit, 
    formData, 
    onFormChange,
    isSubmitting,
    mode = 'edit' 
}) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(e);
    };

    const handleInputChange = (field, value) => {
        onFormChange({ ...formData, [field]: value });
    };

    return (
        <ModalWrapper
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Staff Member"
            size="max-w-2xl"
        >
            <div className="flex-1 overflow-y-auto p-6">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-900 border-b pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 -mx-6 px-6 py-2">Personal Information</h3>
                            
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300 transition-colors bg-white shadow-sm"
                                    placeholder="Enter full name"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Guardian Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.guardian_name}
                                    onChange={(e) => handleInputChange('guardian_name', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300 transition-colors bg-white shadow-sm"
                                    placeholder="Enter guardian name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    PAN Number
                                </label>
                                <input
                                    type="text"
                                    value={formData.pan_number}
                                    onChange={(e) => handleInputChange('pan_number', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300 transition-colors bg-white shadow-sm"
                                    placeholder="ABCDE1234F"
                                    maxLength="10"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-900 border-b pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 -mx-6 px-6 py-2">Contact Information</h3>
                            
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Mobile Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    value={formData.mobile}
                                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300 transition-colors bg-white shadow-sm"
                                    placeholder="+91 9876543210"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300 transition-colors bg-white shadow-sm"
                                    placeholder="email@company.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Emergency Contact
                                </label>
                                <input
                                    type="tel"
                                    value={formData.emergency_contact}
                                    onChange={(e) => handleInputChange('emergency_contact', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300 transition-colors bg-white shadow-sm"
                                    placeholder="+91 9876543299"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-900 border-b pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 -mx-6 px-6 py-2">Employment Details</h3>
                            
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Designation <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.designation}
                                    onChange={(e) => handleInputChange('designation', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300 transition-colors bg-white shadow-sm"
                                    required
                                >
                                    <option value="">Select Designation</option>
                                    <option value="Developer">Developer</option>
                                    <option value="Senior Developer">Senior Developer</option>
                                    <option value="Project Manager">Project Manager</option>
                                    <option value="UI/UX Designer">UI/UX Designer</option>
                                    <option value="Quality Assurance">Quality Assurance</option>
                                    <option value="DevOps Engineer">DevOps Engineer</option>
                                    <option value="Frontend Developer">Frontend Developer</option>
                                    <option value="Backend Developer">Backend Developer</option>
                                    <option value="HR Manager">HR Manager</option>
                                    <option value="Sales Executive">Sales Executive</option>
                                    <option value="Accountant">Accountant</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Monthly Salary <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={formData.salary}
                                    onChange={(e) => handleInputChange('salary', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300 transition-colors bg-white shadow-sm"
                                    placeholder="50000"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Joining Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={formData.joining_date}
                                    onChange={(e) => handleInputChange('joining_date', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300 transition-colors bg-white shadow-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-900 border-b pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 -mx-6 px-6 py-2">Additional Information</h3>
                            
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Address
                                </label>
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                    rows="3"
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300 transition-colors bg-white shadow-sm"
                                    placeholder="Enter complete address"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Bank Account Number
                                </label>
                                <input
                                    type="text"
                                    value={formData.bank_account}
                                    onChange={(e) => handleInputChange('bank_account', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300 transition-colors bg-white shadow-sm"
                                    placeholder="123456789012"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    IFSC Code
                                </label>
                                <input
                                    type="text"
                                    value={formData.ifsc_code}
                                    onChange={(e) => handleInputChange('ifsc_code', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300 transition-colors bg-white shadow-sm"
                                    placeholder="HDFC0001234"
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div className="flex-shrink-0 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 p-6 rounded-b-xl">
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-6 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors disabled:opacity-50 shadow-sm"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 border border-emerald-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center min-w-[120px] justify-center shadow-sm"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Updating...
                            </>
                        ) : (
                            'Update Staff'
                        )}
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
});

StaffFormModal.displayName = 'StaffFormModal';

// Main ViewStaff Component
const ViewStaff = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(() => {
        const saved = localStorage.getItem('sidebarMinimized');
        return saved ? JSON.parse(saved) : false;
    });
    const [loading, setLoading] = useState(false);
    const [staff, setStaff] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal states
    const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
    const [isEditStaffModalOpen, setIsEditStaffModalOpen] = useState(false);
    const [isDeleteStaffModalOpen, setIsDeleteStaffModalOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);

    // Add staff modal states
    const [userDetails, setUserDetails] = useState(null);
    const [isUserFound, setIsUserFound] = useState(false);
    const [isFindingUser, setIsFindingUser] = useState(false);

    // Resend link state
    const [resendingLink, setResendingLink] = useState(null);

    // Form states
    const [staffForm, setStaffForm] = useState({
        designation: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // State for dropdown menus
    const [activeRowDropdown, setActiveRowDropdown] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [showAll, setShowAll] = useState(false);

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

    // Initial data load
    useEffect(() => {
        fetchStaffData();
    }, []);

    // Close all dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown-container')) {
                setActiveRowDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    // Function to transform API data to frontend format based on is_accepted status
    const transformStaffData = (apiData) => {
        return apiData.map((staffMember, index) => {
            const isAccepted = staffMember.is_accepted === true;
            const profile = staffMember.profile || {};
            
            // For accepted staff: Use full profile data
            if (isAccepted) {
                return {
                    id: staffMember.map_id || (index + 1).toString(),
                    username: staffMember.username || '',
                    name: profile.name || 'Unknown',
                    guardian_name: profile.guardian_name || profile.care_of || '',
                    mobile: profile.mobile ? `${profile.country_code || '+91'} ${profile.mobile}` : 'N/A',
                    email: profile.email || 'N/A',
                    designation: staffMember.designation || 'Not Assigned',
                    loan: '0',
                    balance: staffMember.balance || '0',
                    address: profile.address ? 
                        `${profile.address.address_line_1 || ''} ${profile.address.address_line_2 || ''} ${profile.address.city || ''} ${profile.address.state || ''}`.trim() 
                        : '',
                    salary: staffMember.salary || '0',
                    joining_date: staffMember.modify_date || new Date().toISOString().split('T')[0],
                    emergency_contact: '',
                    bank_account: '',
                    ifsc_code: '',
                    pan_number: '',
                    is_accepted: isAccepted,
                    status: isAccepted ? 'Accepted' : 'Pending'
                };
            } 
            // For non-accepted staff: Use basic info only
            else {
                return {
                    id: staffMember.map_id || (index + 1).toString(),
                    username: staffMember.username || '',
                    name: profile.name || 'Unknown',
                    guardian_name: '',
                    mobile: '', // Hide mobile for non-accepted
                    email: profile.email || 'N/A',
                    designation: staffMember.designation || 'Not Assigned',
                    loan: '0',
                    balance: '0',
                    address: '',
                    salary: '',
                    joining_date: '',
                    emergency_contact: '',
                    bank_account: '',
                    ifsc_code: '',
                    pan_number: '',
                    is_accepted: isAccepted,
                    status: isAccepted ? 'Accepted' : 'Pending'
                };
            }
        });
    };

    // API call to fetch staff data with pagination
    const fetchStaffData = async () => {
        setLoading(true);
        
        const headers = getHeaders();
        if (!headers) {
            console.error('Authentication headers not found');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/settings/staff/list?search=&page=${currentPage}&limit=${itemsPerPage}`, {
                method: 'GET',
                headers: headers
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('API Response:', data);
            
            if (data.success && data.data && Array.isArray(data.data)) {
                const transformedData = transformStaffData(data.data);
                setStaff(transformedData);
                console.log('Transformed staff data:', transformedData);
            } else {
                console.error('API response format error:', data);
                setStaff([]);
            }
        } catch (error) {
            console.error('Error fetching staff data:', error);
            setStaff([]);
        } finally {
            setLoading(false);
        }
    };

    // Handle search
    const handleSearch = () => {
        if (!searchQuery.trim()) {
            fetchStaffData(); // Reload original data
            return;
        }

        const filteredData = staff.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.mobile.includes(searchQuery) ||
            item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.guardian_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        setStaff(filteredData);
    };

    // Handle search input change with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery !== '') {
                handleSearch();
            } else {
                fetchStaffData();
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Handle key press in search input
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // Toggle row dropdown
    const toggleRowDropdown = (username) => {
        setActiveRowDropdown(activeRowDropdown === username ? null : username);
    };

    // Find user by email
    const findUserByEmail = async (email) => {
        setIsFindingUser(true);
        setIsUserFound(false);
        setUserDetails(null);

        const headers = getHeaders();
        if (!headers) {
            alert('Authentication required. Please login again.');
            setIsFindingUser(false);
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/settings/staff/check-user`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (data.success && data.data) {
                setUserDetails(data.data);
                setIsUserFound(true);
            } else {
                setIsUserFound(false);
                setUserDetails(null);
                alert(data.message || 'User not found. Please check the email address.');
            }
        } catch (error) {
            console.error('Error finding user:', error);
            setIsUserFound(false);
            setUserDetails(null);
            alert('Network error. Please try again.');
        } finally {
            setIsFindingUser(false);
        }
    };

    // Handle add staff
    const handleAddStaff = async (e) => {
        e.preventDefault();
        if (isSubmitting || !userDetails || !userDetails.username) return;

        setIsSubmitting(true);
        
        const headers = getHeaders();
        if (!headers) {
            alert('Authentication required. Please login again.');
            setIsSubmitting(false);
            return;
        }

        try {
            // Call create staff API with only username and designation
            const response = await fetch(`${BASE_URL}/settings/staff/create`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    username: userDetails.username,
                    designation: staffForm.designation
                })
            });

            const data = await response.json();

            if (data.success) {
                // Refresh staff list after adding new staff
                fetchStaffData();
                
                // Show success message
                alert('Invitation sent to staff successfully!');
                
                // Close modal and reset form
                setIsAddStaffModalOpen(false);
                resetForm();
                
                console.log('Staff added successfully:', data);
            } else {
                alert(data.message || 'Failed to add staff member');
            }
        } catch (error) {
            console.error('Error adding staff:', error);
            alert('An error occurred while adding staff member');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle edit staff
    const handleEditStaff = async (e) => {
        e.preventDefault();
        if (isSubmitting || !selectedStaff) return;

        setIsSubmitting(true);
        try {
            // In a real implementation, you would call an API here
            // For now, we'll just update the local state
            setStaff(prev => prev.map(staffMember => 
                staffMember.id === selectedStaff.id 
                    ? { ...staffMember, ...staffForm }
                    : staffMember
            ));
            
            setIsEditStaffModalOpen(false);
            resetForm();
            
            console.log('Staff updated successfully:', selectedStaff.id);
        } catch (error) {
            console.error('Error updating staff:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle delete staff
    const handleDeleteStaff = async () => {
        if (isSubmitting || !selectedStaff) return;

        setIsSubmitting(true);
        try {
            // In a real implementation, you would call an API here
            // For now, we'll just update the local state
            setStaff(prev => prev.filter(staffMember => staffMember.id !== selectedStaff.id));
            setIsDeleteStaffModalOpen(false);
            
            console.log('Staff deleted successfully:', selectedStaff.id);
        } catch (error) {
            console.error('Error deleting staff:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle resend invitation link
    const handleResendInvitation = async (staffMember) => {
        if (resendingLink === staffMember.username) return;

        setResendingLink(staffMember.username);
        
        const headers = getHeaders();
        if (!headers) {
            alert('Authentication required. Please login again.');
            setResendingLink(null);
            return;
        }

        try {
            // Call API to resend invitation
            const response = await fetch(`${BASE_URL}/settings/staff/resend-invitation`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    username: staffMember.username
                })
            });

            const data = await response.json();

            if (data.success) {
                alert('Invitation link has been resent successfully!');
                console.log('Invitation resent for:', staffMember.username);
            } else {
                alert(data.message || 'Failed to resend invitation');
            }
        } catch (error) {
            console.error('Error resending invitation:', error);
            alert('An error occurred while resending invitation');
        } finally {
            setResendingLink(null);
        }
    };

    // Open edit modal
    const openEditModal = (staffMember) => {
        setSelectedStaff(staffMember);
        setStaffForm({
            name: staffMember.name,
            guardian_name: staffMember.guardian_name,
            mobile: staffMember.mobile,
            email: staffMember.email,
            designation: staffMember.designation,
            address: staffMember.address,
            salary: staffMember.salary,
            joining_date: staffMember.joining_date,
            emergency_contact: staffMember.emergency_contact || '',
            bank_account: staffMember.bank_account || '',
            ifsc_code: staffMember.ifsc_code || '',
            pan_number: staffMember.pan_number || ''
        });
        setIsEditStaffModalOpen(true);
    };

    // Open delete modal
    const openDeleteModal = (staffMember) => {
        setSelectedStaff(staffMember);
        setIsDeleteStaffModalOpen(true);
    };

    // Reset form
    const resetForm = () => {
        setStaffForm({
            designation: ''
        });
        setSelectedStaff(null);
        setUserDetails(null);
        setIsUserFound(false);
    };

    // Reset user details
    const resetUserDetails = () => {
        setUserDetails(null);
        setIsUserFound(false);
    };

    // Calculate totals
    const totalLoan = staff.reduce((acc, member) => acc + parseInt(member.loan || 0), 0);
    const totalBalance = staff.reduce((acc, member) => acc + parseInt(member.balance || 0), 0);
    const totalSalary = staff.reduce((acc, member) => acc + parseInt(member.salary || 0), 0);

    // Get current items based on pagination
    const indexOfLastItem = showAll ? staff.length : currentPage * itemsPerPage;
    const indexOfFirstItem = showAll ? 0 : (currentPage - 1) * itemsPerPage;
    const currentItems = staff.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(staff.length / itemsPerPage);

    // Skeleton loader component
    const SkeletonRow = () => (
        <tr className="border-b border-slate-100 animate-pulse">
            <td className="p-3 text-center">
                <div className="h-4 bg-slate-200 rounded w-6 mx-auto"></div>
            </td>
            <td className="p-3 text-center">
                <div className="h-4 bg-slate-200 rounded w-32 mx-auto"></div>
            </td>
            <td className="p-3 text-center">
                <div className="h-4 bg-slate-200 rounded w-40 mx-auto"></div>
            </td>
            <td className="p-3 text-center">
                <div className="h-4 bg-slate-200 rounded w-24 mx-auto"></div>
            </td>
            <td className="p-3 text-center">
                <div className="h-6 bg-slate-200 rounded w-16 mx-auto"></div>
            </td>
            <td className="p-3 text-center">
                <div className="h-6 bg-slate-200 rounded w-16 mx-auto"></div>
            </td>
            <td className="p-3 text-center">
                <div className="h-6 bg-slate-200 rounded w-10 mx-auto"></div>
            </td>
        </tr>
    );

    // Skeleton Loading Component for full page
    const SkeletonLoader = () => (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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

            <div className={`pt-16 transition-all duration-300 ease-in-out ${isMinimized ? 'md:pl-20' : 'md:pl-72'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                        <div className="border-b border-slate-200 px-6 py-4">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                <div>
                                    <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="h-10 bg-gray-200 rounded w-40"></div>
                                    <div className="h-10 bg-gray-200 rounded w-32"></div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden">
                            <div className="border-b border-slate-200">
                                <table className="w-full text-sm">
                                    <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                                        <tr>
                                            {[...Array(7)].map((_, i) => (
                                                <th key={i} className="p-3">
                                                    <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                </table>
                            </div>

                            <div className="p-4">
                                {[...Array(6)].map((_, index) => (
                                    <div key={index} className="mb-4">
                                        <div className="h-12 bg-gray-100 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Show skeleton while loading
    if (loading) {
        return <SkeletonLoader />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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

            <div className={`pt-16 transition-all duration-300 ease-in-out ${isMinimized ? 'md:pl-20' : 'md:pl-72'}`}>
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white shadow-md"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-xs font-medium">Total Staff</p>
                                    <h3 className="text-lg font-bold mt-1">{staff.length} Members</h3>
                                </div>
                                <FiUsers className="w-5 h-5 opacity-80" />
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: 0.1 }}
                            className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg p-4 text-white shadow-md"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-emerald-100 text-xs font-medium">Total Loan</p>
                                    <h3 className="text-lg font-bold mt-1">₹{formatCurrency(totalLoan)}</h3>
                                </div>
                                <FiCreditCard className="w-5 h-5 opacity-80" />
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: 0.2 }}
                            className="bg-gradient-to-r from-violet-500 to-violet-600 rounded-lg p-4 text-white shadow-md"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-violet-100 text-xs font-medium">Monthly Salary</p>
                                    <h3 className="text-lg font-bold mt-1">₹{formatCurrency(totalSalary)}</h3>
                                </div>
                                <FiDollarSign className="w-5 h-5 opacity-80" />
                            </div>
                        </motion.div>
                    </div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-xl shadow-lg border border-slate-200"
                    >
                        <div className="border-b border-slate-200 px-6 py-4 bg-gradient-to-r from-slate-50 to-white sticky top-0 z-10">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="p-1.5 bg-blue-100 rounded-lg">
                                            <FiUsers className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <h5 className="text-lg font-bold text-slate-800">
                                            Staff Members
                                        </h5>
                                    </div>
                                    <p className="text-slate-500 text-xs font-medium">
                                        Manage all staff members (Accepted and Pending)
                                    </p>
                                </div>

                                <div className="flex flex-col lg:flex-row gap-3 w-full lg:w-auto">
                                    <div className="flex gap-2">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                onKeyPress={handleKeyPress}
                                                placeholder="Search staff..."
                                                className="pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white outline-none transition-colors w-full lg:w-64 shadow-sm"
                                            />
                                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        </div>

                                        <motion.button
                                            onClick={() => setIsAddStaffModalOpen(true)}
                                            className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <FiPlus className="w-4 h-4" />
                                            Add Staff
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Table Container */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="bg-gradient-to-r from-slate-50 to-slate-100">
                                        <th className="text-center p-3 font-semibold text-slate-700 text-[10px] uppercase tracking-wider min-w-[60px]">
                                            #
                                        </th>
                                        <th className="text-center p-3 font-semibold text-slate-700 text-[10px] uppercase tracking-wider min-w-[200px]">
                                            STAFF DETAILS
                                        </th>
                                        <th className="text-center p-3 font-semibold text-slate-700 text-[10px] uppercase tracking-wider min-w-[150px]">
                                            CONTACT INFO
                                        </th>
                                        <th className="text-center p-3 font-semibold text-slate-700 text-[10px] uppercase tracking-wider min-w-[120px]">
                                            DESIGNATION
                                        </th>
                                        <th className="text-center p-3 font-semibold text-slate-700 text-[10px] uppercase tracking-wider min-w-[100px]">
                                            STATUS
                                        </th>
                                        <th className="text-center p-3 font-semibold text-slate-700 text-[10px] uppercase tracking-wider min-w-[100px]">
                                            BALANCE
                                        </th>
                                        <th className="text-center p-3 font-semibold text-slate-700 text-[10px] uppercase tracking-wider min-w-[80px]">
                                            ACTIONS
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-100">
                                    {staff.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="text-center py-8 text-slate-500">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="p-3 bg-slate-100 rounded-full mb-3">
                                                        <FiUsers className="w-8 h-8 text-slate-400" />
                                                    </div>
                                                    <p className="text-slate-600 text-sm font-medium mb-1">No staff records found</p>
                                                    <p className="text-slate-500 text-xs mb-4">Try adding a new staff member or adjust your search</p>
                                                    <motion.button
                                                        onClick={() => setIsAddStaffModalOpen(true)}
                                                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-xs font-semibold hover:shadow transition-all duration-200"
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                    >
                                                        Add Your First Staff Member
                                                    </motion.button>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        currentItems.map((staffMember, index) => {
                                            const isDropdownOpen = activeRowDropdown === staffMember.username;
                                            const actualIndex = showAll ? index : (currentPage - 1) * itemsPerPage + index;
                                            const isAccepted = staffMember.is_accepted === true;

                                            return (
                                                <motion.tr
                                                    key={staffMember.id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="hover:bg-blue-50/20 transition-colors duration-150"
                                                >
                                                    <td className="text-center p-3 align-middle">
                                                        <div className="text-slate-700 font-medium text-xs">
                                                            {actualIndex + 1}
                                                        </div>
                                                    </td>
                                                    <td className="text-center p-3 align-middle">
                                                        <div className="flex flex-col items-center">
                                                            {isAccepted ? (
                                                                <a
                                                                    href={`/staff/view/profile?username=${staffMember.username}`}
                                                                    className="text-blue-600 hover:text-blue-800 font-medium block hover:underline transition-colors text-sm"
                                                                >
                                                                    {staffMember.name}
                                                                </a>
                                                            ) : (
                                                                <span className="text-slate-800 font-medium text-sm">
                                                                    {staffMember.name}
                                                                </span>
                                                            )}
                                                            {isAccepted && staffMember.guardian_name && (
                                                                <div className="text-slate-500 text-xs mt-1">
                                                                    C/O: {staffMember.guardian_name}
                                                                </div>
                                                            )}
                                                            {isAccepted && (
                                                                <div className="text-slate-400 text-[10px] mt-1">
                                                                    Joined: {formatDate(staffMember.joining_date)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="text-center p-3 align-middle">
                                                        <div className="flex flex-col items-center">
                                                            {isAccepted ? (
                                                                <>
                                                                    <div className="flex items-center gap-2 text-slate-800 font-medium text-xs">
                                                                        <FiPhone className="w-3 h-3 text-blue-500" />
                                                                        {staffMember.mobile}
                                                                    </div>
                                                                    <div className="flex items-center gap-2 text-slate-500 text-xs mt-1">
                                                                        <FiMail className="w-3 h-3 text-blue-400" />
                                                                        {staffMember.email}
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div className="flex items-center gap-2 text-slate-500 text-xs">
                                                                    <FiMail className="w-3 h-3 text-blue-400" />
                                                                    {staffMember.email}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="text-center p-3 align-middle">
                                                        <div className="flex flex-col items-center">
                                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-medium ${isAccepted ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 uppercase border border-blue-200' : 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-800 uppercase border border-amber-200'}`}>
                                                                {staffMember.designation}
                                                            </span>
                                                            {isAccepted && staffMember.salary && (
                                                                <div className="text-emerald-600 text-xs font-medium mt-1">
                                                                    ₹{formatCurrency(parseInt(staffMember.salary))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="text-center p-3 align-middle">
                                                        <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg min-w-[80px] border shadow-xs text-xs font-bold ${
                                                            isAccepted 
                                                                ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200' 
                                                                : 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200'
                                                        }`}>
                                                            {isAccepted ? 'Accepted' : 'Pending'}
                                                        </span>
                                                    </td>
                                                    <td className="text-center p-3 align-middle">
                                                        {isAccepted ? (
                                                            <a
                                                                href={`/staff/view/profile/ledger?username=${staffMember.username}`}
                                                                className="inline-block"
                                                            >
                                                                <span className="inline-flex items-center justify-center bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 text-xs font-bold px-3 py-1.5 rounded-lg min-w-[80px] border border-green-200 shadow-xs">
                                                                    ₹{formatCurrency(parseInt(staffMember.balance))}
                                                                </span>
                                                            </a>
                                                        ) : (
                                                            <span className="inline-flex items-center justify-center bg-gradient-to-r from-slate-100 to-slate-200 text-slate-500 text-xs font-medium px-3 py-1.5 rounded-lg min-w-[80px] border border-slate-300 shadow-xs">
                                                                N/A
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="text-center p-3 align-middle">
                                                        <div className="dropdown-container relative flex justify-center">
                                                            <motion.button
                                                                className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-150 border border-slate-200 hover:border-blue-300"
                                                                onClick={() => toggleRowDropdown(staffMember.username)}
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                            >
                                                                <FiSettings className="w-3.5 h-3.5" />
                                                            </motion.button>
                                                            <AnimatePresence>
                                                                {isDropdownOpen && (
                                                                    <motion.div
                                                                        initial={{ opacity: 0, y: 5 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        exit={{ opacity: 0, y: 5 }}
                                                                        className="absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden"
                                                                    >
                                                                        <div className="py-1">
                                                                            {isAccepted ? (
                                                                                // Options for accepted staff
                                                                                <>
                                                                                    <a
                                                                                        href={`/staff/view/profile/attendance?username=${staffMember.username}`}
                                                                                        className="flex items-center w-full px-3 py-2 text-xs text-slate-700 hover:bg-blue-50 transition-colors duration-150"
                                                                                        onClick={() => setActiveRowDropdown(null)}
                                                                                    >
                                                                                        <div className="p-1 bg-blue-50 rounded mr-2">
                                                                                            <FiUserCheck className="w-3 h-3 text-blue-500" />
                                                                                        </div>
                                                                                        <div className="text-left">
                                                                                            <div className="font-medium">Attendance</div>
                                                                                        </div>
                                                                                    </a>
                                                                                    <a
                                                                                        href={`/staff/view/profile/expense?username=${staffMember.username}`}
                                                                                        className="flex items-center w-full px-3 py-2 text-xs text-slate-700 hover:bg-blue-50 transition-colors duration-150"
                                                                                        onClick={() => setActiveRowDropdown(null)}
                                                                                    >
                                                                                        <div className="p-1 bg-green-50 rounded mr-2">
                                                                                            <FiDollarSign className="w-3 h-3 text-green-500" />
                                                                                        </div>
                                                                                        <div className="text-left">
                                                                                            <div className="font-medium">Expenses</div>
                                                                                        </div>
                                                                                    </a>
                                                                                    <a
                                                                                        href={`/staff/view/profile/bonus-fine?username=${staffMember.username}`}
                                                                                        className="flex items-center w-full px-3 py-2 text-xs text-slate-700 hover:bg-blue-50 transition-colors duration-150"
                                                                                        onClick={() => setActiveRowDropdown(null)}
                                                                                    >
                                                                                        <div className="p-1 bg-purple-50 rounded mr-2">
                                                                                            <FiGift className="w-3 h-3 text-purple-500" />
                                                                                        </div>
                                                                                        <div className="text-left">
                                                                                            <div className="font-medium">Bonus/Fine</div>
                                                                                        </div>
                                                                                    </a>
                                                                                    <a
                                                                                        href={`/staff/view/profile/salary?username=${staffMember.username}`}
                                                                                        className="flex items-center w-full px-3 py-2 text-xs text-slate-700 hover:bg-blue-50 transition-colors duration-150"
                                                                                        onClick={() => setActiveRowDropdown(null)}
                                                                                    >
                                                                                        <div className="p-1 bg-amber-50 rounded mr-2">
                                                                                            <FiCreditCard className="w-3 h-3 text-amber-500" />
                                                                                        </div>
                                                                                        <div className="text-left">
                                                                                            <div className="font-medium">Salary</div>
                                                                                        </div>
                                                                                    </a>
                                                                                    <a
                                                                                        href={`/staff/view/profile/ledger?username=${staffMember.username}`}
                                                                                        className="flex items-center w-full px-3 py-2 text-xs text-slate-700 hover:bg-blue-50 transition-colors duration-150"
                                                                                        onClick={() => setActiveRowDropdown(null)}
                                                                                    >
                                                                                        <div className="p-1 bg-blue-50 rounded mr-2">
                                                                                            <FiCreditCard className="w-3 h-3 text-blue-600" />
                                                                                        </div>
                                                                                        <div className="text-left">
                                                                                            <div className="font-medium">Ledger</div>
                                                                                        </div>
                                                                                    </a>
                                                                                    <a
                                                                                        href={`/staff/view/profile/performance?username=${staffMember.username}`}
                                                                                        className="flex items-center w-full px-3 py-2 text-xs text-slate-700 hover:bg-blue-50 transition-colors duration-150"
                                                                                        onClick={() => setActiveRowDropdown(null)}
                                                                                    >
                                                                                        <div className="p-1 bg-emerald-50 rounded mr-2">
                                                                                            <FiTrendingUp className="w-3 h-3 text-emerald-600" />
                                                                                        </div>
                                                                                        <div className="text-left">
                                                                                            <div className="font-medium">Performance</div>
                                                                                        </div>
                                                                                    </a>
                                                                                    <a
                                                                                        href={`/staff/view/profile/profile?username=${staffMember.username}`}
                                                                                        className="flex items-center w-full px-3 py-2 text-xs text-slate-700 hover:bg-blue-50 transition-colors duration-150"
                                                                                        onClick={() => setActiveRowDropdown(null)}
                                                                                    >
                                                                                        <div className="p-1 bg-indigo-50 rounded mr-2">
                                                                                            <FiUser className="w-3 h-3 text-indigo-500" />
                                                                                        </div>
                                                                                        <div className="text-left">
                                                                                            <div className="font-medium">Profile</div>
                                                                                        </div>
                                                                                    </a>
                                                                                </>
                                                                            ) : (
                                                                                // Options for pending staff
                                                                                <>
                                                                                    <div className="text-center py-2 px-3">
                                                                                        <div className="text-xs text-amber-600 font-medium mb-1">
                                                                                            Invitation Pending
                                                                                        </div>
                                                                                        <div className="text-[10px] text-slate-500 mb-2">
                                                                                            Staff hasn't accepted yet
                                                                                        </div>
                                                                                        <button
                                                                                            onClick={() => {
                                                                                                setActiveRowDropdown(null);
                                                                                                handleResendInvitation(staffMember);
                                                                                            }}
                                                                                            disabled={resendingLink === staffMember.username}
                                                                                            className="flex items-center justify-center w-full px-3 py-2 text-xs bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 hover:from-blue-100 hover:to-indigo-100 transition-colors duration-150 rounded border border-blue-200"
                                                                                        >
                                                                                            {resendingLink === staffMember.username ? (
                                                                                                <>
                                                                                                    <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-blue-600" fill="none" viewBox="0 0 24 24">
                                                                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                                                    </svg>
                                                                                                    Resending...
                                                                                                </>
                                                                                            ) : (
                                                                                                <>
                                                                                                    <FiRefreshCw className="w-3 h-3 mr-2" />
                                                                                                    Resend Invitation
                                                                                                </>
                                                                                            )}
                                                                                        </button>
                                                                                    </div>
                                                                                </>
                                                                            )}
                                                                            <div className="border-t border-slate-100 mt-1 pt-1">
                                                                                <button
                                                                                    onClick={() => {
                                                                                        setActiveRowDropdown(null);
                                                                                        openEditModal(staffMember);
                                                                                    }}
                                                                                    className="flex items-center w-full px-3 py-2 text-xs text-slate-700 hover:bg-emerald-50 transition-colors duration-150"
                                                                                >
                                                                                    <div className="p-1 bg-emerald-50 rounded mr-2">
                                                                                        <FiEdit className="w-3 h-3 text-emerald-600" />
                                                                                    </div>
                                                                                    <div className="text-left">
                                                                                        <div className="font-medium">Edit Staff</div>
                                                                                    </div>
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => {
                                                                                        setActiveRowDropdown(null);
                                                                                        openDeleteModal(staffMember);
                                                                                    }}
                                                                                    className="flex items-center w-full px-3 py-2 text-xs text-slate-700 hover:bg-red-50 transition-colors duration-150"
                                                                                >
                                                                                    <div className="p-1 bg-red-50 rounded mr-2">
                                                                                        <FiTrash2 className="w-3 h-3 text-red-600" />
                                                                                    </div>
                                                                                    <div className="text-left">
                                                                                        <div className="font-medium">Delete Staff</div>
                                                                                    </div>
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>

                            {/* Pagination Controls */}
                            {staff.length > itemsPerPage && !showAll && (
                                <div className="border-t border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                                    <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-3 gap-3">
                                        <div className="text-xs text-slate-600">
                                            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, staff.length)} of {staff.length} staff members
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                                            >
                                                <FiChevronLeft className="w-3 h-3" />
                                                Previous
                                            </button>
                                            <div className="flex items-center gap-1">
                                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                    let pageNumber;
                                                    if (totalPages <= 5) {
                                                        pageNumber = i + 1;
                                                    } else if (currentPage <= 3) {
                                                        pageNumber = i + 1;
                                                    } else if (currentPage >= totalPages - 2) {
                                                        pageNumber = totalPages - 4 + i;
                                                    } else {
                                                        pageNumber = currentPage - 2 + i;
                                                    }
                                                    
                                                    return (
                                                        <button
                                                            key={pageNumber}
                                                            onClick={() => setCurrentPage(pageNumber)}
                                                            className={`w-8 h-8 text-xs font-medium rounded-lg transition-colors ${
                                                                currentPage === pageNumber
                                                                    ? 'bg-blue-600 text-white'
                                                                    : 'border border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
                                                            }`}
                                                        >
                                                            {pageNumber}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                disabled={currentPage === totalPages}
                                                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                                            >
                                                Next
                                                <FiChevronRightIcon className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => setShowAll(true)}
                                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-50 transition-colors"
                                        >
                                            Show All
                                            <FiChevronDown className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Show Less Button when showing all */}
                            {showAll && staff.length > itemsPerPage && (
                                <div className="border-t border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                                    <div className="flex justify-center px-4 py-3">
                                        <button
                                            onClick={() => {
                                                setShowAll(false);
                                                setCurrentPage(1);
                                            }}
                                            className="flex items-center gap-1 px-4 py-2 text-xs font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-50 transition-colors shadow-sm"
                                        >
                                            Show Less
                                            <FiChevronUp className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Add Staff Modal */}
            <AddStaffModal
                isOpen={isAddStaffModalOpen}
                onClose={() => {
                    setIsAddStaffModalOpen(false);
                    resetForm();
                }}
                onSubmit={handleAddStaff}
                formData={staffForm}
                onFormChange={setStaffForm}
                isSubmitting={isSubmitting}
                mode="add"
                userDetails={userDetails}
                onFindUser={findUserByEmail}
                isFindingUser={isFindingUser}
                isUserFound={isUserFound}
                resetUserDetails={resetUserDetails}
            />

            {/* Edit Staff Modal */}
            <StaffFormModal
                isOpen={isEditStaffModalOpen}
                onClose={() => {
                    setIsEditStaffModalOpen(false);
                    resetForm();
                }}
                onSubmit={handleEditStaff}
                formData={staffForm}
                onFormChange={setStaffForm}
                isSubmitting={isSubmitting}
                mode="edit"
            />

            {/* Delete Staff Modal */}
            <ModalWrapper
                isOpen={isDeleteStaffModalOpen}
                onClose={() => {
                    setIsDeleteStaffModalOpen(false);
                    resetForm();
                }}
                title="Delete Staff Member"
                size="max-w-sm"
            >
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-200">
                            <IoTrash className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">Confirm Deletion</h3>
                        <p className="text-slate-600 mb-6 text-sm">
                            Are you sure you want to delete <strong>{selectedStaff?.name}</strong>? This action cannot be undone and all associated data will be permanently removed.
                        </p>
                    </div>
                </div>

                <div className="flex-shrink-0 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 p-6 rounded-b-xl">
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                setIsDeleteStaffModalOpen(false);
                                resetForm();
                            }}
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors disabled:opacity-50 shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeleteStaff}
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 border border-red-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center shadow-sm"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Deleting...
                                </>
                            ) : (
                                'Delete Staff'
                            )}
                        </button>
                    </div>
                </div>
            </ModalWrapper>
        </div>
    );
};

export default ViewStaff;