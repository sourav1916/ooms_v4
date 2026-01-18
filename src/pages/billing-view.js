import React, { useState, useEffect, useRef } from 'react';
import { Header, Sidebar } from '../components/header';
import {
    FiFileText,
    FiSearch,
    FiCheckCircle,
    FiXCircle,
    FiCalendar,
    FiMoreVertical,
    FiPrinter,
    FiMail,
    FiChevronDown,
    FiFilter,
} from 'react-icons/fi';
import { PiExportBold } from "react-icons/pi";
import { PiFilePdfDuotone, PiMicrosoftExcelLogoDuotone } from "react-icons/pi";
import { AiOutlineMail } from "react-icons/ai";
import { FaWhatsapp } from "react-icons/fa6";
import EmailSelectionModal from '../components/email-selection';
import MobileSelectionModal from '../components/mobile-selection';
import { motion, AnimatePresence } from 'framer-motion';

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
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState({
        startDate: null,
        endDate: null
    });
    const datePickerRef = useRef(null);
    const tableRef = useRef(null);

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

    // Quick date filters
    const quickDateFilters = [
        { label: 'Today', days: 0 },
        { label: 'Yesterday', days: 1 },
        { label: 'Last 7 Days', days: 7 },
        { label: 'Last 30 Days', days: 30 },
        { label: 'This Month', days: null, type: 'month' },
        { label: 'Last Month', days: null, type: 'lastMonth' },
    ];

    // Billing data
    const [billingData] = useState([
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
    const [isWhatsappModalOpen, setWhatsappModalOpen] = useState(false);

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
        
        setSelectedDate({
            startDate: firstDay,
            endDate: today
        });
        
        const formattedFrom = formatDateString(firstDay);
        const formattedTo = formatDateString(today);
        
        setDateRange(`${formattedFrom} - ${formattedTo}`);
        setFromToDate(`${formattedFrom} to ${formattedTo}`);
    }, []);

    // Format date string
    const formatDateString = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = date.toLocaleString('en-US', { month: 'short' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    // Close date picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
                setShowDatePicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Get previous period for recurring tasks
    const getPreviousPeriod = (type, due_date) => {
        if (!due_date) return 'INVALID';

        const date = new Date(due_date);
        const month = date.getMonth() + 1;

        if (type === 'monthly') {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const previousMonthIndex = (date.getMonth() - 1 + 12) % 12;
            return months[previousMonthIndex];
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

    // Handle individual toggle selection
    const handleToggleSelect = (taskId) => {
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
        setIsEmailModalOpen(false);
        console.log('Selected email:', email);
    };

    const handleWhatsappSubmit = (number) => {
        setWhatsappModalOpen(false);
        console.log('Selected number:', number);
    };

    // Handle quick date filter
    const handleQuickDateFilter = (filter) => {
        const today = new Date();
        let startDate, endDate = today;

        if (filter.type === 'month') {
            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        } else if (filter.type === 'lastMonth') {
            const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            startDate = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
            endDate = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0);
        } else if (filter.days > 0) {
            startDate = new Date(today);
            startDate.setDate(today.getDate() - filter.days);
        } else {
            startDate = today;
        }

        setSelectedDate({ startDate, endDate });
        
        const formattedFrom = formatDateString(startDate);
        const formattedTo = formatDateString(endDate);
        
        setDateRange(`${formattedFrom} - ${formattedTo}`);
        setFromToDate(`${formattedFrom} to ${formattedTo}`);
        setShowDatePicker(false);
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

    // Update select all state when individual toggles change
    useEffect(() => {
        if (selectedItems.length === 0) {
            setSelectAll(false);
        } else if (selectedItems.length === billingData.length) {
            setSelectAll(true);
        }
    }, [selectedItems, billingData.length]);

    // Calculate dynamic heights based on viewport
    const [tableHeight, setTableHeight] = useState('calc(100vh - 260px)');
    
    useEffect(() => {
        const updateTableHeight = () => {
            const headerHeight = 64; // Header height
            const cardHeaderHeight = 96; // Card header height
            const tableHeaderHeight = 48; // Table header height
            const actionButtonsHeight = selectedItems.length > 0 ? 80 : 0; // Action buttons height
            const padding = 48; // Padding top/bottom
            
            const availableHeight = window.innerHeight - headerHeight - cardHeaderHeight - tableHeaderHeight - actionButtonsHeight - padding;
            setTableHeight(`${Math.max(400, availableHeight)}px`);
        };

        updateTableHeight();
        window.addEventListener('resize', updateTableHeight);
        return () => window.removeEventListener('resize', updateTableHeight);
    }, [selectedItems.length]);

    // Custom Date Picker Component
    const DatePickerComponent = () => (
        <AnimatePresence>
            {showDatePicker && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
                    ref={datePickerRef}
                >
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-800">Select Date Range</h3>
                            <button
                                onClick={() => setShowDatePicker(false)}
                                className="text-gray-400 hover:text-gray-600 text-lg"
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {quickDateFilters.map((filter, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleQuickDateFilter(filter)}
                                    className="px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 rounded-lg transition-colors duration-150 border border-gray-200 hover:border-indigo-300"
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                        
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    From Date
                                </label>
                                <input
                                    type="date"
                                    value={selectedDate.startDate ? selectedDate.startDate.toISOString().split('T')[0] : ''}
                                    onChange={(e) => setSelectedDate(prev => ({
                                        ...prev,
                                        startDate: new Date(e.target.value)
                                    }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    To Date
                                </label>
                                <input
                                    type="date"
                                    value={selectedDate.endDate ? selectedDate.endDate.toISOString().split('T')[0] : ''}
                                    onChange={(e) => setSelectedDate(prev => ({
                                        ...prev,
                                        endDate: new Date(e.target.value)
                                    }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>
                        
                        <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                            <button
                                onClick={() => setShowDatePicker(false)}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    if (selectedDate.startDate && selectedDate.endDate) {
                                        const formattedFrom = formatDateString(selectedDate.startDate);
                                        const formattedTo = formatDateString(selectedDate.endDate);
                                        setDateRange(`${formattedFrom} - ${formattedTo}`);
                                        setFromToDate(`${formattedFrom} to ${formattedTo}`);
                                        setShowDatePicker(false);
                                    }
                                }}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
                            >
                                Apply Date
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
        <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
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

            {/* Main content - Fixed to fill screen */}
            <div className={`pt-16 h-full transition-all duration-300 ${isMinimized ? 'lg:pl-20' : 'lg:pl-72'}`}>
                <div className="h-full px-4 sm:px-6 lg:px-8 py-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="h-full flex flex-col"
                    >
                        {/* Main Card with glass effect - Full height */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl flex flex-col h-full overflow-hidden">
                            {/* Card Header - Compact */}
                            <div className="border-b border-gray-200/60 px-6 py-4 bg-gradient-to-r from-gray-50 to-white flex-shrink-0">
                                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                    <div className="flex-1 min-w-0">
                                        <h5 className="text-xl font-bold text-gray-900 mb-1 truncate">
                                            Pending Bill
                                        </h5>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <div className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium flex items-center gap-1 flex-shrink-0">
                                                <FiCalendar className="w-3 h-3" />
                                                <span className="truncate">{fromToDate}</span>
                                            </div>
                                            <span className="text-xs text-gray-500 whitespace-nowrap">
                                                {filteredData.length} records
                                            </span>
                                        </div>
                                    </div>

                                    <div className="w-full lg:w-auto">
                                        <div className="flex flex-col lg:flex-row gap-3">
                                            {/* Filters Row */}
                                            <div className="flex flex-col sm:flex-row gap-2">
                                                {/* Service Filter */}
                                                <div className="relative min-w-[160px]">
                                                    <select
                                                        value={selectedService}
                                                        onChange={(e) => setSelectedService(e.target.value)}
                                                        className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all w-full appearance-none"
                                                    >
                                                        {serviceOptions.map(service => (
                                                            <option key={service.value} value={service.value}>
                                                                {service.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <FiFilter className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                                </div>

                                                {/* Date Filter */}
                                                <div className="dropdown-container relative min-w-[180px]">
                                                    <motion.button
                                                        onClick={() => setShowDatePicker(!showDatePicker)}
                                                        className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all flex items-center justify-between w-full"
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                    >
                                                        <FiCalendar className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                                        <span className="truncate mr-2 text-xs">{dateRange}</span>
                                                        <FiChevronDown className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${showDatePicker ? 'rotate-180' : ''}`} />
                                                    </motion.button>
                                                    <DatePickerComponent />
                                                </div>
                                            </div>

                                            {/* Search and Export Row */}
                                            <div className="flex gap-2">
                                                {/* Search Input */}
                                                <div className="relative flex-1 lg:flex-none lg:w-56">
                                                    <input
                                                        type="text"
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                        placeholder="Search anything..."
                                                        className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all w-full"
                                                    />
                                                    <FiSearch className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                                </div>

                                                {/* Export Dropdown */}
                                                <div className="dropdown-container relative">
                                                    <motion.button
                                                        onClick={() => setShowAddDropdown(!showAddDropdown)}
                                                        className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl whitespace-nowrap"
                                                        whileHover={{ scale: 1.02, y: -1 }}
                                                        whileTap={{ scale: 0.98 }}
                                                    >
                                                        <PiExportBold className="w-4 h-4" />
                                                        <span className="hidden sm:inline">Export</span>
                                                        <FiChevronDown className={`w-4 h-4 transition-transform ${showAddDropdown ? 'rotate-180' : ''}`} />
                                                    </motion.button>

                                                    <AnimatePresence>
                                                        {showAddDropdown && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -10 }}
                                                                className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
                                                            >
                                                                <div className="py-1">
                                                                    <button
                                                                        onClick={() => handleExport('pdf')}
                                                                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors duration-150"
                                                                    >
                                                                        <PiFilePdfDuotone className="w-4 h-4 mr-3 text-red-500" />
                                                                        Export as PDF
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleExport('excel')}
                                                                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors duration-150"
                                                                    >
                                                                        <PiMicrosoftExcelLogoDuotone className="w-4 h-4 mr-3 text-green-500" />
                                                                        Export as Excel
                                                                    </button>
                                                                    <div className="border-t border-gray-100">
                                                                        <button
                                                                            onClick={() => setWhatsappModalOpen(true)}
                                                                            className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors duration-150"
                                                                        >
                                                                            <FaWhatsapp className="w-4 h-4 mr-3 text-green-500" />
                                                                            Share via WhatsApp
                                                                        </button>
                                                                        <button
                                                                            onClick={() => setIsEmailModalOpen(true)}
                                                                            className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors duration-150"
                                                                        >
                                                                            <AiOutlineMail className="w-4 h-4 mr-3 text-blue-500" />
                                                                            Share via Email
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Table Container - Dynamic height */}
                            <div className="flex-1 flex flex-col overflow-hidden">
                                {/* Table Header - Fixed - NO HORIZONTAL SCROLL */}
                                <div className="border-b border-gray-200/60 bg-gradient-to-r from-gray-50 to-gray-100/50 flex-shrink-0">
                                    <table className="w-full text-sm table-fixed">
                                        <thead>
                                            <tr className="text-gray-700">
                                                <th className="text-left p-3 font-semibold text-gray-800 w-16">#</th>
                                                <th className="text-left p-3 font-semibold text-gray-800 w-[18%]">SERVICE</th>
                                                <th className="text-left p-3 font-semibold text-gray-800 w-[15%]">DATES</th>
                                                <th className="text-left p-3 font-semibold text-gray-800 w-[18%]">FIRM/CLIENT</th>
                                                <th className="text-left p-3 font-semibold text-gray-800 w-[15%]">INFO</th>
                                                <th className="text-left p-3 font-semibold text-gray-800 w-[15%]">COMPLETE BY</th>
                                                <th className="text-center p-3 font-semibold text-gray-800 w-36">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <span className="text-xs">SELECT</span>
                                                        <motion.button
                                                            onClick={handleSelectAll}
                                                            className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${selectAll ? 'bg-indigo-600' : 'bg-gray-300'}`}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            <motion.div
                                                                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-md ${selectAll ? 'left-5' : 'left-0.5'}`}
                                                                layout
                                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                            />
                                                            {selectAll && (
                                                                <div className="absolute inset-0 flex items-center justify-center">
                                                                    <FiCheckCircle className="w-2.5 h-2.5 text-white absolute left-1.5" />
                                                                </div>
                                                            )}
                                                        </motion.button>
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>

                                {/* Scrollable Table Body - Vertical scrolling only */}
                                <div 
                                    className="flex-1 overflow-y-auto overflow-x-hidden"
                                    style={{ height: tableHeight }}
                                    ref={tableRef}
                                >
                                    <table className="w-full text-sm table-fixed">
                                        <tbody className="divide-y divide-gray-200/60">
                                            {filteredData.length === 0 ? (
                                                <tr>
                                                    <td colSpan="7" className="text-center py-12">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                                <FiFileText className="w-8 h-8 text-gray-400" />
                                                            </div>
                                                            <p className="text-gray-500 font-medium">No pending billing records found</p>
                                                            <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
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
                                                    const isSelected = selectedItems.includes(item.task_id);

                                                    return (
                                                        <motion.tr
                                                            key={item.id}
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            className={`group transition-all duration-200 ${isSelected ? 'bg-gradient-to-r from-indigo-50/70 to-indigo-100/30 border-l-4 border-l-indigo-500' : 'hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-white'}`}
                                                        >
                                                            <td className="p-3 w-16">
                                                                <div className="w-7 h-7 flex items-center justify-center bg-gray-100 rounded-lg font-medium text-gray-700">
                                                                    {index + 1}
                                                                </div>
                                                            </td>
                                                            <td className="p-3 w-[18%]">
                                                                <a 
                                                                    href={`/view-task-details?task_id=${item.task_id}`}
                                                                    className="block hover:no-underline"
                                                                >
                                                                    <div className="flex items-start gap-2">
                                                                        {item.is_recurring && (
                                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                                                R
                                                                            </span>
                                                                        )}
                                                                        <b className={`transition-colors text-sm ${isSelected ? 'text-indigo-900' : 'text-gray-900 group-hover:text-indigo-700'} line-clamp-2`}>
                                                                            {item.service_name}
                                                                        </b>
                                                                    </div>
                                                                    <div className="mt-1">
                                                                        <span className="text-green-700 font-bold text-sm">
                                                                            ₹{Number(item.fees).toLocaleString()}
                                                                        </span>
                                                                        {item.is_recurring && (
                                                                            <div className="mt-2 space-y-1">
                                                                                <div className="text-xs text-orange-700 font-semibold bg-orange-50 px-2 py-1 rounded line-clamp-1">
                                                                                    Period: {recurringPeriod}
                                                                                </div>
                                                                                <div className="text-xs text-green-600 line-clamp-1">
                                                                                    {shortPeriod} Billing Cycle
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </a>
                                                            </td>
                                                            <td className="p-3 w-[15%]">
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center gap-2 text-xs">
                                                                        <div className="w-5 h-5 flex items-center justify-center bg-gray-100 rounded">
                                                                            <FiCalendar className="w-2.5 h-2.5 text-gray-500" />
                                                                        </div>
                                                                        <span className="text-gray-700 line-clamp-1">
                                                                            {formatDate(item.create_date)}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 text-xs">
                                                                        <div className="w-5 h-5 flex items-center justify-center bg-green-100 rounded">
                                                                            <FiCheckCircle className="w-2.5 h-2.5 text-green-600" />
                                                                        </div>
                                                                        <span className="text-green-700 font-medium line-clamp-1">
                                                                            {formatDate(item.complete_date)}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="p-3 w-[18%]">
                                                                <a 
                                                                    href={`/view-client-profile?username=${item.username}`}
                                                                    className="block hover:no-underline"
                                                                >
                                                                    <div className={`font-semibold transition-colors text-sm ${isSelected ? 'text-indigo-900' : 'text-gray-900 group-hover:text-indigo-700'} line-clamp-2`}>
                                                                        {item.firm_name}
                                                                    </div>
                                                                    <div className="text-xs text-gray-600 mt-1 line-clamp-1">
                                                                        {item.name}
                                                                    </div>
                                                                </a>
                                                            </td>
                                                            <td className="p-3 w-[15%]">
                                                                <div className="space-y-1">
                                                                    <div className="text-xs line-clamp-1">
                                                                        <span className="text-gray-500">PAN:</span>
                                                                        <span className={`font-medium ml-1 ${isSelected ? 'text-indigo-800' : 'text-gray-800'}`}>{item.pan}</span>
                                                                    </div>
                                                                    <div className="text-xs line-clamp-1">
                                                                        <span className="text-gray-500">File No:</span>
                                                                        <span className={`font-medium ml-1 ${isSelected ? 'text-indigo-800' : 'text-gray-800'}`}>{item.file_no}</span>
                                                                    </div>
                                                                    <div className="text-xs line-clamp-1">
                                                                        <span className="text-gray-500">Mobile:</span>
                                                                        <span className="text-indigo-700 font-medium ml-1">{item.mobile}</span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="p-3 w-[15%]">
                                                                <div className="space-y-1">
                                                                    <div className="font-medium text-gray-900 text-sm line-clamp-1">
                                                                        {item.completer_name}
                                                                    </div>
                                                                    <div className="text-xs text-gray-600 line-clamp-1">
                                                                        {item.completer_mobile}
                                                                    </div>
                                                                    <div className="text-xs">
                                                                        <span className={`px-2 py-0.5 rounded-full ${item.completer_user_type === 'manager' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'} line-clamp-1`}>
                                                                            {item.completer_user_type.toUpperCase()}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="p-3 w-36">
                                                                <div className="flex items-center justify-center gap-2">
                                                                    <motion.button
                                                                        onClick={() => handleToggleSelect(item.task_id)}
                                                                        className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${isSelected ? 'bg-indigo-600' : 'bg-gray-300'}`}
                                                                        whileTap={{ scale: 0.95 }}
                                                                    >
                                                                        <motion.div
                                                                            className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-md ${isSelected ? 'left-5' : 'left-0.5'}`}
                                                                            layout
                                                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                                        />
                                                                        {isSelected && (
                                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                                <FiCheckCircle className="w-2.5 h-2.5 text-white absolute left-1.5" />
                                                                            </div>
                                                                        )}
                                                                    </motion.button>
                                                                    <div className="dropdown-container relative">
                                                                        <motion.button
                                                                            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200 cursor-pointer group-hover:bg-gray-200"
                                                                            onClick={() => toggleRowDropdown(item.task_id)}
                                                                            whileHover={{ scale: 1.1 }}
                                                                            whileTap={{ scale: 0.9 }}
                                                                        >
                                                                            <FiMoreVertical className="w-3.5 h-3.5" />
                                                                        </motion.button>
                                                                        <AnimatePresence>
                                                                            {isDropdownOpen && (
                                                                                <motion.div
                                                                                    initial={{ opacity: 0, y: -10 }}
                                                                                    animate={{ opacity: 1, y: 0 }}
                                                                                    exit={{ opacity: 0, y: -10 }}
                                                                                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
                                                                                >
                                                                                    <div className="py-1">
                                                                                        <button
                                                                                            className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors duration-150"
                                                                                            onClick={() => {
                                                                                                setActiveRowDropdown(null);
                                                                                                handleToggleSelect(item.task_id);
                                                                                            }}
                                                                                        >
                                                                                            {isSelected ? (
                                                                                                <>
                                                                                                    <FiXCircle className="w-4 h-4 mr-3 text-red-500" />
                                                                                                    Deselect
                                                                                                </>
                                                                                            ) : (
                                                                                                <>
                                                                                                    <FiCheckCircle className="w-4 h-4 mr-3 text-green-500" />
                                                                                                    Select
                                                                                                </>
                                                                                            )}
                                                                                        </button>
                                                                                        <div className="border-t border-gray-100">
                                                                                            <button
                                                                                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors duration-150"
                                                                                                onClick={() => handleExport('print', item)}
                                                                                            >
                                                                                                <FiPrinter className="w-4 h-4 mr-3" />
                                                                                                Print
                                                                                            </button>
                                                                                            <button
                                                                                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors duration-150"
                                                                                                onClick={() => setWhatsappModalOpen(true)}
                                                                                            >
                                                                                                <FaWhatsapp className="w-4 h-4 mr-3 text-green-500" />
                                                                                                WhatsApp
                                                                                            </button>
                                                                                            <button
                                                                                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors duration-150"
                                                                                                onClick={() => setIsEmailModalOpen(true)}
                                                                                            >
                                                                                                <AiOutlineMail className="w-4 h-4 mr-3 text-blue-500" />
                                                                                                Email
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                </motion.div>
                                                                            )}
                                                                        </AnimatePresence>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </motion.tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Fixed Action Buttons Container - Only shows when items are selected */}
                                <AnimatePresence>
                                    {selectedItems.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 20 }}
                                            className="sticky bottom-0 left-0 right-0 border-t border-gray-200/60 bg-gradient-to-r from-white to-gray-50/95 backdrop-blur-sm shadow-2xl z-10 flex-shrink-0"
                                        >
                                            <div className="px-6 py-3">
                                                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 flex items-center justify-center bg-indigo-100 text-indigo-700 rounded-lg font-bold shadow-md">
                                                            {selectedItems.length}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-800 text-sm">
                                                                {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                Ready for billing
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <motion.button
                                                            onClick={handleGenerateBill}
                                                            className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.98 }}
                                                        >
                                                            <FiFileText className="w-4 h-4" />
                                                            Generate Bill
                                                        </motion.button>
                                                        <motion.button
                                                            onClick={handleMarkNonBillable}
                                                            className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.98 }}
                                                        >
                                                            <FiXCircle className="w-4 h-4" />
                                                            Mark Non-Billable
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
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
            <AnimatePresence>
                {exportModal.open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl p-8 max-w-md w-full mx-auto shadow-2xl"
                        >
                            <div className="text-center">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-20 h-20 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6"
                                >
                                    <PiExportBold className="w-10 h-10 text-indigo-600" />
                                </motion.div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                    Exporting {exportModal.type.toUpperCase()}
                                </h3>
                                <p className="text-gray-600 mb-8">
                                    Your {exportModal.type} export is being processed...
                                </p>
                                <div className="flex justify-center space-x-3 mb-6">
                                    <motion.div
                                        className="w-3 h-3 bg-indigo-600 rounded-full"
                                        animate={{ scale: [1, 1.5, 1] }}
                                        transition={{ duration: 0.6, repeat: Infinity }}
                                    ></motion.div>
                                    <motion.div
                                        className="w-3 h-3 bg-indigo-600 rounded-full"
                                        animate={{ scale: [1, 1.5, 1] }}
                                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                    ></motion.div>
                                    <motion.div
                                        className="w-3 h-3 bg-indigo-600 rounded-full"
                                        animate={{ scale: [1, 1.5, 1] }}
                                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                                    ></motion.div>
                                </div>
                                <p className="text-sm text-gray-500">
                                    This will only take a moment
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BillDisplay;