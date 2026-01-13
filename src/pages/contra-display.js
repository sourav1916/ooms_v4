import React, { useState, useEffect, useRef } from 'react';
import { Header, Sidebar } from '../components/header';
import {
    FiSearch,
    FiPlus,
    FiSettings,
    FiEdit,
    FiDollarSign,
    FiRepeat,
    FiMenu
} from 'react-icons/fi';
import { PiExportBold } from "react-icons/pi";
import { PiFilePdfDuotone, PiMicrosoftExcelLogoDuotone } from "react-icons/pi";
import ContraTransfer from '../components/contra';
import DateFilter from '../components/DateFilter';
import { motion } from 'framer-motion';

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

    // Ref for table body
    const tableBodyRef = useRef(null);

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

    // Skeleton loader component
    const SkeletonRow = () => (
        <tr className="border-b border-gray-200 animate-pulse">
            <td className="p-4">
                <div className="h-4 bg-gray-200 rounded w-8"></div>
            </td>
            <td className="p-4">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
            </td>
            <td className="p-4">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
            </td>
            <td className="p-4">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
            </td>
            <td className="p-4">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
            </td>
            <td className="p-4 text-right">
                <div className="h-6 bg-gray-200 rounded w-16 ml-auto"></div>
            </td>
            <td className="p-4">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
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
                                        {[...Array(8)].map((_, i) => (
                                            <th key={i} className="p-4">
                                                <div className="h-4 bg-gray-200 rounded w-20"></div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...Array(6)].map((_, i) => (
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
                                            Contra Register
                                        </h5>
                                        {fromToDate && (
                                            <p className="text-gray-500 text-xs mt-1">
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
                                                onClick={() => setContraTransferModal(true)}
                                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 shadow-sm"
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

                            {/* Table Container with Fixed Header and Footer, Scrollable Body */}
                            <div className="flex-1 flex flex-col overflow-hidden min-h-[400px]">
                                {/* Fixed Table Header */}
                                <div className="border-b border-gray-200 bg-gray-50 flex-shrink-0">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr>
                                                <th className="text-left p-4 font-semibold text-gray-700">Sl</th>
                                                <th className="text-left p-4 font-semibold text-gray-700">Date</th>
                                                <th className="text-left p-4 font-semibold text-gray-700">Voucher No</th>
                                                <th className="text-left p-4 font-semibold text-gray-700">From Bank</th>
                                                <th className="text-left p-4 font-semibold text-gray-700">To Bank</th>
                                                <th className="text-right p-4 font-semibold text-gray-700">Amount</th>
                                                <th className="text-left p-4 font-semibold text-gray-700">Remark</th>
                                                <th className="text-center p-4 font-semibold text-gray-700">Actions</th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>

                                {/* Scrollable Table Body */}
                                <div 
                                    ref={tableBodyRef}
                                    className="flex-1 overflow-y-auto"
                                    style={{ maxHeight: 'calc(100vh - 400px)' }}
                                >
                                    <table className="w-full text-sm">
                                        <tbody className="bg-white">
                                            {contras.length === 0 ? (
                                                <tr>
                                                    <td colSpan="8" className="text-center py-8 text-gray-500">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <FiRepeat className="w-12 h-12 text-gray-300 mb-3" />
                                                            <p className="text-gray-500">No contra records found</p>
                                                            <motion.button 
                                                                onClick={() => setContraTransferModal(true)}
                                                                className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                            >
                                                                Create Your First Contra Entry
                                                            </motion.button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                contras.map((contra, index) => {
                                                    const isDropdownOpen = activeRowDropdown === contra.contra_id;
                                                    
                                                    return (
                                                        <tr 
                                                            key={contra.contra_id} 
                                                            className="border-b border-gray-200 hover:bg-gray-50 transition-colors group"
                                                        >
                                                            <td className="p-4 text-gray-600 font-medium">{index + 1}</td>
                                                            <td className="p-4 text-gray-600">
                                                                <div className="font-medium">{formatDate(contra.date)}</div>
                                                            </td>
                                                            <td className="p-4">
                                                                <span className="font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded text-xs">
                                                                    {contra.invoice_no}
                                                                </span>
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="text-gray-800">
                                                                    <div className="font-medium">{contra.out_bank}</div>
                                                                    <div className="text-gray-600 text-sm mt-1">
                                                                        {contra.out_account}
                                                                        <span className="text-indigo-600 text-xs font-normal ml-2 bg-indigo-50 px-2 py-1 rounded-full">
                                                                            {contra.out_type.toUpperCase()}
                                                                        </span>
                                                                    </div>
                                                                    <div className="text-gray-500 text-sm">{contra.out_holder}</div>
                                                                </div>
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="text-gray-800">
                                                                    <div className="font-medium">{contra.in_bank}</div>
                                                                    <div className="text-gray-600 text-sm mt-1">
                                                                        {contra.in_account}
                                                                        <span className="text-indigo-600 text-xs font-normal ml-2 bg-indigo-50 px-2 py-1 rounded-full">
                                                                            {contra.in_type.toUpperCase()}
                                                                        </span>
                                                                    </div>
                                                                    <div className="text-gray-500 text-sm">{contra.in_holder}</div>
                                                                </div>
                                                            </td>
                                                            <td className="p-4 text-right">
                                                                <span className="inline-flex items-center justify-center bg-green-50 text-green-700 text-sm font-semibold px-3 py-1.5 rounded-lg min-w-[80px]">
                                                                    ₹{formatCurrency(contra.amount)}
                                                                </span>
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="text-gray-600">
                                                                    {contra.remark}
                                                                </div>
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="dropdown-container relative flex justify-center">
                                                                    <button
                                                                        className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group-hover:bg-gray-200"
                                                                        onClick={() => toggleRowDropdown(contra.contra_id)}
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
                                                                                <a 
                                                                                    href={`/edit-contra-entry?redirect=${window.location.href}&contra_id=${contra.contra_id}`}
                                                                                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                                                                                    onClick={() => setActiveRowDropdown(null)}
                                                                                >
                                                                                    <FiEdit className="w-4 h-4 mr-3" />
                                                                                    Edit Contra
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

                                {/* Fixed Table Footer */}
                                <div className="border-t border-gray-200 bg-gray-50 flex-shrink-0">
                                    <table className="w-full text-sm">
                                        <tfoot>
                                            <tr>
                                                <td className="text-right p-4 font-bold text-gray-800" colSpan="5">
                                                    Total
                                                </td>
                                                <td className="text-right p-4">
                                                    <span className="inline-flex items-center justify-center bg-green-100 text-green-800 text-sm font-bold px-3 py-1.5 rounded-lg min-w-[80px]">
                                                        ₹{formatCurrency(totalAmount)}
                                                    </span>
                                                </td>
                                                <td className="p-4"></td>
                                                <td className="p-4"></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
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

export default ViewContra;