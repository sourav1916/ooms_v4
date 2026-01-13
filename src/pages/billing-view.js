import React, { useState, useEffect, useRef } from 'react';
import { Header, Sidebar } from '../components/header';
import {
    FiFileText,
    FiSearch,
    FiCheckCircle,
    FiXCircle,
    FiLoader,
    FiPlus,
    FiDownload,
    FiUser,
    FiCalendar,
    FiDollarSign,
    FiMoreVertical,
    FiPrinter,
    FiMail,
    FiMessageSquare,
    FiUsers
} from 'react-icons/fi';
import { PiExportBold } from "react-icons/pi";
import { PiFilePdfDuotone, PiMicrosoftExcelLogoDuotone } from "react-icons/pi";
import { AiOutlineMail } from "react-icons/ai";
import { FaWhatsapp } from "react-icons/fa6";
import EmailSelectionModal from '../components/email-selection';
import MobileSelectionModal from '../components/mobile-selection';
import DateFilter from '../components/DateFilter';
import { motion } from 'framer-motion';

const BillDisplay = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(() => {
        const saved = localStorage.getItem('sidebarMinimized');
        return saved ? JSON.parse(saved) : false;
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [dateRange, setDateRange] = useState('');
    const [fromToDate, setFromToDate] = useState('');
    const [loading, setLoading] = useState(false);

    // Service options
    const [serviceOptions] = useState([
        { value: '', name: 'All Services' },
        { value: '1', name: 'Tax Filing' },
        { value: '2', name: 'Audit Services' },
        { value: '3', name: 'GST Return' },
        { value: '4', name: 'Company Registration' },
        { value: '5', name: 'Accounting' },
        { value: '6', name: 'Legal Compliance' }
    ]);

    // Billing data
    const [billingData, setBillingData] = useState([
        {
            id: '1',
            task_id: 'TASK001',
            create_date: '2024-01-15',
            complete_date: '2024-02-10',
            service_name: 'Tax Filing',
            service_id: '1',
            fees: 5000,
            firm_name: 'ABC Corporation',
            file_no: 'FN001',
            name: 'John Doe',
            pan: 'ABCDE1234F',
            mobile: '9876543210',
            username: 'john_abc',
            is_recurring: false,
            recurring_type: '',
            completer_name: 'Sarah Wilson',
            completer_mobile: '9876543215',
            completer_user_type: 'employee'
        },
        {
            id: '2',
            task_id: 'TASK002',
            create_date: '2024-01-10',
            complete_date: '2024-02-05',
            service_name: 'GST Return',
            service_id: '3',
            fees: 3000,
            firm_name: 'XYZ Enterprises',
            file_no: 'FN002',
            name: 'Jane Smith',
            pan: 'XYZAB5678G',
            mobile: '9876543211',
            username: 'jane_xyz',
            is_recurring: true,
            recurring_type: 'monthly',
            due_date: '2024-03-05',
            completer_name: 'Mike Johnson',
            completer_mobile: '9876543216',
            completer_user_type: 'manager'
        },
        {
            id: '3',
            task_id: 'TASK003',
            create_date: '2024-01-20',
            complete_date: '2024-02-15',
            service_name: 'Audit Services',
            service_id: '2',
            fees: 15000,
            firm_name: 'Global Tech Inc',
            file_no: 'FN003',
            name: 'Robert Chen',
            pan: 'GHIJK5678L',
            mobile: '9876543212',
            username: 'robert_gt',
            is_recurring: false,
            recurring_type: '',
            completer_name: 'Emily Davis',
            completer_mobile: '9876543217',
            completer_user_type: 'employee'
        },
        {
            id: '4',
            task_id: 'TASK004',
            create_date: '2024-01-05',
            complete_date: '2024-01-30',
            service_name: 'Company Registration',
            service_id: '4',
            fees: 8000,
            firm_name: 'StartUp Innovations',
            file_no: 'FN004',
            name: 'Michael Brown',
            pan: 'MNOPQ9012R',
            mobile: '9876543213',
            username: 'michael_si',
            is_recurring: true,
            recurring_type: 'yearly',
            due_date: '2025-01-30',
            completer_name: 'David Wilson',
            completer_mobile: '9876543218',
            completer_user_type: 'manager'
        },
        {
            id: '5',
            task_id: 'TASK005',
            create_date: '2024-01-25',
            complete_date: '2024-02-20',
            service_name: 'Accounting',
            service_id: '5',
            fees: 6000,
            firm_name: 'Financial Solutions Ltd',
            file_no: 'FN005',
            name: 'Sophia Martinez',
            pan: 'STUVW3456X',
            mobile: '9876543214',
            username: 'sophia_fs',
            is_recurring: true,
            recurring_type: 'quarterly',
            due_date: '2024-05-20',
            completer_name: 'Jennifer Lee',
            completer_mobile: '9876543219',
            completer_user_type: 'employee'
        },
        {
            id: '6',
            task_id: 'TASK006',
            create_date: '2024-01-12',
            complete_date: '2024-02-07',
            service_name: 'Legal Compliance',
            service_id: '6',
            fees: 10000,
            firm_name: 'Legal Eagles LLP',
            file_no: 'FN006',
            name: 'William Taylor',
            pan: 'YZABC7890D',
            mobile: '9876543220',
            username: 'william_le',
            is_recurring: false,
            recurring_type: '',
            completer_name: 'Richard Moore',
            completer_mobile: '9876543221',
            completer_user_type: 'manager'
        },
        {
            id: '7',
            task_id: 'TASK007',
            create_date: '2024-01-18',
            complete_date: '2024-02-13',
            service_name: 'GST Return',
            service_id: '3',
            fees: 3500,
            firm_name: 'Retail Hub Pvt Ltd',
            file_no: 'FN007',
            name: 'Lisa Anderson',
            pan: 'EFGHI1234J',
            mobile: '9876543222',
            username: 'lisa_rh',
            is_recurring: true,
            recurring_type: 'monthly',
            due_date: '2024-03-13',
            completer_name: 'Thomas Clark',
            completer_mobile: '9876543223',
            completer_user_type: 'employee'
        },
        {
            id: '8',
            task_id: 'TASK008',
            create_date: '2024-01-30',
            complete_date: '2024-02-25',
            service_name: 'Tax Filing',
            service_id: '1',
            fees: 4500,
            firm_name: 'Consulting Experts',
            file_no: 'FN008',
            name: 'James Wilson',
            pan: 'KLMNO5678P',
            mobile: '9876543224',
            username: 'james_ce',
            is_recurring: false,
            recurring_type: '',
            completer_name: 'Patricia Harris',
            completer_mobile: '9876543225',
            completer_user_type: 'manager'
        },
        {
            id: '9',
            task_id: 'TASK009',
            create_date: '2024-01-08',
            complete_date: '2024-02-03',
            service_name: 'Audit Services',
            service_id: '2',
            fees: 18000,
            firm_name: 'Manufacturing Corp',
            file_no: 'FN009',
            name: 'Charles Martin',
            pan: 'QRSTU9012V',
            mobile: '9876543226',
            username: 'charles_mc',
            is_recurring: true,
            recurring_type: 'half yearly',
            due_date: '2024-08-03',
            completer_name: 'Susan Young',
            completer_mobile: '9876543227',
            completer_user_type: 'employee'
        },
        {
            id: '10',
            task_id: 'TASK010',
            create_date: '2024-01-22',
            complete_date: '2024-02-17',
            service_name: 'Company Registration',
            service_id: '4',
            fees: 7500,
            firm_name: 'Tech Startup Solutions',
            file_no: 'FN010',
            name: 'Karen White',
            pan: 'WXYZA3456B',
            mobile: '9876543228',
            username: 'karen_tss',
            is_recurring: false,
            recurring_type: '',
            completer_name: 'Daniel King',
            completer_mobile: '9876543229',
            completer_user_type: 'manager'
        }
    ]);

    // Selected items state
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

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
    }, []);

    // Format date function
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    // Get previous period for recurring tasks
    const getPreviousPeriod = (type, due_date) => {
        if (!due_date) return 'INVALID';

        const date = new Date(due_date);
        const month = date.getMonth() + 1;

        if (type === 'monthly') {
            const previousMonth = new Date(date.getFullYear(), date.getMonth() - 1);
            return previousMonth.toLocaleString('en', { month: 'short' });
        } else if (type === 'quarterly') {
            const currentQuarter = Math.ceil(month / 3);
            const previousQuarter = currentQuarter === 1 ? 4 : currentQuarter - 1;

            const quarters = {
                1: "Jan - Mar",
                2: "Apr - Jun",
                3: "Jul - Sep",
                4: "Oct - Dec"
            };

            return quarters[previousQuarter];
        } else if (type === 'half yearly') {
            let currentHalf, previousHalf;

            if (month >= 4 && month <= 9) {
                currentHalf = "Apr - Sep";
                previousHalf = "Oct - Mar";
            } else {
                currentHalf = "Oct - Mar";
                previousHalf = "Apr - Sep";
            }

            return previousHalf;
        } else if (type === 'yearly') {
            const year = date.getFullYear();
            const startFY = month <= 3 ? year - 1 : year;
            const endFY = String(startFY + 1).slice(-2);

            return `FY ${startFY}-${endFY}`;
        }
        return 'INVALID';
    };

    // Handle individual checkbox change
    const handleCheckboxChange = (taskId) => {
        setSelectedItems(prev => {
            if (prev.includes(taskId)) {
                return prev.filter(id => id !== taskId);
            } else {
                return [...prev, taskId];
            }
        });
    };

    // Handle select all
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedItems([]);
        } else {
            setSelectedItems(billingData.map(item => item.task_id));
        }
        setSelectAll(!selectAll);
    };

    // Handle generate bill
    const handleGenerateBill = () => {
        if (selectedItems.length === 0) return;

        alert(`Generating bill for ${selectedItems.length} selected items`);
        console.log('Selected items for billing:', selectedItems);
    };

    // Handle mark as non-billable
    const handleMarkNonBillable = () => {
        if (selectedItems.length === 0) return;

        alert(`Marking ${selectedItems.length} items as non-billable`);
        console.log('Selected items for non-billable:', selectedItems);
    };

    // Filter data based on search and service filter
    const filteredData = billingData.filter(item => {
        const matchesSearch = searchQuery === '' ||
            item.service_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.firm_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.file_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.pan.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesService = selectedService === '' || item.service_id === selectedService;

        return matchesSearch && matchesService;
    });

    // Handle export
    const handleExport = (type, data = null) => {
        setExportModal({ open: true, type, data });

        // Simulate export process
        setTimeout(() => {
            setExportModal({ open: false, type: '', data: null });
            alert(`${type.toUpperCase()} export completed successfully!`);
        }, 1500);
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

    // Handle date filter change
    const handleDateFilterChange = (filter) => {
        console.log('Selected filter:', filter);
        if (filter.range) {
            setDateRange(filter.range);
            const [from, to] = filter.range.split(' - ');
            setFromToDate(`From ${from} to ${to}`);
        }
    };

    // Toggle row dropdown
    const toggleRowDropdown = (taskId) => {
        setActiveRowDropdown(activeRowDropdown === taskId ? null : taskId);
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

    // Update select all state when individual checkboxes change
    useEffect(() => {
        if (selectedItems.length === 0) {
            setSelectAll(false);
        } else if (selectedItems.length === billingData.length) {
            setSelectAll(true);
        }
    }, [selectedItems, billingData.length]);

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
            <td className="p-4">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
            </td>
            <td className="p-4">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
            </td>
            <td className="p-4">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
            </td>
            <td className="p-4">
                <div className="h-4 bg-gray-200 rounded w-8 ml-auto"></div>
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
                                        {[...Array(7)].map((_, i) => (
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
                            {/* Card Header - Fixed */}
                            <div className="border-b border-gray-200 px-6 py-4">
                                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                    <div>
                                        <h5 className="text-lg font-semibold text-gray-800 mb-1">
                                            Pending Bill
                                        </h5>
                                        {fromToDate && (
                                            <p className="text-gray-500 text-xs mt-1">
                                                {fromToDate}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-col lg:flex-row gap-3 w-full lg:w-auto">
                                        {/* Service Filter */}
                                        <select
                                            value={selectedService}
                                            onChange={(e) => setSelectedService(e.target.value)}
                                            className="px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-colors"
                                        >
                                            {serviceOptions.map(service => (
                                                <option key={service.value} value={service.value}>
                                                    {service.name}
                                                </option>
                                            ))}
                                        </select>

                                        {/* Date Filter Component */}
                                        <DateFilter onChange={handleDateFilterChange} />

                                        <div className="flex gap-2">
                                            {/* Search Input */}
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    placeholder="Search Anything"
                                                    className="pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-colors w-full lg:w-64"
                                                />
                                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            </div>

                                            {/* Export Dropdown */}
                                            <div className="dropdown-container relative">
                                                <motion.button
                                                    onClick={() => setShowAddDropdown(!showAddDropdown)}
                                                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 shadow-sm"
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
                                                            <button
                                                                onClick={() => setWhatsappModalOpen(true)}
                                                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                                                            >
                                                                <FaWhatsapp className="w-4 h-4 mr-3 text-green-500" />
                                                                Share via WhatsApp
                                                            </button>
                                                            <button
                                                                onClick={() => setIsEmailModalOpen(true)}
                                                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                                                            >
                                                                <AiOutlineMail className="w-4 h-4 mr-3 text-blue-500" />
                                                                Share via Email
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Table Container with Fixed Header and Footer */}
                            <div className="flex-1 flex flex-col overflow-hidden min-h-[400px]">
                                {/* Table Header - Fixed */}
                                <div className="border-b border-gray-200 bg-gray-50 flex-shrink-0">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr>
                                                <th className="text-left p-4 font-semibold text-gray-700">#</th>
                                                <th className="text-left p-4 font-semibold text-gray-700">SERVICE</th>
                                                <th className="text-left p-4 font-semibold text-gray-700">DATES</th>
                                                <th className="text-left p-4 font-semibold text-gray-700">FIRM/CLIENT</th>
                                                <th className="text-left p-4 font-semibold text-gray-700">INFO</th>
                                                <th className="text-left p-4 font-semibold text-gray-700">COMPLETE BY</th>
                                                <th className="text-center p-4 font-semibold text-gray-700">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <span>SELECT</span>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectAll}
                                                            onChange={handleSelectAll}
                                                            className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                                                        />
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>

                                {/* Scrollable Table Body */}
                                <div
                                    className="flex-1 overflow-y-auto"
                                    style={{ maxHeight: 'calc(100vh - 450px)' }}
                                >
                                    <table className="w-full text-sm">
                                        <tbody className="bg-white">
                                            {filteredData.length === 0 ? (
                                                <tr>
                                                    <td colSpan="7" className="text-center py-8 text-gray-500">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <FiFileText className="w-12 h-12 text-gray-300 mb-3" />
                                                            <p className="text-gray-500">No pending billing records found</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredData.map((item, index) => {
                                                    const recurringPeriod = item.is_recurring ?
                                                        getPreviousPeriod(item.recurring_type, item.due_date) : '';
                                                    const shortPeriod = item.is_recurring ?
                                                        item.recurring_type.charAt(0).toUpperCase() + item.recurring_type.slice(1) : '';
                                                    const isDropdownOpen = activeRowDropdown === item.task_id;

                                                    return (
                                                        <tr
                                                            key={item.id}
                                                            className="border-b border-gray-200 hover:bg-gray-50 transition-colors group"
                                                        >
                                                            <td className="p-4 text-gray-600 font-medium">{index + 1}</td>
                                                            <td className="p-4" style={{ minWidth: '150px', whiteSpace: 'normal' }}>
                                                                <a href={`/view-task-details?task_id=${item.task_id}`} className="block">
                                                                    <b className="text-indigo-600">
                                                                        {item.is_recurring && (
                                                                            <span className="inline-block bg-red-500 text-white text-xs px-1 rounded mr-1">R</span>
                                                                        )}
                                                                        {item.service_name}
                                                                    </b>
                                                                    <br />
                                                                    <span className="text-green-700 font-semibold">
                                                                        Fees: ₹{Number(item.fees).toLocaleString()}
                                                                    </span>
                                                                    {item.is_recurring && (
                                                                        <div className="text-orange-600 font-bold text-xs mt-1">
                                                                            Period: {recurringPeriod}
                                                                            <span className="text-green-600 font-normal"> [{shortPeriod}]</span>
                                                                        </div>
                                                                    )}
                                                                </a>
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="text-sm space-y-1">
                                                                    <div title="Task create date" className="text-gray-600 flex items-center gap-1">
                                                                        <FiCalendar className="w-3 h-3" />
                                                                        {formatDate(item.create_date)}
                                                                    </div>
                                                                    <div title="Task complete date" className="text-green-600 flex items-center gap-1">
                                                                        <FiCheckCircle className="w-3 h-3" />
                                                                        {formatDate(item.complete_date)}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="p-4" style={{ minWidth: '150px', whiteSpace: 'normal' }}>
                                                                <a href={`/view-client-profile?username=${item.username}`} className="block">
                                                                    <b className="text-indigo-600">{item.firm_name}</b>
                                                                    <br />
                                                                    <div className="text-gray-700">[Name: {item.name}]</div>
                                                                </a>
                                                            </td>
                                                            <td className="p-4" style={{ minWidth: '150px', whiteSpace: 'normal' }}>
                                                                <div className="text-xs text-gray-600">
                                                                    PAN: {item.pan} | File No: {item.file_no}
                                                                    <br />
                                                                    Mobile: <span className="text-indigo-600">{item.mobile}</span>
                                                                </div>
                                                            </td>
                                                            <td className="p-4" style={{ minWidth: '150px', whiteSpace: 'normal' }}>
                                                                <div className="text-sm">
                                                                    {item.completer_name}
                                                                    <br />
                                                                    <small className="text-gray-600">
                                                                        Mobile: {item.completer_mobile}
                                                                        <span className="text-indigo-600"> [{item.completer_user_type.toUpperCase()}]</span>
                                                                    </small>
                                                                </div>
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="flex items-center justify-center gap-4">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedItems.includes(item.task_id)}
                                                                        onChange={() => handleCheckboxChange(item.task_id)}
                                                                        className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                                                                    />
                                                                    <div className="dropdown-container relative">
                                                                        <button
                                                                            className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group-hover:bg-gray-200"
                                                                            onClick={() => toggleRowDropdown(item.task_id)}
                                                                        >
                                                                            <FiMoreVertical className="w-4 h-4" />
                                                                        </button>
                                                                        {isDropdownOpen && (
                                                                            <motion.div
                                                                                initial={{ opacity: 0, y: -10 }}
                                                                                animate={{ opacity: 1, y: 0 }}
                                                                                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden"
                                                                            >
                                                                                <div className="py-1">
                                                                                    <button
                                                                                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                                                                                        onClick={() => {
                                                                                            setActiveRowDropdown(null);
                                                                                            handleCheckboxChange(item.task_id);
                                                                                        }}
                                                                                    >
                                                                                        {selectedItems.includes(item.task_id) ? (
                                                                                            <FiXCircle className="w-4 h-4 mr-3 text-red-500" />
                                                                                        ) : (
                                                                                            <FiCheckCircle className="w-4 h-4 mr-3 text-green-500" />
                                                                                        )}
                                                                                        {selectedItems.includes(item.task_id) ? 'Deselect' : 'Select'}
                                                                                    </button>
                                                                                    <div className="border-t border-gray-100 mt-1 pt-1">
                                                                                        <button
                                                                                            className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                                                                                            onClick={() => handleExport('print', item)}
                                                                                        >
                                                                                            <FiPrinter className="w-4 h-4 mr-3" />
                                                                                            Print
                                                                                        </button>
                                                                                        <button
                                                                                            className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                                                                                            onClick={() => handleExport('whatsapp', item)}
                                                                                        >
                                                                                            <FiMessageSquare className="w-4 h-4 mr-3" />
                                                                                            WhatsApp
                                                                                        </button>
                                                                                        <button
                                                                                            className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                                                                                            onClick={() => handleExport('email', item)}
                                                                                        >
                                                                                            <FiMail className="w-4 h-4 mr-3" />
                                                                                            Email
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            </motion.div>
                                                                        )}
                                                                    </div>
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
                                {selectedItems.length > 0 && (
                                    <div className="border-t border-gray-200 bg-gray-50 flex-shrink-0">
                                        <table className="w-full text-sm">
                                            <tfoot>
                                                <tr>
                                                    <td className="p-4 font-bold text-gray-800" colSpan="6">
                                                        {selectedItems.length} item(s) selected
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex gap-3 justify-center">
                                                            <motion.button
                                                                onClick={handleGenerateBill}
                                                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                            >
                                                                <FiFileText className="w-4 h-4" />
                                                                Generate Bill
                                                            </motion.button>
                                                            <motion.button
                                                                onClick={handleMarkNonBillable}
                                                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                            >
                                                                <FiXCircle className="w-4 h-4" />
                                                                Mark Non-Billable
                                                            </motion.button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Modals */}
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

export default BillDisplay;