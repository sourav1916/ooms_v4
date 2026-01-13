import React, { useState, useEffect } from 'react';
import { Header, Sidebar } from '../components/header';
import {
    FiPlus,
    FiEdit,
    FiSettings,
    FiDollarSign,
    FiMenu,
    FiFileText
} from 'react-icons/fi';
import { PiExportBold } from "react-icons/pi";
import { PiFilePdfDuotone, PiMicrosoftExcelLogoDuotone } from "react-icons/pi";
import { motion } from 'framer-motion';

const CapitalAccounts = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(() => {
        const saved = localStorage.getItem('sidebarMinimized');
        return saved ? JSON.parse(saved) : false;
    });
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [showAddDropdown, setShowAddDropdown] = useState(false);
    const [activeRowDropdown, setActiveRowDropdown] = useState(null);
    const [exportModal, setExportModal] = useState({ open: false, type: '', data: null });

    // Form states
    const [formData, setFormData] = useState({
        holder: '',
        remark: '',
        opening_balance: '',
        opening_type: '',
        payment_date: new Date().toISOString().split('T')[0]
    });

    const [editFormData, setEditFormData] = useState({
        account_id: '',
        holder: '',
        remark: '',
        opening_balance: '',
        opening_type: '',
        payment_date: ''
    });

    // Opening type options
    const [openingTypes] = useState([
        { value: '1', name: 'Credit' },
        { value: '0', name: 'Debit' }
    ]);

    // Mock data for capital accounts
    const mockAccounts = [
        {
            account_id: '1',
            name: 'John Doe Capital',
            remark: 'Primary capital account',
            opening_balance: 1000000,
            opening_date: '01-01-2023',
            opening_type: '1',
            balance: 1250000
        },
        {
            account_id: '2',
            name: 'Jane Smith Investment',
            remark: 'Additional investment',
            opening_balance: 500000,
            opening_date: '15-03-2023',
            opening_type: '1',
            balance: 600000
        },
        {
            account_id: '3',
            name: 'Partners Capital',
            remark: 'Partners contribution',
            opening_balance: 750000,
            opening_date: '20-06-2023',
            opening_type: '1',
            balance: 800000
        },
        {
            account_id: '4',
            name: 'Business Reserve',
            remark: 'Business reserve funds',
            opening_balance: 300000,
            opening_date: '10-04-2023',
            opening_type: '1',
            balance: 350000
        },
        {
            account_id: '5',
            name: 'Expansion Fund',
            remark: 'Future expansion capital',
            opening_balance: 2000000,
            opening_date: '05-08-2023',
            opening_type: '1',
            balance: 2200000
        },
        {
            account_id: '6',
            name: 'Retained Earnings',
            remark: 'Accumulated profits',
            opening_balance: 1500000,
            opening_date: '12-09-2023',
            opening_type: '1',
            balance: 1800000
        },
        {
            account_id: '7',
            name: 'Owner\'s Drawings',
            remark: 'Owner withdrawals',
            opening_balance: 250000,
            opening_date: '20-10-2023',
            opening_type: '0',
            balance: -150000
        },
        {
            account_id: '8',
            name: 'Share Capital',
            remark: 'Issued share capital',
            opening_balance: 5000000,
            opening_date: '01-11-2023',
            opening_type: '1',
            balance: 5200000
        },
        {
            account_id: '9',
            name: 'Loan from Owner',
            remark: 'Personal loan to business',
            opening_balance: 1000000,
            opening_date: '15-12-2023',
            opening_type: '1',
            balance: 1050000
        },
        {
            account_id: '10',
            name: 'Investment Account',
            remark: 'Long-term investments',
            opening_balance: 3000000,
            opening_date: '25-12-2023',
            opening_type: '1',
            balance: 3100000
        }
    ];

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

    // Fetch accounts on component mount
    useEffect(() => {
        fetchAccountList(true);
    }, []);

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    // Simulate API call to fetch accounts
    const fetchAccountList = async (showLoading = false) => {
        if (showLoading) {
            setLoading(true);
        }

        // Simulate API delay
        setTimeout(() => {
            setAccounts(mockAccounts);
            setLoading(false);
        }, 1500);
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

    // Handle create account
    const handleCreateAccount = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            const newAccount = {
                account_id: (accounts.length + 1).toString(),
                name: formData.holder,
                remark: formData.remark,
                opening_balance: parseFloat(formData.opening_balance),
                opening_date: formData.payment_date,
                opening_type: formData.opening_type,
                balance: parseFloat(formData.opening_balance)
            };

            setAccounts(prev => [...prev, newAccount]);
            setFormData({
                holder: '',
                remark: '',
                opening_balance: '',
                opening_type: '',
                payment_date: new Date().toISOString().split('T')[0]
            });
            setShowAddModal(false);
            setLoading(false);

            // Show success message
            alert('Account created successfully!');
        }, 1000);
    };

    // Handle edit account
    const handleEditAccount = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setAccounts(prev => prev.map(account =>
                account.account_id === editFormData.account_id
                    ? {
                        ...account,
                        name: editFormData.holder,
                        remark: editFormData.remark,
                        opening_balance: parseFloat(editFormData.opening_balance),
                        opening_type: editFormData.opening_type,
                        opening_date: editFormData.payment_date
                    }
                    : account
            ));

            setShowEditModal(false);
            setLoading(false);

            // Show success message
            alert('Account updated successfully!');
        }, 1000);
    };

    // Handle edit button click
    const handleEditClick = (account) => {
        setEditFormData({
            account_id: account.account_id,
            holder: account.name,
            remark: account.remark,
            opening_balance: account.opening_balance.toString(),
            opening_type: account.opening_type,
            payment_date: account.opening_date
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

    // Toggle row dropdown
    const toggleRowDropdown = (accountId) => {
        setActiveRowDropdown(activeRowDropdown === accountId ? null : accountId);
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
        <tr className="border-b border-gray-200 animate-pulse">
            <td className="p-4">
                <div className="h-4 bg-gray-200 rounded w-8"></div>
            </td>
            <td className="p-4">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
            </td>
            <td className="p-4">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
            </td>
            <td className="p-4 text-right">
                <div className="h-6 bg-gray-200 rounded w-16 ml-auto"></div>
            </td>
            <td className="p-4">
                <div className="h-6 bg-gray-200 rounded w-8 ml-auto"></div>
            </td>
        </tr>
    );

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

            <div className={`pt-16 transition-all duration-300 ease-in-out ${isMinimized ? 'md:pl-20' : 'md:pl-72'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                        {/* Card Header Skeleton */}
                        <div className="border-b border-gray-200 px-6 py-4">
                            <div className="animate-pulse">
                                <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-64"></div>
                            </div>
                        </div>

                        {/* Table Skeleton */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {[...Array(5)].map((_, i) => (
                                            <th key={i} className="p-4">
                                                <div className="h-4 bg-gray-200 rounded w-20"></div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...Array(5)].map((_, i) => (
                                        <SkeletonRow key={i} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Modal Content Component
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
                            {/* Account Holder */}
                            <div className="lg:col-span-2">
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

                            {/* Remark */}
                            <div className="lg:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Remark
                                </label>
                                <textarea
                                    name="remark"
                                    value={formData.remark}
                                    onChange={onChange}
                                    placeholder="Enter account description or remarks"
                                    rows="3"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors resize-none"
                                />
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
                                    mode === 'add' ? 'Create Account' : 'Update Account'
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
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="h-full flex flex-col"
                    >
                        {/* Main Card - Full height with scrolling */}
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col h-full">
                            {/* Card Header */}
                            <div className="border-b border-gray-200 px-6 py-4">
                                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                    <div>
                                        <h5 className="text-lg font-semibold text-gray-800 mb-1">
                                            Capital Accounts
                                        </h5>
                                        <p className="text-gray-600 text-sm">
                                            Total Accounts: <span className='text-green-700 font-semibold'>{accounts.length}</span>
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        {/* Export Dropdown */}
                                        <div className="dropdown-container relative">
                                            <motion.button
                                                onClick={() => setShowAddDropdown(!showAddDropdown)}
                                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 shadow-sm"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <PiExportBold className="w-4 h-4" />
                                                Export
                                            </motion.button>

                                            {showAddDropdown && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden"
                                                >
                                                    <div className="py-1">
                                                        <button
                                                            onClick={() => handleExport('pdf')}
                                                            className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                                                        >
                                                            <PiFilePdfDuotone className="w-4 h-4 mr-3 text-red-500" />
                                                            Export as PDF
                                                        </button>
                                                        <button
                                                            onClick={() => handleExport('excel')}
                                                            className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                                                        >
                                                            <PiMicrosoftExcelLogoDuotone className="w-4 h-4 mr-3 text-green-500" />
                                                            Export as Excel
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>

                                        <motion.button
                                            onClick={() => setShowAddModal(true)}
                                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 shadow-sm"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <FiPlus className="w-4 h-4" />
                                            Add Account
                                        </motion.button>
                                    </div>
                                </div>
                            </div>

                            {/* Table Container with Fixed Header and Footer, Scrollable Body */}
                            <div className="flex-1 flex flex-col overflow-hidden min-h-[400px]">
                                {/* Fixed Table Header */}
                                <div className="border-b border-gray-200 bg-gray-50 flex-shrink-0">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr>
                                                <th className="text-left p-4 font-semibold text-gray-700">Sl</th>
                                                <th className="text-left p-4 font-semibold text-gray-700">Account Name</th>
                                                <th className="text-left p-4 font-semibold text-gray-700">Remark</th>
                                                <th className="text-right p-4 font-semibold text-gray-700">Balance</th>
                                                <th className="text-center p-4 font-semibold text-gray-700">Actions</th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>

                                {/* Scrollable Table Body */}
                                <div 
                                    className="flex-1 overflow-y-auto"
                                    style={{ maxHeight: 'calc(100vh - 400px)' }}
                                >
                                    <table className="w-full text-sm">
                                        <tbody className="bg-white">
                                            {accounts.length === 0 ? (
                                                <tr>
                                                    <td colSpan="5" className="text-center py-8 text-gray-500">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <FiFileText className="w-12 h-12 text-gray-300 mb-3" />
                                                            <p className="text-gray-500">No capital accounts found</p>
                                                            <motion.button
                                                                onClick={() => setShowAddModal(true)}
                                                                className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                            >
                                                                Create Your First Capital Account
                                                            </motion.button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                accounts.map((account, index) => {
                                                    const isDropdownOpen = activeRowDropdown === account.account_id;
                                                    const isNegativeBalance = Number(account.balance) < 0;

                                                    return (
                                                        <tr
                                                            key={account.account_id}
                                                            className="border-b border-gray-200 hover:bg-gray-50 transition-colors group"
                                                        >
                                                            <td className="p-4 text-gray-600 font-medium">{index + 1}</td>
                                                            <td className="p-4">
                                                                <div className="text-gray-800 font-medium">
                                                                    {account.name}
                                                                </div>
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="text-gray-600">
                                                                    {account.remark}
                                                                </div>
                                                            </td>
                                                            <td className="p-4 text-right">
                                                                <a
                                                                    href={`/view-capital-account-ledger?account_id=${account.account_id}`}
                                                                    className={`inline-flex items-center justify-center text-sm font-semibold px-3 py-1.5 rounded-lg min-w-[80px] hover:opacity-90 transition-colors ${isNegativeBalance
                                                                            ? 'bg-red-50 text-red-700 hover:bg-red-100'
                                                                            : 'bg-green-50 text-green-700 hover:bg-green-100'
                                                                        }`}
                                                                >
                                                                    ₹{formatCurrency(account.balance)}
                                                                </a>
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="dropdown-container relative flex justify-center">
                                                                    <button
                                                                        className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group-hover:bg-gray-200"
                                                                        onClick={() => toggleRowDropdown(account.account_id)}
                                                                    >
                                                                        <FiMenu className="w-4 h-4" />
                                                                    </button>
                                                                    {isDropdownOpen && (
                                                                        <motion.div
                                                                            initial={{ opacity: 0, y: -10 }}
                                                                            animate={{ opacity: 1, y: 0 }}
                                                                            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden"
                                                                        >
                                                                            <div className="py-1">
                                                                                <button
                                                                                    onClick={() => {
                                                                                        handleEditClick(account);
                                                                                        setActiveRowDropdown(null);
                                                                                    }}
                                                                                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                                                                                >
                                                                                    <FiEdit className="w-4 h-4 mr-3" />
                                                                                    Edit Account
                                                                                </button>
                                                                                <a
                                                                                    href={`/view-capital-account-ledger?account_id=${account.account_id}`}
                                                                                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                                                                                    onClick={() => setActiveRowDropdown(null)}
                                                                                >
                                                                                    <FiFileText className="w-4 h-4 mr-3" />
                                                                                    View Ledger
                                                                                </a>
                                                                            </div>
                                                                        </motion.div>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Add Account Modal */}
            <ModalContent
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSubmit={handleCreateAccount}
                formData={formData}
                onChange={handleInputChange}
                loading={loading}
                mode="add"
                title="Add Capital Account"
            />

            {/* Edit Account Modal */}
            <ModalContent
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                onSubmit={handleEditAccount}
                formData={editFormData}
                onChange={handleEditInputChange}
                loading={loading}
                mode="edit"
                title="Edit Capital Account"
            />

            {/* Export Confirmation Modal */}
            {exportModal.open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-lg p-6 max-w-sm w-full mx-auto"
                    >
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <PiExportBold className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Exporting {exportModal.type.toUpperCase()}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Your {exportModal.type} export is being processed...
                            </p>
                            <div className="flex justify-center space-x-3">
                                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default CapitalAccounts;