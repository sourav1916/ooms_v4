import React, { useState, useEffect } from 'react';
import {
    FiSearch,
    FiSettings,
    FiMoreVertical,
    FiEye,
    FiEdit,
    FiUser,
    FiBriefcase,
    FiKey,
    FiCheckSquare,
    FiFileText,
    FiFile,
    FiCheck,
    FiX,
    FiSend
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Header, Sidebar } from '../../components/header';
import DateFilter from '../../components/DateFilter';

const ViewInactiveClients = () => {
    // Header/Sidebar states
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(() => {
        const saved = localStorage.getItem('sidebarMinimized');
        return saved ? JSON.parse(saved) : false;
    });

    // Main states
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState('');
    const [showFirmModal, setShowFirmModal] = useState(false);
    const [selectedFirm, setSelectedFirm] = useState(null);
    const [selectedClients, setSelectedClients] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [showActionDiv, setShowActionDiv] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

    // Mock Inactive Clients data with dates
    const mockClientsData = [
        {
            username: 'client001',
            name: 'Rajesh Kumar',
            guardian_name: 'Suresh Kumar',
            mobile: '+91 9876543210',
            balance: -2500.50,
            status: 'inactive',
            created_date: '2024-01-15',
            last_active: '2024-01-20',
            firm_list: [
                {
                    firm_id: 'firm001',
                    firm_name: 'RK Enterprises',
                    pan: 'ABCDE1234F',
                    file_no: 'F001'
                },
                {
                    firm_id: 'firm002',
                    firm_name: 'RK Trading Co.',
                    pan: 'FGHIJ5678K',
                    file_no: 'F002'
                }
            ]
        },
        {
            username: 'client002',
            name: 'Priya Sharma',
            guardian_name: 'Ramesh Sharma',
            mobile: '+91 9876543211',
            balance: 1500.00,
            status: 'inactive',
            created_date: '2024-01-10',
            last_active: '2024-01-18',
            firm_list: [
                {
                    firm_id: 'firm003',
                    firm_name: 'PS Fashion House',
                    pan: 'KLMNO9012P',
                    file_no: 'F003'
                }
            ]
        },
        {
            username: 'client003',
            name: 'Amit Patel',
            guardian_name: 'Dinesh Patel',
            mobile: '+91 9876543212',
            balance: -5000.75,
            status: 'inactive',
            created_date: '2024-01-05',
            last_active: '2024-01-12',
            firm_list: [
                {
                    firm_id: 'firm004',
                    firm_name: 'AP Manufacturing',
                    pan: 'QRSTU3456V',
                    file_no: 'F004'
                },
                {
                    firm_id: 'firm005',
                    firm_name: 'AP Exports',
                    pan: 'WXYZA7890B',
                    file_no: 'F005'
                }
            ]
        },
        {
            username: 'client004',
            name: 'Sneha Gupta',
            guardian_name: 'Anil Gupta',
            mobile: '+91 9876543213',
            balance: 0.00,
            status: 'inactive',
            created_date: '2024-01-20',
            last_active: '2024-01-25',
            firm_list: [
                {
                    firm_id: 'firm006',
                    firm_name: 'SG Consultancy',
                    pan: 'CDEFG1234H',
                    file_no: 'F006'
                }
            ]
        },
        {
            username: 'client005',
            name: 'Vikram Singh',
            guardian_name: 'Rajendra Singh',
            mobile: '+91 9876543214',
            balance: -12000.25,
            status: 'inactive',
            created_date: '2024-01-18',
            last_active: '2024-01-22',
            firm_list: [
                {
                    firm_id: 'firm007',
                    firm_name: 'VS Constructions',
                    pan: 'HIJKL5678M',
                    file_no: 'F007'
                },
                {
                    firm_id: 'firm008',
                    firm_name: 'VS Real Estate',
                    pan: 'NOPQR9012S',
                    file_no: 'F008'
                }
            ]
        },
        {
            username: 'client006',
            name: 'Anjali Mehta',
            guardian_name: 'Sanjay Mehta',
            mobile: '+91 9876543215',
            balance: -3500.00,
            status: 'inactive',
            created_date: '2024-01-12',
            last_active: '2024-01-19',
            firm_list: [
                {
                    firm_id: 'firm009',
                    firm_name: 'AM Textiles',
                    pan: 'STUVW1234X',
                    file_no: 'F009'
                }
            ]
        },
        {
            username: 'client007',
            name: 'Rahul Verma',
            guardian_name: 'Amit Verma',
            mobile: '+91 9876543216',
            balance: 800.00,
            status: 'inactive',
            created_date: '2024-01-08',
            last_active: '2024-01-15',
            firm_list: [
                {
                    firm_id: 'firm010',
                    firm_name: 'RV Electronics',
                    pan: 'YZABC5678D',
                    file_no: 'F010'
                }
            ]
        },
        {
            username: 'client008',
            name: 'Neha Reddy',
            guardian_name: 'Kumar Reddy',
            mobile: '+91 9876543217',
            balance: -7500.50,
            status: 'inactive',
            created_date: '2024-01-25',
            last_active: '2024-01-30',
            firm_list: [
                {
                    firm_id: 'firm011',
                    firm_name: 'NR Foods',
                    pan: 'EFGHI9012J',
                    file_no: 'F011'
                }
            ]
        }
    ];

    // Mock Firm Data
    const mockFirmData = {
        firm001: {
            firm_id: 'firm001',
            firm_name: 'RK Enterprises',
            pan: 'ABCDE1234F',
            gst: '07ABCDE1234F1Z5',
            vat: 'VAT001234',
            cin: 'U74999DL2019PTC123456',
            tin: 'TIN001234',
            file_no: 'F001',
            tan: 'BLRE12345F',
            firm_type: 'proprietorship',
            username: 'client001'
        },
        firm002: {
            firm_id: 'firm002',
            firm_name: 'RK Trading Co.',
            pan: 'FGHIJ5678K',
            gst: '07FGHIJ5678K1Z5',
            vat: 'VAT005678',
            cin: 'U74999DL2020PTC234567',
            tin: 'TIN005678',
            file_no: 'F002',
            tan: 'BLRE23456G',
            firm_type: 'partnership',
            username: 'client001'
        }
    };

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

    // Initial data load
    useEffect(() => {
        fetchClientsData();
    }, []);

    // Filter clients when search term or date range changes
    useEffect(() => {
        filterClients();
    }, [searchTerm, dateRange, clients]);

    // Update action div visibility
    useEffect(() => {
        setShowActionDiv(selectedClients.length > 0);
    }, [selectedClients]);

    // Update select all state
    useEffect(() => {
        if (filteredClients.length > 0) {
            setSelectAll(selectedClients.length === filteredClients.length);
        }
    }, [selectedClients, filteredClients]);

    // Simulate API call to fetch clients data
    const fetchClientsData = async () => {
        setLoading(true);

        // Simulate API delay
        setTimeout(() => {
            setClients(mockClientsData);
            setFilteredClients(mockClientsData);
            setLoading(false);
        }, 1000);
    };

    // Filter clients based on search term and date range
    const filterClients = () => {
        let filtered = clients;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(client =>
                client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.mobile.includes(searchTerm) ||
                client.guardian_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.firm_list.some(firm =>
                    firm.firm_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    firm.pan.includes(searchTerm) ||
                    firm.file_no.includes(searchTerm)
                )
            );
        }

        // Filter by date range
        if (dateRange) {
            const [from, to] = dateRange.split(' - ');
            const fromDate = new Date(from.split('/').reverse().join('-'));
            const toDate = new Date(to.split('/').reverse().join('-'));
            
            filtered = filtered.filter(client => {
                const clientDate = new Date(client.created_date);
                return clientDate >= fromDate && clientDate <= toDate;
            });
        }

        setFilteredClients(filtered);
    };

    // Handle search
    const handleSearch = () => {
        filterClients();
    };

    // Handle firm click
    const handleFirmClick = (firmId) => {
        // Simulate API call to fetch firm data
        const firmData = mockFirmData[firmId];
        if (firmData) {
            setSelectedFirm(firmData);
            setShowFirmModal(true);
        }
    };

    // Handle client selection
    const handleClientSelect = (username, isSelected) => {
        if (isSelected) {
            setSelectedClients(prev => [...prev, username]);
        } else {
            setSelectedClients(prev => prev.filter(client => client !== username));
        }
    };

    // Handle select all
    const handleSelectAll = (isSelected) => {
        if (isSelected) {
            setSelectedClients(filteredClients.map(client => client.username));
        } else {
            setSelectedClients([]);
        }
        setSelectAll(isSelected);
    };

    // Handle payment reminder
    const handlePaymentReminder = () => {
        if (selectedClients.length === 0) return;

        if (window.confirm('Are you sure? This will send payment reminder message to selected clients')) {
            // Simulate API call
            console.log('Sending payment reminder to:', selectedClients);
            // In a real app, you would make an API call here

            // Clear selection after sending
            setSelectedClients([]);
            setSelectAll(false);
            alert('Payment reminders sent successfully!');
        }
    };

    // Toggle dropdown
    const toggleDropdown = (username) => {
        setActiveDropdown(activeDropdown === username ? null : username);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown-container')) {
                setActiveDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle date filter change
    const handleDateFilterChange = (filter) => {
        console.log('Selected filter:', filter);
        if (filter.range) {
            setDateRange(filter.range);
        }
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    // Format firm type
    const formatFirmType = (type) => {
        return type ? type.toUpperCase() : '---';
    };

    // Calculate summary
    const summary = {
        totalClients: filteredClients.length,
        clientsWithBalance: filteredClients.filter(client => client.balance < 0).length,
        totalBalance: filteredClients.reduce((sum, client) => sum + client.balance, 0),
        totalFirms: filteredClients.reduce((sum, client) => sum + client.firm_list.length, 0)
    };

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
            <td className="p-4">
                <div className="h-4 bg-gray-200 rounded w-8"></div>
            </td>
            <td className="p-4">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
            </td>
            <td className="p-4">
                <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
            </td>
            <td className="p-4 text-center">
                <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
            </td>
            <td className="p-4 text-center">
                <div className="h-6 bg-gray-200 rounded w-16 mx-auto"></div>
            </td>
            <td className="p-4">
                <div className="h-6 bg-gray-200 rounded w-8 mx-auto"></div>
            </td>
            <td className="p-4 text-center">
                <div className="h-5 bg-gray-200 rounded w-5 mx-auto"></div>
            </td>
        </tr>
    );

    // Professional Modal Wrapper Component
    const ModalWrapper = ({ isOpen, onClose, title, children, size = 'max-w-md' }) => {
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
                                ×
                            </button>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        );
    };

    // Show skeleton while loading
    if (loading && clients.length === 0) {
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
                                        Inactive Clients
                                    </h5>
                                    <p className="text-gray-500 text-xs mt-1">
                                        Manage inactive client accounts and send reminders
                                    </p>
                                </div>

                                <div className="flex flex-col lg:flex-row gap-3 w-full lg:w-auto">
                                    {/* Search Box */}
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                            placeholder="Search clients..."
                                            className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all w-full lg:w-64"
                                        />
                                        <FiSearch className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    </div>

                                    {/* Date Filter Component */}
                                    <DateFilter onChange={handleDateFilterChange} />
                                </div>
                            </div>
                        </div>

                        {/* Table Container with Fixed Header and Footer */}
                        <div className="flex-1 flex flex-col overflow-hidden">
                            {/* Table Header - Fixed */}
                            <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr>
                                            <th className="text-left p-4 font-semibold text-gray-700">#</th>
                                            <th className="text-left p-4 font-semibold text-gray-700">Client Details</th>
                                            <th className="text-left p-4 font-semibold text-gray-700">Firms</th>
                                            <th className="text-center p-4 font-semibold text-gray-700">Mobile</th>
                                            <th className="text-center p-4 font-semibold text-gray-700">Balance</th>
                                            <th className="text-center p-4 font-semibold text-gray-700">Actions</th>
                                            <th className="text-center p-4 font-semibold text-gray-700">
                                                <input
                                                    type="checkbox"
                                                    checked={selectAll}
                                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                />
                                            </th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>

                            {/* Scrollable Table Body */}
                            <div className="flex-1 overflow-y-auto">
                                <table className="w-full text-sm">
                                    <tbody className="bg-white">
                                        {loading ? (
                                            // Skeleton Loaders
                                            Array.from({ length: 8 }).map((_, index) => (
                                                <SkeletonRow key={index} />
                                            ))
                                        ) : filteredClients.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="text-center py-8 text-gray-500">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <FiUser className="w-12 h-12 text-gray-300 mb-3" />
                                                        <p className="text-gray-500">
                                                            {clients.length === 0 ? 'No inactive clients found' : 'No clients match your search criteria'}
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredClients.map((client, index) => {
                                                const isSelected = selectedClients.includes(client.username);
                                                const isDropdownOpen = activeDropdown === client.username;

                                                return (
                                                    <tr
                                                        key={client.username}
                                                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                                                    >
                                                        <td className="p-4 text-gray-600 font-medium">
                                                            {index + 1}
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="text-gray-800 font-medium">
                                                                <a
                                                                    href={`/view-client-profile?username=${client.username}`}
                                                                    className="text-indigo-600 hover:text-indigo-800 transition-colors"
                                                                >
                                                                    {client.name}
                                                                </a>
                                                            </div>
                                                            <div className="text-gray-500 text-sm mt-1">
                                                                Guardian: {client.guardian_name}
                                                            </div>
                                                            <div className="text-gray-500 text-xs mt-1">
                                                                Created: {formatDate(client.created_date)}
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="space-y-2">
                                                                {client.firm_list.map((firm, firmIndex) => (
                                                                    <div key={firm.firm_id} className="flex items-center justify-between text-xs">
                                                                        <motion.button
                                                                            onClick={() => handleFirmClick(firm.firm_id)}
                                                                            className="text-green-600 hover:text-green-800 font-medium transition-colors text-left flex-1"
                                                                            whileHover={{ scale: 1.02 }}
                                                                            whileTap={{ scale: 0.98 }}
                                                                        >
                                                                            {firm.firm_name}
                                                                        </motion.button>
                                                                        <div className="flex gap-2 text-gray-500">
                                                                            <span>{firm.pan}</span>
                                                                            <span>•</span>
                                                                            <span>{firm.file_no}</span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-center text-gray-600">
                                                            {client.mobile}
                                                        </td>
                                                        <td className="p-4 text-center">
                                                            <a
                                                                href={`/view-client-profile-ledger?username=${client.username}`}
                                                                className={`inline-flex items-center justify-center px-3 py-1.5 text-sm font-semibold rounded-lg min-w-[80px] ${
                                                                    client.balance < 0
                                                                        ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                                                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                                                                } transition-colors`}
                                                            >
                                                                ₹{formatCurrency(Math.abs(client.balance))}
                                                            </a>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="dropdown-container relative flex justify-center">
                                                                <motion.button
                                                                    className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group-hover:bg-gray-200"
                                                                    onClick={() => toggleDropdown(client.username)}
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                >
                                                                    <FiMoreVertical className="w-4 h-4" />
                                                                </motion.button>
                                                                {isDropdownOpen && (
                                                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                                                                        <div className="py-1">
                                                                            <a
                                                                                href={`/view-client-profile?username=${client.username}`}
                                                                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                                                                            >
                                                                                <FiUser className="w-4 h-4 mr-3" />
                                                                                Profile
                                                                            </a>
                                                                            <a
                                                                                href={`/view-client-profile-firms?username=${client.username}`}
                                                                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                                                                            >
                                                                                <FiBriefcase className="w-4 h-4 mr-3" />
                                                                                Firms
                                                                            </a>
                                                                            <a
                                                                                href={`/view-client-profile-ledger?username=${client.username}`}
                                                                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                                                                            >
                                                                                <FiFileText className="w-4 h-4 mr-3" />
                                                                                Ledger
                                                                            </a>
                                                                            <a
                                                                                href={`/view-client-profile-task?username=${client.username}`}
                                                                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                                                                            >
                                                                                <FiCheckSquare className="w-4 h-4 mr-3" />
                                                                                Tasks
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={isSelected}
                                                                onChange={(e) => handleClientSelect(client.username, e.target.checked)}
                                                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                            />
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
                                    <tfoot>
                                        <tr>
                                            <td className="text-left p-4 font-bold text-gray-800" colSpan="2">
                                                Summary
                                            </td>
                                            <td className="text-left p-4">
                                                <span className="inline-flex items-center justify-center bg-indigo-100 text-indigo-800 text-sm font-bold px-3 py-1.5 rounded-lg">
                                                    {summary.totalFirms} Firms
                                                </span>
                                            </td>
                                            <td className="text-center p-4">
                                                <span className="inline-flex items-center justify-center bg-purple-100 text-purple-800 text-sm font-bold px-3 py-1.5 rounded-lg">
                                                    {summary.totalClients} Clients
                                                </span>
                                            </td>
                                            <td className="text-center p-4">
                                                <span className="inline-flex items-center justify-center bg-red-100 text-red-800 text-sm font-bold px-3 py-1.5 rounded-lg min-w-[80px]">
                                                    ₹{formatCurrency(Math.abs(summary.totalBalance))}
                                                </span>
                                            </td>
                                            <td className="text-center p-4">
                                                <span className="inline-flex items-center justify-center bg-orange-100 text-orange-800 text-sm font-bold px-3 py-1.5 rounded-lg">
                                                    {summary.clientsWithBalance} Due
                                                </span>
                                            </td>
                                            <td className="p-4"></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                        {/* Action Div */}
                        {showActionDiv && (
                            <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 p-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-semibold text-gray-700">
                                            {selectedClients.length} client(s) selected
                                        </span>
                                        <button
                                            onClick={() => handleSelectAll(false)}
                                            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                                        >
                                            Clear Selection
                                        </button>
                                    </div>
                                    <motion.button
                                        onClick={handlePaymentReminder}
                                        className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <FiSend className="w-4 h-4" />
                                        Send Payment Reminder
                                    </motion.button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Firm Info Modal */}
            <ModalWrapper
                isOpen={showFirmModal}
                onClose={() => {
                    setShowFirmModal(false);
                    setSelectedFirm(null);
                }}
                title="Firm Information"
                size="max-w-md"
            >
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-sm font-medium text-gray-700">Firm Name:</div>
                            <div className="text-sm text-gray-900 font-semibold">{selectedFirm?.firm_name}</div>
                            
                            <div className="text-sm font-medium text-gray-700">PAN Number:</div>
                            <div className="text-sm text-gray-900">{selectedFirm?.pan}</div>
                            
                            <div className="text-sm font-medium text-gray-700">GST:</div>
                            <div className="text-sm text-gray-900">{selectedFirm?.gst || '---'}</div>
                            
                            <div className="text-sm font-medium text-gray-700">TAN:</div>
                            <div className="text-sm text-gray-900">{selectedFirm?.tan || '---'}</div>
                            
                            <div className="text-sm font-medium text-gray-700">File No:</div>
                            <div className="text-sm text-gray-900">{selectedFirm?.file_no}</div>
                            
                            <div className="text-sm font-medium text-gray-700">Firm Type:</div>
                            <div className="text-sm text-gray-900">{formatFirmType(selectedFirm?.firm_type)}</div>
                        </div>
                    </div>
                </div>

                <div className="flex-shrink-0 border-t border-gray-200 bg-white p-6 rounded-b-lg shadow-sm">
                    <div className="flex gap-3 justify-end">
                        <a
                            href={`/view-firm?username=${selectedFirm?.username}&firm_id=${selectedFirm?.firm_id}`}
                            className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                            <FiEye className="w-4 h-4" />
                            View Firm
                        </a>
                        <a
                            href={`/edit-firm?username=${selectedFirm?.username}&firm_id=${selectedFirm?.firm_id}`}
                            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                            <FiEdit className="w-4 h-4" />
                            Edit Firm
                        </a>
                    </div>
                </div>
            </ModalWrapper>
        </div>
    );
};

export default ViewInactiveClients;