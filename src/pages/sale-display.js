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
    FiX,
    FiMenu,
    FiPrinter,
    FiMail,
    FiMessageSquare
} from 'react-icons/fi';
import { PiExportBold } from "react-icons/pi";
import { PiFilePdfDuotone, PiMicrosoftExcelLogoDuotone } from "react-icons/pi";
import { AiOutlineMail } from "react-icons/ai";
import { FaWhatsapp } from "react-icons/fa6";
import { motion } from 'framer-motion';
import { Header, Sidebar } from '../components/header';
import EmailSelectionModal from '../components/email-selection';
import MobileSelectionModal from '../components/mobile-selection';
import SaleForm from '../components/sales-form';
import DateFilter from '../components/DateFilter';

const ViewSales = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(() => {
        const saved = localStorage.getItem('sidebarMinimized');
        return saved ? JSON.parse(saved) : false;
    });
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('');
    const [fromToDate, setFromToDate] = useState('');
    const [sales, setSales] = useState([]);
    const [saleFormModal, setSaleFormModal] = useState(false);
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

    // Mock sales data
    const mockSalesData = [
        {
            invoice_id: '1',
            invoice_no: 'INV-001',
            date: '2024-01-15',
            particulars: 'Tax Filing Services',
            sale_from: 'client',
            firm_name: 'ABC Corporation',
            remark: 'Quarterly tax filing',
            total: 5000,
            tax: 900,
            grand_total: 5900,
            task_id: null
        },
        {
            invoice_id: '2',
            invoice_no: 'INV-002',
            date: '2024-01-10',
            particulars: 'GST Return Filing',
            sale_from: 'task',
            firm_name: 'XYZ Enterprises',
            remark: 'Monthly GST return',
            total: 3000,
            tax: 540,
            grand_total: 3540,
            task_id: 'TASK001'
        },
        {
            invoice_id: '3',
            invoice_no: 'INV-003',
            date: '2024-01-05',
            particulars: 'Audit Services',
            sale_from: 'ca',
            firm_name: '',
            remark: 'Annual audit',
            total: 15000,
            tax: 2700,
            grand_total: 17700,
            task_id: null
        },
        {
            invoice_id: '4',
            invoice_no: 'INV-004',
            date: '2024-01-20',
            particulars: 'Company Registration',
            sale_from: 'bank',
            firm_name: 'Tech Innovators Inc',
            remark: 'New company registration',
            total: 8000,
            tax: 1440,
            grand_total: 9440,
            task_id: null
        },
        {
            invoice_id: '5',
            invoice_no: 'INV-005',
            date: '2024-01-18',
            particulars: 'Bookkeeping Services',
            sale_from: 'client',
            firm_name: 'Global Traders Ltd',
            remark: 'Monthly bookkeeping',
            total: 7500,
            tax: 1350,
            grand_total: 8850,
            task_id: null
        },
        {
            invoice_id: '6',
            invoice_no: 'INV-006',
            date: '2024-01-12',
            particulars: 'Financial Consulting',
            sale_from: 'task',
            firm_name: 'Startup Solutions',
            remark: 'Business strategy consultation',
            total: 12000,
            tax: 2160,
            grand_total: 14160,
            task_id: 'TASK002'
        },
        {
            invoice_id: '7',
            invoice_no: 'INV-007',
            date: '2024-01-08',
            particulars: 'Tax Advisory Services',
            sale_from: 'ca',
            firm_name: '',
            remark: 'Corporate tax planning',
            total: 25000,
            tax: 4500,
            grand_total: 29500,
            task_id: null
        },
        {
            invoice_id: '8',
            invoice_no: 'INV-008',
            date: '2024-01-25',
            particulars: 'Payroll Processing',
            sale_from: 'staff',
            firm_name: 'Manufacturing Corp',
            remark: 'Monthly payroll for 50 employees',
            total: 6000,
            tax: 1080,
            grand_total: 7080,
            task_id: null
        },
        {
            invoice_id: '9',
            invoice_no: 'INV-009',
            date: '2024-01-22',
            particulars: 'Compliance Review',
            sale_from: 'agent',
            firm_name: 'Retail Chain Inc',
            remark: 'Annual compliance check',
            total: 9000,
            tax: 1620,
            grand_total: 10620,
            task_id: null
        },
        {
            invoice_id: '10',
            invoice_no: 'INV-010',
            date: '2024-01-14',
            particulars: 'Financial Statement Preparation',
            sale_from: 'client',
            firm_name: 'Service Providers Co',
            remark: 'Year-end financial statements',
            total: 11000,
            tax: 1980,
            grand_total: 12980,
            task_id: null
        },
        {
            invoice_id: '11',
            invoice_no: 'INV-011',
            date: '2024-01-30',
            particulars: 'Business Valuation',
            sale_from: 'task',
            firm_name: 'Acquisition Target Ltd',
            remark: 'Company valuation for merger',
            total: 35000,
            tax: 6300,
            grand_total: 41300,
            task_id: 'TASK003'
        },
        {
            invoice_id: '12',
            invoice_no: 'INV-012',
            date: '2024-01-28',
            particulars: 'Internal Audit',
            sale_from: 'ca',
            firm_name: '',
            remark: 'Quarterly internal audit',
            total: 18000,
            tax: 3240,
            grand_total: 21240,
            task_id: null
        },
        {
            invoice_id: '13',
            invoice_no: 'INV-013',
            date: '2024-01-17',
            particulars: 'Accounting Software Setup',
            sale_from: 'bank',
            firm_name: 'Digital Solutions LLC',
            remark: 'QuickBooks implementation',
            total: 8500,
            tax: 1530,
            grand_total: 10030,
            task_id: null
        },
        {
            invoice_id: '14',
            invoice_no: 'INV-014',
            date: '2024-01-11',
            particulars: 'Tax Return Filing - Individual',
            sale_from: 'client',
            firm_name: '',
            remark: 'Personal income tax return',
            total: 2500,
            tax: 450,
            grand_total: 2950,
            task_id: null
        },
        {
            invoice_id: '15',
            invoice_no: 'INV-015',
            date: '2024-01-03',
            particulars: 'Due Diligence Services',
            sale_from: 'task',
            firm_name: 'Investment Group',
            remark: 'Financial due diligence',
            total: 42000,
            tax: 7560,
            grand_total: 49560,
            task_id: 'TASK004'
        },
        {
            invoice_id: '16',
            invoice_no: 'INV-016',
            date: '2024-01-19',
            particulars: 'Budget Preparation',
            sale_from: 'capital',
            firm_name: 'Expansion Projects Inc',
            remark: 'Annual budget planning',
            total: 9500,
            tax: 1710,
            grand_total: 11210,
            task_id: null
        },
        {
            invoice_id: '17',
            invoice_no: 'INV-017',
            date: '2024-01-24',
            particulars: 'Cost Analysis',
            sale_from: 'client',
            firm_name: 'Manufacturing Unit',
            remark: 'Production cost analysis',
            total: 12500,
            tax: 2250,
            grand_total: 14750,
            task_id: null
        },
        {
            invoice_id: '18',
            invoice_no: 'INV-018',
            date: '2024-01-07',
            particulars: 'Financial Planning',
            sale_from: 'task',
            firm_name: 'Wealth Management',
            remark: 'Retirement planning',
            total: 8000,
            tax: 1440,
            grand_total: 9440,
            task_id: 'TASK005'
        },
        {
            invoice_id: '19',
            invoice_no: 'INV-019',
            date: '2024-01-29',
            particulars: 'Accounting System Review',
            sale_from: 'ca',
            firm_name: '',
            remark: 'System optimization',
            total: 15000,
            tax: 2700,
            grand_total: 17700,
            task_id: null
        },
        {
            invoice_id: '20',
            invoice_no: 'INV-020',
            date: '2024-01-31',
            particulars: 'Business Registration',
            sale_from: 'bank',
            firm_name: 'New Ventures LLC',
            remark: 'LLC formation services',
            total: 7000,
            tax: 1260,
            grand_total: 8260,
            task_id: null
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
        fetchSalesData(from, to);
    }, []);

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    // Simulate API call to fetch sales data
    const fetchSalesData = async (from, to) => {
        setLoading(true);

        // Simulate API delay
        setTimeout(() => {
            const salesData = mockSalesData;
            setSales(salesData);

            // Calculate summary
            const summaryData = salesData.reduce((acc, sale) => ({
                total: acc.total + sale.total,
                tax: acc.tax + sale.tax,
                grand_total: acc.grand_total + sale.grand_total
            }), { total: 0, tax: 0, grand_total: 0 });

            setSummary(summaryData);
            setLoading(false);
        }, 1500);
    };

    // Handle search
    const handleSearch = () => {
        const [from, to] = dateRange.split(' - ');
        setFromToDate(`From ${from} to ${to}`);
        fetchSalesData(from, to);
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

    const handleSaleSuccess = (saleData) => {
        console.log('Sale created successfully:', saleData);
        alert('Sale entry confirmed! Refreshing data...');
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

    // Get edit link and invoice link based on sale_from
    const getActionLinks = (sale) => {
        let editLink = '';
        let invoiceLink = '';

        switch (sale.sale_from) {
            case 'client':
                editLink = `/edit-sale-client?redirect=${window.location.href}&invoice_id=${sale.invoice_id}`;
                invoiceLink = `/preview-invoice-sale?invoice_id=${sale.invoice_id}`;
                break;
            case 'task':
                editLink = `/view-task-details?task_id=${sale.task_id}`;
                invoiceLink = `/preview-invoice-sale?invoice_id=${sale.invoice_id}`;
                break;
            case 'ca':
                editLink = `/edit-sale-ca?redirect=${window.location.href}&invoice_id=${sale.invoice_id}`;
                invoiceLink = `/preview-invoice-sale?invoice_id=${sale.invoice_id}`;
                break;
            case 'staff':
                editLink = `/edit-sale-staff?redirect=${window.location.href}&invoice_id=${sale.invoice_id}`;
                invoiceLink = `/preview-invoice-sale?invoice_id=${sale.invoice_id}`;
                break;
            case 'agent':
                editLink = `/edit-sale-agent?redirect=${window.location.href}&invoice_id=${sale.invoice_id}`;
                invoiceLink = `/preview-invoice-sale?invoice_id=${sale.invoice_id}`;
                break;
            case 'cash':
            case 'savings':
            case 'current':
            case 'loan':
                editLink = `/edit-sale-bank?redirect=${window.location.href}&invoice_id=${sale.invoice_id}`;
                break;
            case 'capital':
                editLink = `/edit-sale-capital?redirect=${window.location.href}&invoice_id=${sale.invoice_id}`;
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

    // Skeleton Loading Component for full page
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
                                                <th key={i} className="text-left p-4">
                                                    <div className="h-4 bg-gray-200 rounded w-20"></div>
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
        <div className="min-h-screen bg-gray-50 overflow-hidden">
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
                                            Sale Register
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
                                                onClick={() => setSaleFormModal(true)}
                                                className="px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <FiPlus className="w-4 h-4" />
                                                Add Sale
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
                                            {sales.length === 0 ? (
                                                <tr>
                                                    <td colSpan="8" className="text-center py-8 text-slate-500">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <FiFileText className="w-12 h-12 text-slate-300 mb-3" />
                                                            <p className="text-slate-500">No sales records found</p>
                                                            <motion.button
                                                                onClick={() => setSaleFormModal(true)}
                                                                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                            >
                                                                Create Your First Sale
                                                            </motion.button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                sales.map((sale, index) => {
                                                    const { editLink, invoiceLink } = getActionLinks(sale);
                                                    const showFirm = sale.sale_from === 'task' && sale.firm_name;
                                                    const isDropdownOpen = activeRowDropdown === sale.invoice_id;

                                                    return (
                                                        <tr
                                                            key={sale.invoice_id}
                                                            className="border-b border-slate-100 hover:bg-slate-50 transition-colors group"
                                                        >
                                                            <td className="p-4 text-slate-600 font-medium">{index + 1}</td>
                                                            <td className="p-4 text-slate-600">
                                                                <div className="font-medium">{formatDate(sale.date)}</div>
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="text-slate-800 font-medium">
                                                                    {sale.particulars}
                                                                    <span className="text-blue-600 text-xs font-normal ml-2 bg-blue-50 px-2 py-1 rounded-full">
                                                                        {sale.sale_from.toUpperCase()}
                                                                    </span>
                                                                    {showFirm && (
                                                                        <div className="text-slate-600 text-sm mt-1 flex items-center gap-1">
                                                                            <FiUsers className="w-3 h-3" />
                                                                            Firm: {sale.firm_name}
                                                                        </div>
                                                                    )}
                                                                    {sale.remark && (
                                                                        <div className="text-slate-500 text-sm mt-1">
                                                                            {sale.remark}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="p-4">
                                                                <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded text-xs">
                                                                    {sale.invoice_no}
                                                                </span>
                                                            </td>
                                                            <td className="p-4 text-right">
                                                                <span className="inline-flex items-center justify-center bg-green-50 text-green-700 text-sm font-semibold px-3 py-1.5 rounded-lg min-w-[80px]">
                                                                    ₹{formatCurrency(sale.total)}
                                                                </span>
                                                            </td>
                                                            <td className="p-4 text-right">
                                                                <span className="inline-flex items-center justify-center bg-orange-50 text-orange-700 text-sm font-semibold px-3 py-1.5 rounded-lg min-w-[80px]">
                                                                    ₹{formatCurrency(sale.tax)}
                                                                </span>
                                                            </td>
                                                            <td className="p-4 text-right">
                                                                <span className="inline-flex items-center justify-center bg-blue-50 text-blue-700 text-sm font-semibold px-3 py-1.5 rounded-lg min-w-[80px]">
                                                                    ₹{formatCurrency(sale.grand_total)}
                                                                </span>
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="dropdown-container relative flex justify-center">
                                                                    <motion.button
                                                                        className="p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer group-hover:bg-slate-200"
                                                                        onClick={() => toggleRowDropdown(sale.invoice_id)}
                                                                        whileHover={{ scale: 1.1 }}
                                                                        whileTap={{ scale: 0.9 }}
                                                                    >
                                                                        <FiMenu className="w-4 h-4" />
                                                                    </motion.button>
                                                                    {isDropdownOpen && (
                                                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden">
                                                                            <div className="py-1">
                                                                                <button
                                                                                    className="flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 transition-colors"
                                                                                    onClick={() => {
                                                                                        setActiveRowDropdown(null);
                                                                                        // Handle edit action
                                                                                    }}
                                                                                >
                                                                                    {sale.sale_from === 'task' ? (
                                                                                        <FiFileText className="w-4 h-4 mr-3" />
                                                                                    ) : (
                                                                                        <FiEdit className="w-4 h-4 mr-3" />
                                                                                    )}
                                                                                    {sale.sale_from === 'task' ? 'Task Details' : 'Edit Sale'}
                                                                                </button>

                                                                                {/* Export Options */}
                                                                                <div className="border-t border-slate-100 mt-1 pt-1">
                                                                                    <button
                                                                                        className="flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 transition-colors"
                                                                                        onClick={() => handleExport('print', sale)}
                                                                                    >
                                                                                        <FiPrinter className="w-4 h-4 mr-3" />
                                                                                        Print
                                                                                    </button>
                                                                                    <button
                                                                                        className="flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 transition-colors"
                                                                                        onClick={() => handleExport('whatsapp', sale)}
                                                                                    >
                                                                                        <FiMessageSquare className="w-4 h-4 mr-3" />
                                                                                        WhatsApp
                                                                                    </button>
                                                                                    <button
                                                                                        className="flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 transition-colors"
                                                                                        onClick={() => handleExport('email', sale)}
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
            <SaleForm
                isOpen={saleFormModal}
                onClose={() => setSaleFormModal(false)}
                onSuccess={handleSaleSuccess}
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

export default ViewSales;