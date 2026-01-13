import React, { useState, useEffect } from 'react';
import {
    FiSearch,
    FiPlus,
    FiSettings,
    FiEdit,
    FiFileText,
    FiDollarSign,
    FiUsers,
    FiUser,
    FiCreditCard,
    FiMenu,
    FiPrinter,
    FiMail,
    FiMessageSquare
} from 'react-icons/fi';
import { PiExportBold } from "react-icons/pi";
import { PiFilePdfDuotone, PiMicrosoftExcelLogoDuotone } from "react-icons/pi";
import { AiOutlineMail } from "react-icons/ai";
import { FaWhatsapp } from "react-icons/fa6";
import EmailSelectionModal from '../components/email-selection';
import MobileSelectionModal from '../components/mobile-selection';
import PurchaseForm from '../components/purchase-form';
import DateFilter from '../components/DateFilter';
import { motion } from 'framer-motion';
import { Header, Sidebar } from '../components/header';

const ViewPurchase = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(() => {
        const saved = localStorage.getItem('sidebarMinimized');
        return saved ? JSON.parse(saved) : false;
    });
    const [dateRange, setDateRange] = useState('');
    const [fromToDate, setFromToDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [purchases, setPurchases] = useState([]);
    const [purchaseFormModal, setPurchaseFormModal] = useState(false);
    const [summary, setSummary] = useState({
        total: 0,
        tax: 0,
        grand_total: 0
    });

    // State for dropdown menus
    const [showAddDropdown, setShowAddDropdown] = useState(false);
    const [activeRowDropdown, setActiveRowDropdown] = useState(null);
    const [exportModal, setExportModal] = useState({ open: false, type: '', data: null });

    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState('');

    const [isWhatsappModalOpen, setWhatsappModalOpen] = useState(false);
    const [selectedWhatsapp, setSelectedWhatsapp] = useState('');

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

    const handlePurchaseSuccess = (purchaseData) => {
        console.log('Purchase created successfully:', purchaseData);
        alert('Purchase entry confirmed! Refreshing data...');
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

    // Mock purchase data
    const mockPurchaseData = [
        {
            invoice_id: '1',
            invoice_no: 'PUR-001',
            date: '2024-01-15',
            particulars: 'Office Supplies',
            purchase_from: 'client',
            firm_name: 'ABC Corporation',
            remark: 'Monthly office supplies',
            total: 5000,
            tax: 900,
            grand_total: 5900,
            task_id: null
        },
        {
            invoice_id: '2',
            invoice_no: 'PUR-002',
            date: '2024-01-10',
            particulars: 'Software Licenses',
            purchase_from: 'ca',
            firm_name: 'Tech Solutions Ltd',
            remark: 'Annual software subscription',
            total: 15000,
            tax: 2700,
            grand_total: 17700,
            task_id: null
        },
        {
            invoice_id: '3',
            invoice_no: 'PUR-003',
            date: '2024-01-05',
            particulars: 'Marketing Materials',
            purchase_from: 'bank',
            firm_name: 'Marketing Pro Inc',
            remark: 'Q1 marketing campaign',
            total: 8000,
            tax: 1440,
            grand_total: 9440,
            task_id: null
        },
        {
            invoice_id: '4',
            invoice_no: 'PUR-004',
            date: '2024-01-20',
            particulars: 'Equipment Purchase',
            purchase_from: 'capital',
            firm_name: 'Office Equipment Co',
            remark: 'New office equipment',
            total: 25000,
            tax: 4500,
            grand_total: 29500,
            task_id: null
        },
        {
            invoice_id: '5',
            invoice_no: 'PUR-005',
            date: '2024-01-18',
            particulars: 'Furniture',
            purchase_from: 'client',
            firm_name: 'Furniture World',
            remark: 'Office chairs and tables',
            total: 35000,
            tax: 6300,
            grand_total: 41300,
            task_id: null
        },
        {
            invoice_id: '6',
            invoice_no: 'PUR-006',
            date: '2024-01-12',
            particulars: 'IT Infrastructure',
            purchase_from: 'ca',
            firm_name: 'IT Services Ltd',
            remark: 'Server and network equipment',
            total: 75000,
            tax: 13500,
            grand_total: 88500,
            task_id: null
        }
    ];

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
        fetchPurchaseData(from, to);
    }, []);

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    // Simulate API call to fetch purchase data
    const fetchPurchaseData = async (from, to) => {
        setLoading(true);

        // Simulate API delay
        setTimeout(() => {
            const purchaseData = mockPurchaseData;
            setPurchases(purchaseData);

            // Calculate summary
            const summaryData = purchaseData.reduce((acc, purchase) => ({
                total: acc.total + purchase.total,
                tax: acc.tax + purchase.tax,
                grand_total: acc.grand_total + purchase.grand_total
            }), { total: 0, tax: 0, grand_total: 0 });

            setSummary(summaryData);
            setLoading(false);
        }, 1500);
    };

    // Handle search
    const handleSearch = () => {
        const [from, to] = dateRange.split(' - ');
        setFromToDate(`From ${from} to ${to}`);
        fetchPurchaseData(from, to);
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

    // Get edit link and invoice link based on purchase_from
    const getActionLinks = (purchase) => {
        let editLink = '';
        let invoiceLink = '';

        switch (purchase.purchase_from) {
            case 'ca':
                editLink = `/edit-purchase-ca?redirect=${window.location.href}&invoice_id=${purchase.invoice_id}`;
                invoiceLink = `/preview-invoice-purchase?invoice_id=${purchase.invoice_id}`;
                break;
            case 'client':
                editLink = `/edit-purchase-client?redirect=${window.location.href}&invoice_id=${purchase.invoice_id}`;
                invoiceLink = `/preview-invoice-purchase?invoice_id=${purchase.invoice_id}`;
                break;
            case 'cash':
            case 'savings':
            case 'current':
            case 'loan':
                editLink = `/edit-purchase-bank?redirect=${window.location.href}&invoice_id=${purchase.invoice_id}`;
                break;
            case 'capital':
                editLink = `/edit-purchase-capital?redirect=${window.location.href}&invoice_id=${purchase.invoice_id}`;
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

    // Skeleton loader component
    const SkeletonRow = () => (
        <tr className="border-b border-slate-100 animate-pulse">
            <td className="p-4">
                <div className="h-4 bg-slate-200 rounded w-8"></div>
            </td>
            <td className="p-4">
                <div className="h-4 bg-slate-200 rounded w-20"></div>
            </td>
            <td className="p-4">
                <div className="h-4 bg-slate-200 rounded w-32"></div>
            </td>
            <td className="p-4">
                <div className="h-4 bg-slate-200 rounded w-16"></div>
            </td>
            <td className="p-4 text-right">
                <div className="h-6 bg-slate-200 rounded w-16 ml-auto"></div>
            </td>
            <td className="p-4 text-right">
                <div className="h-6 bg-slate-200 rounded w-16 ml-auto"></div>
            </td>
            <td className="p-4 text-right">
                <div className="h-6 bg-slate-200 rounded w-16 ml-auto"></div>
            </td>
            <td className="p-4">
                <div className="h-6 bg-slate-200 rounded w-8 ml-auto"></div>
            </td>
        </tr>
    );

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
                                            Purchase Register
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
                                                            <button
                                                                onClick={() => setWhatsappModalOpen(true)}
                                                                className="flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 transition-colors"
                                                            >
                                                                <FaWhatsapp className="w-4 h-4 mr-3 text-green-500" />
                                                                Share via WhatsApp
                                                            </button>
                                                            <button
                                                                onClick={() => setIsEmailModalOpen(true)}
                                                                className="flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 transition-colors"
                                                            >
                                                                <AiOutlineMail className="w-4 h-4 mr-3 text-blue-500" />
                                                                Share via Email
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <motion.button
                                                onClick={() => setPurchaseFormModal(true)}
                                                className="px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <FiPlus className="w-4 h-4" />
                                                Add Purchase
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
                                                <th className="text-left p-4 font-semibold text-slate-700">Date</th>
                                                <th className="text-left p-4 font-semibold text-slate-700">Particulars</th>
                                                <th className="text-left p-4 font-semibold text-slate-700">Voucher No</th>
                                                <th className="text-right p-4 font-semibold text-slate-700">T Value</th>
                                                <th className="text-right p-4 font-semibold text-slate-700">Tax</th>
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
                                            ) : purchases.length === 0 ? (
                                                <tr>
                                                    <td colSpan="8" className="text-center py-8 text-slate-500">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <FiFileText className="w-12 h-12 text-slate-300 mb-3" />
                                                            <p className="text-slate-500">No purchase records found</p>
                                                            <motion.button 
                                                                onClick={() => setPurchaseFormModal(true)}
                                                                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                            >
                                                                Create Your First Purchase
                                                            </motion.button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                purchases.map((purchase, index) => {
                                                    const { editLink, invoiceLink } = getActionLinks(purchase);
                                                    const showFirm = purchase.purchase_from === 'task' && purchase.firm_name;
                                                    const isDropdownOpen = activeRowDropdown === purchase.invoice_id;

                                                    return (
                                                        <tr 
                                                            key={purchase.invoice_id} 
                                                            className="border-b border-slate-100 hover:bg-slate-50 transition-colors group"
                                                        >
                                                            <td className="p-4 text-slate-600 font-medium">{index + 1}</td>
                                                            <td className="p-4 text-slate-600">
                                                                <div className="font-medium">{formatDate(purchase.date)}</div>
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="text-slate-800 font-medium">
                                                                    {purchase.particulars}
                                                                    <span className="text-blue-600 text-xs font-normal ml-2 bg-blue-50 px-2 py-1 rounded-full">
                                                                        {purchase.purchase_from.toUpperCase()}
                                                                    </span>
                                                                    {showFirm && (
                                                                        <div className="text-slate-600 text-sm mt-1 flex items-center gap-1">
                                                                            <FiUsers className="w-3 h-3" />
                                                                            Firm: {purchase.firm_name}
                                                                        </div>
                                                                    )}
                                                                    {purchase.remark && (
                                                                        <div className="text-slate-500 text-sm mt-1">
                                                                            {purchase.remark}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="p-4">
                                                                <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded text-xs">
                                                                    {purchase.invoice_no}
                                                                </span>
                                                            </td>
                                                            <td className="p-4 text-right">
                                                                <motion.span 
                                                                    className="inline-flex items-center justify-center bg-green-50 text-green-700 text-sm font-semibold px-3 py-1.5 rounded-lg min-w-[80px]"
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                >
                                                                    ₹{formatCurrency(purchase.total)}
                                                                </motion.span>
                                                            </td>
                                                            <td className="p-4 text-right">
                                                                <motion.span 
                                                                    className="inline-flex items-center justify-center bg-orange-50 text-orange-700 text-sm font-semibold px-3 py-1.5 rounded-lg min-w-[80px]"
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                >
                                                                    ₹{formatCurrency(purchase.tax)}
                                                                </motion.span>
                                                            </td>
                                                            <td className="p-4 text-right">
                                                                <motion.span 
                                                                    className="inline-flex items-center justify-center bg-blue-50 text-blue-700 text-sm font-semibold px-3 py-1.5 rounded-lg min-w-[80px]"
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                >
                                                                    ₹{formatCurrency(purchase.grand_total)}
                                                                </motion.span>
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="dropdown-container relative flex justify-center">
                                                                    <motion.button
                                                                        className="p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer group-hover:bg-slate-200"
                                                                        onClick={() => toggleRowDropdown(purchase.invoice_id)}
                                                                        whileHover={{ scale: 1.1 }}
                                                                        whileTap={{ scale: 0.9 }}
                                                                    >
                                                                        <FiMenu className="w-4 h-4" />
                                                                    </motion.button>
                                                                    {isDropdownOpen && (
                                                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden">
                                                                            <div className="py-1">
                                                                                <a
                                                                                    href={editLink}
                                                                                    className="flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 transition-colors"
                                                                                    onClick={() => setActiveRowDropdown(null)}
                                                                                >
                                                                                    <FiEdit className="w-4 h-4 mr-3" />
                                                                                    Edit Purchase
                                                                                </a>

                                                                                {/* Export Options */}
                                                                                <div className="border-t border-slate-100 mt-1 pt-1">
                                                                                    <button
                                                                                        className="flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 transition-colors"
                                                                                        onClick={() => handleExport('print', purchase)}
                                                                                    >
                                                                                        <FiPrinter className="w-4 h-4 mr-3" />
                                                                                        Print
                                                                                    </button>
                                                                                    <button
                                                                                        className="flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 transition-colors"
                                                                                        onClick={() => handleExport('whatsapp', purchase)}
                                                                                    >
                                                                                        <FiMessageSquare className="w-4 h-4 mr-3" />
                                                                                        WhatsApp
                                                                                    </button>
                                                                                    <button
                                                                                        className="flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 transition-colors"
                                                                                        onClick={() => handleExport('email', purchase)}
                                                                                    >
                                                                                        <FiMail className="w-4 h-4 mr-3" />
                                                                                        Email
                                                                                    </button>
                                                                                </div>
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
                                                        ₹{formatCurrency(summary.total)}
                                                    </span>
                                                </td>
                                                <td className="text-right p-4">
                                                    <span className="inline-flex items-center justify-center bg-orange-100 text-orange-800 text-sm font-bold px-3 py-1.5 rounded-lg min-w-[80px]">
                                                        ₹{formatCurrency(summary.tax)}
                                                    </span>
                                                </td>
                                                <td className="text-right p-4">
                                                    <span className="inline-flex items-center justify-center bg-blue-100 text-blue-800 text-sm font-bold px-3 py-1.5 rounded-lg min-w-[80px]">
                                                        ₹{formatCurrency(summary.grand_total)}
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

            {/* Modals */}
            <PurchaseForm
                isOpen={purchaseFormModal}
                onClose={() => setPurchaseFormModal(false)}
                onSuccess={handlePurchaseSuccess}
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

export default ViewPurchase;