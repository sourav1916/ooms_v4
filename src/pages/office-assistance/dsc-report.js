import React, { useState, useEffect, useRef } from 'react';
import {
    FiSearch,
    FiPlus,
    FiEdit,
    FiMenu,
    FiPrinter,
    FiMail,
    FiMessageSquare,
    FiUser,
    FiPhone,
    FiMail as FiEmailIcon,
    FiCalendar,
    FiClock,
    FiX
} from 'react-icons/fi';
import { PiExportBold } from "react-icons/pi";
import { PiFilePdfDuotone, PiMicrosoftExcelLogoDuotone } from "react-icons/pi";
import { AiOutlineMail } from "react-icons/ai";
import { FaWhatsapp } from "react-icons/fa6";
import { motion } from 'framer-motion';
import { Header, Sidebar } from '../../components/header';
import DateFilter from '../../components/DateFilter';
import moment from 'moment';

const ViewDSCRegister = () => {
    // Header/Sidebar states
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(() => {
        const saved = localStorage.getItem('sidebarMinimized');
        return saved ? JSON.parse(saved) : false;
    });

    // Main states
    const [loading, setLoading] = useState(false);
    const [dscData, setDscData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [dateRange, setDateRange] = useState('');
    const [fromToDate, setFromToDate] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedDsc, setSelectedDsc] = useState(null);
    const [users, setUsers] = useState([]);

    // State for dropdown menus
    const [showAddDropdown, setShowAddDropdown] = useState(false);
    const [activeRowDropdown, setActiveRowDropdown] = useState(null);
    const [exportModal, setExportModal] = useState({ open: false, type: '', data: null });

    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState('');

    const [isWhatsappModalOpen, setWhatsappModalOpen] = useState(false);
    const [selectedWhatsapp, setSelectedWhatsapp] = useState('');

    // Form states
    const [createForm, setCreateForm] = useState({
        username: '',
        company: '',
        duration: '1',
        issue_date: '',
        expire_date: '',
        password: ''
    });

    const [editForm, setEditForm] = useState({
        dsc_id: '',
        company: '',
        duration: '1',
        issue_date: '',
        expire_date: '',
        password: ''
    });

    // Mock DSC data
    const mockDscData = [
        {
            dsc_id: 'dsc001',
            username: 'user001',
            name: 'John Doe',
            guardian_name: 'Robert Doe',
            mobile: '+91 9876543210',
            email: 'john.doe@company.com',
            company: 'Tech Solutions Inc.',
            issue_date: '2024-01-15',
            expire_date: '2025-01-14',
            duration: 1,
            password: 'encrypted123',
            status: 1,
            user_type: 'user'
        },
        {
            dsc_id: 'dsc002',
            username: 'ca001',
            name: 'Jane Smith',
            guardian_name: 'William Smith',
            mobile: '+91 9876543211',
            email: 'jane.smith@ca.com',
            company: 'Financial Advisors Ltd.',
            issue_date: '2023-11-20',
            expire_date: '2024-11-19',
            duration: 1,
            password: 'secure456',
            status: 1,
            user_type: 'ca'
        },
        {
            dsc_id: 'dsc003',
            username: 'agent001',
            name: 'Mike Johnson',
            guardian_name: 'David Johnson',
            mobile: '+91 9876543212',
            email: 'mike.johnson@agent.com',
            company: 'Insurance Partners',
            issue_date: '2024-03-10',
            expire_date: '2026-03-09',
            duration: 2,
            password: 'agent789',
            status: 1,
            user_type: 'agent'
        },
        {
            dsc_id: 'dsc004',
            username: 'emp001',
            name: 'Sarah Wilson',
            guardian_name: 'James Wilson',
            mobile: '+91 9876543213',
            email: 'sarah.wilson@company.com',
            company: 'Corporate Solutions',
            issue_date: '2024-02-01',
            expire_date: '2027-01-31',
            duration: 3,
            password: 'corp321',
            status: 0,
            user_type: 'employee'
        }
    ];

    // Mock users data for dropdown
    const mockUsers = [
        {
            username: 'user001',
            name: 'John Doe',
            guardian_name: 'Robert Doe',
            mobile: '+91 9876543210',
            user_type: 'user',
            state: 'active'
        },
        {
            username: 'ca001',
            name: 'Jane Smith',
            guardian_name: 'William Smith',
            mobile: '+91 9876543211',
            user_type: 'ca',
            state: 'active'
        },
        {
            username: 'agent001',
            name: 'Mike Johnson',
            guardian_name: 'David Johnson',
            mobile: '+91 9876543212',
            user_type: 'agent',
            state: 'active'
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
        fetchDscData(true);
        fetchUsers();
    }, []);

    // Simulate API call to fetch DSC data
    const fetchDscData = async (from = '', to = '') => {
        setLoading(true);

        setTimeout(() => {
            let filteredData = mockDscData;

            // Filter by date range if provided
            if (from && to) {
                filteredData = mockDscData.filter(item => {
                    const issueDate = moment(item.issue_date);
                    const fromDate = moment(from, 'DD/MM/YYYY');
                    const toDate = moment(to, 'DD/MM/YYYY');
                    return issueDate.isBetween(fromDate, toDate, null, '[]');
                });
            }

            // Filter by search query
            if (searchQuery) {
                filteredData = filteredData.filter(item =>
                    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.mobile.includes(searchQuery) ||
                    item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.company.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }

            setDscData(filteredData);
            setLoading(false);
        }, 1000);
    };

    // Simulate fetching users
    const fetchUsers = async () => {
        setTimeout(() => {
            setUsers(mockUsers);
        }, 500);
    };

    // Handle search
    const handleSearch = () => {
        const [from, to] = dateRange.split(' - ');
        fetchDscData(from, to);
    };

    // Handle search input change with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery !== '') {
                handleSearch();
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Handle key press in search input
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // Handle date filter change
    const handleDateFilterChange = (filter) => {
        console.log('Selected filter:', filter);
        if (filter.range) {
            setDateRange(filter.range);
            const [from, to] = filter.range.split(' - ');
            setFromToDate(`From ${from} to ${to}`);
            fetchDscData(from, to);
        }
    };

    // Handle export
    const handleExport = (type, data = null) => {
        setExportModal({ open: true, type, data });

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

    // Handle edit button click
    const handleEditClick = (dsc) => {
        setSelectedDsc(dsc);
        setEditForm({
            dsc_id: dsc.dsc_id,
            company: dsc.company,
            duration: dsc.duration.toString(),
            issue_date: moment(dsc.issue_date).format('DD/MM/YYYY'),
            expire_date: moment(dsc.expire_date).format('DD/MM/YYYY'),
            password: dsc.password
        });
        setShowEditModal(true);
    };

    // Handle create form submit
    const handleCreateSubmit = (e) => {
        e.preventDefault();
        console.log('Create form data:', createForm);
        setShowCreateModal(false);
        setCreateForm({
            username: '',
            company: '',
            duration: '1',
            issue_date: '',
            expire_date: '',
            password: ''
        });
        const [from, to] = dateRange.split(' - ');
        fetchDscData(from, to);
    };

    // Handle edit form submit
    const handleEditSubmit = (e) => {
        e.preventDefault();
        console.log('Edit form data:', editForm);
        setShowEditModal(false);
        const [from, to] = dateRange.split(' - ');
        fetchDscData(from, to);
    };

    // Calculate expire date based on issue date and duration
    const calculateExpireDate = (issueDate, duration) => {
        if (!issueDate) return '';
        const issueMoment = moment(issueDate, 'DD/MM/YYYY');
        const expireMoment = issueMoment.add(duration * 365, 'days');
        return expireMoment.format('DD/MM/YYYY');
    };

    // Handle create form changes
    const handleCreateChange = (field, value) => {
        const newForm = { ...createForm, [field]: value };
        
        if (field === 'issue_date' || field === 'duration') {
            newForm.expire_date = calculateExpireDate(
                field === 'issue_date' ? value : createForm.issue_date,
                field === 'duration' ? parseInt(value) : parseInt(createForm.duration)
            );
        }
        
        setCreateForm(newForm);
    };

    // Handle edit form changes
    const handleEditChange = (field, value) => {
        const newForm = { ...editForm, [field]: value };
        
        if (field === 'issue_date' || field === 'duration') {
            newForm.expire_date = calculateExpireDate(
                field === 'issue_date' ? value : editForm.issue_date,
                field === 'duration' ? parseInt(value) : parseInt(editForm.duration)
            );
        }
        
        setEditForm(newForm);
    };

    // Get user profile link based on user type
    const getUserProfileLink = (user) => {
        const baseUrls = {
            user: '/view-client-profile',
            ca: '/view-ca-profile',
            agent: '/view-agent-profile',
            employee: '/view-stuff-profile'
        };
        return `${baseUrls[user.user_type]}?username=${user.username}`;
    };

    // Calculate days left until expiration
    const getDaysLeft = (expireDate) => {
        const targetDate = moment(expireDate, "YYYY-MM-DD");
        const today = moment();
        return targetDate.diff(today, 'days');
    };

    // Get status badge class
    const getStatusBadgeClass = (status) => {
        return status === 1 
            ? 'bg-green-100 text-green-800 border border-green-200'
            : 'bg-red-100 text-red-800 border border-red-200';
    };

    // Get urgency badge class
    const getUrgencyBadgeClass = (daysLeft) => {
        if (daysLeft < 0) return 'bg-red-100 text-red-800 border border-red-200';
        if (daysLeft <= 30) return 'bg-orange-100 text-orange-800 border border-orange-200';
        if (daysLeft <= 90) return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
        return 'bg-green-100 text-green-800 border border-green-200';
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    // Toggle row dropdown
    const toggleRowDropdown = (dscId) => {
        setActiveRowDropdown(activeRowDropdown === dscId ? null : dscId);
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
                    {/* Header Skeleton */}
                    <div className="mb-6 animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-64"></div>
                    </div>

                    {/* Controls Skeleton */}
                    <div className="flex flex-col lg:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <div className="h-10 bg-gray-200 rounded"></div>
                        </div>
                        <div className="w-48">
                            <div className="h-10 bg-gray-200 rounded"></div>
                        </div>
                        <div className="w-32">
                            <div className="h-10 bg-gray-200 rounded"></div>
                        </div>
                    </div>

                    {/* Table Skeleton */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm animate-pulse">
                        <div className="border-b border-gray-200">
                            <div className="h-12 bg-gray-100 rounded-t-lg"></div>
                        </div>
                        <div className="p-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-16 bg-gray-100 rounded mb-2"></div>
                            ))}
                        </div>
                        <div className="border-t border-gray-200">
                            <div className="h-16 bg-gray-100 rounded-b-lg"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Skeleton row for table
    const SkeletonRow = () => (
        <tr className="border-b border-gray-100 animate-pulse">
            <td className="p-4 align-middle">
                <div className="h-4 bg-gray-200 rounded w-8"></div>
            </td>
            <td className="p-4 align-middle">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
            </td>
            <td className="p-4 align-middle">
                <div className="h-4 bg-gray-200 rounded w-40"></div>
            </td>
            <td className="p-4 align-middle">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
            </td>
            <td className="p-4 align-middle">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
            </td>
            <td className="p-4 align-middle">
                <div className="h-6 bg-gray-200 rounded w-16 ml-auto"></div>
            </td>
            <td className="p-4 align-middle">
                <div className="h-6 bg-gray-200 rounded w-8 ml-auto"></div>
            </td>
        </tr>
    );

    // Professional Modal Wrapper Component
    const ModalWrapper = ({ isOpen, onClose, title, children, size = 'max-w-2xl' }) => {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen p-4">
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                        onClick={onClose}
                    />
                    {/* Professional Modal panel */}
                    <div className={`relative w-full ${size} bg-white rounded-lg shadow-xl flex flex-col max-h-[90vh]`}>
                        {/* Professional Header */}
                        <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-t-lg">
                            <h2 className="text-xl font-bold">{title}</h2>
                            <button
                                onClick={onClose}
                                className="text-indigo-200 hover:text-white p-1 rounded-lg transition-colors"
                            >
                                <FiX className="w-6 h-6" />
                            </button>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        );
    };

    // Show skeleton while loading
    if (loading && dscData.length === 0) {
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

            <div className={`pt-16 transition-all duration-300 ease-in-out ${isMinimized ? 'md:pl-20' : 'md:pl-72'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
                    {/* Main Card - Full height with scrolling */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col h-full">
                        {/* Card Header */}
                        <div className="border-b border-gray-200 px-6 py-4">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                <div>
                                    <h5 className="text-xl font-bold text-gray-800 mb-1">
                                        DSC Register
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
                                        {/* Search Input */}
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                onKeyPress={handleKeyPress}
                                                placeholder="Search DSC records..."
                                                className="pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-colors w-full lg:w-64"
                                            />
                                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        </div>

                                        {/* Export Dropdown */}
                                        <div className="dropdown-container relative">
                                            <motion.button
                                                onClick={() => setShowAddDropdown(!showAddDropdown)}
                                                className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <PiExportBold className="w-4 h-4" />
                                                Export
                                            </motion.button>

                                            {showAddDropdown && (
                                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
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
                                                </div>
                                            )}
                                        </div>

                                        <motion.button
                                            onClick={() => setShowCreateModal(true)}
                                            className="px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <FiPlus className="w-4 h-4" />
                                            Add DSC
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Table Container with Fixed Header and Footer */}
                        <div className="flex-1 flex flex-col overflow-hidden">
                            {/* Table Header - Fixed */}
                            <div className="border-b border-gray-200">
                                <table className="w-full text-sm">
                                    <colgroup>
                                        <col className="w-[5%]" />  {/* # */}
                                        <col className="w-[25%]" /> {/* USER DETAILS */}
                                        <col className="w-[20%]" /> {/* CONTACT INFO */}
                                        <col className="w-[15%]" /> {/* COMPANY */}
                                        <col className="w-[20%]" /> {/* VALIDITY PERIOD */}
                                        <col className="w-[10%]" /> {/* STATUS */}
                                        <col className="w-[5%]" />  {/* ACTIONS */}
                                    </colgroup>
                                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                        <tr>
                                            <th className="text-left p-4 font-semibold text-gray-700 align-middle">#</th>
                                            <th className="text-left p-4 font-semibold text-gray-700 align-middle">USER DETAILS</th>
                                            <th className="text-left p-4 font-semibold text-gray-700 align-middle">CONTACT INFO</th>
                                            <th className="text-left p-4 font-semibold text-gray-700 align-middle">COMPANY</th>
                                            <th className="text-left p-4 font-semibold text-gray-700 align-middle">VALIDITY PERIOD</th>
                                            <th className="text-left p-4 font-semibold text-gray-700 align-middle">STATUS</th>
                                            <th className="text-center p-4 font-semibold text-gray-700 align-middle">ACTIONS</th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>

                            {/* Scrollable Table Body */}
                            <div className="flex-1 overflow-y-auto">
                                <table className="w-full text-sm">
                                    <colgroup>
                                        <col className="w-[5%]" />
                                        <col className="w-[25%]" />
                                        <col className="w-[20%]" />
                                        <col className="w-[15%]" />
                                        <col className="w-[20%]" />
                                        <col className="w-[10%]" />
                                        <col className="w-[5%]" />
                                    </colgroup>
                                    <tbody className="bg-white">
                                        {loading ? (
                                            // Skeleton Loaders
                                            Array.from({ length: 6 }).map((_, index) => (
                                                <SkeletonRow key={index} />
                                            ))
                                        ) : dscData.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="text-center py-8 text-gray-500 align-middle">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <FiUser className="w-12 h-12 text-gray-300 mb-3" />
                                                        <p className="text-gray-500">No DSC records found</p>
                                                        <motion.button
                                                            onClick={() => setShowCreateModal(true)}
                                                            className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            Add Your First DSC
                                                        </motion.button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            dscData.map((dsc, index) => {
                                                const isDropdownOpen = activeRowDropdown === dsc.dsc_id;
                                                const daysLeft = getDaysLeft(dsc.expire_date);

                                                return (
                                                    <tr
                                                        key={dsc.dsc_id}
                                                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                                                    >
                                                        <td className="p-4 text-gray-600 font-medium align-middle">
                                                            {index + 1}
                                                        </td>
                                                        <td className="p-4 align-middle">
                                                            <a
                                                                href={getUserProfileLink(dsc)}
                                                                className="text-indigo-600 hover:text-indigo-800 font-medium block"
                                                            >
                                                                <div className="flex items-start gap-3">
                                                                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                                        <FiUser className="w-5 h-5 text-indigo-600" />
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-semibold text-gray-800">{dsc.name}</div>
                                                                        <div className="text-gray-500 text-sm mt-1">
                                                                            C/O: {dsc.guardian_name}
                                                                        </div>
                                                                        <div className="text-indigo-600 text-xs font-medium mt-1 bg-indigo-50 px-2 py-1 rounded-full inline-block">
                                                                            {dsc.user_type.toUpperCase()}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </a>
                                                        </td>
                                                        <td className="p-4 align-middle">
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2 text-gray-800 font-medium">
                                                                    <FiPhone className="w-3 h-3" />
                                                                    {dsc.mobile}
                                                                </div>
                                                                <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                                    <FiEmailIcon className="w-3 h-3" />
                                                                    {dsc.email}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 align-middle">
                                                            <span className="text-gray-800 font-medium">
                                                                {dsc.company}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 align-middle">
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2 text-gray-600">
                                                                    <FiCalendar className="w-3 h-3" />
                                                                    {formatDate(dsc.issue_date)} - {formatDate(dsc.expire_date)}
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-indigo-600 text-sm font-medium">
                                                                        ({dsc.duration} Year)
                                                                    </span>
                                                                    {daysLeft <= 90 && (
                                                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getUrgencyBadgeClass(daysLeft)}`}>
                                                                            <FiClock className="w-2 h-2 mr-1" />
                                                                            {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 align-middle">
                                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(dsc.status)}`}>
                                                                {dsc.status === 1 ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 align-middle">
                                                            <div className="dropdown-container relative flex justify-center">
                                                                <motion.button
                                                                    className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group-hover:bg-gray-200"
                                                                    onClick={() => toggleRowDropdown(dsc.dsc_id)}
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                >
                                                                    <FiMenu className="w-4 h-4" />
                                                                </motion.button>
                                                                {isDropdownOpen && (
                                                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                                                                        <div className="py-1">
                                                                            <button
                                                                                onClick={() => {
                                                                                    setActiveRowDropdown(null);
                                                                                    handleEditClick(dsc);
                                                                                }}
                                                                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                                                                            >
                                                                                <FiEdit className="w-4 h-4 mr-3" />
                                                                                Edit DSC
                                                                            </button>
                                                                            <div className="border-t border-gray-100 mt-1 pt-1">
                                                                                <button
                                                                                    onClick={() => handleExport('print', dsc)}
                                                                                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                                                                                >
                                                                                    <FiPrinter className="w-4 h-4 mr-3" />
                                                                                    Print
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => handleExport('whatsapp', dsc)}
                                                                                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                                                                                >
                                                                                    <FiMessageSquare className="w-4 h-4 mr-3" />
                                                                                    WhatsApp
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => handleExport('email', dsc)}
                                                                                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
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
                            <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                                <table className="w-full text-sm">
                                    <colgroup>
                                        <col className="w-[65%]" />
                                        <col className="w-[10%]" />
                                        <col className="w-[5%]" />
                                    </colgroup>
                                    <tfoot>
                                        <tr>
                                            <td className="text-right p-4 font-bold text-gray-800 align-middle" colSpan="5">
                                                Total DSC Records: {dscData.length}
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="flex gap-2">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                                        Active: {dscData.filter(d => d.status === 1).length}
                                                    </span>
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                                                        Inactive: {dscData.filter(d => d.status === 0).length}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle"></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create DSC Modal */}
            <ModalWrapper
                isOpen={showCreateModal}
                onClose={() => {
                    setShowCreateModal(false);
                    setCreateForm({
                        username: '',
                        company: '',
                        duration: '1',
                        issue_date: '',
                        expire_date: '',
                        password: ''
                    });
                }}
                title="Create DSC Register"
                size="max-w-2xl"
            >
                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleCreateSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Select User <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={createForm.username}
                                    onChange={(e) => handleCreateChange('username', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-400 transition-colors"
                                    required
                                >
                                    <option value="">Select User</option>
                                    {users.map(user => (
                                        <option key={user.username} value={user.username}>
                                            Name: {user.name} | C/O: {user.guardian_name} | Mobile: {user.mobile} | Type: {user.user_type.toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Company <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={createForm.company}
                                    onChange={(e) => handleCreateChange('company', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-400 transition-colors"
                                    placeholder="Enter company name"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Duration <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={createForm.duration}
                                    onChange={(e) => handleCreateChange('duration', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-400 transition-colors"
                                    required
                                >
                                    <option value="1">1 Year</option>
                                    <option value="2">2 Years</option>
                                    <option value="3">3 Years</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Issue Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={createForm.issue_date}
                                    onChange={(e) => handleCreateChange('issue_date', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-400 transition-colors"
                                    placeholder="DD/MM/YYYY"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Expire Date
                                </label>
                                <input
                                    type="text"
                                    value={createForm.expire_date}
                                    readOnly
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 outline-none"
                                    placeholder="DD/MM/YYYY"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Password
                                </label>
                                <input
                                    type="text"
                                    value={createForm.password}
                                    onChange={(e) => handleCreateChange('password', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-400 transition-colors"
                                    placeholder="DSC Password"
                                />
                            </div>
                        </div>
                    </form>
                </div>

                <div className="flex-shrink-0 border-t border-gray-200 bg-white p-6 rounded-b-lg shadow-sm">
                    <div className="flex justify-end gap-3">
                        <motion.button
                            type="button"
                            onClick={() => {
                                setShowCreateModal(false);
                                setCreateForm({
                                    username: '',
                                    company: '',
                                    duration: '1',
                                    issue_date: '',
                                    expire_date: '',
                                    password: ''
                                });
                            }}
                            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            type="submit"
                            onClick={handleCreateSubmit}
                            className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Create DSC
                        </motion.button>
                    </div>
                </div>
            </ModalWrapper>

            {/* Edit DSC Modal */}
            <ModalWrapper
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedDsc(null);
                }}
                title="Update DSC Register"
                size="max-w-2xl"
            >
                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleEditSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    User Information
                                </label>
                                <input
                                    type="text"
                                    value={selectedDsc ? `Name: ${selectedDsc.name} | C/O: ${selectedDsc.guardian_name} | Mobile: ${selectedDsc.mobile} | Type: ${selectedDsc.user_type.toUpperCase()}` : ''}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 outline-none"
                                    disabled
                                    readOnly
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Company <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={editForm.company}
                                    onChange={(e) => handleEditChange('company', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-400 transition-colors"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Duration <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={editForm.duration}
                                    onChange={(e) => handleEditChange('duration', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-400 transition-colors"
                                    required
                                >
                                    <option value="1">1 Year</option>
                                    <option value="2">2 Years</option>
                                    <option value="3">3 Years</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Issue Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={editForm.issue_date}
                                    onChange={(e) => handleEditChange('issue_date', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-400 transition-colors"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Expire Date
                                </label>
                                <input
                                    type="text"
                                    value={editForm.expire_date}
                                    readOnly
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Password
                                </label>
                                <input
                                    type="text"
                                    value={editForm.password}
                                    onChange={(e) => handleEditChange('password', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-400 transition-colors"
                                />
                            </div>
                        </div>
                    </form>
                </div>

                <div className="flex-shrink-0 border-t border-gray-200 bg-white p-6 rounded-b-lg shadow-sm">
                    <div className="flex justify-end gap-3">
                        <motion.button
                            type="button"
                            onClick={() => {
                                setShowEditModal(false);
                                setSelectedDsc(null);
                            }}
                            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            type="submit"
                            onClick={handleEditSubmit}
                            className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Update DSC
                        </motion.button>
                    </div>
                </div>
            </ModalWrapper>

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

export default ViewDSCRegister;