// pages/client/ClientLedger.jsx
import React, { useState, useEffect, useCallback, forwardRef, useRef } from 'react';
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
    FiEye,
    FiMail,
    FiPhone,
    FiUserCheck,
    FiBarChart2
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import API_BASE_URL from '../utils/api-controller';
import getHeaders from '../utils/get-headers';
import axios from 'axios';
import { TransactionModalManager } from '../finance/bank/client-transaction-modal';
import DatePicker from 'react-datepicker';
import { Calendar, X, ChevronDown } from 'lucide-react';
import "react-datepicker/dist/react-datepicker.css";

// DateRangePicker Component - Professional design with inline dual calendar
const DateRangePicker = ({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    minDate,
    maxDate
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [localStartDate, setLocalStartDate] = useState(startDate ? new Date(startDate + 'T12:00:00') : null);
    const [localEndDate, setLocalEndDate] = useState(endDate ? new Date(endDate + 'T12:00:00') : null);
    const dropdownRef = useRef(null);

    const quickDateFilters = [
        { label: '7 Days', type: 'last7Days' },
        { label: 'Current Month', type: 'currentMonth' },
        { label: 'Last Month', type: 'lastMonth' },
        { label: '3 Months', type: 'last3Months' },
        { label: '6 Months', type: 'last6Months' },
        { label: '1 Year', type: 'lastYear' },
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            const isCalendarPopper = event.target.closest('.react-datepicker-popper');
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !isCalendarPopper) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setLocalStartDate(startDate ? new Date(startDate + 'T12:00:00') : null);
        setLocalEndDate(endDate ? new Date(endDate + 'T12:00:00') : null);
    }, [startDate, endDate]);

    const formatRangeDisplay = () => {
        if (!startDate && !endDate) return 'Select date range';
        const format = (dateStr) => {
            if (!dateStr) return '';
            const d = new Date(dateStr + 'T12:00:00');
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
        };
        return startDate && endDate ? `${format(startDate)} – ${format(endDate)}` : 'Select date range';
    };

    const handleQuickFilter = (filter) => {
        const today = new Date();
        today.setHours(12, 0, 0, 0);
        let start = new Date(today);
        let end = new Date(today);

        switch (filter.type) {
            case 'currentMonth':
                start = new Date(today.getFullYear(), today.getMonth(), 1);
                break;
            case 'last7Days':
                start.setDate(today.getDate() - 7);
                break;
            case 'lastMonth':
                start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                end = new Date(today.getFullYear(), today.getMonth(), 0);
                break;
            case 'last3Months':
                start.setMonth(today.getMonth() - 3);
                break;
            case 'last6Months':
                start.setMonth(today.getMonth() - 6);
                break;
            case 'lastYear':
                start.setMonth(today.getMonth() - 12);
                break;
            default:
                break;
        }

        const toISO = (d) => d.toISOString().split('T')[0];
        setLocalStartDate(start);
        setLocalEndDate(end);
        onStartDateChange(toISO(start));
        onEndDateChange(toISO(end));
        setIsOpen(false);
    };

    const handleRangeChange = (update) => {
        if (Array.isArray(update)) {
            const [start, end] = update;
            setLocalStartDate(start);
            setLocalEndDate(end ?? start);
            if (start) onStartDateChange(start.toISOString().split('T')[0]);
            if (end) onEndDateChange(end.toISOString().split('T')[0]);
        }
    };

    const handleApply = () => {
        if (localStartDate && localEndDate) {
            const [s, e] = [localStartDate, localEndDate].sort((a, b) => a - b);
            onStartDateChange(s.toISOString().split('T')[0]);
            onEndDateChange(e.toISOString().split('T')[0]);
            setIsOpen(false);
        }
    };

    const clearDates = (e) => {
        e?.stopPropagation();
        setLocalStartDate(null);
        setLocalEndDate(null);
        onStartDateChange('');
        onEndDateChange('');
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <style>{`
                .daterange-picker .react-datepicker { font-family: inherit; border: none; }
                .daterange-picker .react-datepicker__month-container { padding: 0.5rem; }
                .daterange-picker .react-datepicker__header { background: transparent; border: none; padding: 0.5rem 0.5rem 0.75rem; }
                .daterange-picker .react-datepicker__current-month { color: #1e293b; font-weight: 600; font-size: 0.875rem; }
                .daterange-picker .react-datepicker__day-names { margin: 0.5rem 0 0; }
                .daterange-picker .react-datepicker__day-name { color: #64748b; font-weight: 600; font-size: 0.7rem; width: 2.25rem; line-height: 2rem; }
                .daterange-picker .react-datepicker__day { width: 2.25rem; height: 2.25rem; line-height: 2.25rem; margin: 0.125rem; border-radius: 0.5rem; font-size: 0.8rem; font-weight: 500; }
                .daterange-picker .react-datepicker__day:hover { background: #eef2ff; color: #4f46e5; }
                .daterange-picker .react-datepicker__day--in-range { background: #c7d2fe !important; color: #312e81 !important; }
                .daterange-picker .react-datepicker__day--range-start,
                .daterange-picker .react-datepicker__day--range-end { background: #4f46e5 !important; color: white !important; }
                .daterange-picker .react-datepicker__day--today { font-weight: 700; color: #4f46e5; background: #eef2ff; }
                .daterange-picker .react-datepicker__day--outside-month { color: #cbd5e1; }
                .daterange-picker .react-datepicker__day--disabled { color: #e2e8f0; cursor: not-allowed; }
                .daterange-picker .react-datepicker__navigation { top: 0.6rem; }
                .daterange-picker .react-datepicker__navigation-icon::before { border-color: #64748b; border-width: 2px 2px 0 0; }
            `}</style>

            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full min-w-[280px] px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-indigo-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-sm">
                        <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Date range</p>
                        <p className="text-sm font-semibold text-slate-800">{formatRangeDisplay()}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    {(startDate || endDate) && (
                        <button type="button" onClick={clearDates} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Clear">
                            <X className="h-4 w-4" />
                        </button>
                    )}
                    <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute left-0 mt-2 w-[min(420px,95vw)] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-[9999]">
                    {/* Quick filters */}
                    <div className="p-4 bg-gradient-to-r from-slate-50 to-indigo-50/30 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Quick select</p>
                        <div className="flex flex-wrap gap-2">
                            {quickDateFilters.map((f) => (
                                <button
                                    key={f.type}
                                    type="button"
                                    onClick={() => handleQuickFilter(f)}
                                    className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-indigo-500 hover:text-white hover:border-indigo-500 transition-all duration-150 shadow-sm"
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Inline dual calendar */}
                    <div className="p-4 daterange-picker">
                        <DatePicker
                            inline
                            selectsRange
                            monthsShown={2}
                            startDate={localStartDate}
                            endDate={localEndDate}
                            onChange={handleRangeChange}
                            minDate={minDate ? new Date(minDate) : undefined}
                            maxDate={maxDate ? new Date(maxDate) : new Date()}
                            dateFormat="dd/MM/yyyy"
                        />
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-200">
                        <span className="text-xs text-slate-500">
                            {localStartDate && localEndDate
                                ? `${localStartDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} – ${localEndDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`
                                : 'Select start and end dates'}
                        </span>
                        <button
                            type="button"
                            onClick={handleApply}
                            disabled={!localStartDate || !localEndDate}
                            className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

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
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const LIMIT_OPTIONS = [5, 10, 20, 50, 100];
    const [pageJumpInput, setPageJumpInput] = useState('');
    const [openingBalance, setOpeningBalance] = useState({ debit: 0, credit: 0, balance: 0 });
    const [summary, setSummary] = useState({
        totalCredit: 0,
        totalDebit: 0,
        closingBalance: 0
    });
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [transactionType, setTransactionType] = useState('');
    const [showActionMenu, setShowActionMenu] = useState(null);
    const [selectedBank, setSelectedBank] = useState(null);
    const [detailsTransaction, setDetailsTransaction] = useState(null);
    const [showOpeningBalanceModal, setShowOpeningBalanceModal] = useState(false);
    const [openingBalanceData, setOpeningBalanceData] = useState(null);
    const [openingBalanceLoading, setOpeningBalanceLoading] = useState(false);
    const [openingBalanceSubmitting, setOpeningBalanceSubmitting] = useState(false);
    const [openingBalanceForm, setOpeningBalanceForm] = useState({
        amount: '',
        type: 'credit',
        transaction_date: new Date().toISOString().split('T')[0],
        remark: ''
    });

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

    // Reset to page 1 when date filters or limit change
    useEffect(() => {
        setCurrentPage(1);
    }, [fromDate, toDate, itemsPerPage]);

    // Fetch transactions when page, limit, fromDate, toDate, or clientProfile (for party_id) changes
    useEffect(() => {
        if (username) {
            fetchTransactions();
        }
    }, [currentPage, itemsPerPage, fromDate, toDate, clientProfile?.id]);

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
        const partyId = clientProfile?.id ?? username;
        try {
            const response = await axios.get(
                `${API_BASE_URL}/transaction/list?page_no=${currentPage}&limit=${itemsPerPage}&from_date=${fromDate}&to_date=${toDate}&party_type=client&party_id=${encodeURIComponent(partyId)}`,
                { headers: getHeaders() }
            );

            if (response.data.success) {
                const openingBal = response.data.opening_balance;
                const openingBalObj = typeof openingBal === 'object' && openingBal !== null
                    ? { debit: openingBal.debit ?? 0, credit: openingBal.credit ?? 0, balance: openingBal.balance ?? 0 }
                    : { debit: 0, credit: 0, balance: openingBal ?? 0 };

                setTransactions(response.data.data || []);
                setOpeningBalance(openingBalObj);
                const meta = response.data.meta || {};
                const total = meta.total ?? 0;
                const limit = meta.limit ?? itemsPerPage;
                setTotalItems(total);
                setTotalPages(Math.max(1, Math.ceil(total / limit)));

                calculateSummary(response.data.data || [], openingBalObj.balance);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
            toast.error('Failed to fetch transactions');
            setTransactions([]);
            setOpeningBalance({ debit: 0, credit: 0, balance: 0 });
            calculateSummary([], 0);
        } finally {
            setFetchingTransactions(false);
            setLoading(false);
        }
    };

    // Calculate transaction summary (supports new API: payment/sale/etc with debit/credit/balance)
    const calculateSummary = (transactionsData, openingBal) => {
        let totalCredit = 0;
        let totalDebit = 0;
        let closingBalance = openingBal;

        transactionsData.forEach(transaction => {
            const amounts = getTransactionAmounts(transaction);
            totalDebit += amounts.debit;
            totalCredit += amounts.credit;
            if (amounts.balance != null) closingBalance = amounts.balance;
        });

        setSummary({
            totalCredit,
            totalDebit,
            closingBalance
        });
    };

    // Get debit/credit/balance from transaction (new API: type-specific object e.g. payment, sale)
    const getTransactionAmounts = (transaction) => {
        const key = transaction.transaction_type;
        const amounts = key && transaction[key] ? transaction[key] : transaction.payment || {};
        return {
            debit: amounts.debit ?? 0,
            credit: amounts.credit ?? 0,
            balance: amounts.balance
        };
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

    // Fetch opening balance (get-opening-balance API)
    const fetchOpeningBalance = useCallback(async () => {
        const partyId = clientProfile?.id ?? username;
        if (!partyId) return;
        setOpeningBalanceLoading(true);
        try {
            const res = await axios.get(
                `${API_BASE_URL}/transaction/get-opening-balance?party_type=client&party_id=${encodeURIComponent(partyId)}`,
                { headers: getHeaders() }
            );
            if (res.data.success && res.data.data) {
                const d = res.data.data;
                setOpeningBalanceData(d);
                setOpeningBalanceForm({
                    amount: String(d.amount || ''),
                    type: d.type || 'credit',
                    transaction_date: d.transaction_date ? d.transaction_date.split('T')[0] : new Date().toISOString().split('T')[0],
                    remark: d.remark || ''
                });
            } else {
                setOpeningBalanceData(null);
                setOpeningBalanceForm({
                    amount: '',
                    type: 'credit',
                    transaction_date: new Date().toISOString().split('T')[0],
                    remark: ''
                });
            }
        } catch (err) {
            console.error('Fetch opening balance error:', err);
            toast.error(err.response?.data?.message || 'Failed to fetch opening balance');
            setOpeningBalanceData(null);
        } finally {
            setOpeningBalanceLoading(false);
        }
    }, [username, clientProfile?.id]);

    // Open opening balance modal
    const handleOpenOpeningBalanceModal = () => {
        setShowOpeningBalanceModal(true);
        fetchOpeningBalance();
    };

    // Set/Update opening balance (set-opening-balance API)
    const handleSetOpeningBalance = async (e) => {
        e.preventDefault();
        const partyId = clientProfile?.id ?? username;
        if (!partyId) {
            toast.error('Client not found');
            return;
        }
        const amt = parseFloat(openingBalanceForm.amount);
        if (isNaN(amt) || amt <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }
        setOpeningBalanceSubmitting(true);
        try {
            const res = await axios.post(
                `${API_BASE_URL}/transaction/set-opening-balance`,
                {
                    amount: amt,
                    type: openingBalanceForm.type,
                    party_type: 'client',
                    party_id: partyId,
                    remark: openingBalanceForm.remark.trim() || undefined,
                    transaction_date: openingBalanceForm.transaction_date
                },
                { headers: getHeaders() }
            );
            if (res.data.success) {
                toast.success(res.data.message || 'Opening balance saved successfully');
                setShowOpeningBalanceModal(false);
                fetchTransactions();
            } else {
                toast.error(res.data.message || 'Failed to set opening balance');
            }
        } catch (err) {
            console.error('Set opening balance error:', err);
            toast.error(err.response?.data?.message || 'Failed to set opening balance');
        } finally {
            setOpeningBalanceSubmitting(false);
        }
    };

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

    // Handle view details
    const handleViewDetails = (transaction) => {
        setDetailsTransaction(transaction);
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

    // Get transaction type color (debit=blue, credit=orange)
    const getTransactionTypeColor = (transaction) => {
        const amounts = getTransactionAmounts(transaction);
        if (amounts.debit > 0) return 'text-blue-600 bg-blue-50 border-blue-200';
        if (amounts.credit > 0) return 'text-orange-600 bg-orange-50 border-orange-200';
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
        const page = Math.max(1, Math.min(totalPages, Math.floor(newPage)));
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            setPageJumpInput('');
        }
    };

    // Handle page jump
    const handlePageJump = (e) => {
        e.preventDefault();
        const page = parseInt(pageJumpInput, 10);
        if (!isNaN(page)) {
            handlePageChange(page);
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
            case 'JOURNAL': return <FiRepeat className="w-5 h-5" />;
            default: return <FiPlus className="w-5 h-5" />;
        }
    };

// Get particulars display (new API: particular.type + particular.details + particular.remark, fallback to transaction_type + remark)
const getParticularsDisplay = (transaction) => {
    const particular = transaction.particular;
    const remark = particular?.remark;
    if (particular?.type === 'bank' && particular?.details) {
        const d = particular.details;
        return (
            <div className="flex flex-col min-w-0">
                <div className="font-medium text-slate-800">{d.bank || 'Bank'}</div>
                <div className="text-xs text-slate-500">
                    {[d.account_no, d.holder, d.ifsc, d.branch].filter(Boolean).join(' • ')}
                </div>
                {remark && (
                    <div className="text-xs text-slate-600 mt-1 truncate max-w-[200px]" title={remark}>
                        {remark}
                    </div>
                )}
            </div>
        );
    }
    if (transaction.create_by && particular?.type) {
        return (
            <div className="flex flex-col min-w-0">
                <div className="font-medium text-slate-800">{transaction.create_by.name || 'Company'}</div>
                <div className="text-xs text-slate-500">{transaction.create_by.email || ''}</div>
                {remark && (
                    <div className="text-xs text-slate-600 mt-1 truncate max-w-[200px]" title={remark}>
                        {remark}
                    </div>
                )}
            </div>
        );
    }
    // No particulars (e.g. opening balance) – show transaction type + remark
    const txType = (transaction.transaction_type || '')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
    return (
        <div className="flex flex-col min-w-0">
            <div className="font-medium text-slate-800">{txType || 'N/A'}</div>
            {remark && (
                <div className="text-xs text-slate-600 mt-1 truncate max-w-[200px]" title={remark}>
                    {remark}
                </div>
            )}
        </div>
    );
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
                            {['RECEIVE', 'PAYMENT', 'SALE', 'PURCHASE', 'EXPENSE', 'JOURNAL'].map((type) => (
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
                    <p className={`text-xl font-bold ${(openingBalance.balance ?? 0) >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                        ₹{formatCurrency(openingBalance.balance ?? 0)}
                        {(openingBalance.balance ?? 0) >= 0 ? 
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

            {/* Date Filter Card - Compact Version */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-xl shadow-lg border border-slate-200 p-3 mb-6"
            >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <FiCalendar className="text-blue-600 w-4 h-4" />
                        <span className="text-xs font-medium text-slate-700">Date Range:</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Opening Balance Icon - opens modal */}
                        <button
                            type="button"
                            onClick={handleOpenOpeningBalanceModal}
                            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50 transition-all shadow-sm"
                            title="Set Opening Balance"
                        >
                            <FiBarChart2 className="w-5 h-5 text-indigo-600" />
                        </button>
                        {/* DateRangePicker Component */}
                        <div className="min-w-[280px] flex-1 max-w-md">
                            <DateRangePicker
                                startDate={fromDate}
                                endDate={toDate}
                                onStartDateChange={setFromDate}
                                onEndDateChange={setToDate}
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            disabled={fetchingTransactions}
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-xs font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200 flex items-center gap-1"
                        >
                            {fetchingTransactions ? (
                                <>
                                    <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Loading...</span>
                                </>
                            ) : (
                                'Apply'
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
                            {/* Opening Balance Row - Always Show debit, credit, balance */}
                            <tr className="bg-blue-50/50 font-medium">
                                <td className="p-4 text-slate-600"></td>
                                <td className="p-4 text-slate-800" colSpan="2">Opening Balance</td>
                                <td className="p-4"></td>
                                <td className="p-4"></td>
                                <td className="p-4 text-right">
                                    {openingBalance.debit > 0 ? (
                                        <span className="text-sm font-semibold text-blue-600">₹{formatCurrency(openingBalance.debit)}</span>
                                    ) : (
                                        <span className="text-sm text-slate-600">₹{formatCurrency(0)}</span>
                                    )}
                                </td>
                                <td className="p-4 text-right">
                                    {openingBalance.credit > 0 ? (
                                        <span className="text-sm font-semibold text-orange-600">₹{formatCurrency(openingBalance.credit)}</span>
                                    ) : (
                                        <span className="text-sm text-slate-600">₹{formatCurrency(0)}</span>
                                    )}
                                </td>
                                <td className={`p-4 text-right font-bold ${(openingBalance.balance ?? 0) >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                                    ₹{formatCurrency(openingBalance.balance ?? 0)}
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
                                                <span className={`px-3 py-1 rounded-lg text-xs font-medium border w-fit ${getTransactionTypeColor(transaction)}`}>
                                                    {(transaction.transaction_type || 'N/A').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm font-mono text-slate-600">
                                                {transaction.invoice_no || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            {(() => {
                                                const amounts = getTransactionAmounts(transaction);
                                                return amounts.debit > 0 ? (
                                                    <span className="text-sm font-semibold text-blue-600">₹{formatCurrency(amounts.debit)}</span>
                                                ) : (
                                                    <span className="text-sm text-slate-600">₹{formatCurrency(0)}</span>
                                                );
                                            })()}
                                        </td>
                                        <td className="p-4 text-right">
                                            {(() => {
                                                const amounts = getTransactionAmounts(transaction);
                                                return amounts.credit > 0 ? (
                                                    <span className="text-sm font-semibold text-orange-600">₹{formatCurrency(amounts.credit)}</span>
                                                ) : (
                                                    <span className="text-sm text-slate-600">₹{formatCurrency(0)}</span>
                                                );
                                            })()}
                                        </td>
                                        <td className="p-4 text-right">
                                            <span className={`text-sm font-bold ${((getTransactionAmounts(transaction).balance) ?? 0) >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                                                ₹{formatCurrency(getTransactionAmounts(transaction).balance ?? 0)}
                                            </span>
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
                                                        onClick={() => handleViewDetails(transaction)}
                                                        className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-indigo-50 flex items-center gap-2 transition-colors"
                                                    >
                                                        <FiEye className="w-4 h-4 text-indigo-600" />
                                                        Details
                                                    </button>
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
                {!loading && !fetchingTransactions && (transactions.length > 0 || totalItems > 0) && totalPages > 0 && (
                    <div className="border-t border-slate-200 px-6 py-4 bg-white">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="text-sm text-slate-600">
                                    Showing {totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
                                </div>
                                <div className="flex items-center gap-2">
                                    <label htmlFor="limit-select" className="text-sm text-slate-500">Show</label>
                                    <select
                                        id="limit-select"
                                        value={itemsPerPage}
                                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                        className="px-2 py-1.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-700"
                                    >
                                        {LIMIT_OPTIONS.map((n) => (
                                            <option key={n} value={n}>{n}</option>
                                        ))}
                                    </select>
                                    <span className="text-sm text-slate-500">per page</span>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); handlePageChange(currentPage - 1); }}
                                        disabled={currentPage <= 1}
                                        className="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                                    >
                                        Previous
                                    </button>
                                    <span className="px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg min-w-[2.5rem] text-center">
                                        {currentPage}
                                    </span>
                                    <span className="text-slate-400 text-sm px-1">/</span>
                                    <span className="px-2 py-2 text-sm font-medium text-slate-600">
                                        {totalPages}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); handlePageChange(currentPage + 1); }}
                                        disabled={currentPage >= totalPages}
                                        className="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                                    >
                                        Next
                                    </button>
                                </div>
                                <form onSubmit={handlePageJump} className="flex items-center gap-2">
                                    <span className="text-sm text-slate-500">Go to</span>
                                    <input
                                        type="number"
                                        min={1}
                                        max={totalPages}
                                        value={pageJumpInput}
                                        onChange={(e) => setPageJumpInput(e.target.value)}
                                        placeholder={String(currentPage)}
                                        className="w-14 px-2 py-1.5 text-sm text-center border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <button
                                        type="submit"
                                        className="px-2 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                                    >
                                        Go
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Opening Balance Modal */}
            {showOpeningBalanceModal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    onClick={() => !openingBalanceSubmitting && setShowOpeningBalanceModal(false)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 px-6 py-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-xl">
                                        <FiBarChart2 className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">
                                            {openingBalanceData ? 'Edit' : 'Set'} Opening Balance
                                        </h2>
                                        <p className="text-indigo-200 text-sm mt-0.5">
                                            {clientProfile?.name || username}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => !openingBalanceSubmitting && setShowOpeningBalanceModal(false)}
                                    className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                                >
                                    <FiX className="w-6 h-6 text-white" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            {openingBalanceLoading ? (
                                <div className="py-12 flex justify-center">
                                    <svg className="animate-spin h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                </div>
                            ) : (
                                <form onSubmit={handleSetOpeningBalance} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Amount (₹) *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            required
                                            value={openingBalanceForm.amount}
                                            onChange={(e) => setOpeningBalanceForm(f => ({ ...f, amount: e.target.value }))}
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="0.00"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Type *</label>
                                        <select
                                            value={openingBalanceForm.type}
                                            onChange={(e) => setOpeningBalanceForm(f => ({ ...f, type: e.target.value }))}
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="credit">Credit (Client owes you)</option>
                                            <option value="debit">Debit (You owe client)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Transaction Date *</label>
                                        <input
                                            type="date"
                                            required
                                            value={openingBalanceForm.transaction_date}
                                            onChange={(e) => setOpeningBalanceForm(f => ({ ...f, transaction_date: e.target.value }))}
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Remark</label>
                                        <textarea
                                            rows={3}
                                            value={openingBalanceForm.remark}
                                            onChange={(e) => setOpeningBalanceForm(f => ({ ...f, remark: e.target.value }))}
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                                            placeholder="Optional note..."
                                        />
                                    </div>

                                    {openingBalanceData && (
                                        <p className="text-xs text-slate-500">
                                            Current: ₹{formatCurrency(openingBalanceData.amount)} ({openingBalanceData.type})
                                            {openingBalanceData.invoice_no && ` • ${openingBalanceData.invoice_no}`}
                                        </p>
                                    )}

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => !openingBalanceSubmitting && setShowOpeningBalanceModal(false)}
                                            className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={openingBalanceSubmitting || !openingBalanceForm.amount || parseFloat(openingBalanceForm.amount) <= 0}
                                            className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {openingBalanceSubmitting ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                    </svg>
                                                    Saving...
                                                </span>
                                            ) : (
                                                openingBalanceData ? 'Update' : 'Set Opening Balance'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Transaction Details Modal */}
            {detailsTransaction && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    onClick={() => setDetailsTransaction(null)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden bg-white rounded-2xl shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="sticky top-0 z-10 bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 px-6 py-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-xl">
                                        <FiFileText className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">
                                            Transaction Details
                                        </h2>
                                        <p className="text-indigo-200 text-sm mt-0.5">
                                            {(detailsTransaction.transaction_type || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} • {detailsTransaction.invoice_no || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setDetailsTransaction(null)}
                                    className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                                >
                                    <FiX className="w-6 h-6 text-white" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="overflow-y-auto p-6 space-y-6 max-h-[calc(90vh-180px)]">
                            {/* Basic Info */}
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Transaction Info</h3>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div><span className="text-slate-500">Date</span><p className="font-medium text-slate-800">{formatDate(detailsTransaction.transaction_date)} {formatTime(detailsTransaction.transaction_date)}</p></div>
                                    <div><span className="text-slate-500">Voucher No</span><p className="font-mono font-medium text-slate-800">{detailsTransaction.invoice_no || 'N/A'}</p></div>
                                    <div><span className="text-slate-500">Type</span><p className="font-medium text-slate-800">{(detailsTransaction.transaction_type || 'N/A').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</p></div>
                                    <div className="col-span-2"><span className="text-slate-500">Transaction ID</span><p className="font-mono text-xs text-slate-600 break-all">{detailsTransaction.transaction_id || 'N/A'}</p></div>
                                </div>
                            </div>

                            {/* Amounts */}
                            {(() => {
                                const amt = getTransactionAmounts(detailsTransaction);
                                return (
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Amounts</h3>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="bg-white rounded-lg p-3 border border-blue-100">
                                                <p className="text-xs text-slate-500 mb-1">Debit</p>
                                                <p className="text-lg font-bold text-blue-600">₹{formatCurrency(amt.debit)}</p>
                                            </div>
                                            <div className="bg-white rounded-lg p-3 border border-orange-100">
                                                <p className="text-xs text-slate-500 mb-1">Credit</p>
                                                <p className="text-lg font-bold text-orange-600">₹{formatCurrency(amt.credit)}</p>
                                            </div>
                                            <div className="bg-white rounded-lg p-3 border border-indigo-100">
                                                <p className="text-xs text-slate-500 mb-1">Balance</p>
                                                <p className={`text-lg font-bold ${(amt.balance ?? 0) >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>₹{formatCurrency(amt.balance ?? 0)}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Particulars - Dynamic based on type */}
                            {detailsTransaction.particular && (
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                                        Particulars {detailsTransaction.particular.type && `(${detailsTransaction.particular.type})`}
                                    </h3>
                                    {detailsTransaction.particular.type === 'bank' && detailsTransaction.particular.details ? (
                                        <div className="bg-white rounded-lg p-4 border border-indigo-100 space-y-2">
                                            <div className="flex items-center gap-2 mb-3">
                                                <FiHome className="w-5 h-5 text-indigo-600" />
                                                <span className="font-semibold text-slate-800">{detailsTransaction.particular.details.bank || 'Bank'}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div><span className="text-slate-500">Account No</span><p className="font-medium">{detailsTransaction.particular.details.account_no || '-'}</p></div>
                                                <div><span className="text-slate-500">Account Holder</span><p className="font-medium">{detailsTransaction.particular.details.holder || '-'}</p></div>
                                                <div><span className="text-slate-500">IFSC</span><p className="font-mono font-medium">{detailsTransaction.particular.details.ifsc || '-'}</p></div>
                                                <div><span className="text-slate-500">Branch</span><p className="font-medium">{detailsTransaction.particular.details.branch || '-'}</p></div>
                                                <div><span className="text-slate-500">Type</span><p className="font-medium capitalize">{detailsTransaction.particular.details.type || '-'}</p></div>
                                            </div>
                                            {detailsTransaction.particular.remark && (
                                                <div className="pt-2 mt-2 border-t border-slate-100">
                                                    <span className="text-slate-500 text-xs">Remark</span>
                                                    <p className="text-sm text-slate-700 mt-0.5">{detailsTransaction.particular.remark}</p>
                                                </div>
                                            )}
                                        </div>
                                    ) : detailsTransaction.particular.details && typeof detailsTransaction.particular.details === 'object' ? (
                                        <div className="bg-white rounded-lg p-4 border border-slate-200">
                                            <div className="space-y-2">
                                                {Object.entries(detailsTransaction.particular.details)
                                                    .filter(([, val]) => val != null && val !== '')
                                                    .map(([key, val]) => (
                                                        <div key={key} className="flex justify-between text-sm">
                                                            <span className="text-slate-500 capitalize">{key.replace(/_/g, ' ')}</span>
                                                            <span className="font-medium text-slate-800">{typeof val === 'object' ? JSON.stringify(val) : String(val)}</span>
                                                        </div>
                                                    ))}
                                            </div>
                                            {detailsTransaction.particular.remark && (
                                                <div className="pt-2 mt-2 border-t border-slate-100">
                                                    <span className="text-slate-500 text-xs">Remark</span>
                                                    <p className="text-sm text-slate-700 mt-0.5">{detailsTransaction.particular.remark}</p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-slate-600 text-sm">{JSON.stringify(detailsTransaction.particular)}</p>
                                    )}
                                </div>
                            )}

                            {/* Created By */}
                            {detailsTransaction.create_by && (
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Created By</h3>
                                    <div className="flex items-center gap-3 bg-white rounded-lg p-4 border border-slate-200">
                                        <div className="p-2 bg-indigo-100 rounded-full">
                                            <FiUser className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                                            <div><span className="text-slate-500">Name</span><p className="font-medium">{detailsTransaction.create_by.name || '-'}</p></div>
                                            <div><span className="text-slate-500">Username</span><p className="font-mono font-medium">{detailsTransaction.create_by.username || '-'}</p></div>
                                            {detailsTransaction.create_by.email && <div className="col-span-2 flex items-center gap-2"><FiMail className="w-4 h-4 text-slate-400" /><span className="text-slate-600">{detailsTransaction.create_by.email}</span></div>}
                                            {detailsTransaction.create_by.mobile && <div className="col-span-2 flex items-center gap-2"><FiPhone className="w-4 h-4 text-slate-400" /><span className="text-slate-600">+{detailsTransaction.create_by.country_code || ''} {detailsTransaction.create_by.mobile}</span></div>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Modified By - if different from create_by */}
                            {detailsTransaction.modify_by && JSON.stringify(detailsTransaction.modify_by) !== JSON.stringify(detailsTransaction.create_by) && (
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Modified By</h3>
                                    <div className="flex items-center gap-3 bg-white rounded-lg p-4 border border-slate-200">
                                        <div className="p-2 bg-amber-100 rounded-full">
                                            <FiUserCheck className="w-5 h-5 text-amber-600" />
                                        </div>
                                        <div className="text-sm">
                                            <p className="font-medium">{detailsTransaction.modify_by.name || '-'}</p>
                                            <p className="text-slate-500 text-xs">{detailsTransaction.modify_by.email || detailsTransaction.modify_by.username || ''}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Timestamps */}
                            <div className="flex gap-4 text-xs text-slate-500">
                                {detailsTransaction.create_date && <span>Created: {formatDate(detailsTransaction.create_date)} {formatTime(detailsTransaction.create_date)}</span>}
                                {detailsTransaction.modify_date && <span>Modified: {formatDate(detailsTransaction.modify_date)} {formatTime(detailsTransaction.modify_date)}</span>}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 border-t border-slate-200 bg-slate-50 px-6 py-4">
                            <button
                                onClick={() => setDetailsTransaction(null)}
                                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

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