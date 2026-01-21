import React, { useState, useEffect, useRef } from 'react';
import { Header, Sidebar } from '../components/header';
import {
    FiSearch,
    FiPlus,
    FiSettings,
    FiEdit,
    FiDollarSign,
    FiRepeat,
    FiMenu,
    FiChevronRight,
    FiTrendingUp,
    FiFilter,
    FiChevronDown,
    FiChevronUp,
    FiChevronLeft,
    FiChevronRight as FiChevronRightIcon,
    FiCreditCard,
    FiPrinter
} from 'react-icons/fi';
import { PiExportBold } from "react-icons/pi";
import { PiFilePdfDuotone, PiMicrosoftExcelLogoDuotone } from "react-icons/pi";
import { motion, AnimatePresence } from 'framer-motion';
import ContraTransfer from '../components/contra';
import DateFilter from '../components/DateFilter';

const ViewContra = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(() => {
        const saved = localStorage.getItem('sidebarMinimized');
        return saved ? JSON.parse(saved) : false;
    });
    const [dateRange, setDateRange] = useState('');
    const [fromToDate, setFromToDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [contras, setContras] = useState([]);
    const [contraFormModal, setContraTransferModal] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);

    // State for dropdown menus
    const [showAddDropdown, setShowAddDropdown] = useState(false);
    const [activeRowDropdown, setActiveRowDropdown] = useState(null);
    const [exportModal, setExportModal] = useState({ open: false, type: '', data: null });

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [showAll, setShowAll] = useState(false);

    // Mock contra data
    const mockContraData = [
        {
            contra_id: '1',
            invoice_id: 'CONT-001',
            invoice_no: 'CONT-001',
            date: '2024-01-15',
            out_bank: 'State Bank of India',
            out_account: '12345678901',
            out_holder: 'John Doe',
            out_type: 'Savings',
            in_bank: 'HDFC Bank',
            in_account: '98765432109',
            in_holder: 'John Doe',
            in_type: 'Current',
            amount: 50000,
            remark: 'Transfer for office expenses'
        },
        {
            contra_id: '2',
            invoice_id: 'CONT-002',
            invoice_no: 'CONT-002',
            date: '2024-01-10',
            out_bank: 'ICICI Bank',
            out_account: '45678912304',
            out_holder: 'Company Account',
            out_type: 'Current',
            in_bank: 'Axis Bank',
            in_account: '78912345607',
            in_holder: 'Company Account',
            in_type: 'Savings',
            amount: 75000,
            remark: 'Fund transfer for investment'
        },
        {
            contra_id: '3',
            invoice_id: 'CONT-003',
            invoice_no: 'CONT-003',
            date: '2024-01-05',
            out_bank: 'HDFC Bank',
            out_account: '98765432109',
            out_holder: 'John Doe',
            out_type: 'Current',
            in_bank: 'State Bank of India',
            in_account: '12345678901',
            in_holder: 'John Doe',
            in_type: 'Savings',
            amount: 25000,
            remark: 'Personal fund transfer'
        },
        {
            contra_id: '4',
            invoice_id: 'CONT-004',
            invoice_no: 'CONT-004',
            date: '2024-01-20',
            out_bank: 'Axis Bank',
            out_account: '78912345607',
            out_holder: 'Company Account',
            out_type: 'Savings',
            in_bank: 'ICICI Bank',
            in_account: '45678912304',
            in_holder: 'Company Account',
            in_type: 'Current',
            amount: 100000,
            remark: 'Business fund reallocation'
        },
        {
            contra_id: '5',
            invoice_id: 'CONT-005',
            invoice_no: 'CONT-005',
            date: '2024-01-18',
            out_bank: 'Kotak Mahindra Bank',
            out_account: '65432198701',
            out_holder: 'Business Account',
            out_type: 'Current',
            in_bank: 'Yes Bank',
            in_account: '32165498702',
            in_holder: 'Business Account',
            in_type: 'Savings',
            amount: 80000,
            remark: 'Monthly fund transfer'
        },
        {
            contra_id: '6',
            invoice_id: 'CONT-006',
            invoice_no: 'CONT-006',
            date: '2024-01-12',
            out_bank: 'Yes Bank',
            out_account: '32165498702',
            out_holder: 'Business Account',
            out_type: 'Savings',
            in_bank: 'Kotak Mahindra Bank',
            in_account: '65432198701',
            in_holder: 'Business Account',
            in_type: 'Current',
            amount: 60000,
            remark: 'Emergency fund transfer'
        },
        {
            contra_id: '7',
            invoice_id: 'CONT-007',
            invoice_no: 'CONT-007',
            date: '2024-01-22',
            out_bank: 'Punjab National Bank',
            out_account: '45612378901',
            out_holder: 'Company Account',
            out_type: 'Current',
            in_bank: 'Bank of Baroda',
            in_account: '78945612302',
            in_holder: 'Company Account',
            in_type: 'Savings',
            amount: 45000,
            remark: 'Quarterly transfer'
        },
        {
            contra_id: '8',
            invoice_id: 'CONT-008',
            invoice_no: 'CONT-008',
            date: '2024-01-25',
            out_bank: 'Bank of India',
            out_account: '32198765401',
            out_holder: 'Business Account',
            out_type: 'Savings',
            in_bank: 'Canara Bank',
            in_account: '65498732102',
            in_holder: 'Business Account',
            in_type: 'Current',
            amount: 120000,
            remark: 'Annual fund allocation'
        },
        {
            contra_id: '9',
            invoice_id: 'CONT-009',
            invoice_no: 'CONT-009',
            date: '2024-01-28',
            out_bank: 'Union Bank of India',
            out_account: '98732165401',
            out_holder: 'Company Account',
            out_type: 'Current',
            in_bank: 'IDBI Bank',
            in_account: '32165498702',
            in_holder: 'Company Account',
            in_type: 'Savings',
            amount: 35000,
            remark: 'Monthly expenses'
        },
        {
            contra_id: '10',
            invoice_id: 'CONT-010',
            invoice_no: 'CONT-010',
            date: '2024-01-30',
            out_bank: 'Central Bank of India',
            out_account: '65478932101',
            out_holder: 'Business Account',
            out_type: 'Savings',
            in_bank: 'Indian Bank',
            in_account: '98765412302',
            in_holder: 'Business Account',
            in_type: 'Current',
            amount: 90000,
            remark: 'Project funding'
        },
        {
            contra_id: '11',
            invoice_id: 'CONT-011',
            invoice_no: 'CONT-011',
            date: '2024-01-03',
            out_bank: 'SBI',
            out_account: '11223344556',
            out_holder: 'Main Account',
            out_type: 'Current',
            in_bank: 'HDFC',
            in_account: '99887766554',
            in_holder: 'Main Account',
            in_type: 'Savings',
            amount: 55000,
            remark: 'Salary transfer'
        },
        {
            contra_id: '12',
            invoice_id: 'CONT-012',
            invoice_no: 'CONT-012',
            date: '2024-01-08',
            out_bank: 'ICICI',
            out_account: '66778899001',
            out_holder: 'Operations',
            out_type: 'Current',
            in_bank: 'Axis',
            in_account: '22334455667',
            in_holder: 'Operations',
            in_type: 'Savings',
            amount: 70000,
            remark: 'Vendor payment fund'
        },
        {
            contra_id: '13',
            invoice_id: 'CONT-013',
            invoice_no: 'CONT-013',
            date: '2024-01-14',
            out_bank: 'Kotak',
            out_account: '33445566778',
            out_holder: 'Business',
            out_type: 'Savings',
            in_bank: 'Yes Bank',
            in_account: '88990011223',
            in_holder: 'Business',
            in_type: 'Current',
            amount: 85000,
            remark: 'Expense fund'
        },
        {
            contra_id: '14',
            invoice_id: 'CONT-014',
            invoice_no: 'CONT-014',
            date: '2024-01-19',
            out_bank: 'PNB',
            out_account: '55667788990',
            out_holder: 'Company',
            out_type: 'Current',
            in_bank: 'BOB',
            in_account: '11223344556',
            in_holder: 'Company',
            in_type: 'Savings',
            amount: 95000,
            remark: 'Investment transfer'
        },
        {
            contra_id: '15',
            invoice_id: 'CONT-015',
            invoice_no: 'CONT-015',
            date: '2024-01-24',
            out_bank: 'BOI',
            out_account: '77889900112',
            out_holder: 'Business',
            out_type: 'Savings',
            in_bank: 'Canara',
            in_account: '44556677889',
            in_holder: 'Business',
            in_type: 'Current',
            amount: 110000,
            remark: 'Capital transfer'
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

    const handleContraSuccess = (contraData) => {
        console.log('Contra entry created successfully:', contraData);
        alert('Contra entry confirmed! Refreshing data...');
    };

    const handleExport = (type, data = null) => {
        setExportModal({ open: true, type, data });
        
        // Simulate export process
        setTimeout(() => {
            setExportModal({ open: false, type: '', data: null });
            alert(`${type.toUpperCase()} export completed successfully!`);
        }, 1500);
    };

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
        fetchContraData(from, to);
    }, []);

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    // Simulate API call to fetch contra data
    const fetchContraData = async (from, to) => {
        setLoading(true);

        // Simulate API delay
        setTimeout(() => {
            setContras(mockContraData);

            // Calculate total amount
            const total = mockContraData.reduce((acc, contra) => acc + contra.amount, 0);
            setTotalAmount(total);
            setLoading(false);
        }, 1500);
    };

    // Handle search
    const handleSearch = () => {
        const [from, to] = dateRange.split(' - ');
        setFromToDate(`From ${from} to ${to}`);
        fetchContraData(from, to);
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

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    // Toggle row dropdown
    const toggleRowDropdown = (contraId) => {
        setActiveRowDropdown(activeRowDropdown === contraId ? null : contraId);
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

    // Get current items based on pagination
    const indexOfLastItem = showAll ? contras.length : currentPage * itemsPerPage;
    const indexOfFirstItem = showAll ? 0 : (currentPage - 1) * itemsPerPage;
    const currentItems = contras.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(contras.length / itemsPerPage);

    // Calculate paginated total
    const paginatedTotal = currentItems.reduce((acc, contra) => acc + contra.amount, 0);

    // Skeleton loader component
    const SkeletonRow = () => (
        <tr className="border-b border-slate-100 animate-pulse">
            <td className="p-3 text-center">
                <div className="h-4 bg-slate-200 rounded w-6 mx-auto"></div>
            </td>
            <td className="p-3 text-center">
                <div className="h-4 bg-slate-200 rounded w-16 mx-auto"></div>
            </td>
            <td className="p-3 text-center">
                <div className="h-4 bg-slate-200 rounded w-16 mx-auto"></div>
            </td>
            <td className="p-3 text-center">
                <div className="h-4 bg-slate-200 rounded w-24 mx-auto"></div>
            </td>
            <td className="p-3 text-center">
                <div className="h-4 bg-slate-200 rounded w-24 mx-auto"></div>
            </td>
            <td className="p-3 text-center">
                <div className="h-6 bg-slate-200 rounded w-16 mx-auto"></div>
            </td>
            <td className="p-3 text-center">
                <div className="h-6 bg-slate-200 rounded w-20 mx-auto"></div>
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
                                            {[...Array(8)].map((_, i) => (
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
                                <p className="text-blue-100 text-xs font-medium">Total Transfers</p>
                                <h3 className="text-lg font-bold mt-1">₹{formatCurrency(totalAmount)}</h3>
                            </div>
                            <FiRepeat className="w-5 h-5 opacity-80" />
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
                                            <FiRepeat className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <h5 className="text-lg font-bold text-slate-800">
                                            Contra Register
                                        </h5>
                                    </div>
                                    {fromToDate && (
                                        <div className="flex items-center gap-1 text-slate-600">
                                            <FiFilter className="w-3 h-3" />
                                            <p className="text-xs font-medium">
                                                {fromToDate}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col lg:flex-row gap-3 w-full lg:w-auto">
                                    {/* Date Filter Component */}
                                    <div className="w-full lg:w-auto">
                                        <DateFilter onChange={handleDateFilterChange} />
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

                                        <motion.button
                                            onClick={() => setContraTransferModal(true)}
                                            className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <FiPlus className="w-4 h-4" />
                                            Add Contra
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Table Container */}
                      {/* Table Container */}
<div className="w-full">
    <table className="w-full text-xs table-fixed">
        <thead>
            <tr className="bg-gradient-to-r from-slate-50 to-slate-100">
                <th className="text-center p-3 font-semibold text-slate-700 text-[10px] uppercase tracking-wider w-[5%]">
                    Sl No
                </th>
                <th className="text-center p-3 font-semibold text-slate-700 text-[10px] uppercase tracking-wider w-[8%]">
                    Date
                </th>
                <th className="text-center p-3 font-semibold text-slate-700 text-[10px] uppercase tracking-wider w-[10%]">
                    Voucher No
                </th>
                <th className="text-center p-3 font-semibold text-slate-700 text-[10px] uppercase tracking-wider w-[20%]">
                    From Bank
                </th>
                <th className="text-center p-3 font-semibold text-slate-700 text-[10px] uppercase tracking-wider w-[20%]">
                    To Bank
                </th>
                <th className="text-center p-3 font-semibold text-slate-700 text-[10px] uppercase tracking-wider w-[10%]">
                    Amount
                </th>
                <th className="text-center p-3 font-semibold text-slate-700 text-[10px] uppercase tracking-wider w-[17%]">
                    Remark
                </th>
                <th className="text-center p-3 font-semibold text-slate-700 text-[10px] uppercase tracking-wider w-[10%]">
                    Actions
                </th>
            </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-100">
            {contras.length === 0 ? (
                <tr>
                    <td colSpan="8" className="text-center py-8 text-slate-500">
                        <div className="flex flex-col items-center justify-center">
                            <div className="p-3 bg-slate-100 rounded-full mb-3">
                                <FiRepeat className="w-8 h-8 text-slate-400" />
                            </div>
                            <p className="text-slate-600 text-sm font-medium mb-1">No contra records found</p>
                            <p className="text-slate-500 text-xs mb-4">Start by creating your first contra entry</p>
                            <motion.button
                                onClick={() => setContraTransferModal(true)}
                                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-xs font-semibold hover:shadow transition-all duration-200"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Create Your First Contra Entry
                            </motion.button>
                        </div>
                    </td>
                </tr>
            ) : (
                currentItems.map((contra, index) => {
                    const isDropdownOpen = activeRowDropdown === contra.contra_id;
                    const actualIndex = showAll ? index : (currentPage - 1) * itemsPerPage + index;
                    
                    return (
                        <motion.tr
                            key={contra.contra_id}
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
                                <div className="font-medium text-slate-700 text-xs">
                                    {formatDate(contra.date)}
                                </div>
                            </td>
                            <td className="text-center p-3 align-middle">
                                <span className="inline-flex items-center justify-center bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 font-bold px-3 py-1.5 rounded text-xs border border-slate-300/50">
                                    {contra.invoice_no}
                                </span>
                            </td>
                            <td className="text-center p-3 align-middle">
                                <div className="px-2">
                                    <div className="text-slate-800 font-semibold text-xs truncate">
                                        {contra.out_bank}
                                    </div>
                                    <div className="flex flex-col items-center gap-1 mt-1">
                                        <div className="text-slate-600 text-[10px] truncate">
                                            {contra.out_account}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-slate-500 text-[10px] truncate max-w-[60px]">
                                                {contra.out_holder}
                                            </span>
                                            <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-medium capitalize whitespace-nowrap ${
                                                contra.out_type === 'savings' ? 'bg-blue-100 text-blue-700' :
                                                contra.out_type === 'current' ? 'bg-emerald-100 text-emerald-700' :
                                                'bg-slate-100 text-slate-700'
                                            }`}>
                                                {contra.out_type}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="text-center p-3 align-middle">
                                <div className="px-2">
                                    <div className="text-slate-800 font-semibold text-xs truncate">
                                        {contra.in_bank}
                                    </div>
                                    <div className="flex flex-col items-center gap-1 mt-1">
                                        <div className="text-slate-600 text-[10px] truncate">
                                            {contra.in_account}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-slate-500 text-[10px] truncate max-w-[60px]">
                                                {contra.in_holder}
                                            </span>
                                            <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-medium capitalize whitespace-nowrap ${
                                                contra.in_type === 'savings' ? 'bg-blue-100 text-blue-700' :
                                                contra.in_type === 'current' ? 'bg-emerald-100 text-emerald-700' :
                                                'bg-slate-100 text-slate-700'
                                            }`}>
                                                {contra.in_type}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="text-center p-3 align-middle">
                                <span className="inline-flex items-center justify-center bg-gradient-to-r from-green-50 to-green-100 text-green-800 font-bold px-3 py-1.5 rounded text-xs">
                                    ₹{formatCurrency(contra.amount)}
                                </span>
                            </td>
                            <td className="text-center p-3 align-middle">
                                <div className="px-2">
                                    <div className="text-slate-500 text-[10px] italic truncate">
                                        "{contra.remark}"
                                    </div>
                                </div>
                            </td>
                            <td className="text-center p-3 align-middle">
                                <div className="dropdown-container relative flex justify-center">
                                    <motion.button
                                        className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-150 border border-slate-200 hover:border-blue-300"
                                        onClick={() => toggleRowDropdown(contra.contra_id)}
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
                                                    <a 
                                                        href={`/edit-contra-entry?redirect=${window.location.href}&contra_id=${contra.contra_id}`}
                                                        className="flex items-center w-full px-3 py-2 text-xs text-slate-700 hover:bg-blue-50 transition-colors duration-150"
                                                        onClick={() => setActiveRowDropdown(null)}
                                                    >
                                                        <div className="p-1 bg-blue-50 rounded mr-2">
                                                            <FiEdit className="w-3 h-3 text-blue-500" />
                                                        </div>
                                                        <div className="text-left">
                                                            <div className="font-medium">Edit Contra</div>
                                                        </div>
                                                    </a>
                                                    <div className="border-t border-slate-100 mt-1 pt-1">
                                                        <button
                                                            className="flex items-center w-full px-3 py-2 text-xs text-slate-700 hover:bg-blue-50 transition-colors duration-150"
                                                            onClick={() => handleExport('print', contra)}
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
                    </motion.div>
                </div>
            </div>

            {/* Modals */}
            <ContraTransfer
                isOpen={contraFormModal}
                onClose={() => setContraTransferModal(false)}
                onSuccess={handleContraSuccess}
                mode="modal"
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

export default ViewContra;