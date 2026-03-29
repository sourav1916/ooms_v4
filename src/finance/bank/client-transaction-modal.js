// finance/bank/bank-modals.js
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoTrash, IoAdd } from "react-icons/io5";  
import { FiX,FiUser, FiDollarSign, FiShoppingBag, FiTruck, FiFileText, FiRepeat, FiPlus, FiTrash2, FiSearch, FiMail, FiPhone, FiCreditCard, FiHome, FiArrowRight, FiArrowLeft, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import API_BASE_URL from '../../utils/api-controller';
import getHeaders from '../../utils/get-headers';
import axios from 'axios';

const appSettings = {
    company_name: 'Professional Accounting Services',
    gst_applicable: true,
    default_gst_rate: 18,
    currency: 'INR',
};
// Base Modal Component
const BaseModal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    onClick={onClose}
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
                >
                    <div className="w-full max-w-3xl max-h-[90vh] overflow-hidden bg-white rounded-2xl shadow-2xl pointer-events-auto mx-4">
                        <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                            <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <FiX className="w-6 h-6 text-slate-500" />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-88px)]">
                            {children}
                        </div>
                    </div>
                </motion.div>
            </>
        </AnimatePresence>
    );
};

// Bank Search Component with Pagination
const BankSearchDropdown = ({ onSelect, selectedBankId, excludeBankId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [banks, setBanks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const fetchBanks = useCallback(async (search = '', pageNum = 1) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${API_BASE_URL}/transaction/bank/list?page_no=${pageNum}&limit=10&search=${search}`,
                { headers: getHeaders() }
            );
            
            if (response.data.success) {
                const bankData = response.data.data || [];
                // Filter out excluded bank if needed
                const filteredBanks = excludeBankId 
                    ? bankData.filter(bank => bank.bank_id !== excludeBankId)
                    : bankData;
                
                if (pageNum === 1) {
                    setBanks(filteredBanks);
                } else {
                    setBanks(prev => [...prev, ...filteredBanks]);
                }
                
                setHasMore(!response.data.is_last_page);
            }
        } catch (error) {
            console.error('Error fetching banks:', error);
            toast.error('Failed to fetch banks');
        } finally {
            setLoading(false);
        }
    }, [excludeBankId]);

    // Debounce search
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            setPage(1);
            fetchBanks(searchTerm, 1);
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [searchTerm, fetchBanks]);

    // Click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchBanks(searchTerm, nextPage);
    };

    const handleSelect = (bank) => {
        onSelect(bank);
        setSearchTerm(bank.bank);
        setShowDropdown(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    placeholder="Search bank by name, account, or IFSC..."
                    className="w-full px-4 py-3 pl-10 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                {loading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                    </div>
                )}
            </div>

            {showDropdown && (
                <div className="absolute z-20 mt-1 w-full bg-white border-2 border-slate-200 rounded-lg shadow-xl max-h-80 overflow-y-auto">
                    {banks.length > 0 ? (
                        <>
                            {banks.map((bank) => (
                                <button
                                    key={bank.bank_id}
                                    type="button"
                                    onClick={() => handleSelect(bank)}
                                    className={`w-full px-4 py-3 text-left hover:bg-blue-50 border-b border-slate-100 last:border-0 transition-colors ${
                                        selectedBankId === bank.bank_id ? 'bg-blue-50' : ''
                                    }`}
                                >
                                    <div className="font-medium text-slate-800">{bank.bank}</div>
                                    <div className="text-sm text-slate-500 flex items-center gap-3 mt-1">
                                        <span>A/c: {bank.account_no}</span>
                                        <span>•</span>
                                        <span>IFSC: {bank.ifsc}</span>
                                    </div>
                                    <div className="text-xs text-slate-400 flex items-center justify-between mt-1">
                                        <span>Branch: {bank.branch}</span>
                                        <span className="font-medium text-green-600">
                                            Bal: ₹{bank.balance?.toLocaleString()}
                                        </span>
                                    </div>
                                    {bank.remark && (
                                        <div className="text-xs text-slate-400 mt-1">
                                            Note: {bank.remark}
                                        </div>
                                    )}
                                </button>
                            ))}
                            
                            {/* Pagination Load More */}
                            {hasMore && (
                                <button
                                    type="button"
                                    onClick={loadMore}
                                    disabled={loading}
                                    className="w-full px-4 py-3 text-center bg-slate-50 hover:bg-slate-100 text-blue-600 font-medium text-sm border-t border-slate-200 transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Loading...' : 'Load More Banks'}
                                </button>
                            )}
                        </>
                    ) : (
                        <div className="p-4 text-center text-slate-500">
                            {loading ? 'Loading banks...' : 'No banks found'}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// Receive Modal - API Integrated with Bank Search (No Client Search)
export const ReceiveModal = ({ isOpen, onClose, bankDetails, bankId, onSubmit, formatCurrency, summary, clientUsername, clientName }) => {
    const [loading, setLoading] = useState(false);
    const [selectedBank, setSelectedBank] = useState(bankDetails);
    const [showBankSearch, setShowBankSearch] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedBank) {
            toast.error('Please select a bank');
            return;
        }

        const formData = new FormData(e.target);
        const amount = formData.get('amount');
        const date = formData.get('date');
        const description = formData.get('description');

        if (!amount || parseFloat(amount) <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        setLoading(true);
        
        const payload = {
            amount: parseFloat(amount),
            party1_id: clientUsername, // Client username as party1_id
            party1_type: "client",     // party1_type is client
            party2_id: selectedBank.bank_id, // Bank ID as party2_id
            party2_type: "bank",       // party2_type is bank
            remark: description || `Payment received from ${clientName}`,
            transaction_date: date
        };

        try {
            const response = await axios.post(
                `${API_BASE_URL}/transaction/payment/receive`,
                payload,
                { headers: getHeaders() }
            );

            if (response.data.success) {
                toast.success(response.data.message || 'Payment received successfully');
                onSubmit('RECEIVE', response.data.data);
                onClose();
                // Reset form
                setSelectedBank(bankDetails);
                setShowBankSearch(false);
            }
        } catch (error) {
            console.error('Error creating receive transaction:', error);
            toast.error(error.response?.data?.message || 'Failed to create receive transaction');
        } finally {
            setLoading(false);
        }
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Receive Payment from Client">
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Client Info - Read Only */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-blue-600 font-medium">Client</p>
                            <p className="text-lg font-semibold text-slate-800">{clientName}</p>
                            <p className="text-xs text-slate-500">Username: {clientUsername}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-blue-600 font-medium">Balance Summary</p>
                            <p className="text-sm text-green-600">Credit: ₹{formatCurrency(summary?.totalCredit || 0)}</p>
                            <p className="text-sm text-red-600">Debit: ₹{formatCurrency(summary?.totalDebit || 0)}</p>
                        </div>
                    </div>
                </div>

                {/* Bank Selection */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <label className="block text-sm font-medium text-blue-700 mb-2">
                        Select Bank Account <span className="text-red-500">*</span>
                    </label>
                    
                    {!showBankSearch ? (
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-slate-800">{selectedBank?.bank || 'No bank selected'}</p>
                                {selectedBank && (
                                    <p className="text-sm text-slate-600">
                                        A/c: {selectedBank?.account_no} | Balance: ₹{formatCurrency(selectedBank?.balance || 0)}
                                    </p>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowBankSearch(true)}
                                className="px-3 py-1 text-sm bg-white border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50"
                            >
                                {selectedBank ? 'Change Bank' : 'Select Bank'}
                            </button>
                        </div>
                    ) : (
                        <BankSearchDropdown 
                            onSelect={(bank) => {
                                setSelectedBank(bank);
                                setShowBankSearch(false);
                            }}
                            selectedBankId={selectedBank?.bank_id}
                        />
                    )}
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="date"
                                defaultValue={new Date().toISOString().split('T')[0]}
                                required
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Amount <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="amount"
                                placeholder="Enter amount"
                                required
                                min="0.01"
                                step="0.01"
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Description / Remark
                        </label>
                        <textarea
                            name="description"
                            placeholder="Enter description or remark"
                            rows="2"
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <p className="text-xs text-slate-600 mb-1">Transaction Summary</p>
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">Receiving from:</span>
                            <span className="text-blue-600">{clientName}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-1">
                            <span className="font-medium">To Bank:</span>
                            <span className="text-blue-600">{selectedBank?.bank || 'Not selected'}</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-slate-200">
                    <button
                        type="submit"
                        disabled={loading || !selectedBank}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-base font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </>
                        ) : (
                            'Receive Payment'
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-lg text-base font-medium hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </BaseModal>
    );
};

// Payment Modal - API Integrated with Bank Search
export const PaymentModal = ({ isOpen, onClose, bankDetails, bankId, onSubmit, formatCurrency, summary, clientUsername, clientName }) => {
    const [loading, setLoading] = useState(false);
    const [selectedBank, setSelectedBank] = useState(bankDetails);
    const [showBankSearch, setShowBankSearch] = useState(false);

    // Initialize selectedBank when bankDetails is available
    useEffect(() => {
        if (bankDetails && bankDetails.bank_id) {
            setSelectedBank(bankDetails);
        }
    }, [bankDetails]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log('PaymentModal - Form submitted');
        console.log('Selected bank:', selectedBank);
        console.log('Client username:', clientUsername);
        console.log('Client name:', clientName);
        
        if (!selectedBank) {
            toast.error('Please select a bank');
            return;
        }

        if (!clientUsername) {
            toast.error('Client information not available');
            return;
        }

        const formData = new FormData(e.target);
        const amount = formData.get('amount');
        const date = formData.get('date');
        const description = formData.get('description');
        const paymentMode = formData.get('payment_mode');

        console.log('Form values:', { amount, date, description, paymentMode });

        if (!amount || parseFloat(amount) <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        // Check if sufficient balance
        if (parseFloat(amount) > (selectedBank?.balance || 0)) {
            toast.error('Insufficient balance in bank account');
            return;
        }

        setLoading(true);
        
        const payload = {
            amount: parseFloat(amount),
            party1_id: selectedBank.bank_id,  // Bank ID as party1_id
            party1_type: "bank",              // party1_type is bank
            party2_id: clientUsername,        // Client username as party2_id
            party2_type: "client",            // party2_type is client
            remark: description || `Payment made to ${clientName} via ${paymentMode}`,
            transaction_date: date
        };

        console.log('Payment payload:', JSON.stringify(payload, null, 2));

        try {
            const response = await axios.post(
                `${API_BASE_URL}/transaction/payment/payment`,
                payload,
                { headers: getHeaders() }
            );

            console.log('Payment response:', response.data);

            if (response.data.success) {
                toast.success(response.data.message || 'Payment made successfully');
                if (onSubmit) {
                    onSubmit('PAYMENT', response.data.data);
                }
                onClose();
                // Reset form
                setSelectedBank(bankDetails);
                setShowBankSearch(false);
                e.target.reset();
            } else {
                toast.error(response.data.message || 'Payment failed');
            }
        } catch (error) {
            console.error('Error creating payment transaction:', error);
            console.error('Error response:', error.response?.data);
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to create payment transaction';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Make Payment to Client">
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Client Info - Read Only */}
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-red-600 font-medium">Client</p>
                            <p className="text-lg font-semibold text-slate-800">{clientName}</p>
                            <p className="text-xs text-slate-500">Username: {clientUsername}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-red-600 font-medium">Balance Summary</p>
                            <p className="text-sm text-green-600">Credit: ₹{formatCurrency(summary?.totalCredit || 0)}</p>
                            <p className="text-sm text-red-600">Debit: ₹{formatCurrency(summary?.totalDebit || 0)}</p>
                        </div>
                    </div>
                </div>

                {/* Bank Selection */}
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <label className="block text-sm font-medium text-red-700 mb-2">
                        Select Bank Account <span className="text-red-500">*</span>
                    </label>
                    
                    {!showBankSearch ? (
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-slate-800">{selectedBank?.bank || 'No bank selected'}</p>
                                {selectedBank && (
                                    <p className="text-sm text-slate-600">
                                        A/c: {selectedBank?.account_no} | Balance: ₹{formatCurrency(selectedBank?.balance || 0)}
                                    </p>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowBankSearch(true)}
                                className="px-3 py-1 text-sm bg-white border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                            >
                                {selectedBank ? 'Change Bank' : 'Select Bank'}
                            </button>
                        </div>
                    ) : (
                        <BankSearchDropdown 
                            onSelect={(bank) => {
                                setSelectedBank(bank);
                                setShowBankSearch(false);
                            }}
                            selectedBankId={selectedBank?.bank_id}
                        />
                    )}
                </div>

                <div className="space-y-4">
                    {/* Form Fields */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="date"
                                defaultValue={new Date().toISOString().split('T')[0]}
                                required
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Amount <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="amount"
                                placeholder="Enter amount"
                                required
                                min="0.01"
                                step="0.01"
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Payment Mode <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="payment_mode"
                            required
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="cash">Cash</option>
                            <option value="cheque">Cheque</option>
                            <option value="online">Online Transfer</option>
                            <option value="card">Card</option>
                            <option value="upi">UPI</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Description / Remark
                        </label>
                        <textarea
                            name="description"
                            placeholder="Enter description or remark"
                            rows="2"
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <p className="text-xs text-slate-600 mb-1">Transaction Summary</p>
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">Paying to:</span>
                            <span className="text-red-600">{clientName}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-1">
                            <span className="font-medium">From Bank:</span>
                            <span className="text-red-600">{selectedBank?.bank || 'Not selected'}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-1">
                            <span className="font-medium">Bank ID:</span>
                            <span className="text-gray-600">{selectedBank?.bank_id || 'Not selected'}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-1">
                            <span className="font-medium">Client Username:</span>
                            <span className="text-gray-600">{clientUsername}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-1">
                            <span className="font-medium">Available Balance:</span>
                            <span className="text-green-600">₹{formatCurrency(selectedBank?.balance || 0)}</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-slate-200">
                    <button
                        type="submit"
                        disabled={loading || !selectedBank}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg text-base font-medium hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </>
                        ) : (
                            'Make Payment'
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-lg text-base font-medium hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </BaseModal>
    );
};
// Sale Modal - UI Only with Bank Search
export const SaleModal = ({ isOpen, onClose, onSubmit, formatCurrency, clientUsername, clientName, clientId }) => {
    const [formData, setFormData] = useState({
        payment_date: new Date().toISOString().split('T')[0],
        items: [{ service_id: '', description: '', price: '', amount: 0, remark: '' }],
        subtotal: 0,
        discount: 0,
        discount_type: 'percentage',
        sgst_rate: appSettings.gst_applicable ? appSettings.default_gst_rate / 2 : 0,
        cgst_rate: appSettings.gst_applicable ? appSettings.default_gst_rate / 2 : 0,
        sgst_amount: 0,
        cgst_amount: 0,
        round_off: 0,
        grand_total: 0,
        notes: '',
        tax_rate: appSettings.default_gst_rate,
        additional_charge: 0,
        apply_round_off: false
    });

    const [serviceOptions, setServiceOptions] = useState([]);
    const [isLoadingServices, setIsLoadingServices] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sendEmail, setSendEmail] = useState(true);
    const [sendWhatsApp, setSendWhatsApp] = useState(true);

    useEffect(() => {
        if (isOpen) {
            fetchServices();
            resetForm();
        }
    }, [isOpen]);

    const fetchServices = async () => {
        setIsLoadingServices(true);
        try {
            const response = await fetch(`${API_BASE_URL}/service/list?search=&category_id`, {
                method: 'GET',
                headers: getHeaders()
            });
            const data = await response.json();
            if (data.success) {
                setServiceOptions(data.data.map(service => ({
                    service_id: service.service_id,
                    name: service.name,
                    fees: parseFloat(service.fees),
                    category: service.category_name,
                    remark: service.remark
                })));
            }
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setIsLoadingServices(false);
        }
    };

    const resetForm = () => {
        setFormData({
            payment_date: new Date().toISOString().split('T')[0],
            items: [{ service_id: '', description: '', price: '', amount: 0, remark: '' }],
            subtotal: 0,
            discount: 0,
            discount_type: 'percentage',
            sgst_rate: appSettings.gst_applicable ? appSettings.default_gst_rate / 2 : 0,
            cgst_rate: appSettings.gst_applicable ? appSettings.default_gst_rate / 2 : 0,
            sgst_amount: 0,
            cgst_amount: 0,
            round_off: 0,
            grand_total: 0,
            notes: '',
            tax_rate: appSettings.default_gst_rate,
            additional_charge: 0,
            apply_round_off: false
        });
    };

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [
                ...prev.items,
                { service_id: '', description: '', price: '', amount: 0, remark: '' }
            ]
        }));
    };

    const removeItem = (index) => {
        if (formData.items.length > 1) {
            setFormData(prev => ({
                ...prev,
                items: prev.items.filter((_, i) => i !== index)
            }));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'additional_charge' || name === 'discount' ? parseFloat(value) || 0 : value
        }));
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = formData.items.map((item, i) => {
            if (i === index) {
                const updatedItem = {
                    ...item,
                    [field]: field === 'price' ? parseFloat(value) || 0 : value
                };
                updatedItem.amount = updatedItem.price || 0;
                return updatedItem;
            }
            return item;
        });

        setFormData(prev => ({ ...prev, items: updatedItems }));
    };

    const handleServiceChange = (index, serviceId) => {
        const service = serviceOptions.find(s => s.service_id === serviceId);
        if (service) {
            const updatedItems = formData.items.map((item, i) =>
                i === index ? {
                    ...item,
                    service_id: serviceId,
                    price: parseFloat(service.fees),
                    amount: parseFloat(service.fees),
                    description: service.name,
                    remark: service.remark || ''
                } : item
            );

            setFormData(prev => ({
                ...prev,
                items: updatedItems
            }));
        }
    };

    // Calculate totals
    useEffect(() => {
        let subtotal = 0;
        formData.items.forEach(item => {
            subtotal += Number(item.amount) || 0;
        });

        let discountAmount = 0;
        if (formData.discount > 0) {
            if (formData.discount_type === 'percentage') {
                discountAmount = subtotal * (Number(formData.discount) / 100);
            } else {
                discountAmount = Number(formData.discount) || 0;
            }
        }

        const amountAfterDiscount = Math.max(0, subtotal - discountAmount);
        
        const sgst_amount = amountAfterDiscount * (Number(formData.sgst_rate) / 100);
        const cgst_amount = amountAfterDiscount * (Number(formData.cgst_rate) / 100);
        
        let grand_total = amountAfterDiscount + sgst_amount + cgst_amount + (Number(formData.additional_charge) || 0);
        
        let round_off = 0;
        if (formData.apply_round_off) {
            round_off = Math.round(grand_total) - grand_total;
            grand_total = Math.round(grand_total);
        }

        setFormData(prev => ({
            ...prev,
            subtotal,
            sgst_amount,
            cgst_amount,
            round_off,
            grand_total
        }));
    }, [formData.items, formData.discount, formData.discount_type, formData.sgst_rate, formData.cgst_rate, formData.additional_charge, formData.apply_round_off]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (isSubmitting) return;

        const hasValidItems = formData.items.some(item => item.service_id && item.price > 0);
        if (!hasValidItems) {
            alert('Please add at least one valid service item');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                transaction_date: formData.payment_date,
                remark: formData.notes,
                tax_rate: formData.tax_rate,
                items: formData.items
                    .filter(item => item.service_id && item.price > 0)
                    .map(item => ({
                        service_id: item.service_id,
                        fees: item.price,
                        remark: item.remark || item.description
                    })),
                additional_charge: Number(formData.additional_charge) || 0,
                round_off: formData.apply_round_off
            };

            if (formData.discount > 0) {
                payload.discount_type = formData.discount_type;
                if (formData.discount_type === 'percentage') {
                    payload.discount_perc_rate = Number(formData.discount);
                } else {
                    payload.discount_value = Number(formData.discount);
                }
            } else {
                payload.discount_type = 'not applicable';
            }

            payload.username = clientUsername;
            payload.user_type = 'client';
            payload.firm_id = clientId;

            const response = await fetch(`${API_BASE_URL}/sale/create/user`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.success) {
                const submissionData = {
                    ...formData,
                    clientName,
                    clientUsername,
                    timestamp: new Date().toISOString(),
                    api_response: data,
                    notifications: {
                        email: sendEmail,
                        whatsapp: sendWhatsApp
                    }
                };
                onSubmit('SALE', submissionData);
                onClose();
            } else {
                throw new Error(data.message || 'Failed to create sale');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert(error.message || 'Error creating sale. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatCurrencyLocal = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity" onClick={onClose} />
                <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl max-h-[90vh] flex flex-col">
                    {/* Header */}
                    <div className="flex-shrink-0 flex items-center justify-between p-4 border-b bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-xl">
                        <div>
                            <h2 className="text-lg font-bold">Create Sale Invoice</h2>
                            <p className="text-green-100 text-xs">{clientName}</p>
                        </div>
                        <button onClick={onClose} className="p-1 hover:bg-green-500 rounded-lg">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-5 bg-gray-50">
                        <form onSubmit={handleSubmit}>
                            {/* Client Info */}
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-5">
                                <p className="text-xs text-green-600 font-medium">Client</p>
                                <p className="text-lg font-semibold text-slate-800">{clientName}</p>
                                <p className="text-xs text-slate-500">Username: {clientUsername}</p>
                            </div>

                            {/* Date */}
                            <div className="mb-5">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="payment_date"
                                    value={formData.payment_date}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>

                            {/* Services Table */}
                            <div className="mb-5">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-base font-bold text-gray-900">Services & Items</h3>
                                    <button
                                        type="button"
                                        onClick={addItem}
                                        className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                                    >
                                        <IoAdd className="w-4 h-4 mr-1" />
                                        Add Service
                                    </button>
                                </div>

                                <div className="overflow-x-auto border border-gray-300 rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Service</th>
                                                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Description</th>
                                                <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">Price</th>
                                                <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700 w-12">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {formData.items.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="px-3 py-2">
                                                        <select
                                                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                                                            value={item.service_id}
                                                            onChange={(e) => handleServiceChange(index, e.target.value)}
                                                            required
                                                        >
                                                            <option value="">Select Service</option>
                                                            {serviceOptions.map(service => (
                                                                <option key={service.service_id} value={service.service_id}>
                                                                    {service.name} - ₹{service.fees}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        <input
                                                            type="text"
                                                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                            placeholder="Description"
                                                            value={item.description}
                                                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                                        />
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        <input
                                                            type="number"
                                                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-right"
                                                            placeholder="0"
                                                            value={item.price}
                                                            onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                                                            required
                                                        />
                                                    </td>
                                                    <td className="px-3 py-2 text-center">
                                                        {formData.items.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeItem(index)}
                                                                className="text-red-500 hover:bg-red-50 p-1 rounded"
                                                            >
                                                                <IoTrash className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Additional Settings */}
                            <div className="grid grid-cols-2 gap-4 mb-5">
                                <div className="bg-white p-3 rounded-lg border">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Additional Charge (₹)</label>
                                    <input
                                        type="number"
                                        name="additional_charge"
                                        value={formData.additional_charge}
                                        onChange={handleInputChange}
                                        className="w-full px-2 py-1 border rounded text-sm"
                                        min="0"
                                    />
                                </div>
                                <div className="bg-white p-3 rounded-lg border flex items-center">
                                    <input
                                        type="checkbox"
                                        id="round_off"
                                        checked={formData.apply_round_off}
                                        onChange={(e) => setFormData(prev => ({ ...prev, apply_round_off: e.target.checked }))}
                                        className="mr-2"
                                    />
                                    <label htmlFor="round_off" className="text-xs font-medium text-gray-700">Apply Round Off</label>
                                </div>
                            </div>

                            {/* Discount Section */}
                            <div className="bg-white p-4 rounded-lg border mb-5">
                                <h4 className="text-sm font-bold mb-3">Discount</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <select
                                        name="discount_type"
                                        value={formData.discount_type}
                                        onChange={handleInputChange}
                                        className="px-2 py-1 border rounded text-sm"
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="flat">Flat Amount (₹)</option>
                                    </select>
                                    <input
                                        type="number"
                                        name="discount"
                                        value={formData.discount}
                                        onChange={handleInputChange}
                                        placeholder={formData.discount_type === 'percentage' ? 'Percentage' : 'Amount'}
                                        className="px-2 py-1 border rounded text-sm"
                                        min="0"
                                    />
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="mb-5">
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    placeholder="Additional notes..."
                                    className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
                                    rows="2"
                                />
                            </div>

                            {/* Summary */}
                            <div className="bg-gradient-to-br from-green-50 to-white p-4 rounded-lg border border-green-100">
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span className="font-semibold">{formatCurrencyLocal(formData.subtotal)}</span>
                                    </div>
                                    {formData.discount > 0 && (
                                        <div className="flex justify-between text-red-600">
                                            <span>Discount:</span>
                                            <span>-{formatCurrencyLocal(formData.discount_type === 'percentage' 
                                                ? formData.subtotal * (formData.discount / 100) 
                                                : formData.discount)}</span>
                                        </div>
                                    )}
                                    {appSettings.gst_applicable && (
                                        <>
                                            <div className="flex justify-between">
                                                <span>SGST ({formData.sgst_rate}%):</span>
                                                <span>{formatCurrencyLocal(formData.sgst_amount)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>CGST ({formData.cgst_rate}%):</span>
                                                <span>{formatCurrencyLocal(formData.cgst_amount)}</span>
                                            </div>
                                        </>
                                    )}
                                    {formData.additional_charge > 0 && (
                                        <div className="flex justify-between">
                                            <span>Additional Charge:</span>
                                            <span>{formatCurrencyLocal(formData.additional_charge)}</span>
                                        </div>
                                    )}
                                    <div className="pt-2 border-t">
                                        <div className="flex justify-between font-bold">
                                            <span>Grand Total:</span>
                                            <span className="text-green-700 text-lg">{formatCurrencyLocal(formData.grand_total)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="flex-shrink-0 border-t bg-white p-4 rounded-b-xl">
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-4">
                                <label className="flex items-center cursor-pointer">
                                    <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} className="mr-2" />
                                    <span className="text-xs">Email Invoice</span>
                                </label>
                                <label className="flex items-center cursor-pointer">
                                    <input type="checkbox" checked={sendWhatsApp} onChange={(e) => setSendWhatsApp(e.target.checked)} className="mr-2" />
                                    <span className="text-xs">WhatsApp Invoice</span>
                                </label>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={isSubmitting || formData.items.every(item => !item.service_id)}
                                className="flex-1 px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium hover:from-green-700 hover:to-green-800 disabled:opacity-50 transition-all"
                            >
                                {isSubmitting ? 'Creating...' : 'Create Sale Invoice'}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const PurchaseModal = ({ isOpen, onClose, onSubmit, formatCurrency, clientUsername, clientName, clientId }) => {
    const [formData, setFormData] = useState({
        purchase_date: new Date().toISOString().split('T')[0],
        items: [{ service_id: '', description: '', price: '', amount: 0, remark: '' }],
        subtotal: 0,
        sgst_rate: 9, // 18% total GST, 9% each
        cgst_rate: 9,
        sgst_amount: 0,
        cgst_amount: 0,
        round_off: 0,
        grand_total: 0,
        notes: '',
        tax_rate: 18
    });

    const [serviceOptions, setServiceOptions] = useState([]);
    const [isLoadingServices, setIsLoadingServices] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sendEmail, setSendEmail] = useState(true);
    const [sendWhatsApp, setSendWhatsApp] = useState(true);

    useEffect(() => {
        if (isOpen) {
            fetchServices();
            resetForm();
        }
    }, [isOpen]);

    const fetchServices = async () => {
        setIsLoadingServices(true);
        try {
            const response = await fetch(`${API_BASE_URL}/service/list?search=&category_id`, {
                method: 'GET',
                headers: getHeaders()
            });
            const data = await response.json();
            if (data.success) {
                setServiceOptions(data.data.map(service => ({
                    service_id: service.service_id,
                    name: service.name,
                    fees: parseFloat(service.fees),
                    category: service.category_name,
                    remark: service.remark
                })));
            }
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setIsLoadingServices(false);
        }
    };

    const resetForm = () => {
        setFormData({
            purchase_date: new Date().toISOString().split('T')[0],
            items: [{ service_id: '', description: '', price: '', amount: 0, remark: '' }],
            subtotal: 0,
            sgst_rate: 9,
            cgst_rate: 9,
            sgst_amount: 0,
            cgst_amount: 0,
            round_off: 0,
            grand_total: 0,
            notes: '',
            tax_rate: 18
        });
    };

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [
                ...prev.items,
                { service_id: '', description: '', price: '', amount: 0, remark: '' }
            ]
        }));
    };

    const removeItem = (index) => {
        if (formData.items.length > 1) {
            setFormData(prev => ({
                ...prev,
                items: prev.items.filter((_, i) => i !== index)
            }));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = formData.items.map((item, i) => {
            if (i === index) {
                const updatedItem = {
                    ...item,
                    [field]: field === 'price' ? parseFloat(value) || 0 : value
                };
                updatedItem.amount = updatedItem.price || 0;
                return updatedItem;
            }
            return item;
        });

        setFormData(prev => ({ ...prev, items: updatedItems }));
    };

    const handleServiceChange = (index, serviceId) => {
        const service = serviceOptions.find(s => s.service_id === serviceId);
        if (service) {
            const updatedItems = formData.items.map((item, i) =>
                i === index ? {
                    ...item,
                    service_id: serviceId,
                    price: parseFloat(service.fees),
                    amount: parseFloat(service.fees),
                    description: service.name,
                    remark: service.remark || ''
                } : item
            );

            setFormData(prev => ({
                ...prev,
                items: updatedItems
            }));
        }
    };

    // Calculate totals
    useEffect(() => {
        let subtotal = 0;
        formData.items.forEach(item => {
            subtotal += Number(item.amount) || 0;
        });

        const sgst_amount = subtotal * (Number(formData.sgst_rate) / 100);
        const cgst_amount = subtotal * (Number(formData.cgst_rate) / 100);
        
        let grand_total = subtotal + sgst_amount + cgst_amount;
        
        let round_off = 0;

        setFormData(prev => ({
            ...prev,
            subtotal,
            sgst_amount,
            cgst_amount,
            round_off,
            grand_total
        }));
    }, [formData.items, formData.sgst_rate, formData.cgst_rate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (isSubmitting) return;

        const hasValidItems = formData.items.some(item => item.service_id && item.price > 0);
        if (!hasValidItems) {
            alert('Please add at least one valid service item');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                transaction_date: formData.purchase_date,
                remark: formData.notes,
                tax_rate: formData.tax_rate,
                items: formData.items
                    .filter(item => item.service_id && item.price > 0)
                    .map(item => ({
                        service_id: item.service_id,
                        fees: item.price,
                        remark: item.remark || item.description
                    }))
            };

            payload.username = clientUsername;
            payload.user_type = 'client';

            const response = await fetch(`${API_BASE_URL}/purchase/create/user`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.success) {
                const submissionData = {
                    ...formData,
                    clientName,
                    clientUsername,
                    timestamp: new Date().toISOString(),
                    api_response: data,
                    notifications: {
                        email: sendEmail,
                        whatsapp: sendWhatsApp
                    }
                };
                onSubmit('PURCHASE', submissionData);
                onClose();
            } else {
                throw new Error(data.message || 'Failed to create purchase');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert(error.message || 'Error creating purchase. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatCurrencyLocal = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity" onClick={onClose} />
                <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl max-h-[90vh] flex flex-col">
                    {/* Header */}
                    <div className="flex-shrink-0 flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-xl">
                        <div>
                            <h2 className="text-lg font-bold">Create Purchase Bill</h2>
                            <p className="text-purple-100 text-xs">{clientName}</p>
                        </div>
                        <button onClick={onClose} className="p-1 hover:bg-purple-500 rounded-lg">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-5 bg-gray-50">
                        <form onSubmit={handleSubmit}>
                            {/* Client Info */}
                            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 mb-5">
                                <p className="text-xs text-purple-600 font-medium">Client</p>
                                <p className="text-lg font-semibold text-slate-800">{clientName}</p>
                                <p className="text-xs text-slate-500">Username: {clientUsername}</p>
                            </div>

                            {/* Date */}
                            <div className="mb-5">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Bill Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="purchase_date"
                                    value={formData.purchase_date}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                />
                            </div>

                            {/* Items Table */}
                            <div className="mb-5">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-base font-bold text-gray-900">Purchase Items</h3>
                                    <button
                                        type="button"
                                        onClick={addItem}
                                        className="inline-flex items-center px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                                    >
                                        <IoAdd className="w-4 h-4 mr-1" />
                                        Add Item
                                    </button>
                                </div>

                                <div className="overflow-x-auto border border-gray-300 rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Service/Item</th>
                                                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Description</th>
                                                <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">Price</th>
                                                <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700 w-12">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {formData.items.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="px-3 py-2">
                                                        <select
                                                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                                                            value={item.service_id}
                                                            onChange={(e) => handleServiceChange(index, e.target.value)}
                                                            required
                                                            disabled={isLoadingServices}
                                                        >
                                                            <option value="">Select Service</option>
                                                            {serviceOptions.map(service => (
                                                                <option key={service.service_id} value={service.service_id}>
                                                                    {service.name} - ₹{service.fees}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        <input
                                                            type="text"
                                                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                            placeholder="Description"
                                                            value={item.description}
                                                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                                        />
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        <input
                                                            type="number"
                                                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-right"
                                                            placeholder="0"
                                                            value={item.price}
                                                            onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                                                            required
                                                        />
                                                    </td>
                                                    <td className="px-3 py-2 text-center">
                                                        {formData.items.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeItem(index)}
                                                                className="text-red-500 hover:bg-red-50 p-1 rounded"
                                                            >
                                                                <IoTrash className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="mb-5">
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    placeholder="Additional notes..."
                                    className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
                                    rows="2"
                                />
                            </div>

                            {/* Summary */}
                            <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-lg border border-purple-100">
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span className="font-semibold">{formatCurrencyLocal(formData.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>SGST ({formData.sgst_rate}%):</span>
                                        <span>{formatCurrencyLocal(formData.sgst_amount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>CGST ({formData.cgst_rate}%):</span>
                                        <span>{formatCurrencyLocal(formData.cgst_amount)}</span>
                                    </div>
                                    <div className="pt-2 border-t">
                                        <div className="flex justify-between font-bold">
                                            <span>Total Payable:</span>
                                            <span className="text-purple-700 text-lg">{formatCurrencyLocal(formData.grand_total)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="flex-shrink-0 border-t bg-white p-4 rounded-b-xl">
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-4">
                                <label className="flex items-center cursor-pointer">
                                    <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} className="mr-2" />
                                    <span className="text-xs">Email Bill</span>
                                </label>
                                <label className="flex items-center cursor-pointer">
                                    <input type="checkbox" checked={sendWhatsApp} onChange={(e) => setSendWhatsApp(e.target.checked)} className="mr-2" />
                                    <span className="text-xs">WhatsApp Bill</span>
                                </label>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={isSubmitting || formData.items.every(item => !item.service_id)}
                                className="flex-1 px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 transition-all"
                            >
                                {isSubmitting ? 'Creating...' : 'Create Purchase Bill'}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Expense Modal - UI Only with Bank Search
export const ExpenseModal = ({ isOpen, onClose, bankDetails, bankId, onSubmit, formatCurrency, clientUsername, clientName }) => {
    const [selectedBank, setSelectedBank] = useState(bankDetails);
    const [showBankSearch, setShowBankSearch] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!selectedBank) {
            toast.error('Please select a bank');
            return;
        }

        const formData = new FormData(e.target);
        const data = {
            ...Object.fromEntries(formData),
            bank: selectedBank,
            clientName: clientName,
            clientUsername: clientUsername
        };
        onSubmit('EXPENSE', data);
        toast.success('Expense created successfully (Demo)');
        onClose();
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Create Expense">
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Client Info - Read Only */}
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-orange-600 font-medium">Client</p>
                            <p className="text-lg font-semibold text-slate-800">{clientName}</p>
                            <p className="text-xs text-slate-500">Username: {clientUsername}</p>
                        </div>
                    </div>
                </div>

                {/* Bank Selection */}
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <label className="block text-sm font-medium text-orange-700 mb-2">
                        Select Bank Account <span className="text-red-500">*</span>
                    </label>
                    
                    {!showBankSearch ? (
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-slate-800">{selectedBank?.bank || 'No bank selected'}</p>
                                {selectedBank && (
                                    <p className="text-sm text-slate-600">
                                        A/c: {selectedBank?.account_no} | Balance: ₹{formatCurrency(selectedBank?.balance || 0)}
                                    </p>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowBankSearch(true)}
                                className="px-3 py-1 text-sm bg-white border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50"
                            >
                                {selectedBank ? 'Change Bank' : 'Select Bank'}
                            </button>
                        </div>
                    ) : (
                        <BankSearchDropdown 
                            onSelect={(bank) => {
                                setSelectedBank(bank);
                                setShowBankSearch(false);
                            }}
                            selectedBankId={selectedBank?.bank_id}
                        />
                    )}
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Payee Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="payee"
                            placeholder="Enter payee name"
                            required
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="date"
                                defaultValue={new Date().toISOString().split('T')[0]}
                                required
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Amount <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="amount"
                                placeholder="Enter amount"
                                required
                                min="0.01"
                                step="0.01"
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="category"
                            required
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        >
                            <option value="">Select Category</option>
                            <option value="rent">Rent</option>
                            <option value="salary">Salary</option>
                            <option value="electricity">Electricity</option>
                            <option value="travel">Travel</option>
                            <option value="office">Office Expenses</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Payment Mode <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="payment_mode"
                            required
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        >
                            <option value="cash">Cash</option>
                            <option value="cheque">Cheque</option>
                            <option value="online">Online Transfer</option>
                            <option value="card">Card</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            placeholder="Enter description"
                            rows="2"
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                    </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-200">
                    <button
                        type="submit"
                        disabled={!selectedBank}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg text-base font-medium hover:from-orange-700 hover:to-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200"
                    >
                        Create Expense
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-lg text-base font-medium hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </BaseModal>
    );
};

// Journal Modal - UI Only with Client Search for client-to-client transfers
export const JournalModal = ({ isOpen, onClose, bankDetails, bankId, onSubmit, formatCurrency, clientUsername, clientName }) => {
    const [selectedFromClient, setSelectedFromClient] = useState(null);
    const [selectedToClient, setSelectedToClient] = useState(null);
    const [showFromClientSearch, setShowFromClientSearch] = useState(false);
    const [showToClientSearch, setShowToClientSearch] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Search terms for client search
    const [fromSearchTerm, setFromSearchTerm] = useState('');
    const [toSearchTerm, setToSearchTerm] = useState('');
    const [fromClients, setFromClients] = useState([]);
    const [toClients, setToClients] = useState([]);
    const [loadingFrom, setLoadingFrom] = useState(false);
    const [loadingTo, setLoadingTo] = useState(false);
    const [fromPage, setFromPage] = useState(1);
    const [toPage, setToPage] = useState(1);
    const [hasMoreFrom, setHasMoreFrom] = useState(true);
    const [hasMoreTo, setHasMoreTo] = useState(true);
    
    const fromDropdownRef = useRef(null);
    const toDropdownRef = useRef(null);

    // Auto-select the current client when modal opens
    useEffect(() => {
        if (isOpen && clientUsername) {
            // Create current client object from props
            const currentClient = {
                id: clientUsername,
                username: clientUsername,
                name: clientName || clientUsername,
                email: '',
                contact: '',
                balance: '0'
            };
            setSelectedFromClient(currentClient);
        }
    }, [isOpen, clientUsername, clientName]);

    // Fetch clients for FROM dropdown
    const fetchFromClients = useCallback(async (search = '', pageNum = 1, append = false) => {
        setLoadingFrom(true);
        try {
            const response = await axios.get(
                `${API_BASE_URL}/client/search?page_no=${pageNum}&limit=10&search=${search}`,
                { headers: getHeaders() }
            );
            
            if (response.data.success) {
                const clientData = response.data.data || [];
                const formattedClients = clientData.map(client => ({
                    id: client.username,
                    name: client.name || client.username,
                    username: client.username,
                    email: client.email || '',
                    contact: client.phone || '',
                    balance: client.balance || '0'
                }));
                
                if (append) {
                    setFromClients(prev => [...prev, ...formattedClients]);
                } else {
                    setFromClients(formattedClients);
                }
                
                setHasMoreFrom(!response.data.is_last_page);
            }
        } catch (error) {
            console.error('Error fetching from clients:', error);
        } finally {
            setLoadingFrom(false);
        }
    }, []);

    // Fetch clients for TO dropdown
    const fetchToClients = useCallback(async (search = '', pageNum = 1, append = false) => {
        setLoadingTo(true);
        try {
            const response = await axios.get(
                `${API_BASE_URL}/client/search?page_no=${pageNum}&limit=10&search=${search}`,
                { headers: getHeaders() }
            );
            
            if (response.data.success) {
                const clientData = response.data.data || [];
                const formattedClients = clientData.map(client => ({
                    id: client.username,
                    name: client.name || client.username,
                    username: client.username,
                    email: client.email || '',
                    contact: client.phone || '',
                    balance: client.balance || '0'
                }));
                
                if (append) {
                    setToClients(prev => [...prev, ...formattedClients]);
                } else {
                    setToClients(formattedClients);
                }
                
                setHasMoreTo(!response.data.is_last_page);
            }
        } catch (error) {
            console.error('Error fetching to clients:', error);
        } finally {
            setLoadingTo(false);
        }
    }, []);

    // Debounced search for FROM dropdown
    useEffect(() => {
        const timer = setTimeout(() => {
            setFromPage(1);
            fetchFromClients(fromSearchTerm, 1, false);
        }, 500);
        return () => clearTimeout(timer);
    }, [fromSearchTerm, fetchFromClients]);

    // Debounced search for TO dropdown
    useEffect(() => {
        const timer = setTimeout(() => {
            setToPage(1);
            fetchToClients(toSearchTerm, 1, false);
        }, 500);
        return () => clearTimeout(timer);
    }, [toSearchTerm, fetchToClients]);

    // Initial load when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchFromClients('', 1, false);
            fetchToClients('', 1, false);
        }
    }, [isOpen, fetchFromClients, fetchToClients]);

    // Click outside handlers
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (fromDropdownRef.current && !fromDropdownRef.current.contains(event.target)) {
                setShowFromClientSearch(false);
            }
            if (toDropdownRef.current && !toDropdownRef.current.contains(event.target)) {
                setShowToClientSearch(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedFromClient || !selectedToClient) {
            toast.error('Please select both clients');
            return;
        }

        if (selectedFromClient.username === selectedToClient.username) {
            toast.error('Cannot transfer between the same client');
            return;
        }

        const formData = new FormData(e.target);
        const amount = parseFloat(formData.get('amount'));
        
        if (amount <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        const payload = {
            amount: amount,
            party1_id: selectedFromClient.username,
            party2_id: selectedToClient.username,
            party1_type: "client",
            party2_type: "client",
            remark: formData.get('description') || "Journal entry transfer",
            transaction_date: formData.get('date')
        };

        setLoading(true);
        
        try {
            await onSubmit(payload);
            toast.success('Journal entry created successfully');
            onClose();
            setSelectedFromClient(null);
            setSelectedToClient(null);
        } catch (error) {
            toast.error(error.message || 'Failed to create journal entry');
        } finally {
            setLoading(false);
        }
    };

    // Client Search Dropdown Component
    const ClientSearchDropdown = ({ type, onSelect, selectedClient, excludeClientId }) => {
        const dropdownRef = type === 'from' ? fromDropdownRef : toDropdownRef;
        const searchTerm = type === 'from' ? fromSearchTerm : toSearchTerm;
        const setSearchTerm = type === 'from' ? setFromSearchTerm : setToSearchTerm;
        const clients = type === 'from' ? fromClients : toClients;
        const isLoading = type === 'from' ? loadingFrom : loadingTo;
        const hasMore = type === 'from' ? hasMoreFrom : hasMoreTo;
        const loadMore = type === 'from' ? () => {
            const nextPage = fromPage + 1;
            setFromPage(nextPage);
            fetchFromClients(fromSearchTerm, nextPage, true);
        } : () => {
            const nextPage = toPage + 1;
            setToPage(nextPage);
            fetchToClients(toSearchTerm, nextPage, true);
        };

        const filteredClients = useMemo(() => {
            if (!searchTerm) return clients;
            return clients.filter(client =>
                client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.username?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }, [searchTerm, clients]);

        const handleSelect = (client) => {
            onSelect(client);
            setShowFromClientSearch(false);
            setShowToClientSearch(false);
        };

        return (
            <div className="relative" ref={dropdownRef}>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search clients..."
                        className="w-full px-4 py-3 pl-10 border-2 border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-y-auto">
                    {isLoading && clients.length === 0 ? (
                        <div className="px-4 py-3 text-center text-gray-500">Loading clients...</div>
                    ) : filteredClients.length > 0 ? (
                        <>
                            {filteredClients
                                .filter(client => client.id !== excludeClientId)
                                .map(client => (
                                    <div
                                        key={client.id}
                                        className="px-4 py-2 cursor-pointer hover:bg-indigo-50 border-b border-gray-100 last:border-0"
                                        onClick={() => handleSelect(client)}
                                    >
                                        <div className="font-medium text-slate-800">{client.name}</div>
                                        <div className="text-sm text-slate-500">
                                            Username: {client.username} | Balance: ₹{formatCurrency(client.balance || 0)}
                                        </div>
                                    </div>
                                ))}
                            {hasMore && (
                                <button
                                    type="button"
                                    onClick={loadMore}
                                    disabled={isLoading}
                                    className="w-full px-4 py-2 text-center bg-gray-50 hover:bg-gray-100 text-indigo-600 text-sm border-t border-gray-200"
                                >
                                    {isLoading ? 'Loading...' : 'Load More'}
                                </button>
                            )}
                        </>
                    ) : (
                        <div className="px-4 py-3 text-center text-gray-500">
                            {searchTerm ? 'No clients found' : 'No clients available'}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Create Journal Entry">
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* From Client Selection - Auto-selected with current client */}
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <label className="block text-sm font-medium text-red-700 mb-2">
                        From Client (Decrease) <span className="text-red-500">*</span>
                    </label>
                    
                    {!showFromClientSearch ? (
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-slate-800">
                                    {selectedFromClient ? selectedFromClient.name : 'No client selected'}
                                </p>
                                {selectedFromClient && (
                                    <p className="text-sm text-slate-600">
                                        Username: {selectedFromClient.username} | Balance: ₹{formatCurrency(selectedFromClient.balance || 0)}
                                    </p>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowFromClientSearch(true)}
                                className="px-3 py-1 text-sm bg-white border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                            >
                                {selectedFromClient ? 'Change Client' : 'Select Client'}
                            </button>
                        </div>
                    ) : (
                        <ClientSearchDropdown 
                            type="from"
                            onSelect={setSelectedFromClient}
                            selectedClient={selectedFromClient}
                            excludeClientId={selectedToClient?.username}
                        />
                    )}
                </div>

                {/* To Client Selection */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <label className="block text-sm font-medium text-green-700 mb-2">
                        To Client (Increase) <span className="text-red-500">*</span>
                    </label>
                    
                    {!showToClientSearch ? (
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-slate-800">
                                    {selectedToClient ? selectedToClient.name : 'No client selected'}
                                </p>
                                {selectedToClient && (
                                    <p className="text-sm text-slate-600">
                                        Username: {selectedToClient.username} | Balance: ₹{formatCurrency(selectedToClient.balance || 0)}
                                    </p>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowToClientSearch(true)}
                                className="px-3 py-1 text-sm bg-white border border-green-300 text-green-600 rounded-lg hover:bg-green-50"
                            >
                                {selectedToClient ? 'Change Client' : 'Select Client'}
                            </button>
                        </div>
                    ) : (
                        <ClientSearchDropdown 
                            type="to"
                            onSelect={setSelectedToClient}
                            selectedClient={selectedToClient}
                            excludeClientId={selectedFromClient?.username}
                        />
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            name="date"
                            defaultValue={new Date().toISOString().split('T')[0]}
                            required
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Amount <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="amount"
                            placeholder="Enter amount"
                            required
                            min="0.01"
                            step="0.01"
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Description / Reference
                    </label>
                    <textarea
                        name="description"
                        placeholder="Enter description or reference"
                        rows="2"
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-200">
                    <button
                        type="submit"
                        disabled={!selectedFromClient || !selectedToClient || loading}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg text-base font-medium hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200"
                    >
                        {loading ? 'Creating...' : 'Create Journal Entry'}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-lg text-base font-medium hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </BaseModal>
    );
};
// Modal Manager Component
export const TransactionModalManager = ({ 
    modalType, 
    isOpen, 
    onClose, 
    bankDetails, 
    bankId, 
    onSubmit,
    formatCurrency,
    summary,
    clientId,
    clientName 
}) => {
    const modalProps = {
        isOpen,
        onClose,
        bankDetails,
        bankId,
        onSubmit,
        formatCurrency,
        summary,
        clientUsername: clientId,
        clientName: clientName
    };

    switch(modalType) {
        case 'RECEIVE':
            return <ReceiveModal {...modalProps} />;
        case 'PAYMENT':
            return <PaymentModal {...modalProps} />;
        case 'SALE':
            return <SaleModal {...modalProps} />;
        case 'PURCHASE':
            return <PurchaseModal {...modalProps} />;
        case 'EXPENSE':
            return <ExpenseModal {...modalProps} />;
        case 'JOURNAL':
            return <JournalModal {...modalProps} />;
        default:
            return null;
    }
};

export default TransactionModalManager ;
