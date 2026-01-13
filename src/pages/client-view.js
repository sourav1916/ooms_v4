import React, { useState, useEffect } from 'react';
import { Sidebar, Header } from '../components/header';
import { useNavigate } from 'react-router-dom';
import {
    FiUsers,
    FiDollarSign,
    FiUserCheck,
    FiUserPlus,
    FiFileText,
    FiPlus,
    FiSearch,
    FiX,
    FiUser,
    FiLoader,
    FiCheckCircle,
    FiTrash2,
    FiClock,
    FiMoreVertical,
    FiInfo,
    FiEdit,
    FiEye,
    FiSettings,
    FiGrid,
    FiMail,
    FiPhone,
    FiTrendingUp,
    FiTrendingDown,
    FiMessageSquare,
    FiPrinter,
    FiDownload
} from 'react-icons/fi';
import { PiExportBold } from "react-icons/pi";
import { PiFilePdfDuotone, PiMicrosoftExcelLogoDuotone } from "react-icons/pi";
import { AiOutlineMail } from "react-icons/ai";
import { FaWhatsapp } from "react-icons/fa6";
import DeleteConfirmationModal from '../components/delete-confirmation';
import { motion, AnimatePresence } from 'framer-motion';

const ViewClients = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(() => {
        const saved = localStorage.getItem('sidebarMinimized');
        return saved ? JSON.parse(saved) : false;
    });
    const [activePage, setActivePage] = useState('clients');
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [settingsModalOpen, setSettingsModalOpen] = useState(false);
    const [columnConfig, setColumnConfig] = useState([]);
    const [selectedClients, setSelectedClients] = useState(new Set());
    const [selectAll, setSelectAll] = useState(false);
    const [activeRowDropdown, setActiveRowDropdown] = useState(null);
    const [showExportDropdown, setShowExportDropdown] = useState(false);
    const [exportModal, setExportModal] = useState({ open: false, type: '', data: null });
    const navigate = useNavigate();
    const [deleteModal, SetDeleteModal] = useState(false);
    const [deleteOtp, SetDeleteOtp] = useState('');

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

    // All available data fields from clients
    const availableFields = [
        { id: 'id', label: 'ID', type: 'text' },
        { id: 'username', label: 'Username', type: 'text' },
        { id: 'name', label: 'Client Name', type: 'text' },
        { id: 'guardian_name', label: 'Guardian Name', type: 'text' },
        { id: 'mobile', label: 'Mobile', type: 'text' },
        { id: 'balance', label: 'Balance', type: 'currency' },
        { id: 'firm_count', label: 'Firm Count', type: 'number' },
        { id: 'firm_list', label: 'Firms', type: 'array' },
        { id: 'pan', label: 'PAN', type: 'text' },
        { id: 'file_no', label: 'File No', type: 'text' },
        { id: 'status', label: 'Status', type: 'status' },
        { id: 'actions', label: 'Actions', type: 'actions' }
    ];

    // Default column configuration - SEPARATED STATUS AND ACTIONS
    const defaultColumnConfig = [
        {
            id: 1,
            name: 'Client Info',
            items: [
                { id: 'name', label: 'Client Name' },
                { id: 'guardian_name', label: 'Guardian Name' },
                { id: 'username', label: 'Username' }
            ]
        },
        {
            id: 2,
            name: 'Contact',
            items: [
                { id: 'mobile', label: 'Mobile' }
            ]
        },
        {
            id: 3,
            name: 'Firms',
            items: [
                { id: 'firm_list', label: 'Firm Details' },
                { id: 'firm_count', label: 'Total Firms' }
            ]
        },
        {
            id: 4,
            name: 'Financial',
            items: [
                { id: 'balance', label: 'Balance' }
            ]
        },
        {
            id: 5,
            name: 'Status',
            items: [
                { id: 'status', label: 'Status' }
            ],
            fixed: true
        },
        {
            id: 6,
            name: 'Actions',
            items: [
                { id: 'actions', label: 'Actions' }
            ],
            fixed: true
        }
    ];

    // Initialize column config
    useEffect(() => {
        const savedConfig = localStorage.getItem('clientColumnConfig');
        if (savedConfig) {
            setColumnConfig(JSON.parse(savedConfig));
        } else {
            setColumnConfig(defaultColumnConfig);
        }
    }, []);

    // Save column config
    const saveColumnConfig = (config) => {
        setColumnConfig(config);
        localStorage.setItem('clientColumnConfig', JSON.stringify(config));
    };

    // Client data
    const [clients, setClients] = useState([
        {
            id: '1',
            username: 'client001',
            name: 'John Doe',
            guardian_name: 'Robert Doe',
            mobile: '9876543210',
            balance: -5000,
            status: 'ACTIVE',
            firm_list: [
                { firm_name: 'ABC Corp', pan: 'ABCDE1234F', file_no: 'FN001' },
                { firm_name: 'Doe Enterprises', pan: 'DOEAB5678G', file_no: 'FN002' }
            ]
        },
        {
            id: '2',
            username: 'client002',
            name: 'Jane Smith',
            guardian_name: 'William Smith',
            mobile: '9876543211',
            balance: 15000,
            status: 'ACTIVE',
            firm_list: [
                { firm_name: 'XYZ Solutions', pan: 'XYZAB9012H', file_no: 'FN003' }
            ]
        },
        {
            id: '3',
            username: 'client003',
            name: 'Mike Johnson',
            guardian_name: 'Thomas Johnson',
            mobile: '9876543212',
            balance: -2500,
            status: 'INACTIVE',
            firm_list: [
                { firm_name: 'Global Tech', pan: 'GLOTI3456J', file_no: 'FN004' }
            ]
        },
        {
            id: '4',
            username: 'client004',
            name: 'Sarah Wilson',
            guardian_name: 'James Wilson',
            mobile: '9876543213',
            balance: 7500,
            status: 'ACTIVE',
            firm_list: [
                { firm_name: 'Wilson & Co', pan: 'WILS5678K', file_no: 'FN005' },
                { firm_name: 'Tech Innovators', pan: 'TECH9012L', file_no: 'FN006' }
            ]
        },
        {
            id: '5',
            username: 'client005',
            name: 'David Brown',
            guardian_name: 'Richard Brown',
            mobile: '9876543214',
            balance: -12000,
            status: 'PENDING',
            firm_list: [
                { firm_name: 'Brown Industries', pan: 'BRWN3456M', file_no: 'FN007' }
            ]
        }
    ]);

    // Stats data
    const [clientStats] = useState({
        total: 156,
        active: 142,
        inactive: 14,
        withBalance: 89
    });

    const [statusOptions] = useState([
        { value: 'ACTIVE', name: 'Active' },
        { value: 'INACTIVE', name: 'Inactive' },
        { value: 'PENDING', name: 'Pending' }
    ]);

    const [groupOptions] = useState([
        { value: 'gst', name: 'GST' },
        { value: 'itr', name: 'ITR' },
        { value: 'company', name: 'Company' }
    ]);

    // Handle export
    const handleExport = (type, data = null) => {
        setExportModal({ open: true, type, data });

        // Simulate export process
        setTimeout(() => {
            setExportModal({ open: false, type: '', data: null });
            alert(`${type.toUpperCase()} export completed successfully!`);
        }, 1500);
    };

    // Handle client selection
    const handleClientSelect = (username) => {
        const newSelected = new Set(selectedClients);
        if (newSelected.has(username)) {
            newSelected.delete(username);
        } else {
            newSelected.add(username);
        }
        setSelectedClients(newSelected);
    };

    // Handle select all
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedClients(new Set());
        } else {
            const allUsernames = new Set(filteredClients.map(client => client.username));
            setSelectedClients(allUsernames);
        }
        setSelectAll(!selectAll);
    };

    // Format balance
    const formatBalance = (balance) => {
        return `₹${Math.abs(balance).toLocaleString()}`;
    };

    // Handle status change
    const handleStatusChange = (clientId, newStatus) => {
        setClients(prev => prev.map(client =>
            client.id === clientId ? { ...client, status: newStatus } : client
        ));
    };

    // Filter clients based on search and filters
    const filteredClients = clients.filter(client => {
        const matchesSearch = searchQuery === '' ||
            client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.mobile.includes(searchQuery) ||
            client.firm_list.some(firm =>
                firm.firm_name.toLowerCase().includes(searchQuery.toLowerCase())
            );

        const matchesStatus = selectedStatus === '' || client.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    // Toggle row dropdown
    const toggleRowDropdown = (clientId) => {
        setActiveRowDropdown(activeRowDropdown === clientId ? null : clientId);
    };

    // Close all dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown-container')) {
                setActiveRowDropdown(null);
                setShowExportDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Render cell content based on field type
    const renderCellContent = (client, fieldId) => {
        switch (fieldId) {
            case 'name':
                return (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                            <FiUser className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <div className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors text-sm">
                                {client.name}
                            </div>
                            <div className="text-xs text-gray-500 font-medium">
                                @{client.username}
                            </div>
                        </div>
                    </div>
                );
            case 'guardian_name':
                return (
                    <span className="text-gray-700 font-medium text-sm">
                        {client.guardian_name || '-'}
                    </span>
                );
            case 'username':
                return (
                    <span className="text-gray-700 font-medium bg-gray-100 px-2 py-1 rounded text-xs">
                        {client.username}
                    </span>
                );
            case 'mobile':
                return (
                    <div className="flex items-center gap-2 text-gray-700 font-medium text-sm">
                        <FiPhone className="w-3 h-3 text-gray-400" />
                        {client.mobile}
                    </div>
                );
            case 'balance':
                return (
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${client.balance < 0
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-green-50 text-green-700 border border-green-200'
                        }`}>
                        {client.balance < 0 ? (
                            <FiTrendingDown className="w-3 h-3" />
                        ) : (
                            <FiTrendingUp className="w-3 h-3" />
                        )}
                        {formatBalance(client.balance)}
                    </div>
                );
            case 'firm_count':
                return (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                        {client.firm_list.length} {client.firm_list.length === 1 ? 'firm' : 'firms'}
                    </span>
                );
            case 'firm_list':
                return (
                    <div className="space-y-1">
                        {client.firm_list.map((firm, idx) => (
                            <div key={idx} className="bg-gray-50 rounded p-1 border border-gray-200">
                                <div className="font-semibold text-gray-800 text-xs">
                                    {firm.firm_name}
                                </div>
                                <div className="text-xs text-gray-600 flex gap-1 mt-0.5">
                                    <span>PAN: {firm.pan}</span>
                                    <span>•</span>
                                    <span>File: {firm.file_no}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'status':
                return (
                    <select
                        value={client.status}
                        onChange={(e) => handleStatusChange(client.id, e.target.value)}
                        className={`w-full px-3 py-2 text-xs border rounded
                            focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white outline-none transition-all font-medium
                            ${client.status === 'ACTIVE'
                                ? 'border-green-300 text-green-700'
                                : client.status === 'INACTIVE'
                                    ? 'border-red-300 text-red-700'
                                    : 'border-yellow-300 text-yellow-700'
                            }
                        `}
                    >
                        {statusOptions.map((status) => (
                            <option key={status.value} value={status.value}>
                                {status.name}
                            </option>
                        ))}
                    </select>
                );
            case 'actions':
                return (
                    <div className="flex gap-2">
                        <motion.button
                            className="flex items-center justify-center w-8 h-8 rounded bg-blue-100"
                            onClick={() => navigate(`/client/profile`)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <FiEye className="w-4 h-4 text-blue-600" />
                        </motion.button>

                        <motion.button
                            className="flex items-center justify-center w-8 h-8 rounded bg-green-100"
                            onClick={() => navigate(`/client/edit/${client.id}`)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <FiEdit className="w-4 h-4 text-green-600" />
                        </motion.button>

                        <motion.button
                            className="flex items-center justify-center w-8 h-8 rounded bg-purple-100"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <FiMessageSquare className="w-4 h-4 text-purple-600" />
                        </motion.button>

                        <motion.button
                            onClick={() => SetDeleteModal(true)}
                            className="flex items-center justify-center w-8 h-8 rounded bg-red-100 text-red-600"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <FiTrash2 className="w-4 h-4" />
                        </motion.button>
                    </div>
                );
            default:
                return (
                    <span className="text-gray-700 font-medium text-sm">
                        {client[fieldId] || '-'}
                    </span>
                );
        }
    };

    // Helper functions for column management
    const addItemToColumn = (columnIndex, fieldId) => {
        const field = availableFields.find(f => f.id === fieldId);
        if (!field) return;

        const newConfig = [...columnConfig];
        if (newConfig[columnIndex].items.length < 5) {
            newConfig[columnIndex].items.push({
                id: field.id,
                label: field.label
            });
            saveColumnConfig(newConfig);
        }
    };

    const removeItemFromColumn = (columnIndex, itemIndex) => {
        const newConfig = [...columnConfig];
        newConfig[columnIndex].items.splice(itemIndex, 1);
        saveColumnConfig(newConfig);
    };

    // Skeleton loader component
    const SkeletonRow = () => (
        <div className="flex items-center border-b border-gray-100 animate-pulse">
            <div className="w-12 p-4">
                <div className="h-4 bg-gray-200 rounded w-4"></div>
            </div>
            {columnConfig.map((column, index) => (
                <div key={index} className="flex-1 p-4">
                    <div className="space-y-2">
                        {column.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="min-h-[1.5rem] flex items-center">
                                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    // Settings Modal Component
    const SettingsModal = () => (
        <AnimatePresence>
            {settingsModalOpen && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSettingsModalOpen(false)}
                >
                    <motion.div
                        className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold">Table Column Settings</h2>
                                <p className="text-blue-100 text-sm mt-1">Customize your client table view</p>
                            </div>
                            <motion.button
                                onClick={() => setSettingsModalOpen(false)}
                                className="text-white hover:text-blue-200 transition-colors duration-200 p-1 rounded-lg hover:bg-blue-500"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <FiX className="w-6 h-6" />
                            </motion.button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto max-h-[70vh]">
                            <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 mb-6">
                                {columnConfig.map((column, columnIndex) => (
                                    <motion.div
                                        key={column.id}
                                        className={`border-2 rounded-xl p-4 transition-all duration-200 ${column.fixed
                                            ? 'bg-blue-50 border-blue-300 shadow-sm'
                                            : 'bg-white border-gray-200 hover:shadow-md hover:border-gray-300'
                                            }`}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <h3 className="font-bold text-gray-800 text-sm mb-3 flex items-center justify-between">
                                            <span className="flex items-center gap-2">
                                                {column.name}
                                                {column.fixed && (
                                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                                        Fixed
                                                    </span>
                                                )}
                                            </span>
                                        </h3>

                                        <div className="space-y-2 mb-3">
                                            {column.items.map((item, itemIndex) => (
                                                <motion.div
                                                    key={`${column.id}-${item.id}`}
                                                    className="flex items-center justify-between bg-white border border-gray-200 px-3 py-2 rounded-lg text-sm transition-all duration-200 hover:bg-gray-50 hover:border-gray-300"
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: itemIndex * 0.05 }}
                                                >
                                                    <span className="font-medium text-gray-700">{item.label}</span>
                                                    {!column.fixed && (
                                                        <motion.button
                                                            onClick={() => removeItemFromColumn(columnIndex, itemIndex)}
                                                            className="text-red-500 hover:text-red-700 transition-colors duration-200 p-1 rounded hover:bg-red-50"
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                        >
                                                            <FiX className="w-3 h-3" />
                                                        </motion.button>
                                                    )}
                                                </motion.div>
                                            ))}
                                        </div>

                                        {!column.fixed && column.items.length < 5 && (
                                            <select
                                                value=""
                                                onChange={(e) => {
                                                    if (e.target.value) {
                                                        addItemToColumn(columnIndex, e.target.value);
                                                        e.target.value = '';
                                                    }
                                                }}
                                                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                                            >
                                                <option value="">Add field...</option>
                                                {availableFields
                                                    .filter(field =>
                                                        !columnConfig.some(col =>
                                                            col.items.some(item => item.id === field.id)
                                                        )
                                                    )
                                                    .map(field => (
                                                        <option key={field.id} value={field.id}>
                                                            {field.label}
                                                        </option>
                                                    ))}
                                            </select>
                                        )}
                                    </motion.div>
                                ))}
                            </div>

                            {/* Available Fields */}
                            <div className="border-t pt-6">
                                <h3 className="font-bold text-gray-800 text-sm mb-4 flex items-center gap-2">
                                    <FiGrid className="w-4 h-4 text-blue-600" />
                                    Available Fields
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                    {availableFields
                                        .filter(field =>
                                            !columnConfig.some(col =>
                                                col.items.some(item => item.id === field.id)
                                            )
                                        )
                                        .map(field => (
                                            <motion.div
                                                key={field.id}
                                                className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:shadow-md hover:border-gray-400 hover:from-white hover:to-gray-50 cursor-pointer text-center"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                {field.label}
                                            </motion.div>
                                        ))}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="border-t px-6 py-4 bg-gray-50 flex justify-between items-center">
                            <motion.button
                                onClick={() => {
                                    saveColumnConfig(defaultColumnConfig);
                                    setSettingsModalOpen(false);
                                }}
                                className="px-6 py-3 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-200 transition-all duration-200 hover:shadow-sm text-gray-700"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Reset to Default
                            </motion.button>
                            <div className="space-x-3">
                                <motion.button
                                    onClick={() => setSettingsModalOpen(false)}
                                    className="px-6 py-3 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-200 transition-all duration-200 hover:shadow-sm text-gray-700"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    onClick={() => setSettingsModalOpen(false)}
                                    className="px-6 py-3 text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:shadow-md shadow-sm"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Save Changes
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

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
                <div className="h-full flex flex-col">
                    {/* Main Card - Full height with scrolling */}
                    <motion.div 
                        className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full mx-4 sm:mx-6 md:mx-8 my-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Card Header */}
                        <div className="border-b border-gray-200 px-6 py-4">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                <div>
                                    <h5 className="text-xl font-bold text-gray-800 mb-1">
                                        Client Management
                                    </h5>
                                    <p className="text-gray-500 text-xs">
                                        {filteredClients.length} of {clients.length} clients shown
                                    </p>
                                </div>

                                <div className="flex flex-col lg:flex-row gap-3 w-full lg:w-auto">
                                    {/* Search Input */}
                                    <div className="flex-1 relative min-w-[300px]">
                                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="Search by name, mobile, or firm..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-sm"
                                        />
                                    </div>

                                    <div className="flex gap-2">
                                        {/* Status Filter */}
                                        <select
                                            value={selectedStatus}
                                            onChange={(e) => setSelectedStatus(e.target.value)}
                                            className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-sm"
                                        >
                                            <option value="">All Status</option>
                                            {statusOptions.map(status => (
                                                <option key={status.value} value={status.value}>
                                                    {status.name}
                                                </option>
                                            ))}
                                        </select>

                                        {/* Group Filter */}
                                        <select
                                            value={selectedService}
                                            onChange={(e) => setSelectedService(e.target.value)}
                                            className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-sm"
                                        >
                                            <option value="">Group</option>
                                            {groupOptions.map(service => (
                                                <option key={service.value} value={service.value}>
                                                    {service.name}
                                                </option>
                                            ))}
                                        </select>

                                        {/* Export Dropdown */}
                                        <div className="dropdown-container relative">
                                            <motion.button
                                                onClick={() => setShowExportDropdown(!showExportDropdown)}
                                                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <PiExportBold className="w-4 h-4" />
                                                Export
                                            </motion.button>

                                            <AnimatePresence>
                                                {showExportDropdown && (
                                                    <motion.div
                                                        className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden"
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                    >
                                                        <div className="py-1">
                                                            <button
                                                                onClick={() => handleExport('pdf')}
                                                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                                                            >
                                                                <PiFilePdfDuotone className="w-4 h-4 mr-3 text-red-500" />
                                                                Export as PDF
                                                            </button>
                                                            <button
                                                                onClick={() => handleExport('excel')}
                                                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                                                            >
                                                                <PiMicrosoftExcelLogoDuotone className="w-4 h-4 mr-3 text-green-500" />
                                                                Export as Excel
                                                            </button>
                                                            <button
                                                                onClick={() => handleExport('whatsapp')}
                                                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                                                            >
                                                                <FaWhatsapp className="w-4 h-4 mr-3 text-green-500" />
                                                                Share via WhatsApp
                                                            </button>
                                                            <button
                                                                onClick={() => handleExport('email')}
                                                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                                                            >
                                                                <AiOutlineMail className="w-4 h-4 mr-3 text-blue-500" />
                                                                Share via Email
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        <motion.button
                                            onClick={() => navigate('/client/create')}
                                            className="px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <FiUserPlus className="w-4 h-4" />
                                            Add Client
                                        </motion.button>

                                        <motion.button
                                            onClick={() => setSettingsModalOpen(true)}
                                            className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 text-gray-700 font-medium flex items-center gap-2 shadow-sm"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <FiSettings className="w-4 h-4" />
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Table Container with Fixed Header and Footer */}
                        <div className="flex-1 flex flex-col overflow-hidden">
                            {/* Table Header - Fixed */}
                            <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                                <div className="flex items-center">
                                    {/* Checkbox Column */}
                                    <div className="w-12 p-4">
                                        <input
                                            type="checkbox"
                                            checked={selectAll}
                                            onChange={handleSelectAll}
                                            className="w-4 h-4 text-blue-600 rounded border-gray-400 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Dynamic Columns */}
                                    {columnConfig.map(column => (
                                        <div
                                            key={column.id}
                                            className="flex-1 p-4 font-semibold text-gray-700 text-sm"
                                        >
                                            {column.name}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Scrollable Table Body */}
                            <div className="flex-1 overflow-y-auto">
                                {loading ? (
                                    // Skeleton Loaders
                                    Array.from({ length: 6 }).map((_, index) => (
                                        <SkeletonRow key={index} />
                                    ))
                                ) : filteredClients.length === 0 ? (
                                    <div className="flex items-center justify-center py-8 text-gray-500">
                                        <div className="text-center">
                                            <FiUsers className="w-12 h-12 text-gray-300 mb-3 mx-auto" />
                                            <p className="text-gray-500">No clients found</p>
                                            <motion.button
                                                onClick={() => navigate('/client/create')}
                                                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Create Your First Client
                                            </motion.button>
                                        </div>
                                    </div>
                                ) : (
                                    filteredClients.map((client, index) => (
                                        <motion.div
                                            key={client.id}
                                            className="flex items-center border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            {/* Checkbox */}
                                            <div className="w-12 p-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedClients.has(client.username)}
                                                    onChange={() => handleClientSelect(client.username)}
                                                    className="w-4 h-4 text-blue-600 rounded border-gray-400 focus:ring-blue-500"
                                                />
                                            </div>

                                            {/* Dynamic Columns */}
                                            {columnConfig.map(column => (
                                                <div key={column.id} className="flex-1 p-4">
                                                    <div className="space-y-2">
                                                        {column.items.map(item => (
                                                            <div key={item.id} className="min-h-[1.5rem] flex items-center">
                                                                {renderCellContent(client, item.id)}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </motion.div>
                                    ))
                                )}
                            </div>

                            {/* Table Footer - Fixed */}
                            <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                                <div className="p-4">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-gray-800 text-sm">
                                            Showing {filteredClients.length} of {clients.length} clients
                                        </span>
                                        <div className="flex gap-2 items-center">
                                            <div className="text-sm text-gray-600 mr-4">
                                                {selectedClients.size} client(s) selected
                                            </div>
                                            <motion.button
                                                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:from-blue-700 hover:to-blue-800 flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={selectedClients.size === 0}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <FiMail className="w-4 h-4" />
                                                Send Message
                                            </motion.button>
                                            <motion.button
                                                className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:from-green-700 hover:to-green-800 flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={selectedClients.size === 0}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <FiDownload className="w-4 h-4" />
                                                Export Selected
                                            </motion.button>
                                            <motion.button
                                                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:from-purple-700 hover:to-purple-800 flex items-center gap-2 shadow-sm"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <FiPrinter className="w-4 h-4" />
                                                Print All
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Settings Modal */}
            <SettingsModal />

            {/* Export Confirmation Modal */}
            <AnimatePresence>
                {exportModal.open && (
                    <motion.div 
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-2xl p-6 max-w-sm w-full mx-auto"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
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
                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {deleteModal && <DeleteConfirmationModal
                title="Client Delete"
                onConfirm={(res) => {
                    SetDeleteModal(false)
                    console.log("Confirmed:", res);
                }}
            />
            }
        </div>
    );
};

export default ViewClients;