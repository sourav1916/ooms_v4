// pages/client/ClientLedger.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FiArrowLeft,
    FiCalendar,
    FiRepeat,
    FiDownload,
    FiPrinter,
    FiX,
    FiRefreshCw,
    FiPlus,
    FiUser,
    FiDollarSign,
    FiFileText,
    FiShoppingBag,
    FiTruck,
    FiHome,
    FiGlobe,
    FiCreditCard,
    FiMoreVertical,
    FiEdit2,
    FiFile,
    FiMail,
    FiPhone,
    FiUserCheck
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import API_BASE_URL from '../utils/api-controller';
import getHeaders from '../utils/get-headers';
import axios from 'axios';
import { TransactionModalManager } from '../finance/bank/client-transaction-modal';

const ClientLedger = () => {
    const { username } = useParams();
    const navigate = useNavigate();

    const [clientProfile, setClientProfile] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchingTransactions, setFetchingTransactions] = useState(false);
    const [fromDate, setFromDate] = useState(() => {
        const date = new Date();
        date.setMonth(date.getMonth() - 1);
        return date.toISOString().split('T')[0];
    });
    const [toDate, setToDate] = useState(() => {
        return new Date().toISOString().split('T')[0];
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage] = useState(20);
    const [openingBalance, setOpeningBalance] = useState(0);
    const [summary, setSummary] = useState({
        totalCredit: 0,
        totalDebit: 0,
        closingBalance: 0
    });
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [transactionType, setTransactionType] = useState('');
    const [showActionMenu, setShowActionMenu] = useState(null);
    const [selectedBank, setSelectedBank] = useState(null); // ADD THIS LINE

    // Fetch client profile and ledger transactions
    useEffect(() => {
        if (username) {
            fetchClientProfile();
            fetchTransactions();
        } else {
            toast.error('Client username not found');
            navigate(-1);
        }
    }, [username]);

    // Fetch transactions when page, fromDate, or toDate changes
    useEffect(() => {
        if (username) {
            fetchTransactions();
        }
    }, [currentPage, fromDate, toDate]);

    // Close action menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setShowActionMenu(null);
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Fetch client profile details
    const fetchClientProfile = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/client/profile/${username}`,
                { headers: getHeaders() }
            );

            if (response.data.success) {
                setClientProfile(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching client profile:', error);
            toast.error('Failed to fetch client details');
        }
    };

    // Fetch transactions for client ledger
    const fetchTransactions = async () => {
        setFetchingTransactions(true);
        try {
            const response = await axios.get(
                `${API_BASE_URL}/transaction/list?page_no=${currentPage}&limit=${itemsPerPage}&from_date=${fromDate}&to_date=${toDate}&party_type=client&party_id=${username}`,
                { headers: getHeaders() }
            );

            if (response.data.success) {
                setTransactions(response.data.data || []);
                setOpeningBalance(response.data.opening_balance || 0);
                setTotalItems(response.data.meta?.total || 0);
                setTotalPages(Math.ceil((response.data.meta?.total || 0) / itemsPerPage));
                
                calculateSummary(response.data.data || [], response.data.opening_balance || 0);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
            toast.error('Failed to fetch transactions');
            setTransactions([]);
            calculateSummary([], 0);
        } finally {
            setFetchingTransactions(false);
            setLoading(false);
        }
    };

    // Calculate transaction summary
    const calculateSummary = (transactionsData, openingBal) => {
        let totalCredit = 0;
        let totalDebit = 0;
        let closingBalance = openingBal;

        transactionsData.forEach(transaction => {
            if (transaction.type === "1") {
                totalCredit += transaction.amount;
            } else if (transaction.type === "0") {
                totalDebit += transaction.amount;
            }
            closingBalance = transaction.new_balance;
        });

        setSummary({
            totalCredit,
            totalDebit,
            closingBalance
        });
    };

    // Handle search
    const handleSearch = useCallback(() => {
        setCurrentPage(1);
        fetchTransactions();
    }, [fromDate, toDate]);

    // Handle refresh
    const handleRefresh = useCallback(() => {
        fetchTransactions();
        toast.success('Data refreshed');
    }, []);

    // Handle export
    const handleExport = useCallback((type) => {
        toast.success(`${type.toUpperCase()} export started...`);
    }, []);

    // Handle print
    const handlePrint = useCallback(() => {
        window.print();
    }, []);

    // Handle transaction type click - MODIFIED
   const handleTransactionTypeClick = (type) => {
    // Don't check for selectedBank - let the modal handle bank selection
    setTransactionType(type);
    setShowTransactionModal(true);
};
    // Handle create transaction
    const handleCreateTransaction = async (type, formData) => {
        try {
            console.log('Creating transaction:', type, formData);
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success(`${type} transaction created successfully`);
            setShowTransactionModal(false);
            setSelectedBank(null); // Clear selected bank on successful transaction
            fetchTransactions();
        } catch (error) {
            console.error('Error creating transaction:', error);
            toast.error(`Failed to create ${type} transaction`);
        }
    };

    // Handle action click
    const handleActionClick = (e, transactionId) => {
        e.stopPropagation();
        setShowActionMenu(showActionMenu === transactionId ? null : transactionId);
    };

    // Handle edit
    const handleEdit = (transaction) => {
        console.log('Edit transaction:', transaction);
        toast.success('Edit functionality coming soon');
        setShowActionMenu(null);
    };

    // Handle view invoice
    const handleViewInvoice = (transaction) => {
        console.log('View invoice:', transaction);
        toast.success('View invoice functionality coming soon');
        setShowActionMenu(null);
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(Math.abs(amount || 0));
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    // Format time
    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get transaction type color
    const getTransactionTypeColor = (type) => {
        if (type === "0") {
            return 'text-blue-600 bg-blue-50 border-blue-200';
        } else if (type === "1") {
            return 'text-orange-600 bg-orange-50 border-orange-200';
        }
        return 'text-slate-600 bg-slate-50 border-slate-200';
    };

    // Get payment mode icon
    const getPaymentModeIcon = (mode) => {
        switch(mode?.toLowerCase()) {
            case 'cash': 
                return <FiDollarSign className="w-4 h-4 text-green-600" />;
            case 'bank': 
                return <FiHome className="w-4 h-4 text-blue-600" />;
            case 'cheque': 
                return <FiFileText className="w-4 h-4 text-purple-600" />;
            case 'online': 
                return <FiGlobe className="w-4 h-4 text-indigo-600" />;
            case 'card': 
                return <FiCreditCard className="w-4 h-4 text-orange-600" />;
            default: 
                return <FiDollarSign className="w-4 h-4 text-slate-600" />;
        }
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // Get transaction type icon
    const getTransactionTypeIcon = (type) => {
        switch(type) {
            case 'RECEIVE': return <FiUser className="w-5 h-5" />;
            case 'PAYMENT': return <FiDollarSign className="w-5 h-5" />;
            case 'SALE': return <FiShoppingBag className="w-5 h-5" />;
            case 'PURCHASE': return <FiTruck className="w-5 h-5" />;
            case 'EXPENSE': return <FiFileText className="w-5 h-5" />;
            case 'CONTRA': return <FiRepeat className="w-5 h-5" />;
            default: return <FiPlus className="w-5 h-5" />;
        }
    };

    // Get particulars display
    const getParticularsDisplay = (transaction) => {
        if (transaction.create_by) {
            return (
                <div className="flex flex-col">
                    <div className="font-medium text-slate-800">{transaction.create_by.name || 'Company'}</div>
                    <div className="text-xs text-slate-500">{transaction.create_by.email || ''}</div>
                </div>
            );
        }
        return <span className="text-sm text-slate-500">N/A</span>;
    };

    // Navigate to client profile
    const goToClientProfile = () => {
        navigate(`/client/profile/${username}`);
    };

    // Loading skeleton
    const SkeletonRow = () => (
        <tr className="border-b border-slate-100 animate-pulse">
            <td className="p-4"><div className="h-4 bg-slate-200 rounded w-8"></div></td>
            <td className="p-4"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
            <td className="p-4"><div className="h-4 bg-slate-200 rounded w-32"></div></td>
            <td className="p-4"><div className="h-4 bg-slate-200 rounded w-20"></div></td>
            <td className="p-4"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
            <td className="p-4 text-right"><div className="h-4 bg-slate-200 rounded w-20 ml-auto"></div></td>
            <td className="p-4 text-right"><div className="h-4 bg-slate-200 rounded w-20 ml-auto"></div></td>
            <td className="p-4 text-right"><div className="h-4 bg-slate-200 rounded w-20 ml-auto"></div></td>
            <td className="p-4 text-center"><div className="h-8 bg-slate-200 rounded w-8 mx-auto"></div></td>
        </tr>
    );

    return (
        <div className="w-full">
            {/* Header with Back Button */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <motion.button
                        onClick={() => navigate(-1)}
                        className="p-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-slate-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FiArrowLeft className="w-5 h-5 text-slate-600" />
                    </motion.button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Client Ledger</h1>
                        {clientProfile && (
                            <p className="text-sm text-slate-500 mt-1">
                                {clientProfile.name} - {clientProfile.email} {clientProfile.mobile && `(+${clientProfile.country_code || '91'} ${clientProfile.mobile})`}
                            </p>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <motion.button
                        onClick={handleRefresh}
                        className="p-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-slate-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title="Refresh"
                    >
                        <FiRefreshCw className="w-5 h-5 text-slate-600" />
                    </motion.button>
                    <motion.button
                        onClick={() => handleExport('pdf')}
                        className="p-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-slate-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title="Export PDF"
                    >
                        <FiDownload className="w-5 h-5 text-slate-600" />
                    </motion.button>
                    <motion.button
                        onClick={handlePrint}
                        className="p-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-slate-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title="Print"
                    >
                        <FiPrinter className="w-5 h-5 text-slate-600" />
                    </motion.button>
                    <div className="relative group">
                        <motion.button
                            className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-white"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            title="Add Transaction"
                        >
                            <FiPlus className="w-5 h-5" />
                        </motion.button>
                        
                        {/* Dropdown Menu */}
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-2 hidden group-hover:block z-50">
                            {['RECEIVE', 'PAYMENT', 'SALE', 'PURCHASE', 'EXPENSE', 'CONTRA'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => handleTransactionTypeClick(type)}
                                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-blue-50 flex items-center gap-3 transition-colors"
                                >
                                    <span className="text-blue-600">{getTransactionTypeIcon(type)}</span>
                                    {type.charAt(0) + type.slice(1).toLowerCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl p-4 shadow-lg border border-slate-200"
                >
                    <p className="text-sm text-slate-500 mb-1">Opening</p>
                    <p className={`text-xl font-bold ${openingBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                        ₹{formatCurrency(openingBalance)}
                        {openingBalance >= 0 ? 
                            <span className="text-xs ml-1 text-blue-600">(Receivable)</span> : 
                            <span className="text-xs ml-1 text-orange-600">(Payable)</span>
                        }
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl p-4 shadow-lg border border-slate-200"
                >
                    <p className="text-sm text-slate-500 mb-1">Paid to Client</p>
                    <p className="text-xl font-bold text-blue-600">
                        ₹{formatCurrency(summary.totalDebit)}
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl p-4 shadow-lg border border-slate-200"
                >
                    <p className="text-sm text-slate-500 mb-1">Received from Client</p>
                    <p className="text-xl font-bold text-orange-600">
                        ₹{formatCurrency(summary.totalCredit)}
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-xl p-4 shadow-lg border border-slate-200"
                >
                    <p className="text-sm text-slate-500 mb-1">Closing</p>
                    <p className={`text-xl font-bold ${summary.closingBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                        ₹{formatCurrency(summary.closingBalance)}
                        {summary.closingBalance >= 0 ? 
                            <span className="text-xs ml-1 text-blue-600">(Receivable)</span> : 
                            <span className="text-xs ml-1 text-orange-600">(Payable)</span>
                        }
                    </p>
                </motion.div>
            </div>

            {/* Date Filter Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-xl shadow-lg border border-slate-200 p-4 mb-6"
            >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <FiCalendar className="text-blue-600 w-5 h-5" />
                        <span className="text-sm font-medium text-slate-700">Date Range:</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                        <span className="text-slate-500">to</span>
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                        <button
                            onClick={handleSearch}
                            disabled={fetchingTransactions}
                            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200 flex items-center gap-2"
                        >
                            {fetchingTransactions ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Loading...
                                </>
                            ) : (
                                'Apply Filter'
                            )}
                        </button>
                        {(fromDate || toDate) && (
                            <button
                                onClick={() => {
                                    const date = new Date();
                                    date.setMonth(date.getMonth() - 1);
                                    setFromDate(date.toISOString().split('T')[0]);
                                    setToDate(new Date().toISOString().split('T')[0]);
                                }}
                                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                                title="Clear filter"
                            >
                                <FiX className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Transactions Table Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-y border-slate-200">
                                <th className="text-left p-4 font-semibold text-slate-600 w-16">#</th>
                                <th className="text-left p-4 font-semibold text-slate-600">Date</th>
                                <th className="text-left p-4 font-semibold text-slate-600">Particulars</th>
                                <th className="text-left p-4 font-semibold text-slate-600">Type</th>
                                <th className="text-left p-4 font-semibold text-slate-600">Voucher No</th>
                                <th className="text-right p-4 font-semibold text-slate-600">Debit</th>
                                <th className="text-right p-4 font-semibold text-slate-600">Credit</th>
                                <th className="text-right p-4 font-semibold text-slate-600">Balance</th>
                                <th className="text-center p-4 font-semibold text-slate-600 w-20">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {/* Opening Balance Row - Always Show */}
                            <tr className="bg-blue-50/50 font-medium">
                                <td className="p-4 text-slate-600"></td>
                                <td className="p-4 text-slate-800" colSpan="2">Opening Balance</td>
                                <td className="p-4"></td>
                                <td className="p-4"></td>
                                <td className="p-4 text-right text-slate-400">-</td>
                                <td className="p-4 text-right text-slate-400">-</td>
                                <td className={`p-4 text-right font-bold ${openingBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                                    ₹{formatCurrency(openingBalance)}
                                </td>
                                <td className="p-4"></td>
                            </tr>

                            {loading || fetchingTransactions ? (
                                [...Array(5)].map((_, index) => <SkeletonRow key={index} />)
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="text-center py-12">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="p-4 bg-slate-100 rounded-full mb-4">
                                                <FiRepeat className="w-8 h-8 text-slate-400" />
                                            </div>
                                            <p className="text-slate-600 text-lg font-medium mb-2">No transactions found</p>
                                            <p className="text-slate-500 text-sm">No transactions available for the selected date range</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((transaction, index) => (
                                    <motion.tr
                                        key={transaction.transaction_id || index}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.02 }}
                                        className="hover:bg-blue-50/30 transition-colors duration-150"
                                    >
                                        <td className="p-4 text-slate-600">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                        <td className="p-3 text-slate-600 text-sm">
                                            {formatDate(transaction.transaction_date)}
                                        </td>
                                        <td className="p-4">
                                            {getParticularsDisplay(transaction)}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className={`px-3 py-1 rounded-lg text-xs font-medium border w-fit ${getTransactionTypeColor(transaction.type)}`}>
                                                    {transaction.transaction_type?.toUpperCase() || (transaction.type === "0" ? 'DEBIT' : 'CREDIT')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm font-mono text-slate-600">
                                                {transaction.invoice_no || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            {transaction.type === "0" ? (
                                                <span className="text-sm font-semibold text-blue-600">
                                                    ₹{formatCurrency(transaction.amount)}
                                                </span>
                                            ) : (
                                                <span className="text-sm text-slate-400">-</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            {transaction.type === "1" ? (
                                                <span className="text-sm font-semibold text-orange-600">
                                                    ₹{formatCurrency(transaction.amount)}
                                                </span>
                                            ) : (
                                                <span className="text-sm text-slate-400">-</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <span className={`text-sm font-bold ${transaction.new_balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                                                ₹{formatCurrency(transaction.new_balance)}
                                            </span>
                                            <div className="text-xs text-slate-400">
                                                Prev: ₹{formatCurrency(transaction.old_balance)}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center relative">
                                            <button
                                                onClick={(e) => handleActionClick(e, transaction.transaction_id)}
                                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                            >
                                                <FiMoreVertical className="w-5 h-5 text-slate-600" />
                                            </button>
                                            
                                            {/* Action Menu */}
                                            {showActionMenu === transaction.transaction_id && (
                                                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50">
                                                    <button
                                                        onClick={() => handleEdit(transaction)}
                                                        className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-blue-50 flex items-center gap-2 transition-colors"
                                                    >
                                                        <FiEdit2 className="w-4 h-4 text-blue-600" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleViewInvoice(transaction)}
                                                        className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-blue-50 flex items-center gap-2 transition-colors"
                                                    >
                                                        <FiFile className="w-4 h-4 text-green-600" />
                                                        Invoice
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))
                            )}

                            {/* Total Row - Always Show */}
                            <tr className="bg-slate-100 font-bold border-t-2 border-slate-300">
                                <td className="p-4 text-slate-800" colSpan="5">Total</td>
                                <td className="p-4 text-right text-blue-600">₹{formatCurrency(summary.totalDebit)}</td>
                                <td className="p-4 text-right text-orange-600">₹{formatCurrency(summary.totalCredit)}</td>
                                <td className={`p-4 text-right ${summary.closingBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                                    ₹{formatCurrency(summary.closingBalance)}
                                </td>
                                <td className="p-4"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && !fetchingTransactions && transactions.length > 0 && (
                    <div className="border-t border-slate-200 px-6 py-4 bg-white">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-slate-600">
                                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
                            </div>
                            <div className="flex gap-2">
                                <motion.button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Previous
                                </motion.button>
                                <span className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg">
                                    {currentPage}
                                </span>
                                <motion.button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Next
                                </motion.button>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Transaction Modal Manager - MODIFIED */}
            <TransactionModalManager
    modalType={transactionType}
    isOpen={showTransactionModal}
    onClose={() => {
        setShowTransactionModal(false);
    }}
    clientId={username} // Pass the username from params
    clientName={clientProfile?.name} // Pass the client name
    bankDetails={selectedBank}
    bankId={selectedBank?.bank_id}
    onSubmit={handleCreateTransaction}
    formatCurrency={formatCurrency}
    summary={summary}
/>
        </div>
    );
};

export default ClientLedger;