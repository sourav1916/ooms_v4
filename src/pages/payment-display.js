import React, { useState, useEffect } from 'react';
import {
    FiSearch,
    FiPlus,
    FiSettings,
    FiEdit,
    FiFileText,
    FiUsers,
    FiUser,
    FiDollarSign,
    FiMenu,
    FiPrinter,
    FiMail,
    FiMessageSquare,
    FiChevronRight,
    FiTrendingUp,
    FiFilter,
    FiChevronDown,
    FiChevronUp,
    FiChevronLeft,
    FiChevronRight as FiChevronRightIcon,
    FiCreditCard
} from 'react-icons/fi';
import { PiExportBold } from "react-icons/pi";
import { PiFilePdfDuotone, PiMicrosoftExcelLogoDuotone } from "react-icons/pi";
import { AiOutlineMail } from "react-icons/ai";
import { FaWhatsapp } from "react-icons/fa6";
import { motion, AnimatePresence } from 'framer-motion';
import EmailSelectionModal from '../components/email-selection';
import MobileSelectionModal from '../components/mobile-selection';
import PaymentSend from '../components/payment-send';
import DateFilter from '../components/DateFilter';
import { Header, Sidebar } from '../components/header';

const ViewPayments = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(() => {
        const saved = localStorage.getItem('sidebarMinimized');
        return saved ? JSON.parse(saved) : false;
    });
    const [dateRange, setDateRange] = useState('');
    const [fromToDate, setFromToDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [payments, setPayments] = useState([]);
    const [paymentFormModal, setPaymentSendModal] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);

    // State for dropdown menus
    const [showAddDropdown, setShowAddDropdown] = useState(false);
    const [activeRowDropdown, setActiveRowDropdown] = useState(null);
    const [exportModal, setExportModal] = useState({ open: false, type: '', data: null });

    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState('');

    const [isWhatsappModalOpen, setWhatsappModalOpen] = useState(false);
    const [selectedWhatsapp, setSelectedWhatsapp] = useState('');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [showAll, setShowAll] = useState(false);

    // Mock payments data
    const mockPaymentsData = [
        {
            invoice_id: '1',
            payment_id: 'PAY001',
            invoice_no: 'PAY-001',
            date: '2024-01-15',
            particulars: 'Payment to Vendor',
            party_type: 'client',
            remark: 'Office supplies payment',
            amount: 25000,
            received_bank: 'State Bank of India',
            received_bank_type: 'savings',
            creator_name: 'John Manager',
            creator_mobile: '9876543210',
            creator_type: 'manager'
        },
        {
            invoice_id: '2',
            payment_id: 'PAY002',
            invoice_no: 'PAY-002',
            date: '2024-01-10',
            particulars: 'CA Professional Fees',
            party_type: 'ca',
            remark: 'Monthly professional fees',
            amount: 15000,
            received_bank: 'HDFC Bank',
            received_bank_type: 'current',
            creator_name: 'Sarah Executive',
            creator_mobile: '9876543211',
            creator_type: 'employee'
        },
        {
            invoice_id: '3',
            payment_id: 'PAY003',
            invoice_no: 'PAY-003',
            date: '2024-01-05',
            particulars: 'Staff Salary Payment',
            party_type: 'staff',
            remark: 'January salary payment',
            amount: 75000,
            received_bank: 'ICICI Bank',
            received_bank_type: 'savings',
            creator_name: 'Mike Director',
            creator_mobile: '9876543212',
            creator_type: 'admin'
        },
        {
            invoice_id: '4',
            payment_id: 'PAY004',
            invoice_no: 'PAY-004',
            date: '2024-01-20',
            particulars: 'Agent Commission',
            party_type: 'agent',
            remark: 'Q1 commission payment',
            amount: 20000,
            received_bank: 'Axis Bank',
            received_bank_type: 'current',
            creator_name: 'Lisa Supervisor',
            creator_mobile: '9876543213',
            creator_type: 'manager'
        },
        {
            invoice_id: '5',
            payment_id: 'PAY005',
            invoice_no: 'PAY-005',
            date: '2024-01-25',
            particulars: 'Capital Withdrawal',
            party_type: 'capital',
            remark: 'Partner capital withdrawal',
            amount: 50000,
            received_bank: 'State Bank of India',
            received_bank_type: 'savings',
            creator_name: 'Robert Partner',
            creator_mobile: '9876543214',
            creator_type: 'admin'
        },
        {
            invoice_id: '6',
            payment_id: 'PAY006',
            invoice_no: 'PAY-006',
            date: '2024-01-18',
            particulars: 'Software Subscription',
            party_type: 'client',
            remark: 'Annual software license',
            amount: 45000,
            received_bank: 'Kotak Mahindra Bank',
            received_bank_type: 'current',
            creator_name: 'Priya Manager',
            creator_mobile: '9876543215',
            creator_type: 'manager'
        },
        {
            invoice_id: '7',
            payment_id: 'PAY007',
            invoice_no: 'PAY-007',
            date: '2024-01-08',
            particulars: 'Rent Payment',
            party_type: 'vendor',
            remark: 'Office rent for January',
            amount: 35000,
            received_bank: 'ICICI Bank',
            received_bank_type: 'savings',
            creator_name: 'Mike Director',
            creator_mobile: '9876543212',
            creator_type: 'admin'
        },
        {
            invoice_id: '8',
            payment_id: 'PAY008',
            invoice_no: 'PAY-008',
            date: '2024-01-22',
            particulars: 'Electricity Bill',
            party_type: 'utility',
            remark: 'Office electricity bill',
            amount: 12500,
            received_bank: 'Axis Bank',
            received_bank_type: 'current',
            creator_name: 'Lisa Supervisor',
            creator_mobile: '9876543213',
            creator_type: 'manager'
        },
        {
            invoice_id: '9',
            payment_id: 'PAY009',
            invoice_no: 'PAY-009',
            date: '2024-01-19',
            particulars: 'Internet Bill',
            party_type: 'utility',
            remark: 'Monthly internet bill',
            amount: 8500,
            received_bank: 'State Bank of India',
            received_bank_type: 'savings',
            creator_name: 'Robert Partner',
            creator_mobile: '9876543214',
            creator_type: 'admin'
        },
        {
            invoice_id: '10',
            payment_id: 'PAY010',
            invoice_no: 'PAY-010',
            date: '2024-01-12',
            particulars: 'Marketing Expenses',
            party_type: 'client',
            remark: 'Digital marketing campaign',
            amount: 30000,
            received_bank: 'HDFC Bank',
            received_bank_type: 'current',
            creator_name: 'Priya Manager',
            creator_mobile: '9876543215',
            creator_type: 'manager'
        },
        {
            invoice_id: '11',
            payment_id: 'PAY011',
            invoice_no: 'PAY-011',
            date: '2024-01-28',
            particulars: 'Travel Expenses',
            party_type: 'staff',
            remark: 'Business travel reimbursement',
            amount: 18000,
            received_bank: 'ICICI Bank',
            received_bank_type: 'savings',
            creator_name: 'Mike Director',
            creator_mobile: '9876543212',
            creator_type: 'admin'
        },
        {
            invoice_id: '12',
            payment_id: 'PAY012',
            invoice_no: 'PAY-012',
            date: '2024-01-14',
            particulars: 'Legal Fees',
            party_type: 'ca',
            remark: 'Legal consultation fees',
            amount: 25000,
            received_bank: 'Axis Bank',
            received_bank_type: 'current',
            creator_name: 'Lisa Supervisor',
            creator_mobile: '9876543213',
            creator_type: 'manager'
        },
        {
            invoice_id: '13',
            payment_id: 'PAY013',
            invoice_no: 'PAY-013',
            date: '2024-01-03',
            particulars: 'Insurance Premium',
            party_type: 'insurance',
            remark: 'Annual insurance premium',
            amount: 45000,
            received_bank: 'State Bank of India',
            received_bank_type: 'savings',
            creator_name: 'Robert Partner',
            creator_mobile: '9876543214',
            creator_type: 'admin'
        },
        {
            invoice_id: '14',
            payment_id: 'PAY014',
            invoice_no: 'PAY-014',
            date: '2024-01-30',
            particulars: 'Maintenance Charges',
            party_type: 'vendor',
            remark: 'Office maintenance',
            amount: 15000,
            received_bank: 'HDFC Bank',
            received_bank_type: 'current',
            creator_name: 'Priya Manager',
            creator_mobile: '9876543215',
            creator_type: 'manager'
        },
        {
            invoice_id: '15',
            payment_id: 'PAY015',
            invoice_no: 'PAY-015',
            date: '2024-01-17',
            particulars: 'Tax Payment',
            party_type: 'government',
            remark: 'GST payment',
            amount: 55000,
            received_bank: 'ICICI Bank',
            received_bank_type: 'savings',
            creator_name: 'Mike Director',
            creator_mobile: '9876543212',
            creator_type: 'admin'
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

    const handlePaymentSuccess = (paymentData) => {
        console.log('Payment entry created successfully:', paymentData);
        alert('Payment entry confirmed! Refreshing data...');
    };

    const handleEmailSubmit = (email) => {
        setSelectedEmail(email);
        setIsEmailModalOpen(false);
        console.log('Selected email:', email);
    };

    const handleWhatsappSubmit = (number) => {
        setSelectedWhatsapp(number);
        setWhatsappModalOpen(false);
        console.log('Selected number:', number);
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
        fetchPaymentsData(from, to);
    }, []);

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    // Simulate API call to fetch payments data
    const fetchPaymentsData = async (from, to) => {
        setLoading(true);

        // Simulate API delay
        setTimeout(() => {
            const paymentsData = mockPaymentsData;
            setPayments(paymentsData);

            // Calculate total amount
            const total = paymentsData.reduce((acc, item) => acc + item.amount, 0);
            setTotalAmount(total);
            setLoading(false);
        }, 1500);
    };

    // Handle search
    const handleSearch = () => {
        const [from, to] = dateRange.split(' - ');
        setFromToDate(`From ${from} to ${to}`);
        fetchPaymentsData(from, to);
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

    // Get edit link and invoice link based on party_type
    const getActionLinks = (item) => {
        let editLink = '';
        let invoiceLink = '';

        switch (item.party_type) {
            case 'client':
                editLink = `/edit-payment-client?redirect=${window.location.href}&invoice_id=${item.invoice_id}`;
                invoiceLink = `/preview-invoice-payment?invoice_id=${item.invoice_id}`;
                break;
            case 'ca':
                editLink = `/edit-payment-ca?redirect=${window.location.href}&invoice_id=${item.invoice_id}`;
                invoiceLink = `/preview-invoice-payment?invoice_id=${item.invoice_id}`;
                break;
            case 'staff':
                editLink = `/edit-payment-staff?redirect=${window.location.href}&invoice_id=${item.invoice_id}`;
                invoiceLink = `/preview-invoice-payment?invoice_id=${item.invoice_id}`;
                break;
            case 'agent':
                editLink = `/edit-payment-agent?redirect=${window.location.href}&invoice_id=${item.invoice_id}`;
                invoiceLink = `/preview-invoice-payment?invoice_id=${item.invoice_id}`;
                break;
            case 'capital':
                editLink = `/edit-payment-client-capital?redirect=${window.location.href}&payment_id=${item.payment_id}`;
                break;
            default:
                editLink = '#';
                invoiceLink = '#';
        }

        return { editLink, invoiceLink };
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    // Toggle row dropdown
    const toggleRowDropdown = (invoiceId) => {
        setActiveRowDropdown(activeRowDropdown === invoiceId ? null : invoiceId);
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
    const indexOfLastItem = showAll ? payments.length : currentPage * itemsPerPage;
    const indexOfFirstItem = showAll ? 0 : (currentPage - 1) * itemsPerPage;
    const currentItems = payments.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(payments.length / itemsPerPage);

    // Calculate paginated total
    const paginatedTotal = currentItems.reduce((acc, item) => acc + item.amount, 0);

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
                <div className="h-4 bg-slate-200 rounded w-24 mx-auto"></div>
            </td>
            <td className="p-3 text-center">
                <div className="h-4 bg-slate-200 rounded w-16 mx-auto"></div>
            </td>
            <td className="p-3 text-center">
                <div className="h-6 bg-slate-200 rounded w-16 mx-auto"></div>
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
                                <p className="text-blue-100 text-xs font-medium">Total Payments</p>
                                <h3 className="text-lg font-bold mt-1">₹{formatCurrency(totalAmount)}</h3>
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
                                            <FiDollarSign className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <h5 className="text-lg font-bold text-slate-800">
                                            Payments Register
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
                                                                onClick={() => setWhatsappModalOpen(true)}
                                                                className="flex items-center w-full px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 transition-all duration-150 group"
                                                            >
                                                                <div className="p-1.5 bg-green-50 rounded mr-2 group-hover:bg-green-100 transition-colors">
                                                                    <FaWhatsapp className="w-3.5 h-3.5 text-green-500" />
                                                                </div>
                                                                <div className="text-left">
                                                                    <div className="font-medium text-xs">Share via WhatsApp</div>
                                                                </div>
                                                            </button>
                                                            <button
                                                                onClick={() => setIsEmailModalOpen(true)}
                                                                className="flex items-center w-full px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 transition-all duration-150 group"
                                                            >
                                                                <div className="p-1.5 bg-blue-50 rounded mr-2 group-hover:bg-blue-100 transition-colors">
                                                                    <AiOutlineMail className="w-3.5 h-3.5 text-blue-500" />
                                                                </div>
                                                                <div className="text-left">
                                                                    <div className="font-medium text-xs">Share via Email</div>
                                                                </div>
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        <motion.button
                                            onClick={() => setPaymentSendModal(true)}
                                            className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <FiPlus className="w-4 h-4" />
                                            Add Payment
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
                                            Sl No
                                        </th>
                                        <th className="text-center p-3 font-semibold text-slate-700 text-[10px] uppercase tracking-wider min-w-[80px]">
                                            Date
                                        </th>
                                        <th className="text-center p-3 font-semibold text-slate-700 text-[10px] uppercase tracking-wider min-w-[200px]">
                                            Particulars
                                        </th>
                                        <th className="text-center p-3 font-semibold text-slate-700 text-[10px] uppercase tracking-wider min-w-[120px]">
                                            Voucher No
                                        </th>
                                        <th className="text-center p-3 font-semibold text-slate-700 text-[10px] uppercase tracking-wider min-w-[100px]">
                                            Amount
                                        </th>
                                        <th className="text-center p-3 font-semibold text-slate-700 text-[10px] uppercase tracking-wider min-w-[150px]">
                                            Payment From
                                        </th>
                                        <th className="text-center p-3 font-semibold text-slate-700 text-[10px] uppercase tracking-wider min-w-[150px]">
                                            Payment By
                                        </th>
                                        <th className="text-center p-3 font-semibold text-slate-700 text-[10px] uppercase tracking-wider min-w-[80px]">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-100">
                                    {payments.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="text-center py-8 text-slate-500">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="p-3 bg-slate-100 rounded-full mb-3">
                                                        <FiFileText className="w-8 h-8 text-slate-400" />
                                                    </div>
                                                    <p className="text-slate-600 text-sm font-medium mb-1">No payment records found</p>
                                                    <p className="text-slate-500 text-xs mb-4">Start by creating your first payment entry</p>
                                                    <motion.button
                                                        onClick={() => setPaymentSendModal(true)}
                                                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-xs font-semibold hover:shadow transition-all duration-200"
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                    >
                                                        Create Your First Payment
                                                    </motion.button>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        currentItems.map((payment, index) => {
                                            const { editLink, invoiceLink } = getActionLinks(payment);
                                            const isDropdownOpen = activeRowDropdown === payment.invoice_id;
                                            const actualIndex = showAll ? index : (currentPage - 1) * itemsPerPage + index;

                                            return (
                                                <motion.tr
                                                    key={payment.invoice_id}
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
                                                            {formatDate(payment.date)}
                                                        </div>
                                                    </td>
                                                    <td className="text-center p-3 align-middle">
                                                        <div className="mx-auto max-w-[180px]">
                                                            <div className="text-slate-800 font-semibold text-xs">
                                                                {payment.particulars}
                                                            </div>
                                                            <div className="flex justify-center mt-1">
                                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${
                                                                    payment.party_type === 'client' ? 'bg-blue-100 text-blue-700' :
                                                                    payment.party_type === 'ca' ? 'bg-purple-100 text-purple-700' :
                                                                    payment.party_type === 'staff' ? 'bg-rose-100 text-rose-700' :
                                                                    payment.party_type === 'agent' ? 'bg-amber-100 text-amber-700' :
                                                                    payment.party_type === 'capital' ? 'bg-emerald-100 text-emerald-700' :
                                                                    payment.party_type === 'vendor' ? 'bg-indigo-100 text-indigo-700' :
                                                                    payment.party_type === 'utility' ? 'bg-cyan-100 text-cyan-700' :
                                                                    payment.party_type === 'government' ? 'bg-red-100 text-red-700' :
                                                                    payment.party_type === 'insurance' ? 'bg-violet-100 text-violet-700' :
                                                                    'bg-slate-100 text-slate-700'
                                                                }`}>
                                                                    {payment.party_type}
                                                                </span>
                                                            </div>
                                                            {payment.remark && (
                                                                <div className="text-slate-500 text-[10px] text-center mt-1 italic truncate">
                                                                    "{payment.remark}"
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="text-center p-3 align-middle">
                                                        <span className="inline-flex items-center justify-center bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 font-bold px-3 py-1.5 rounded text-xs border border-slate-300/50 shadow-xs">
                                                            {payment.invoice_no}
                                                        </span>
                                                    </td>
                                                    <td className="text-center p-3 align-middle">
                                                        <span className="inline-flex items-center justify-center bg-gradient-to-r from-green-50 to-green-100 text-green-800 font-bold px-3 py-1.5 rounded text-xs min-w-[90px] shadow-xs">
                                                            ₹{formatCurrency(payment.amount)}
                                                        </span>
                                                    </td>
                                                    <td className="text-center p-3 align-middle">
                                                        <div className="mx-auto max-w-[140px]">
                                                            <div className="text-slate-800 text-xs font-medium">
                                                                {payment.received_bank}
                                                            </div>
                                                            <div className="flex justify-center mt-1">
                                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${
                                                                    payment.received_bank_type === 'savings' ? 'bg-blue-100 text-blue-700' :
                                                                    payment.received_bank_type === 'current' ? 'bg-emerald-100 text-emerald-700' :
                                                                    'bg-slate-100 text-slate-700'
                                                                }`}>
                                                                    {payment.received_bank_type}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="text-center p-3 align-middle">
                                                        <div className="mx-auto max-w-[140px]">
                                                            <div className="text-slate-800 text-xs font-medium">
                                                                {payment.creator_name}
                                                            </div>
                                                            <div className="flex flex-col items-center gap-1 mt-1">
                                                                <div className="text-slate-600 text-[10px]">
                                                                    {payment.creator_mobile}
                                                                </div>
                                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${
                                                                    payment.creator_type === 'admin' ? 'bg-red-100 text-red-700' :
                                                                    payment.creator_type === 'manager' ? 'bg-blue-100 text-blue-700' :
                                                                    payment.creator_type === 'employee' ? 'bg-emerald-100 text-emerald-700' :
                                                                    payment.creator_type === 'partner' ? 'bg-purple-100 text-purple-700' :
                                                                    'bg-slate-100 text-slate-700'
                                                                }`}>
                                                                    {payment.creator_type}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="text-center p-3 align-middle">
                                                        <div className="dropdown-container relative flex justify-center">
                                                            <motion.button
                                                                className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-150 border border-slate-200 hover:border-blue-300"
                                                                onClick={() => toggleRowDropdown(payment.invoice_id)}
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
                                                                                href={editLink}
                                                                                className="flex items-center w-full px-3 py-2 text-xs text-slate-700 hover:bg-blue-50 transition-colors duration-150"
                                                                                onClick={() => setActiveRowDropdown(null)}
                                                                            >
                                                                                <div className="p-1 bg-blue-50 rounded mr-2">
                                                                                    <FiEdit className="w-3 h-3 text-blue-500" />
                                                                                </div>
                                                                                <div className="text-left">
                                                                                    <div className="font-medium">Edit Payment</div>
                                                                                </div>
                                                                            </a>
                                                                            <div className="border-t border-slate-100 mt-1 pt-1">
                                                                                <button
                                                                                    className="flex items-center w-full px-3 py-2 text-xs text-slate-700 hover:bg-blue-50 transition-colors duration-150"
                                                                                    onClick={() => handleExport('print', payment)}
                                                                                >
                                                                                    <div className="p-1 bg-slate-50 rounded mr-2">
                                                                                        <FiPrinter className="w-3 h-3 text-slate-600" />
                                                                                    </div>
                                                                                    <div className="text-left">
                                                                                        <div className="font-medium">Print</div>
                                                                                    </div>
                                                                                </button>
                                                                                <button
                                                                                    className="flex items-center w-full px-3 py-2 text-xs text-slate-700 hover:bg-blue-50 transition-colors duration-150"
                                                                                    onClick={() => handleExport('whatsapp', payment)}
                                                                                >
                                                                                    <div className="p-1 bg-green-50 rounded mr-2">
                                                                                        <FaWhatsapp className="w-3 h-3 text-green-500" />
                                                                                    </div>
                                                                                    <div className="text-left">
                                                                                        <div className="font-medium">WhatsApp</div>
                                                                                    </div>
                                                                                </button>
                                                                                <button
                                                                                    className="flex items-center w-full px-3 py-2 text-xs text-slate-700 hover:bg-blue-50 transition-colors duration-150"
                                                                                    onClick={() => handleExport('email', payment)}
                                                                                >
                                                                                    <div className="p-1 bg-blue-50 rounded mr-2">
                                                                                        <FiMail className="w-3 h-3 text-blue-500" />
                                                                                    </div>
                                                                                    <div className="text-left">
                                                                                        <div className="font-medium">Email</div>
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
                            {payments.length > itemsPerPage && !showAll && (
                                <div className="border-t border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                                    <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-3 gap-3">
                                        <div className="text-xs text-slate-600">
                                            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, payments.length)} of {payments.length} entries
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
                            {showAll && payments.length > itemsPerPage && (
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

            {/* Modals */}
            <PaymentSend
                isOpen={paymentFormModal}
                onClose={() => setPaymentSendModal(false)}
                onSuccess={handlePaymentSuccess}
                mode="modal"
            />

            <EmailSelectionModal
                isOpen={isEmailModalOpen}
                onClose={() => setIsEmailModalOpen(false)}
                onSubmit={handleEmailSubmit}
            />

            <MobileSelectionModal
                isOpen={isWhatsappModalOpen}
                onClose={() => setWhatsappModalOpen(false)}
                onSubmit={handleWhatsappSubmit}
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

export default ViewPayments;