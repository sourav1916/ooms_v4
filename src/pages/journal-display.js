import React, { useState, useEffect } from 'react';
import {
    FiSearch,
    FiPlus,
    FiSettings,
    FiEdit,
    FiFileText,
    FiMenu
} from 'react-icons/fi';
import { PiExportBold } from "react-icons/pi";
import { PiFilePdfDuotone, PiMicrosoftExcelLogoDuotone } from "react-icons/pi";
import JournalEntry from '../components/journal';
import DateFilter from '../components/DateFilter';
import { motion } from 'framer-motion';
import { Header, Sidebar } from '../components/header';

const ViewJournal = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(() => {
        const saved = localStorage.getItem('sidebarMinimized');
        return saved ? JSON.parse(saved) : false;
    });
    const [dateRange, setDateRange] = useState('');
    const [fromToDate, setFromToDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [journals, setJournals] = useState([]);
    const [journalFormModal, setJournalEntryModal] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);

    // State for dropdown menus
    const [showAddDropdown, setShowAddDropdown] = useState(false);
    const [activeRowDropdown, setActiveRowDropdown] = useState(null);
    const [exportModal, setExportModal] = useState({ open: false, type: '', data: null });

    const handleJournalSuccess = (journalData) => {
        console.log('Journal entry created successfully:', journalData);
        alert('Journal entry confirmed! Refreshing data...');
    };

    const handleExport = (type, data = null) => {
        setExportModal({ open: true, type, data });

        // Simulate export process
        setTimeout(() => {
            setExportModal({ open: false, type: '', data: null });
            alert(`${type.toUpperCase()} export completed successfully!`);
        }, 1500);
    };

    // Mock journal data
    const mockJournalData = [
        {
            journal_id: '1',
            invoice_id: 'INV001',
            date: '2024-01-15',
            from: 'Cash Account',
            from_type: 'cash',
            to: 'Office Equipment',
            to_type: 'asset',
            invoice_no: 'JNL-001',
            amount: 50000,
            remark: 'Purchase of office equipment'
        },
        {
            journal_id: '2',
            invoice_id: 'INV002',
            date: '2024-01-10',
            from: 'Client Receivable',
            from_type: 'client',
            to: 'Bank Account',
            to_type: 'bank',
            invoice_no: 'JNL-002',
            amount: 75000,
            remark: 'Client payment received'
        },
        {
            journal_id: '3',
            invoice_id: 'INV003',
            date: '2024-01-05',
            from: 'Capital Account',
            from_type: 'capital',
            to: 'Business Account',
            to_type: 'business',
            invoice_no: 'JNL-003',
            amount: 100000,
            remark: 'Capital investment'
        },
        {
            journal_id: '4',
            invoice_id: 'INV004',
            date: '2024-01-20',
            from: 'Vendor Payable',
            from_type: 'vendor',
            to: 'Bank Transfer',
            to_type: 'bank',
            invoice_no: 'JNL-004',
            amount: 25000,
            remark: 'Vendor payment'
        },
        {
            journal_id: '5',
            invoice_id: 'INV005',
            date: '2024-01-25',
            from: 'Sales Account',
            from_type: 'sales',
            to: 'Income Account',
            to_type: 'income',
            invoice_no: 'JNL-005',
            amount: 150000,
            remark: 'Sales revenue recording'
        },
        {
            journal_id: '6',
            invoice_id: 'INV006',
            date: '2024-01-18',
            from: 'Expense Account',
            from_type: 'expense',
            to: 'Cash Account',
            to_type: 'cash',
            invoice_no: 'JNL-006',
            amount: 35000,
            remark: 'Office expenses'
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
        fetchJournalData(from, to);
    }, []);

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    // Simulate API call to fetch journal data
    const fetchJournalData = async (from, to) => {
        setLoading(true);

        // Simulate API delay
        setTimeout(() => {
            const journalData = mockJournalData;
            setJournals(journalData);

            // Calculate total amount
            const total = journalData.reduce((acc, item) => acc + item.amount, 0);
            setTotalAmount(total);
            setLoading(false);
        }, 1500);
    };

    // Handle search
    const handleSearch = () => {
        const [from, to] = dateRange.split(' - ');
        setFromToDate(`From ${from} to ${to}`);
        fetchJournalData(from, to);
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

    // Get action links based on from_type and to_type
    const getActionLinks = (item) => {
        let editLink = '';
        let invoiceLink = '';

        const { from_type, to_type } = item;

        if ((['client', 'ca', 'staff', 'agent'].includes(from_type)) &&
            (['client', 'ca', 'staff', 'agent'].includes(to_type))) {
            editLink = `/edit-journal-entry?redirect=${window.location.href}&journal_id=${item.journal_id}`;
            invoiceLink = `/preview-invoice-journal?invoice_id=${item.invoice_id}&journal_id=${item.journal_id}`;
        } else if ((from_type === 'capital') && (['client', 'ca', 'staff', 'agent'].includes(to_type))) {
            editLink = `/edit-journal-entry-capital?redirect=${window.location.href}&invoice_id=${item.invoice_id}`;
        } else if ((['client', 'ca', 'staff', 'agent'].includes(from_type)) && (to_type === 'capital')) {
            editLink = `/edit-journal-entry-capital?redirect=${window.location.href}&invoice_id=${item.invoice_id}`;
        }

        return { editLink, invoiceLink };
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    // Toggle row dropdown
    const toggleRowDropdown = (journalId) => {
        setActiveRowDropdown(activeRowDropdown === journalId ? null : journalId);
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
                <div className="h-4 bg-slate-200 rounded w-32"></div>
            </td>
            <td className="p-4">
                <div className="h-4 bg-slate-200 rounded w-16"></div>
            </td>
            <td className="p-4 text-right">
                <div className="h-6 bg-slate-200 rounded w-16 ml-auto"></div>
            </td>
            <td className="p-4">
                <div className="h-4 bg-slate-200 rounded w-24"></div>
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
                                            Journal Register
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
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <motion.button
                                                onClick={() => setJournalEntryModal(true)}
                                                className="px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <FiPlus className="w-4 h-4" />
                                                Add Journal
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
                                                <th className="text-left p-4 font-semibold text-slate-700">Reduce From</th>
                                                <th className="text-left p-4 font-semibold text-slate-700">Increase To</th>
                                                <th className="text-left p-4 font-semibold text-slate-700">Voucher No</th>
                                                <th className="text-right p-4 font-semibold text-slate-700">Amount</th>
                                                <th className="text-left p-4 font-semibold text-slate-700">Remark</th>
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
                                            ) : journals.length === 0 ? (
                                                <tr>
                                                    <td colSpan="8" className="text-center py-8 text-slate-500">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <FiFileText className="w-12 h-12 text-slate-300 mb-3" />
                                                            <p className="text-slate-500">No journal entries found</p>
                                                            <motion.button
                                                                onClick={() => setJournalEntryModal(true)}
                                                                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                            >
                                                                Create Your First Journal Entry
                                                            </motion.button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                journals.map((journal, index) => {
                                                    const { editLink, invoiceLink } = getActionLinks(journal);
                                                    const isDropdownOpen = activeRowDropdown === journal.journal_id;

                                                    return (
                                                        <tr
                                                            key={journal.journal_id}
                                                            className="border-b border-slate-100 hover:bg-slate-50 transition-colors group"
                                                        >
                                                            <td className="p-4 text-slate-600 font-medium">{index + 1}</td>
                                                            <td className="p-4 text-slate-600">
                                                                <div className="font-medium">{formatDate(journal.date)}</div>
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="text-slate-800 font-medium">
                                                                    {journal.from}
                                                                    <span className="text-blue-600 text-xs font-normal ml-2 bg-blue-50 px-2 py-1 rounded-full">
                                                                        {journal.from_type.toUpperCase()}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="text-slate-800 font-medium">
                                                                    {journal.to}
                                                                    <span className="text-blue-600 text-xs font-normal ml-2 bg-blue-50 px-2 py-1 rounded-full">
                                                                        {journal.to_type.toUpperCase()}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="p-4">
                                                                <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded text-xs">
                                                                    {journal.invoice_no}
                                                                </span>
                                                            </td>
                                                            <td className="p-4 text-right">
                                                                <motion.span 
                                                                    className="inline-flex items-center justify-center bg-green-50 text-green-700 text-sm font-semibold px-3 py-1.5 rounded-lg min-w-[80px]"
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                >
                                                                    ₹{formatCurrency(journal.amount)}
                                                                </motion.span>
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="text-slate-600">
                                                                    {journal.remark}
                                                                </div>
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="dropdown-container relative flex justify-center">
                                                                    <motion.button
                                                                        className="p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer group-hover:bg-slate-200"
                                                                        onClick={() => toggleRowDropdown(journal.journal_id)}
                                                                        whileHover={{ scale: 1.1 }}
                                                                        whileTap={{ scale: 0.9 }}
                                                                    >
                                                                        <FiMenu className="w-4 h-4" />
                                                                    </motion.button>
                                                                    {isDropdownOpen && (
                                                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden">
                                                                            <div className="py-1">
                                                                                <a
                                                                                    href={`/edit-contra-entry?redirect=${window.location.href}&contra_id=${journal.journal_id}`}
                                                                                    className="flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 transition-colors"
                                                                                    onClick={() => setActiveRowDropdown(null)}
                                                                                >
                                                                                    <FiEdit className="w-4 h-4 mr-3" />
                                                                                    Edit Journal
                                                                                </a>
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
                                                <td className="text-right p-4 font-bold text-slate-800" colSpan="5">
                                                    Total
                                                </td>
                                                <td className="text-right p-4">
                                                    <span className="inline-flex items-center justify-center bg-green-100 text-green-800 text-sm font-bold px-3 py-1.5 rounded-lg min-w-[80px]">
                                                        ₹{formatCurrency(totalAmount)}
                                                    </span>
                                                </td>
                                                <td className="p-4"></td>
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
            <JournalEntry
                isOpen={journalFormModal}
                onClose={() => setJournalEntryModal(false)}
                onSuccess={handleJournalSuccess}
                mode="modal"
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

export default ViewJournal;