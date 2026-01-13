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
    FiFileText,
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

const ViewFileIndex = () => {
    // Header/Sidebar states
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(() => {
        const saved = localStorage.getItem('sidebarMinimized');
        return saved ? JSON.parse(saved) : false;
    });

    // Main states
    const [loading, setLoading] = useState(false);
    const [fileData, setFileData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [dateRange, setDateRange] = useState('');
    const [fromToDate, setFromToDate] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
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
        gst: '',
        audit: '',
        income_tax: '',
        other: ''
    });

    const [editForm, setEditForm] = useState({
        index_id: '',
        gst: '',
        audit: '',
        income_tax: '',
        other: ''
    });

    // Mock File Index data
    const mockFileData = [
        {
            index_id: 'index001',
            username: 'user001',
            name: 'John Doe',
            guardian_name: 'Robert Doe',
            mobile: '+91 9876543210',
            email: 'john.doe@company.com',
            gst: 'GST/2024/001',
            audit: 'AUD/2024/001',
            income_tax: 'ITR/2024/001',
            other: 'MISC/2024/001',
            user_type: 'user',
            created_date: '2024-01-15'
        },
        {
            index_id: 'index002',
            username: 'ca001',
            name: 'Jane Smith',
            guardian_name: 'William Smith',
            mobile: '+91 9876543211',
            email: 'jane.smith@ca.com',
            gst: 'GST/2024/002',
            audit: 'AUD/2024/002',
            income_tax: 'ITR/2024/002',
            other: 'MISC/2024/002',
            user_type: 'ca',
            created_date: '2024-01-20'
        },
        {
            index_id: 'index003',
            username: 'agent001',
            name: 'Mike Johnson',
            guardian_name: 'David Johnson',
            mobile: '+91 9876543212',
            email: 'mike.johnson@agent.com',
            gst: 'GST/2024/003',
            audit: 'AUD/2024/003',
            income_tax: 'ITR/2024/003',
            other: 'MISC/2024/003',
            user_type: 'agent',
            created_date: '2024-02-05'
        },
        {
            index_id: 'index004',
            username: 'emp001',
            name: 'Sarah Wilson',
            guardian_name: 'James Wilson',
            mobile: '+91 9876543213',
            email: 'sarah.wilson@company.com',
            gst: 'GST/2024/004',
            audit: 'AUD/2024/004',
            income_tax: 'ITR/2024/004',
            other: 'MISC/2024/004',
            user_type: 'employee',
            created_date: '2024-02-10'
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
        fetchFileData(true);
        fetchUsers();
    }, []);

    // Simulate API call to fetch file data
    const fetchFileData = async (from = '', to = '') => {
        setLoading(true);

        setTimeout(() => {
            let filteredData = mockFileData;

            // Filter by date range if provided
            if (from && to) {
                filteredData = mockFileData.filter(item => {
                    const createdDate = moment(item.created_date);
                    const fromDate = moment(from, 'DD/MM/YYYY');
                    const toDate = moment(to, 'DD/MM/YYYY');
                    return createdDate.isBetween(fromDate, toDate, null, '[]');
                });
            }

            // Filter by search query
            if (searchQuery) {
                filteredData = filteredData.filter(item =>
                    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.mobile.includes(searchQuery) ||
                    item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.gst.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.audit.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.income_tax.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.other.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }

            setFileData(filteredData);
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
        fetchFileData(from, to);
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
            fetchFileData(from, to);
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
    const handleEditClick = (file) => {
        setSelectedFile(file);
        setEditForm({
            index_id: file.index_id,
            gst: file.gst,
            audit: file.audit,
            income_tax: file.income_tax,
            other: file.other
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
            gst: '',
            audit: '',
            income_tax: '',
            other: ''
        });
        const [from, to] = dateRange.split(' - ');
        fetchFileData(from, to);
    };

    // Handle edit form submit
    const handleEditSubmit = (e) => {
        e.preventDefault();
        console.log('Edit form data:', editForm);
        setShowEditModal(false);
        const [from, to] = dateRange.split(' - ');
        fetchFileData(from, to);
    };

    // Handle form changes
    const handleCreateChange = (field, value) => {
        setCreateForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleEditChange = (field, value) => {
        setEditForm(prev => ({
            ...prev,
            [field]: value
        }));
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

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    // Get file badge class
    const getFileBadgeClass = (fileType) => {
        const baseClasses = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border';
        
        switch (fileType) {
            case 'gst':
                return `${baseClasses} bg-blue-100 text-blue-800 border-blue-200`;
            case 'audit':
                return `${baseClasses} bg-green-100 text-green-800 border-green-200`;
            case 'income_tax':
                return `${baseClasses} bg-purple-100 text-purple-800 border-purple-200`;
            case 'other':
                return `${baseClasses} bg-orange-100 text-orange-800 border-orange-200`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800 border-gray-200`;
        }
    };

    // Toggle row dropdown
    const toggleRowDropdown = (indexId) => {
        setActiveRowDropdown(activeRowDropdown === indexId ? null : indexId);
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
                <div className="h-6 bg-gray-200 rounded w-20"></div>
            </td>
            <td className="p-4 align-middle">
                <div className="h-6 bg-gray-200 rounded w-20"></div>
            </td>
            <td className="p-4 align-middle">
                <div className="h-6 bg-gray-200 rounded w-20"></div>
            </td>
            <td className="p-4 align-middle">
                <div className="h-6 bg-gray-200 rounded w-20"></div>
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
    if (loading && fileData.length === 0) {
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
                                        File Index Register
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
                                                placeholder="Search file index..."
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
                                            Add File Index
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
                                        <col className="w-[12%]" /> {/* GST */}
                                        <col className="w-[12%]" /> {/* AUDIT */}
                                        <col className="w-[12%]" /> {/* INCOME TAX */}
                                        <col className="w-[12%]" /> {/* OTHER */}
                                        <col className="w-[5%]" />  {/* ACTIONS */}
                                    </colgroup>
                                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                        <tr>
                                            <th className="text-left p-4 font-semibold text-gray-700 align-middle">#</th>
                                            <th className="text-left p-4 font-semibold text-gray-700 align-middle">USER DETAILS</th>
                                            <th className="text-left p-4 font-semibold text-gray-700 align-middle">CONTACT INFO</th>
                                            <th className="text-left p-4 font-semibold text-gray-700 align-middle">GST FILE</th>
                                            <th className="text-left p-4 font-semibold text-gray-700 align-middle">AUDIT FILE</th>
                                            <th className="text-left p-4 font-semibold text-gray-700 align-middle">INCOME TAX</th>
                                            <th className="text-left p-4 font-semibold text-gray-700 align-middle">OTHER FILE</th>
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
                                        <col className="w-[12%]" />
                                        <col className="w-[12%]" />
                                        <col className="w-[12%]" />
                                        <col className="w-[12%]" />
                                        <col className="w-[5%]" />
                                    </colgroup>
                                    <tbody className="bg-white">
                                        {loading ? (
                                            // Skeleton Loaders
                                            Array.from({ length: 6 }).map((_, index) => (
                                                <SkeletonRow key={index} />
                                            ))
                                        ) : fileData.length === 0 ? (
                                            <tr>
                                                <td colSpan="8" className="text-center py-8 text-gray-500 align-middle">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <FiFileText className="w-12 h-12 text-gray-300 mb-3" />
                                                        <p className="text-gray-500">No file index records found</p>
                                                        <motion.button
                                                            onClick={() => setShowCreateModal(true)}
                                                            className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            Add Your First File Index
                                                        </motion.button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            fileData.map((file, index) => {
                                                const isDropdownOpen = activeRowDropdown === file.index_id;

                                                return (
                                                    <tr
                                                        key={file.index_id}
                                                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                                                    >
                                                        <td className="p-4 text-gray-600 font-medium align-middle">
                                                            {index + 1}
                                                        </td>
                                                        <td className="p-4 align-middle">
                                                            <a
                                                                href={getUserProfileLink(file)}
                                                                className="text-indigo-600 hover:text-indigo-800 font-medium block"
                                                            >
                                                                <div className="flex items-start gap-3">
                                                                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                                        <FiUser className="w-5 h-5 text-indigo-600" />
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-semibold text-gray-800">{file.name}</div>
                                                                        <div className="text-gray-500 text-sm mt-1">
                                                                            C/O: {file.guardian_name}
                                                                        </div>
                                                                        <div className="text-indigo-600 text-xs font-medium mt-1 bg-indigo-50 px-2 py-1 rounded-full inline-block">
                                                                            {file.user_type.toUpperCase()}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </a>
                                                        </td>
                                                        <td className="p-4 align-middle">
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2 text-gray-800 font-medium">
                                                                    <FiPhone className="w-3 h-3" />
                                                                    {file.mobile}
                                                                </div>
                                                                <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                                    <FiEmailIcon className="w-3 h-3" />
                                                                    {file.email}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 align-middle">
                                                            {file.gst && (
                                                                <span className={getFileBadgeClass('gst')}>
                                                                    {file.gst}
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="p-4 align-middle">
                                                            {file.audit && (
                                                                <span className={getFileBadgeClass('audit')}>
                                                                    {file.audit}
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="p-4 align-middle">
                                                            {file.income_tax && (
                                                                <span className={getFileBadgeClass('income_tax')}>
                                                                    {file.income_tax}
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="p-4 align-middle">
                                                            {file.other && (
                                                                <span className={getFileBadgeClass('other')}>
                                                                    {file.other}
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="p-4 align-middle">
                                                            <div className="dropdown-container relative flex justify-center">
                                                                <motion.button
                                                                    className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group-hover:bg-gray-200"
                                                                    onClick={() => toggleRowDropdown(file.index_id)}
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
                                                                                    handleEditClick(file);
                                                                                }}
                                                                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                                                                            >
                                                                                <FiEdit className="w-4 h-4 mr-3" />
                                                                                Edit File Index
                                                                            </button>
                                                                            <div className="border-t border-gray-100 mt-1 pt-1">
                                                                                <button
                                                                                    onClick={() => handleExport('print', file)}
                                                                                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                                                                                >
                                                                                    <FiPrinter className="w-4 h-4 mr-3" />
                                                                                    Print
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => handleExport('whatsapp', file)}
                                                                                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                                                                                >
                                                                                    <FiMessageSquare className="w-4 h-4 mr-3" />
                                                                                    WhatsApp
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => handleExport('email', file)}
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
                                        <col className="w-[50%]" />
                                        <col className="w-[50%]" />
                                    </colgroup>
                                    <tfoot>
                                        <tr>
                                            <td className="text-right p-4 font-bold text-gray-800 align-middle" colSpan="6">
                                                Total File Index Records: {fileData.length}
                                            </td>
                                            <td className="p-4 align-middle" colSpan="2">
                                                <div className="flex gap-2 justify-end">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                                        GST: {fileData.filter(f => f.gst).length}
                                                    </span>
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                                        Audit: {fileData.filter(f => f.audit).length}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Modal */}
            <ModalWrapper
                isOpen={showCreateModal}
                onClose={() => {
                    setShowCreateModal(false);
                    setCreateForm({
                        username: '',
                        gst: '',
                        audit: '',
                        income_tax: '',
                        other: ''
                    });
                }}
                title="Create File Index"
                size="max-w-2xl"
            >
                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleCreateSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    View User <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={createForm.username}
                                    onChange={(e) => handleCreateChange('username', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none"
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    GST
                                </label>
                                <input
                                    type="text"
                                    value={createForm.gst}
                                    onChange={(e) => handleCreateChange('gst', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none"
                                    placeholder="GST file no"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Audit
                                </label>
                                <input
                                    type="text"
                                    value={createForm.audit}
                                    onChange={(e) => handleCreateChange('audit', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none"
                                    placeholder="Audit file no"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Income Tax
                                </label>
                                <input
                                    type="text"
                                    value={createForm.income_tax}
                                    onChange={(e) => handleCreateChange('income_tax', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none"
                                    placeholder="Income Tax file no"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Other
                                </label>
                                <input
                                    type="text"
                                    value={createForm.other}
                                    onChange={(e) => handleCreateChange('other', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none"
                                    placeholder="Other file no"
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
                                    gst: '',
                                    audit: '',
                                    income_tax: '',
                                    other: ''
                                });
                            }}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            type="submit"
                            onClick={handleCreateSubmit}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Submit
                        </motion.button>
                    </div>
                </div>
            </ModalWrapper>

            {/* Edit Modal */}
            <ModalWrapper
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedFile(null);
                }}
                title="Update File Index"
                size="max-w-2xl"
            >
                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleEditSubmit}>
                        <input type="hidden" name="index_id" value={editForm.index_id} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    View User
                                </label>
                                <input
                                    type="text"className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 outline-none"
                                    disabled
                                    readOnly
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    GST
                                </label>
                                <input
                                    type="text"
                                    value={editForm.gst}
                                    onChange={(e) => handleEditChange('gst', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none"
                                    placeholder="GST file no"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Audit
                                </label>
                                <input
                                    type="text"
                                    value={editForm.audit}
                                    onChange={(e) => handleEditChange('audit', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none"
                                    placeholder="Audit file no"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Income Tax
                                </label>
                                <input
                                    type="text"
                                    value={editForm.income_tax}
                                    onChange={(e) => handleEditChange('income_tax', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none"
                                    placeholder="Income Tax file no"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Other
                                </label>
                                <input
                                    type="text"
                                    value={editForm.other}
                                    onChange={(e) => handleEditChange('other', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none"
                                    placeholder="Other file no"
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
                                setSelectedFile(null);
                            }}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            type="submit"
                            onClick={handleEditSubmit}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Submit
                        </motion.button>
                    </div>
                </div>
            </ModalWrapper>
        </div>
    );
};

export default ViewFileIndex;