import React, { useState, useEffect } from 'react';
import {
    FiSearch,
    FiPlus,
    FiX,
    FiMenu,
    FiEdit,
    FiFileText
} from 'react-icons/fi';
import { PiExportBold } from "react-icons/pi";
import { PiFilePdfDuotone, PiMicrosoftExcelLogoDuotone } from "react-icons/pi";
import DateFilter from '../components/DateFilter';
import { useNavigate } from 'react-router-dom';
import CreateExpenseModal from '../components/expense-form';
import { motion } from 'framer-motion';
import { Header, Sidebar } from '../components/header';

const ViewExpenses = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(() => {
        const saved = localStorage.getItem('sidebarMinimized');
        return saved ? JSON.parse(saved) : false;
    });
    const [dateRange, setDateRange] = useState('');
    const [fromToDate, setFromToDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const [totalExpense, setTotalExpense] = useState(0);
    const [showAddItemModal, setShowAddItemModal] = useState(false);
    const [showCreateExpenseModal, setShowCreateExpenseModal] = useState(false);
    const [activeRowDropdown, setActiveRowDropdown] = useState(null);
    const [showAddDropdown, setShowAddDropdown] = useState(false);
    const [exportModal, setExportModal] = useState({ open: false, type: '', data: null });
    const navigate = useNavigate();

    const [newItemForm, setNewItemForm] = useState({
        name: '',
        type: ''
    });

    // Mock data
    const mockExpensesData = [
        {
            item_id: '1',
            name: 'Office Supplies',
            type: 'direct expense',
            total: 15000,
            invoice_no: 'EXP-001'
        },
        {
            item_id: '2',
            name: 'Employee Salaries',
            type: 'direct expense',
            total: 75000,
            invoice_no: 'EXP-002'
        },
        {
            item_id: '3',
            name: 'Marketing Campaign',
            type: 'indirect expense',
            total: 25000,
            invoice_no: 'EXP-003'
        },
        {
            item_id: '4',
            name: 'Business Travel',
            type: 'reimbursable expense',
            total: 18000,
            invoice_no: 'EXP-004'
        },
        {
            item_id: '5',
            name: 'Software Subscriptions',
            type: 'indirect expense',
            total: 12000,
            invoice_no: 'EXP-005'
        },
        {
            item_id: '6',
            name: 'Utilities & Rent',
            type: 'direct expense',
            total: 45000,
            invoice_no: 'EXP-006'
        }
    ];

    const mockParties = [
        { id: '1', name: 'Vendor A', type: 'vendor' },
        { id: '2', name: 'Vendor B', type: 'vendor' },
        { id: '3', name: 'Service Provider C', type: 'service' }
    ];

    const mockBanks = [
        { id: '1', name: 'HDFC Bank', account: '1234567890' },
        { id: '2', name: 'SBI', account: '0987654321' },
        { id: '3', name: 'ICICI Bank', account: '1122334455' }
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

    // Initialize with current month date range
    useEffect(() => {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = today;

        const formatDate = (date) => {
            return date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }).replace(/\//g, '/');
        };

        const from = formatDate(firstDay);
        const to = formatDate(lastDay);

        setDateRange(`${from} - ${to}`);
        setFromToDate(`From ${from} to ${to}`);
        fetchExpensesData(from, to);
    }, []);

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    // Simulate API call to fetch expenses data
    const fetchExpensesData = async (from, to) => {
        setLoading(true);

        setTimeout(() => {
            const expensesData = mockExpensesData;
            setExpenses(expensesData);

            const total = expensesData.reduce((acc, item) => acc + item.total, 0);
            setTotalExpense(total);
            setLoading(false);
        }, 1500);
    };

    // Handle search
    const handleSearch = () => {
        const [from, to] = dateRange.split(' - ');
        setFromToDate(`From ${from} to ${to}`);
        fetchExpensesData(from, to);
    };

    // Handle date filter change
    const handleDateFilterChange = (filter) => {
        console.log('Selected filter:', filter);
        if (filter.range) {
            setDateRange(filter.range);
            const [from, to] = filter.range.split(' - ');
            setFromToDate(`From ${from} to ${to}`);
        }
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewItemForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleExpenseInputChange = (e) => {
        const { name, value } = e.target;
    };

    // Handle new item form submission
    const handleCreateItem = async (e) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            console.log('Creating new expense item:', newItemForm);
            setNewItemForm({ name: '', type: '' });
            setShowAddItemModal(false);

            const [from, to] = dateRange.split(' - ');
            fetchExpensesData(from, to);

            alert('Expense item created successfully!');
        }, 1000);
    };

    // Handle expense form submission
    const handleCreateExpense = async (e) => {
        
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

    // Format expense type for display
    const formatExpenseType = (type) => {
        return type.split(' ').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    // Toggle row dropdown
    const toggleRowDropdown = (itemId) => {
        setActiveRowDropdown(activeRowDropdown === itemId ? null : itemId);
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
            <td className="p-4">
                <div className="h-4 bg-slate-200 rounded w-8"></div>
            </td>
            <td className="p-4">
                <div className="h-4 bg-slate-200 rounded w-32"></div>
            </td>
            <td className="p-4">
                <div className="h-4 bg-slate-200 rounded w-24"></div>
            </td>
            <td className="p-4">
                <div className="h-4 bg-slate-200 rounded w-16"></div>
            </td>
            <td className="p-4 text-right">
                <div className="h-6 bg-slate-200 rounded w-16 ml-auto"></div>
            </td>
            <td className="p-4">
                <div className="h-6 bg-slate-200 rounded w-8 ml-auto"></div>
            </td>
        </tr>
    );

    // Add Expense Item Modal - Compact height (preserved from original)
    const AddItemModal = ({
        isOpen,
        onClose,
        onSubmit,
        formData,
        onChange,
        loading
    }) => {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen p-4">
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                        onClick={onClose}
                    />
                    {/* Compact Modal panel */}
                    <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-300">
                        {/* Professional Header */}
                        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-300 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl">
                            <h2 className="text-xl font-bold">Add Expense Item</h2>
                            <button
                                onClick={onClose}
                                className="text-blue-200 p-1 text-white rounded-lg bg-blue-500 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Compact Body */}
                        <div className="p-6">
                            <form onSubmit={onSubmit}>
                                <div className="space-y-4">
                                    {/* Expense Name */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Expense Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={onChange}
                                            placeholder="Enter expense name"
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                                            required
                                        />
                                    </div>

                                    {/* Expense Type */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Expense Type <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="type"
                                            value={formData.type}
                                            onChange={onChange}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors bg-white"
                                            required
                                        >
                                            <option value="" disabled>Select Expense Type</option>
                                            <option value="direct expense">Direct Expense</option>
                                            <option value="indirect expense">Indirect Expense</option>
                                            <option value="reimbursable expense">Reimbursable Expense</option>
                                        </select>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Footer Section */}
                        <div className="flex-shrink-0 border-t border-gray-200 bg-white p-4 rounded-b-xl">
                            <div className="flex justify-end items-center gap-3">
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
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Item'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 overflow-hidden">
            {/* Fixed Header */}
            <Header
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
                isMinimized={isMinimized}
                setIsMinimized={setIsMinimized}
            />
            
            {/* Fixed Sidebar */}
            <Sidebar
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
                isMinimized={isMinimized}
                setIsMinimized={setIsMinimized}
            />

            {/* Main Content Area - Scrollable */}
            <div className={`pt-16 transition-all duration-300 ease-in-out h-screen overflow-hidden ${isMinimized ? 'md:pl-20' : 'md:pl-72'}`}>
                <div className="h-full overflow-y-auto p-4">
                    <div className="h-full flex flex-col">
                        {/* Main Card - Full height with scrolling */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
                            {/* Card Header */}
                            <div className="border-b border-slate-200 px-6 py-4">
                                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                    <div>
                                        <h5 className="text-xl font-bold text-slate-800 mb-1">
                                            Expenses Register
                                        </h5>
                                        {fromToDate && (
                                            <p className="text-slate-500 text-xs mt-1">
                                                {fromToDate}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-col lg:flex-row gap-3 w-full lg:w-auto">
                                        {/* Date Filter Component */}
                                        <DateFilter onChange={handleDateFilterChange} />

                                        <div className="flex gap-2">
                                            {/* Export Dropdown */}
                                            <div className="dropdown-container relative">
                                                <motion.button
                                                    onClick={() => setShowAddDropdown(!showAddDropdown)}
                                                    className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <PiExportBold className="w-4 h-4" />
                                                    Export
                                                </motion.button>

                                                {showAddDropdown && (
                                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden">
                                                        <div className="py-1">
                                                            <button
                                                                onClick={() => handleExport('pdf')}
                                                                className="flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 transition-colors"
                                                            >
                                                                <PiFilePdfDuotone className="w-4 h-4 mr-3 text-red-500" />
                                                                Export as PDF
                                                            </button>
                                                            <button
                                                                onClick={() => handleExport('excel')}
                                                                className="flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 transition-colors"
                                                            >
                                                                <PiMicrosoftExcelLogoDuotone className="w-4 h-4 mr-3 text-green-500" />
                                                                Export as Excel
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Original buttons preserved with enhanced styling */}
                                            <motion.button
                                                onClick={() => setShowAddItemModal(true)}
                                                className="px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <FiPlus className="w-4 h-4" />
                                                Item
                                            </motion.button>

                                            <motion.button
                                                onClick={() => setShowCreateExpenseModal(true)}
                                                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <FiPlus className="w-4 h-4" />
                                                Entry
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Table Container with Fixed Header and Footer */}
                            <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                                {/* Table Header - Fixed */}
                                <div className="border-b border-slate-200 shrink-0">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                                            <tr>
                                                <th className="text-left p-4 font-semibold text-slate-700">Sl</th>
                                                <th className="text-left p-4 font-semibold text-slate-700">Expense</th>
                                                <th className="text-left p-4 font-semibold text-slate-700">Type</th>
                                                <th className="text-left p-4 font-semibold text-slate-700">Voucher No</th>
                                                <th className="text-right p-4 font-semibold text-slate-700">Total</th>
                                                <th className="text-center p-4 font-semibold text-slate-700">Actions</th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>

                                {/* Scrollable Table Body */}
                                <div className="flex-1 overflow-y-auto min-h-0">
                                    <table className="w-full text-sm">
                                        <tbody className="bg-white">
                                            {loading ? (
                                                // Skeleton Loaders
                                                Array.from({ length: 6 }).map((_, index) => (
                                                    <SkeletonRow key={index} />
                                                ))
                                            ) : expenses.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" className="text-center py-8 text-slate-500">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <FiFileText className="w-12 h-12 text-slate-300 mb-3" />
                                                            <p className="text-slate-500">No expense records found</p>
                                                            <motion.button
                                                                onClick={() => setShowAddItemModal(true)}
                                                                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                            >
                                                                Create Your First Expense
                                                            </motion.button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                expenses.map((expense, index) => {
                                                    const isDropdownOpen = activeRowDropdown === expense.item_id;

                                                    return (
                                                        <tr
                                                            key={expense.item_id}
                                                            className="border-b border-slate-100 hover:bg-slate-50 transition-colors group"
                                                        >
                                                            <td className="p-4 text-slate-600 font-medium">{index + 1}</td>
                                                            <td className="p-4">
                                                                <div className="text-slate-800 font-medium">
                                                                    {expense.name}
                                                                </div>
                                                            </td>
                                                            <td className="p-4">
                                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                                                    {formatExpenseType(expense.type)}
                                                                </span>
                                                            </td>
                                                            <td className="p-4">
                                                                <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded text-xs">
                                                                    {expense.invoice_no}
                                                                </span>
                                                            </td>
                                                            <td className="p-4 text-right">
                                                                <motion.span
                                                                    onClick={() => navigate('../finance/voucher/expense-details')}
                                                                    className="inline-flex items-center justify-center bg-green-50 text-green-700 text-sm font-semibold px-3 py-1.5 rounded-lg min-w-[80px] hover:bg-green-100 transition-colors cursor-pointer"
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                >
                                                                    ₹{formatCurrency(expense.total)}
                                                                </motion.span>
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="dropdown-container relative flex justify-center">
                                                                    <motion.button
                                                                        className="p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer group-hover:bg-slate-200"
                                                                        onClick={() => toggleRowDropdown(expense.item_id)}
                                                                        whileHover={{ scale: 1.1 }}
                                                                        whileTap={{ scale: 0.9 }}
                                                                    >
                                                                        <FiMenu className="w-4 h-4" />
                                                                    </motion.button>
                                                                    {isDropdownOpen && (
                                                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden">
                                                                            <div className="py-1">
                                                                                <a
                                                                                    href={`/edit-expense-item?item_id=${expense.item_id}`}
                                                                                    className="flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 transition-colors"
                                                                                    onClick={() => setActiveRowDropdown(null)}
                                                                                >
                                                                                    <FiEdit className="w-4 h-4 mr-3" />
                                                                                    Edit Expense
                                                                                </a>
                                                                                <motion.span
                                                                                    onClick={() => navigate('../finance/voucher/expense-details')}
                                                                                    className="flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 transition-colors cursor-pointer"
                                                                                    whileHover={{ scale: 1.02 }}
                                                                                >
                                                                                    <FiFileText className="w-4 h-4 mr-3" />
                                                                                    View Details
                                                                                </motion.span>
                                                                            </div>
                                                                        </div>
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

                                {/* Table Footer - Fixed */}
                                <div className="border-t border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 shrink-0">
                                    <table className="w-full text-sm">
                                        <tfoot>
                                            <tr>
                                                <td className="text-right p-4 font-bold text-slate-800" colSpan="4">
                                                    Total
                                                </td>
                                                <td className="text-right p-4">
                                                    <span className="inline-flex items-center justify-center bg-green-100 text-green-800 text-sm font-bold px-3 py-1.5 rounded-lg min-w-[80px]">
                                                        ₹{formatCurrency(totalExpense)}
                                                    </span>
                                                </td>
                                                <td className="p-4"></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preserved Original Modals */}
            <AddItemModal
                isOpen={showAddItemModal}
                onClose={() => setShowAddItemModal(false)}
                onSubmit={handleCreateItem}
                formData={newItemForm}
                onChange={handleInputChange}
                loading={loading}
            />

            <CreateExpenseModal
                isOpen={showCreateExpenseModal}
                onClose={() => setShowCreateExpenseModal(false)}
                onSubmit={handleCreateExpense}
                onChange={handleExpenseInputChange}
                loading={loading}
            />

            {/* Export Confirmation Modal */}
            {exportModal.open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-auto transform transition-all duration-300 scale-95 animate-fade-in">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <PiExportBold className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-2">
                                Exporting {exportModal.type.toUpperCase()}
                            </h3>
                            <p className="text-slate-600 mb-6">
                                Your {exportModal.type} export is being processed...
                            </p>
                            <div className="flex justify-center space-x-3">
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewExpenses;