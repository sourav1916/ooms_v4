import React, { useState, useEffect, useRef } from 'react';
import { Header, Sidebar } from '../components/header';
import {
    FiPlus,
    FiEdit,
    FiSettings,
    FiDollarSign,
    FiMenu,
    FiFileText,
    FiFilter,
    FiChevronRight,
    FiPrinter,
    FiCreditCard
} from 'react-icons/fi';
import { PiExportBold } from "react-icons/pi";
import { PiFilePdfDuotone, PiMicrosoftExcelLogoDuotone } from "react-icons/pi";
import { motion, AnimatePresence } from 'framer-motion';

const BankList = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(() => {
        const saved = localStorage.getItem('sidebarMinimized');
        return saved ? JSON.parse(saved) : false;
    });
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showAddDropdown, setShowAddDropdown] = useState(false);
    const [activeRowDropdown, setActiveRowDropdown] = useState(null);
    const [exportModal, setExportModal] = useState({ open: false, type: '', data: null });
    
    // Form states
    const [formData, setFormData] = useState({
        bank: '',
        holder: '',
        account: '',
        ifsc: '',
        branch: '',
        type: '',
        opening_balance: '',
        opening_type: '',
        payment_date: new Date().toISOString().split('T')[0]
    });
    
    const [editFormData, setEditFormData] = useState({
        bank_id: '',
        bank: '',
        holder: '',
        account: '',
        ifsc: '',
        branch: '',
        type: '',
        opening_balance: '',
        opening_type: '',
        payment_date: ''
    });

    // Bank type options
    const [bankTypes] = useState([
        { value: 'savings', name: 'Savings Account' },
        { value: 'current', name: 'Current Account' },
        { value: 'salary', name: 'Salary Account' },
        { value: 'fixed_deposit', name: 'Fixed Deposit' }
    ]);

    // Opening type options
    const [openingTypes] = useState([
        { value: '1', name: 'Credit' },
        { value: '0', name: 'Debit' }
    ]);

    // Mock banks data
    const [banks, setBanks] = useState([
        {
            bank_id: '1',
            bank: 'State Bank of India',
            account: '12345678901',
            holder: 'John Doe',
            ifsc: 'SBIN0000123',
            type: 'savings',
            branch: 'Main Branch',
            opening_balance: 50000,
            opening_date: '01-01-2023',
            opening_type: '1',
            balance_due: 75000
        },
        {
            bank_id: '2',
            bank: 'HDFC Bank',
            account: '98765432109',
            holder: 'Jane Smith',
            ifsc: 'HDFC0000567',
            type: 'current',
            branch: 'Corporate Branch',
            opening_balance: 100000,
            opening_date: '15-03-2023',
            opening_type: '1',
            balance_due: 125000
        },
        {
            bank_id: '3',
            bank: 'ICICI Bank',
            account: '45678912304',
            holder: 'Mike Johnson',
            ifsc: 'ICIC0000789',
            type: 'salary',
            branch: 'Tech Park Branch',
            opening_balance: 25000,
            opening_date: '20-06-2023',
            opening_type: '1',
            balance_due: 35000
        },
        {
            bank_id: '4',
            bank: 'Axis Bank',
            account: '78912345607',
            holder: 'Sarah Wilson',
            ifsc: 'UTIB0000456',
            type: 'savings',
            branch: 'Mall Road Branch',
            opening_balance: 75000,
            opening_date: '10-02-2023',
            opening_type: '1',
            balance_due: 90000
        },
        {
            bank_id: '5',
            bank: 'Kotak Mahindra Bank',
            account: '65432198701',
            holder: 'Robert Brown',
            ifsc: 'KKBK0000321',
            type: 'current',
            branch: 'Business Park',
            opening_balance: 150000,
            opening_date: '05-04-2023',
            opening_type: '1',
            balance_due: 180000
        },
        {
            bank_id: '6',
            bank: 'Yes Bank',
            account: '32165498702',
            holder: 'Priya Sharma',
            ifsc: 'YESB0000789',
            type: 'savings',
            branch: 'City Center',
            opening_balance: 60000,
            opening_date: '12-07-2023',
            opening_type: '1',
            balance_due: 75000
        },
        {
            bank_id: '7',
            bank: 'Punjab National Bank',
            account: '78945612301',
            holder: 'David Lee',
            ifsc: 'PUNB0000456',
            type: 'current',
            branch: 'Industrial Area',
            opening_balance: 200000,
            opening_date: '01-05-2023',
            opening_type: '1',
            balance_due: 250000
        },
        {
            bank_id: '8',
            bank: 'Bank of Baroda',
            account: '65498732102',
            holder: 'Lisa Wang',
            ifsc: 'BARB0000789',
            type: 'savings',
            branch: 'Commercial Complex',
            opening_balance: 80000,
            opening_date: '20-08-2023',
            opening_type: '1',
            balance_due: 95000
        },
        {
            bank_id: '9',
            bank: 'Canara Bank',
            account: '32178965403',
            holder: 'Kevin Patel',
            ifsc: 'CNRB0000123',
            type: 'current',
            branch: 'Financial District',
            opening_balance: 175000,
            opening_date: '10-09-2023',
            opening_type: '1',
            balance_due: 210000
        },
        {
            bank_id: '10',
            bank: 'Union Bank of India',
            account: '98712345604',
            holder: 'Maria Garcia',
            ifsc: 'UBIN0000567',
            type: 'savings',
            branch: 'Residential Area',
            opening_balance: 45000,
            opening_date: '15-10-2023',
            opening_type: '1',
            balance_due: 60000
        }
    ]);

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

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle create bank
    const handleCreateBank = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            const newBank = {
                bank_id: (banks.length + 1).toString(),
                ...formData,
                opening_balance: parseFloat(formData.opening_balance),
                balance_due: parseFloat(formData.opening_balance),
                opening_date: formData.payment_date
            };

            setBanks(prev => [...prev, newBank]);
            setFormData({
                bank: '',
                holder: '',
                account: '',
                ifsc: '',
                branch: '',
                type: '',
                opening_balance: '',
                opening_type: '',
                payment_date: new Date().toISOString().split('T')[0]
            });
            setShowAddModal(false);
            setLoading(false);

            // Show success message
            alert('Bank created successfully!');
        }, 1000);
    };

    // Handle edit bank
    const handleEditBank = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setBanks(prev => prev.map(bank =>
                bank.bank_id === editFormData.bank_id
                    ? {
                        ...bank,
                        bank: editFormData.bank,
                        holder: editFormData.holder,
                        account: editFormData.account,
                        ifsc: editFormData.ifsc,
                        branch: editFormData.branch,
                        type: editFormData.type,
                        opening_balance: parseFloat(editFormData.opening_balance),
                        opening_type: editFormData.opening_type,
                        opening_date: editFormData.payment_date
                    }
                    : bank
            ));

            setShowEditModal(false);
            setLoading(false);

            // Show success message
            alert('Bank updated successfully!');
        }, 1000);
    };

    // Handle edit button click
    const handleEditClick = (bank) => {
        setEditFormData({
            bank_id: bank.bank_id,
            bank: bank.bank,
            holder: bank.holder,
            account: bank.account,
            ifsc: bank.ifsc,
            branch: bank.branch,
            type: bank.type,
            opening_balance: bank.opening_balance.toString(),
            opening_type: bank.opening_type,
            payment_date: bank.opening_date
        });
        setShowEditModal(true);
    };

    // Handle export
    const handleExport = (type, data = null) => {
        setExportModal({ open: true, type, data });
        
        // Simulate export process
        setTimeout(() => {
            setExportModal({ open: false, type: '', data: null });
            alert(`${type.toUpperCase()} export completed successfully!`);
        }, 1500);
    };

    // Get bank type name
    const getBankTypeName = (typeValue) => {
        const type = bankTypes.find(t => t.value === typeValue);
        return type ? type.name : typeValue;
    };

    // Get bank type color
    const getBankTypeColor = (type) => {
        switch(type) {
            case 'savings': return 'bg-blue-100 text-blue-700';
            case 'current': return 'bg-green-100 text-green-700';
            case 'salary': return 'bg-purple-100 text-purple-700';
            case 'fixed_deposit': return 'bg-orange-100 text-orange-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    // Toggle row dropdown
    const toggleRowDropdown = (bankId) => {
        setActiveRowDropdown(activeRowDropdown === bankId ? null : bankId);
    };

    // Close all dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown-container')) {
                setShowAddDropdown(false);
                setActiveRowDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
                <div className="h-4 bg-slate-200 rounded w-24 mx-auto"></div>
            </td>
            <td className="p-3 text-center">
                <div className="h-4 bg-slate-200 rounded w-20 mx-auto"></div>
            </td>
            <td className="p-3 text-center">
                <div className="h-4 bg-slate-200 rounded w-16 mx-auto"></div>
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
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                        {/* Skeleton Header */}
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

                        {/* Skeleton Table */}
                        <div className="overflow-hidden">
                            <div className="border-b border-slate-200">
                                <table className="w-full text-sm">
                                    <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                                        <tr>
                                            {[...Array(7)].map((_, i) => (
                                                <th key={i} className="text-center p-3">
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

    // Modal Content Component (moved inside BankList to access state variables)
    const ModalContent = ({ 
        isOpen, 
        onClose, 
        onSubmit, 
        formData, 
        onChange, 
        loading, 
        mode = 'add',
        title 
    }) => {
        if (!isOpen) return null;

        const modalContent = (
            <div className="bg-white rounded-xl shadow-2xl flex flex-col h-full border border-gray-300">
                {/* Professional Header */}
                <div className="flex-shrink-0 flex items-center justify-between p-3 border-b border-gray-300 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl">
                    <div>
                        <h2 className="text-xl font-bold">{title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-blue-200 p-1 text-white rounded-lg bg-blue-500 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={onSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Bank Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Bank Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="bank"
                                    value={formData.bank}
                                    onChange={onChange}
                                    placeholder="Enter bank name"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                                    required
                                />
                            </div>

                            {/* Account Holder */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Account Holder <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="holder"
                                    value={formData.holder}
                                    onChange={onChange}
                                    placeholder="Enter account holder name"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                                    required
                                />
                            </div>

                            {/* Account Number */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Account Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="account"
                                    value={formData.account}
                                    onChange={onChange}
                                    placeholder="Enter account number"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                                    required
                                />
                            </div>

                            {/* IFSC Code */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    IFSC Code <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="ifsc"
                                    value={formData.ifsc}
                                    onChange={onChange}
                                    placeholder="Enter IFSC code"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                                    required
                                />
                            </div>

                            {/* Branch */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Branch <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="branch"
                                    value={formData.branch}
                                    onChange={onChange}
                                    placeholder="Enter branch name"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                                    required
                                />
                            </div>

                            {/* Account Type */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Account Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={onChange}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors bg-white"
                                    required
                                >
                                    <option value="" disabled>Select Account Type</option>
                                    {bankTypes.map(type => (
                                        <option key={type.value} value={type.value}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Opening Balance */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Opening Balance <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="opening_balance"
                                    value={formData.opening_balance}
                                    onChange={onChange}
                                    placeholder="Enter opening balance"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                                    required
                                />
                            </div>

                            {/* Opening Type */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Balance Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="opening_type"
                                    value={formData.opening_type}
                                    onChange={onChange}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors bg-white"
                                    required
                                >
                                    <option value="" disabled>Select Balance Type</option>
                                    {openingTypes.map(type => (
                                        <option key={type.value} value={type.value}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Opening Date */}
                            <div className="lg:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Opening Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="payment_date"
                                    value={formData.payment_date}
                                    onChange={onChange}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                                    required
                                />
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer Section */}
                <div className="flex-shrink-0 border-t border-gray-200 bg-white p-4 rounded-b-xl shadow-sm">
                    <div className="flex flex-col lg:flex-row justify-end items-start lg:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                onClick={onSubmit}
                                disabled={loading}
                                className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center min-w-[120px] justify-center"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {mode === 'add' ? 'Creating...' : 'Updating...'}
                                    </>
                                ) : (
                                    mode === 'add' ? 'Create Bank' : 'Update Bank'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );

        return (
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen p-4">
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                        onClick={onClose}
                    />
                    {/* Professional Modal panel */}
                    <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl h-[90vh] flex flex-col">
                        {modalContent}
                    </div>
                </div>
            </div>
        );
    };

    // Show skeleton while loading
    if (loading) {
        return <SkeletonLoader />;
    }

    // Calculate total balance
    const totalBalance = banks.reduce((acc, bank) => acc + bank.balance_due, 0);

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

            {/* Main Content Area - Full Page Scroll */}
            <div className={`pt-16 transition-all duration-300 ease-in-out ${isMinimized ? 'md:pl-20' : 'md:pl-72'}`}>
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* Header Stats Card - Smaller */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white shadow-md mb-4"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-xs font-medium">Total Bank Balance</p>
                                <h3 className="text-lg font-bold mt-1">₹{formatCurrency(totalBalance)}</h3>
                                <p className="text-blue-100 text-xs mt-1">
                                    {banks.length} Bank Accounts
                                </p>
                            </div>
                            <FiCreditCard className="w-5 h-5 opacity-80" />
                        </div>
                    </motion.div>

                    {/* Main Card */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-xl shadow-lg border border-slate-200"
                    >
                        {/* Card Header */}
                        <div className="border-b border-slate-200 px-6 py-4 bg-gradient-to-r from-slate-50 to-white sticky top-0 z-10">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="p-1.5 bg-blue-100 rounded-lg">
                                            <FiCreditCard className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <h5 className="text-lg font-bold text-slate-800">
                                            Bank Register
                                        </h5>
                                    </div>
                                    <p className="text-slate-600 text-xs font-medium">
                                        Manage all your bank accounts in one place
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    {/* Export Dropdown */}
                                    <div className="dropdown-container relative">
                                        <motion.button
                                            onClick={() => setShowAddDropdown(!showAddDropdown)}
                                            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <PiExportBold className="w-4 h-4" />
                                            Export
                                            <FiChevronRight className={`w-3 h-3 transition-transform ${showAddDropdown ? 'rotate-90' : ''}`} />
                                        </motion.button>

                                        <AnimatePresence>
                                            {showAddDropdown && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 5 }}
                                                    className="absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden"
                                                >
                                                    <div className="py-1">
                                                        <button
                                                            onClick={() => handleExport('pdf')}
                                                            className="flex items-center w-full px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 transition-all duration-150 group"
                                                        >
                                                            <div className="p-1.5 bg-red-50 rounded mr-2 group-hover:bg-red-100 transition-colors">
                                                                <PiFilePdfDuotone className="w-3.5 h-3.5 text-red-500" />
                                                            </div>
                                                            <div className="text-left">
                                                                <div className="font-medium text-xs">Export as PDF</div>
                                                            </div>
                                                        </button>
                                                        <button
                                                            onClick={() => handleExport('excel')}
                                                            className="flex items-center w-full px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 transition-all duration-150 group"
                                                        >
                                                            <div className="p-1.5 bg-green-50 rounded mr-2 group-hover:bg-green-100 transition-colors">
                                                                <PiMicrosoftExcelLogoDuotone className="w-3.5 h-3.5 text-green-500" />
                                                            </div>
                                                            <div className="text-left">
                                                                <div className="font-medium text-xs">Export as Excel</div>
                                                            </div>
                                                        </button>
                                                        <button
                                                            onClick={() => handleExport('print')}
                                                            className="flex items-center w-full px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 transition-all duration-150 group"
                                                        >
                                                            <div className="p-1.5 bg-slate-50 rounded mr-2 group-hover:bg-slate-100 transition-colors">
                                                                <FiPrinter className="w-3.5 h-3.5 text-slate-600" />
                                                            </div>
                                                            <div className="text-left">
                                                                <div className="font-medium text-xs">Print Report</div>
                                                            </div>
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Add Bank Button */}
                                    <motion.button
                                        onClick={() => setShowAddModal(true)}
                                        className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <FiPlus className="w-4 h-4" />
                                        Add Bank
                                    </motion.button>
                                </div>
                            </div>
                        </div>

                        {/* Table Container */}
                        <div className="w-full">
                            <table className="w-full text-xs table-fixed">
                                <thead>
                                    <tr className="bg-gradient-to-r from-slate-50 to-slate-100">
                                        <th className="text-center p-3 font-semibold text-slate-700 text-[10px] uppercase tracking-wider w-[5%]">
                                            Sl No
                                        </th>
                                        <th className="text-center p-3 font-semibold text-slate-700 text-[10px] uppercase tracking-wider w-[25%]">
                                            Bank Details
                                        </th>
                                        <th className="text-center p-3 font-semibold text-slate-700 text-[10px] uppercase tracking-wider w=[15%]">
                                            A/C Holder
                                        </th>
                                        <th className="text-center p-3 font-semibold text-slate-700 text-[10px] uppercase tracking-wider w=[10%]">
                                            IFSC
                                        </th>
                                        <th className="text-center p-3 font-semibold text-slate-700 text-[10px] uppercase tracking-wider w=[10%]">
                                            Type
                                        </th>
                                        <th className="text-center p-3 font-semibold text-slate-700 text-[10px] uppercase tracking-wider w=[15%]">
                                            Balance
                                        </th>
                                        <th className="text-center p-3 font-semibold text-slate-700 text-[10px] uppercase tracking-wider w=[10%]">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-100">
                                    {banks.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="text-center py-8 text-slate-500">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="p-3 bg-slate-100 rounded-full mb-3">
                                                        <FiCreditCard className="w-8 h-8 text-slate-400" />
                                                    </div>
                                                    <p className="text-slate-600 text-sm font-medium mb-1">No bank accounts found</p>
                                                    <p className="text-slate-500 text-xs mb-4">Start by adding your first bank account</p>
                                                    <motion.button 
                                                        onClick={() => setShowAddModal(true)}
                                                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-xs font-semibold hover:shadow transition-all duration-200"
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                    >
                                                        Add Your First Bank Account
                                                    </motion.button>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        banks.map((bank, index) => {
                                            const isDropdownOpen = activeRowDropdown === bank.bank_id;

                                            return (
                                                <motion.tr
                                                    key={bank.bank_id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="hover:bg-blue-50/20 transition-colors duration-150"
                                                >
                                                    <td className="text-center p-3 align-middle">
                                                        <div className="text-slate-700 font-medium text-xs">
                                                            {index + 1}
                                                        </div>
                                                    </td>
                                                    <td className="text-center p-3 align-middle">
                                                        <div className="px-2">
                                                            <div className="text-slate-800 font-semibold text-xs truncate">
                                                                {bank.bank}
                                                            </div>
                                                            <div className="text-slate-600 text-[10px] truncate mt-1">
                                                                {bank.account}
                                                            </div>
                                                            <div className="text-slate-500 text-[10px] truncate">
                                                                {bank.branch}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="text-center p-3 align-middle">
                                                        <div className="text-slate-800 font-semibold text-xs truncate">
                                                            {bank.holder}
                                                        </div>
                                                    </td>
                                                    <td className="text-center p-3 align-middle">
                                                        <span className="inline-flex items-center justify-center bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 font-bold px-3 py-1.5 rounded text-xs border border-slate-300/50">
                                                            {bank.ifsc}
                                                        </span>
                                                    </td>
                                                    <td className="text-center p-3 align-middle">
                                                        <span className={`px-2 py-1.5 rounded-full text-[9px] font-medium capitalize whitespace-nowrap ${getBankTypeColor(bank.type)}`}>
                                                            {getBankTypeName(bank.type)}
                                                        </span>
                                                    </td>
                                                    <td className="text-center p-3 align-middle">
                                                        <a
                                                            href={`/view-bank-ledger?bank_id=${bank.bank_id}`}
                                                            className="inline-flex items-center justify-center bg-gradient-to-r from-green-50 to-green-100 text-green-800 font-bold px-3 py-1.5 rounded text-xs cursor-pointer hover:shadow transition-all duration-150"
                                                        >
                                                            ₹{formatCurrency(bank.balance_due)}
                                                        </a>
                                                    </td>
                                                    <td className="text-center p-3 align-middle">
                                                        <div className="dropdown-container relative flex justify-center">
                                                            <motion.button
                                                                className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-150 border border-slate-200 hover:border-blue-300"
                                                                onClick={() => toggleRowDropdown(bank.bank_id)}
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                            >
                                                                <FiMenu className="w-3.5 h-3.5" />
                                                            </motion.button>
                                                            <AnimatePresence>
                                                                {isDropdownOpen && (
                                                                    <motion.div
                                                                        initial={{ opacity: 0, y: 5 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        exit={{ opacity: 0, y: 5 }}
                                                                        className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden"
                                                                    >
                                                                        <div className="py-1">
                                                                            <button
                                                                                onClick={() => {
                                                                                    handleEditClick(bank);
                                                                                    setActiveRowDropdown(null);
                                                                                }}
                                                                                className="flex items-center w-full px-3 py-2 text-xs text-slate-700 hover:bg-blue-50 transition-colors duration-150"
                                                                            >
                                                                                <div className="p-1 bg-blue-50 rounded mr-2">
                                                                                    <FiEdit className="w-3 h-3 text-blue-500" />
                                                                                </div>
                                                                                <div className="text-left">
                                                                                    <div className="font-medium">Edit Bank</div>
                                                                                </div>
                                                                            </button>
                                                                            <div className="border-t border-slate-100 mt-1 pt-1">
                                                                                <a 
                                                                                    href={`/view-bank-ledger?bank_id=${bank.bank_id}`}
                                                                                    className="flex items-center w-full px-3 py-2 text-xs text-slate-700 hover:bg-blue-50 transition-colors duration-150"
                                                                                    onClick={() => setActiveRowDropdown(null)}
                                                                                >
                                                                                    <div className="p-1 bg-green-50 rounded mr-2">
                                                                                        <FiFileText className="w-3 h-3 text-green-500" />
                                                                                    </div>
                                                                                    <div className="text-left">
                                                                                        <div className="font-medium">View Ledger</div>
                                                                                    </div>
                                                                                </a>
                                                                                <button
                                                                                    className="flex items-center w-full px-3 py-2 text-xs text-slate-700 hover:bg-blue-50 transition-colors duration-150"
                                                                                    onClick={() => handleExport('print', bank)}
                                                                                >
                                                                                    <div className="p-1 bg-slate-50 rounded mr-2">
                                                                                        <FiPrinter className="w-3 h-3 text-slate-600" />
                                                                                    </div>
                                                                                    <div className="text-left">
                                                                                        <div className="font-medium">Print</div>
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
                        </div>

                        {/* Table Footer - Fixed */}
                        {/* <div className="border-t border-slate-200 bg-gradient-to-r from-slate-50 to-white shrink-0">
                            <table className="w-full text-sm">
                                <tfoot>
                                    <tr>
                                        <td className="text-right p-4 font-bold text-slate-800 text-xs uppercase tracking-wider" colSpan="5">
                                            Total Balance
                                        </td>
                                        <td className="text-center p-4">
                                            <span className="inline-flex items-center justify-center bg-gradient-to-r from-green-100 to-green-200 text-green-800 text-sm font-bold px-4 py-2 rounded-lg min-w-[100px]">
                                                ₹{formatCurrency(totalBalance)}
                                            </span>
                                        </td>
                                        <td className="p-4"></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div> */}
                    </motion.div>
                </div>
            </div>

            {/* Add Bank Modal */}
            <ModalContent
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSubmit={handleCreateBank}
                formData={formData}
                onChange={handleInputChange}
                loading={loading}
                mode="add"
                title="Add New Bank Account"
            />

            {/* Edit Bank Modal */}
            <ModalContent
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                onSubmit={handleEditBank}
                formData={editFormData}
                onChange={handleEditInputChange}
                loading={loading}
                mode="edit"
                title="Edit Bank Account"
            />

            {/* Export Confirmation Modal */}
            <AnimatePresence>
                {exportModal.open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                            className="bg-white rounded-xl p-6 max-w-sm w-full mx-auto shadow-xl"
                        >
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <PiExportBold className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">
                                    Exporting {exportModal.type.toUpperCase()}
                                </h3>
                                <p className="text-slate-600 mb-6 text-sm">
                                    Your {exportModal.type} export is being processed...
                                </p>
                                <div className="flex justify-center space-x-2 mb-6">
                                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                                <div className="text-xs text-slate-500">
                                    This will only take a moment...
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BankList;