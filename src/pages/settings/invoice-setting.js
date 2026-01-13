import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FiPlus,
    FiEdit,
    FiTrash2,
    FiFileText,
    FiSearch,
    FiMail,
    FiDownload,
    FiPrinter,
    FiX,
    FiCalendar,
    FiFilter,
    FiChevronLeft,
    FiChevronRight,
    FiChevronsLeft,
    FiChevronsRight
} from 'react-icons/fi';
import { PiExportBold } from "react-icons/pi";
import { PiFilePdfDuotone, PiMicrosoftExcelLogoDuotone } from "react-icons/pi";
import { AiOutlineMail } from "react-icons/ai";
import { FaWhatsapp } from "react-icons/fa6";
import { motion } from 'framer-motion';
import { Header, Sidebar } from '../../components/header';
import DeleteConfirmationModal from '../../components/delete-confirmation';

const InvoiceSettings = () => {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(() => {
        const saved = localStorage.getItem('sidebarMinimized');
        return saved ? JSON.parse(saved) : false;
    });
    const [loading, setLoading] = useState(false);
    const [invoicePrefixData, setInvoicePrefixData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showExportDropdown, setShowExportDropdown] = useState(false);
    const [exportModal, setExportModal] = useState({ open: false, type: '', data: null });
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [selectedInvoices, setSelectedInvoices] = useState(new Set());
    const [selectAll, setSelectAll] = useState(false);
    const [formData, setFormData] = useState({
        type: '',
        prefix: '',
        validity_from: '',
        validity_to: ''
    });

    // Mock data
    const [invoicePrefixDataState, setInvoicePrefixDataState] = useState([
        {
            id: '1',
            type: 'sale',
            prefix: 'COMPANY/2025/SALE/',
            validity_from: '2025-01-01',
            validity_to: '2025-12-31',
            created_date: '2024-12-01'
        },
        {
            id: '2',
            type: 'purchase',
            prefix: 'COMPANY/2025/PUR/',
            validity_from: '2025-01-01',
            validity_to: '2025-12-31',
            created_date: '2024-12-01'
        },
        {
            id: '3',
            type: 'received',
            prefix: 'COMPANY/2025/REC/',
            validity_from: '2025-01-01',
            validity_to: '2025-12-31',
            created_date: '2024-11-15'
        },
        {
            id: '4',
            type: 'payment',
            prefix: 'COMPANY/2025/PAY/',
            validity_from: '2025-01-01',
            validity_to: '2025-12-31',
            created_date: '2024-11-15'
        },
        {
            id: '5',
            type: 'expense',
            prefix: 'COMPANY/2025/EXP/',
            validity_from: '2025-01-01',
            validity_to: '2025-12-31',
            created_date: '2024-11-10'
        },
        {
            id: '6',
            type: 'contra',
            prefix: 'COMPANY/2025/CON/',
            validity_from: '2025-01-01',
            validity_to: '2025-12-31',
            created_date: '2024-11-10'
        },
        {
            id: '7',
            type: 'journal',
            prefix: 'COMPANY/2025/JRN/',
            validity_from: '2025-01-01',
            validity_to: '2025-12-31',
            created_date: '2024-11-05'
        },
        {
            id: '8',
            type: 'opening balance',
            prefix: 'COMPANY/2025/OB/',
            validity_from: '2025-01-01',
            validity_to: '2025-12-31',
            created_date: '2024-11-05'
        }
    ]);

    // Invoice type options
    const invoiceTypes = [
        { value: 'received', label: 'Received' },
        { value: 'payment', label: 'Payment' },
        { value: 'sale', label: 'Sale' },
        { value: 'purchase', label: 'Purchase' },
        { value: 'expense', label: 'Expense' },
        { value: 'contra', label: 'Contra' },
        { value: 'journal', label: 'Journal' },
        { value: 'opening balance', label: 'Opening Balance' },
        { value: 'loan create', label: 'Loan Create' },
        { value: 'loan repayment', label: 'Loan Repayment' },
        { value: 'loan opening balance', label: 'Loan Opening Balance' },
        { value: 'asset depreciation', label: 'Asset Depreciation' },
        { value: 'asset sale', label: 'Asset Sale' },
        { value: 'asset purchase', label: 'Asset Purchase' }
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

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown-container')) {
                setShowExportDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Load initial data
    useEffect(() => {
        fetchInvoicePrefixData();
    }, []);

    const fetchInvoicePrefixData = async () => {
        setLoading(true);
        setTimeout(() => {
            setInvoicePrefixData(invoicePrefixDataState);
            setLoading(false);
        }, 1000);
    };

    // Filter invoices based on search and filters
    const filteredInvoices = invoicePrefixData.filter(invoice => {
        const matchesSearch = searchQuery === '' ||
            invoice.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
            invoice.prefix.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType = selectedType === '' || invoice.type === selectedType;

        return matchesSearch && matchesType;
    });

    // Handle invoice selection
    const handleInvoiceSelect = (invoiceId) => {
        const newSelected = new Set(selectedInvoices);
        if (newSelected.has(invoiceId)) {
            newSelected.delete(invoiceId);
        } else {
            newSelected.add(invoiceId);
        }
        setSelectedInvoices(newSelected);
    };

    // Handle select all
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedInvoices(new Set());
        } else {
            const allInvoiceIds = new Set(filteredInvoices.map(invoice => invoice.id));
            setSelectedInvoices(allInvoiceIds);
        }
        setSelectAll(!selectAll);
    };

    const resetForm = () => {
        setFormData({
            type: '',
            prefix: '',
            validity_from: '',
            validity_to: ''
        });
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const formatDateForDisplay = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
    };

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // YYYY-MM-DD format for input
    };

    // Handle create invoice prefix
    const handleCreateInvoicePrefix = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        setTimeout(() => {
            const newInvoicePrefix = {
                id: `${invoicePrefixData.length + 1}`,
                ...formData,
                created_date: new Date().toISOString().split('T')[0]
            };
            setInvoicePrefixData(prev => [newInvoicePrefix, ...prev]);
            resetForm();
            setShowCreateModal(false);
            setLoading(false);
            
            alert('Invoice prefix created successfully!');
        }, 1000);
    };

    // Handle edit invoice prefix
    const handleEditInvoicePrefix = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        setTimeout(() => {
            setInvoicePrefixData(prev => prev.map(invoice => 
                invoice.id === selectedInvoice.id 
                    ? { ...invoice, ...formData }
                    : invoice
            ));
            setShowEditModal(false);
            setLoading(false);
            
            alert('Invoice prefix updated successfully!');
        }, 1000);
    };

    // Handle delete invoice prefix
    const handleDeleteInvoicePrefix = (invoiceId) => {
        setInvoicePrefixData(prev => prev.filter(invoice => invoice.id !== invoiceId));
        setDeleteModal(false);
    };

    // Handle export
    const handleExport = (type, data = null) => {
        setExportModal({ open: true, type, data });
        setTimeout(() => {
            setExportModal({ open: false, type: '', data: null });
            alert(`${type.toUpperCase()} export completed successfully!`);
        }, 1500);
    };

    const openCreateModal = () => {
        resetForm();
        setShowCreateModal(true);
    };

    const openEditModal = (invoice) => {
        setSelectedInvoice(invoice);
        setFormData({
            type: invoice.type,
            prefix: invoice.prefix,
            validity_from: formatDateForInput(invoice.validity_from),
            validity_to: formatDateForInput(invoice.validity_to)
        });
        setShowEditModal(true);
    };

    // Get type color
    const getTypeColor = (type) => {
        const colors = {
            'sale': 'from-green-500 to-green-600',
            'purchase': 'from-blue-500 to-blue-600',
            'received': 'from-purple-500 to-purple-600',
            'payment': 'from-orange-500 to-orange-600',
            'expense': 'from-red-500 to-red-600',
            'contra': 'from-pink-500 to-pink-600',
            'journal': 'from-indigo-500 to-indigo-600',
            'opening balance': 'from-teal-500 to-teal-600',
            'loan create': 'from-yellow-500 to-yellow-600',
            'loan repayment': 'from-lime-500 to-lime-600',
            'asset depreciation': 'from-cyan-500 to-cyan-600'
        };
        return colors[type] || 'from-gray-500 to-gray-600';
    };

    // Skeleton loader component
    const SkeletonRow = () => (
        <tr className="animate-pulse">
            <td className="p-4">
                <div className="h-4 bg-gray-200 rounded w-4"></div>
            </td>
            <td className="p-4">
                <div className="h-3 bg-gray-200 rounded w-8"></div>
            </td>
            <td className="p-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                    <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                        <div className="h-2 bg-gray-200 rounded w-16"></div>
                    </div>
                </div>
            </td>
            <td className="p-4">
                <div className="h-3 bg-gray-200 rounded w-32"></div>
            </td>
            <td className="p-4">
                <div className="h-3 bg-gray-200 rounded w-40"></div>
            </td>
            <td className="p-4">
                <div className="flex gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded"></div>
                    <div className="w-8 h-8 bg-gray-200 rounded"></div>
                </div>
            </td>
        </tr>
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
                <div className="max-w-full mx-auto px-4 sm:px-6 md:px-8 py-6">
                    <div className="h-full flex flex-col">
                        {/* Main Card - Full height with scrolling */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
                            {/* Card Header */}
                            <div className="border-b border-gray-200 px-6 py-4">
                                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                    <div>
                                        <h5 className="text-xl font-bold text-gray-800 mb-1">
                                            Invoice Prefix Management
                                        </h5>
                                        <p className="text-gray-500 text-xs">
                                            {filteredInvoices.length} of {invoicePrefixData.length} invoice prefixes shown
                                        </p>
                                    </div>

                                    <div className="flex flex-col lg:flex-row gap-3 w-full lg:w-auto">
                                        {/* Search Input */}
                                        <div className="flex-1 relative min-w-[300px]">
                                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <input
                                                type="text"
                                                placeholder="Search by type or prefix..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-sm"
                                            />
                                        </div>

                                        <div className="flex gap-2">
                                            {/* Type Filter */}
                                            <select
                                                value={selectedType}
                                                onChange={(e) => setSelectedType(e.target.value)}
                                                className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-sm"
                                            >
                                                <option value="">All Types</option>
                                                {invoiceTypes.map(type => (
                                                    <option key={type.value} value={type.value}>
                                                        {type.label}
                                                    </option>
                                                ))}
                                            </select>

                                            {/* Export Dropdown */}
                                            <div className="dropdown-container relative">
                                                <motion.button
                                                    onClick={() => setShowExportDropdown(!showExportDropdown)}
                                                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm"
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <PiExportBold className="w-4 h-4" />
                                                    Export
                                                </motion.button>

                                                {showExportDropdown && (
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
                                                                onClick={() => handleExport('whatsapp')}
                                                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                                                            >
                                                                <FaWhatsapp className="w-4 h-4 mr-3 text-green-500" />
                                                                Share via WhatsApp
                                                            </button>
                                                            <button
                                                                onClick={() => handleExport('email')}
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
                                                onClick={openCreateModal}
                                                className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <FiPlus className="w-4 h-4" />
                                                Add Prefix
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Table Container */}
                            <div className="flex-1 overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                        <tr>
                                            <th className="w-12 p-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectAll}
                                                    onChange={handleSelectAll}
                                                    className="w-4 h-4 text-indigo-600 rounded border-gray-400 focus:ring-indigo-500"
                                                />
                                            </th>
                                            <th className="text-left p-4 font-semibold text-gray-700 text-sm">#</th>
                                            <th className="text-left p-4 font-semibold text-gray-700 text-sm">Type</th>
                                            <th className="text-left p-4 font-semibold text-gray-700 text-sm">Prefix</th>
                                            <th className="text-left p-4 font-semibold text-gray-700 text-sm">Date Between</th>
                                            <th className="text-center p-4 font-semibold text-gray-700 text-sm">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {loading ? (
                                            // Skeleton Loaders
                                            Array.from({ length: 5 }).map((_, index) => (
                                                <SkeletonRow key={index} />
                                            ))
                                        ) : filteredInvoices.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="p-8 text-center">
                                                    <div className="flex flex-col items-center justify-center py-8">
                                                        <FiFileText className="w-16 h-16 text-gray-300 mb-4" />
                                                        <p className="text-gray-500 text-lg font-medium mb-2">No invoice prefixes found</p>
                                                        <p className="text-gray-400 text-sm mb-6">Try adjusting your search or add a new prefix</p>
                                                        <button
                                                            onClick={openCreateModal}
                                                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all duration-200 shadow-sm"
                                                        >
                                                            <FiPlus className="w-4 h-4 inline mr-2" />
                                                            Add New Prefix
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredInvoices.map((invoice, index) => (
                                                <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="p-4">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedInvoices.has(invoice.id)}
                                                            onChange={() => handleInvoiceSelect(invoice.id)}
                                                            className="w-4 h-4 text-indigo-600 rounded border-gray-400 focus:ring-indigo-500"
                                                        />
                                                    </td>
                                                    <td className="p-4 text-sm text-gray-600 font-medium">
                                                        {index + 1}
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-8 h-8 bg-gradient-to-br ${getTypeColor(invoice.type)} rounded-lg flex items-center justify-center shadow-sm`}>
                                                                <FiFileText className="w-4 h-4 text-white" />
                                                            </div>
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize">
                                                                {invoice.type}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-2">
                                                            <code className="text-sm font-mono text-gray-800 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                                                                {invoice.prefix}
                                                            </code>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="text-sm text-gray-700 font-medium">
                                                            <div className="flex items-center gap-2">
                                                                <FiCalendar className="w-3 h-3 text-gray-400" />
                                                                {formatDateForDisplay(invoice.validity_from)}
                                                                <span className="mx-2">→</span>
                                                                <FiCalendar className="w-3 h-3 text-gray-400" />
                                                                {formatDateForDisplay(invoice.validity_to)}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex justify-center items-center gap-2">
                                                            <button
                                                                onClick={() => openEditModal(invoice)}
                                                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                                title="Edit"
                                                            >
                                                                <FiEdit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedInvoice(invoice);
                                                                    setDeleteModal(true);
                                                                }}
                                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Delete"
                                                            >
                                                                <FiTrash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Table Footer */}
                            <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                                <div className="p-4">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-gray-800 text-sm">
                                            Showing {filteredInvoices.length} of {invoicePrefixData.length} invoice prefixes
                                        </span>
                                        <div className="flex gap-2 items-center">
                                            <div className="text-sm text-gray-600 mr-4">
                                                {selectedInvoices.size} invoice prefix(es) selected
                                            </div>
                                            <button
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:bg-indigo-700 flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={selectedInvoices.size === 0}
                                            >
                                                <FiMail className="w-4 h-4" />
                                                Send Message
                                            </button>
                                            <button
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:bg-green-700 flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={selectedInvoices.size === 0}
                                            >
                                                <FiDownload className="w-4 h-4" />
                                                Export Selected
                                            </button>
                                            <button
                                                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:bg-purple-700 flex items-center gap-2 shadow-sm"
                                            >
                                                <FiPrinter className="w-4 h-4" />
                                                Print All
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Invoice Prefix Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all duration-300">
                        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-4 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold">Add Invoice Prefix</h2>
                                <p className="text-indigo-100 text-sm mt-1">Configure new invoice prefix settings</p>
                            </div>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="text-white hover:text-indigo-200 transition-colors duration-200 p-1 rounded-lg hover:bg-indigo-500"
                            >
                                <FiX className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleCreateInvoicePrefix}>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Invoice Type
                                            </label>
                                            <select
                                                value={formData.type}
                                                onChange={(e) => handleInputChange('type', e.target.value)}
                                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
                                                required
                                            >
                                                <option value="">Select Invoice Type</option>
                                                {invoiceTypes.map(type => (
                                                    <option key={type.value} value={type.value}>
                                                        {type.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Prefix
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.prefix}
                                                onChange={(e) => handleInputChange('prefix', e.target.value)}
                                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
                                                placeholder="Ex: COMPANY/2025/"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <FiCalendar className="inline w-4 h-4 mr-2 text-gray-400" />
                                                Start Date
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.validity_from}
                                                onChange={(e) => handleInputChange('validity_from', e.target.value)}
                                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <FiCalendar className="inline w-4 h-4 mr-2 text-gray-400" />
                                                End Date
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.validity_to}
                                                onChange={(e) => handleInputChange('validity_to', e.target.value)}
                                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="border-t px-6 py-4 bg-gray-50 flex justify-end gap-3">
                                <motion.button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-6 py-3 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-200 transition-all duration-200 hover:shadow-sm text-gray-700"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-3 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 hover:shadow-md shadow-sm disabled:opacity-50"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {loading ? 'Adding...' : 'Add Prefix'}
                                </motion.button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Invoice Prefix Modal */}
            {showEditModal && selectedInvoice && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all duration-300">
                        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-4 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold">Edit Invoice Prefix</h2>
                                <p className="text-indigo-100 text-sm mt-1">Update invoice prefix settings</p>
                            </div>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="text-white hover:text-indigo-200 transition-colors duration-200 p-1 rounded-lg hover:bg-indigo-500"
                            >
                                <FiX className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleEditInvoicePrefix}>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Invoice Type
                                            </label>
                                            <select
                                                value={formData.type}
                                                onChange={(e) => handleInputChange('type', e.target.value)}
                                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
                                                required
                                            >
                                                <option value="">Select Invoice Type</option>
                                                {invoiceTypes.map(type => (
                                                    <option key={type.value} value={type.value}>
                                                        {type.label}
                                                    </option>
                                                ))}
                                        </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Prefix
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.prefix}
                                                onChange={(e) => handleInputChange('prefix', e.target.value)}
                                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
                                                placeholder="Ex: COMPANY/2025/"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <FiCalendar className="inline w-4 h-4 mr-2 text-gray-400" />
                                                Start Date
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.validity_from}
                                                onChange={(e) => handleInputChange('validity_from', e.target.value)}
                                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <FiCalendar className="inline w-4 h-4 mr-2 text-gray-400" />
                                                End Date
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.validity_to}
                                                onChange={(e) => handleInputChange('validity_to', e.target.value)}
                                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="border-t px-6 py-4 bg-gray-50 flex justify-end gap-3">
                                <motion.button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-6 py-3 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-200 transition-all duration-200 hover:shadow-sm text-gray-700"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-3 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 hover:shadow-md shadow-sm disabled:opacity-50"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {loading ? 'Updating...' : 'Update Prefix'}
                                </motion.button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Export Confirmation Modal */}
            {exportModal.open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-auto transform transition-all duration-300">
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
                    </div>
                </div>
            )}

            {deleteModal && selectedInvoice && (
                <DeleteConfirmationModal
                    title={`Delete Invoice Prefix`}
                    message={`Are you sure you want to delete the "${selectedInvoice.prefix}" prefix for ${selectedInvoice.type} invoices? This action cannot be undone.`}
                    onConfirm={(res) => {
                        if (res.confirmed) {
                            handleDeleteInvoicePrefix(selectedInvoice.id);
                        }
                        setDeleteModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default InvoiceSettings;