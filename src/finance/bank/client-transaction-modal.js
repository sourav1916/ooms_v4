// finance/bank/bank-modals.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUser, FiDollarSign, FiShoppingBag, FiTruck, FiFileText, FiRepeat, FiPlus, FiTrash2, FiSearch, FiMail, FiPhone, FiCreditCard, FiHome, FiArrowRight, FiArrowLeft, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import API_BASE_URL from '../../utils/api-controller';
import getHeaders from '../../utils/get-headers';
import axios from 'axios';

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
            party1_id: selectedBank.bank_id,
            party2_id: clientUsername, // Using the client username from params
            party1_type: "bank",
            party2_type: "client",
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

// Payment Modal - API Integrated with Bank Search (No Client Search)
export const PaymentModal = ({ isOpen, onClose, bankDetails, bankId, onSubmit, formatCurrency, summary, clientUsername, clientName }) => {
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
        const paymentMode = formData.get('payment_mode');

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
            party1_id: selectedBank.bank_id,
            party2_id: clientUsername, // Using the client username from params
            party1_type: "bank",
            party2_type: "client",
            remark: description || `Payment made to ${clientName} via ${paymentMode}`,
            transaction_date: date
        };

        try {
            const response = await axios.post(
                `${API_BASE_URL}/transaction/payment/payment`,
                payload,
                { headers: getHeaders() }
            );

            if (response.data.success) {
                toast.success(response.data.message || 'Payment made successfully');
                onSubmit('PAYMENT', response.data.data);
                onClose();
                // Reset form
                setSelectedBank(bankDetails);
                setShowBankSearch(false);
            }
        } catch (error) {
            console.error('Error creating payment transaction:', error);
            toast.error(error.response?.data?.message || 'Failed to create payment transaction');
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
export const SaleModal = ({ isOpen, onClose, bankDetails, bankId, onSubmit, formatCurrency, clientUsername, clientName }) => {
    const [items, setItems] = useState([{ id: 1, service: '', description: '', price: 0 }]);
    const [total, setTotal] = useState(0);
    const [selectedBank, setSelectedBank] = useState(bankDetails);
    const [showBankSearch, setShowBankSearch] = useState(false);

    const addItem = () => {
        setItems([...items, { id: items.length + 1, service: '', description: '', price: 0 }]);
    };

    const removeItem = (id) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    const updateItem = (id, field, value) => {
        const updatedItems = items.map(item => {
            if (item.id === id) {
                return { ...item, [field]: value };
            }
            return item;
        });
        setItems(updatedItems);
        
        const newTotal = updatedItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
        setTotal(newTotal);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!selectedBank) {
            toast.error('Please select a bank');
            return;
        }

        const formData = new FormData(e.target);
        const data = {
            date: formData.get('date'),
            clientName: clientName,
            clientUsername: clientUsername,
            items: items,
            total: total,
            bank: selectedBank
        };
        onSubmit('SALE', data);
        toast.success('Sale created successfully (Demo)');
        onClose();
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Create Sale">
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Client Info - Read Only */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-green-600 font-medium">Client</p>
                            <p className="text-lg font-semibold text-slate-800">{clientName}</p>
                            <p className="text-xs text-slate-500">Username: {clientUsername}</p>
                        </div>
                    </div>
                </div>

                {/* Bank Selection */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <label className="block text-sm font-medium text-green-700 mb-2">
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
                                className="px-3 py-1 text-sm bg-white border border-green-300 text-green-600 rounded-lg hover:bg-green-50"
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

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Date <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        name="date"
                        defaultValue={new Date().toISOString().split('T')[0]}
                        required
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                </div>

                {/* Items Table */}
                <div className="border-2 border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-100">
                            <tr>
                                <th className="p-3 text-left text-sm font-semibold text-slate-600">Item/Service</th>
                                <th className="p-3 text-left text-sm font-semibold text-slate-600">Description</th>
                                <th className="p-3 text-right text-sm font-semibold text-slate-600">Price (₹)</th>
                                <th className="p-3 text-center text-sm font-semibold text-slate-600 w-16"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {items.map((item) => (
                                <tr key={item.id}>
                                    <td className="p-2">
                                        <input
                                            type="text"
                                            value={item.service}
                                            onChange={(e) => updateItem(item.id, 'service', e.target.value)}
                                            placeholder="Item name"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="text"
                                            value={item.description}
                                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                            placeholder="Description"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="number"
                                            value={item.price}
                                            onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-right"
                                        />
                                    </td>
                                    <td className="p-2 text-center">
                                        {items.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeItem(item.id)}
                                                className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <FiTrash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors text-sm font-medium"
                >
                    <FiPlus className="w-4 h-4" />
                    Add Item
                </button>

                {/* Summary */}
                <div className="bg-slate-50 p-4 rounded-lg border-2 border-slate-200">
                    <div className="flex justify-between items-center">
                        <span className="text-base font-medium text-slate-700">Total Amount:</span>
                        <span className="text-xl font-bold text-green-600">₹{formatCurrency(total)}</span>
                    </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-200">
                    <button
                        type="submit"
                        disabled={!selectedBank}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg text-base font-medium hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200"
                    >
                        Create Sale
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

// Purchase Modal - UI Only with Bank Search
export const PurchaseModal = ({ isOpen, onClose, bankDetails, bankId, onSubmit, formatCurrency, clientUsername, clientName }) => {
    const [items, setItems] = useState([{ id: 1, item: '', description: '', price: 0 }]);
    const [total, setTotal] = useState(0);
    const [selectedBank, setSelectedBank] = useState(bankDetails);
    const [showBankSearch, setShowBankSearch] = useState(false);

    const addItem = () => {
        setItems([...items, { id: items.length + 1, item: '', description: '', price: 0 }]);
    };

    const removeItem = (id) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    const updateItem = (id, field, value) => {
        const updatedItems = items.map(item => {
            if (item.id === id) {
                return { ...item, [field]: value };
            }
            return item;
        });
        setItems(updatedItems);
        
        const newTotal = updatedItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
        setTotal(newTotal);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!selectedBank) {
            toast.error('Please select a bank');
            return;
        }

        const formData = new FormData(e.target);
        const data = {
            date: formData.get('date'),
            vendor: formData.get('vendor'),
            items: items,
            total: total,
            bank: selectedBank,
            clientName: clientName,
            clientUsername: clientUsername
        };
        onSubmit('PURCHASE', data);
        toast.success('Purchase created successfully (Demo)');
        onClose();
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Create Purchase">
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Client Info - Read Only */}
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-purple-600 font-medium">Client</p>
                            <p className="text-lg font-semibold text-slate-800">{clientName}</p>
                            <p className="text-xs text-slate-500">Username: {clientUsername}</p>
                        </div>
                    </div>
                </div>

                {/* Bank Selection */}
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <label className="block text-sm font-medium text-purple-700 mb-2">
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
                                className="px-3 py-1 text-sm bg-white border border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50"
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

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Select Vendor <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="vendor"
                        required
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                        <option value="">Select Vendor</option>
                        <option value="vendor1">Vendor 1</option>
                        <option value="vendor2">Vendor 2</option>
                        <option value="vendor3">Vendor 3</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Date <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        name="date"
                        defaultValue={new Date().toISOString().split('T')[0]}
                        required
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                </div>

                {/* Items Table */}
                <div className="border-2 border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-100">
                            <tr>
                                <th className="p-3 text-left text-sm font-semibold text-slate-600">Item</th>
                                <th className="p-3 text-left text-sm font-semibold text-slate-600">Description</th>
                                <th className="p-3 text-right text-sm font-semibold text-slate-600">Price (₹)</th>
                                <th className="p-3 text-center text-sm font-semibold text-slate-600 w-16"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {items.map((item) => (
                                <tr key={item.id}>
                                    <td className="p-2">
                                        <input
                                            type="text"
                                            value={item.item}
                                            onChange={(e) => updateItem(item.id, 'item', e.target.value)}
                                            placeholder="Item name"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="text"
                                            value={item.description}
                                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                            placeholder="Description"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="number"
                                            value={item.price}
                                            onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-right"
                                        />
                                    </td>
                                    <td className="p-2 text-center">
                                        {items.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeItem(item.id)}
                                                className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <FiTrash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors text-sm font-medium"
                >
                    <FiPlus className="w-4 h-4" />
                    Add Item
                </button>

                {/* Summary */}
                <div className="bg-slate-50 p-4 rounded-lg border-2 border-slate-200">
                    <div className="flex justify-between items-center">
                        <span className="text-base font-medium text-slate-700">Total Amount:</span>
                        <span className="text-xl font-bold text-purple-600">₹{formatCurrency(total)}</span>
                    </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-200">
                    <button
                        type="submit"
                        disabled={!selectedBank}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg text-base font-medium hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200"
                    >
                        Create Purchase
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

// Contra Modal - UI Only with Bank Search for both banks
export const ContraModal = ({ isOpen, onClose, bankDetails, bankId, onSubmit, formatCurrency, clientUsername, clientName }) => {
    const [selectedFromBank, setSelectedFromBank] = useState(bankDetails);
    const [selectedToBank, setSelectedToBank] = useState(null);
    const [showFromBankSearch, setShowFromBankSearch] = useState(false);
    const [showToBankSearch, setShowToBankSearch] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!selectedFromBank || !selectedToBank) {
            toast.error('Please select both banks');
            return;
        }

        const formData = new FormData(e.target);
        const data = {
            date: formData.get('date'),
            fromBank: selectedFromBank,
            toBank: selectedToBank,
            amount: formData.get('amount'),
            description: formData.get('description'),
            clientName: clientName,
            clientUsername: clientUsername
        };
        onSubmit('CONTRA', data);
        toast.success('Contra entry created successfully (Demo)');
        onClose();
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Create Contra Entry">
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Client Info - Read Only */}
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-indigo-600 font-medium">Client</p>
                            <p className="text-lg font-semibold text-slate-800">{clientName}</p>
                            <p className="text-xs text-slate-500">Username: {clientUsername}</p>
                        </div>
                    </div>
                </div>

                {/* From Bank Selection */}
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                    <label className="block text-sm font-medium text-indigo-700 mb-2">
                        From Bank (Source) <span className="text-red-500">*</span>
                    </label>
                    
                    {!showFromBankSearch ? (
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-slate-800">{selectedFromBank?.bank || 'No bank selected'}</p>
                                {selectedFromBank && (
                                    <p className="text-sm text-slate-600">
                                        A/c: {selectedFromBank?.account_no} | Balance: ₹{formatCurrency(selectedFromBank?.balance || 0)}
                                    </p>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowFromBankSearch(true)}
                                className="px-3 py-1 text-sm bg-white border border-indigo-300 text-indigo-600 rounded-lg hover:bg-indigo-50"
                            >
                                {selectedFromBank ? 'Change Bank' : 'Select Bank'}
                            </button>
                        </div>
                    ) : (
                        <BankSearchDropdown 
                            onSelect={(bank) => {
                                setSelectedFromBank(bank);
                                setShowFromBankSearch(false);
                            }}
                            selectedBankId={selectedFromBank?.bank_id}
                        />
                    )}
                </div>

                {/* To Bank Selection */}
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                    <label className="block text-sm font-medium text-indigo-700 mb-2">
                        To Bank (Destination) <span className="text-red-500">*</span>
                    </label>
                    
                    {!showToBankSearch ? (
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-slate-800">{selectedToBank?.bank || 'No bank selected'}</p>
                                {selectedToBank && (
                                    <p className="text-sm text-slate-600">
                                        A/c: {selectedToBank.account_no} | Balance: ₹{formatCurrency(selectedToBank.balance)}
                                    </p>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowToBankSearch(true)}
                                className="px-3 py-1 text-sm bg-white border border-indigo-300 text-indigo-600 rounded-lg hover:bg-indigo-50"
                            >
                                {selectedToBank ? 'Change Bank' : 'Select Bank'}
                            </button>
                        </div>
                    ) : (
                        <BankSearchDropdown 
                            onSelect={(bank) => {
                                setSelectedToBank(bank);
                                setShowToBankSearch(false);
                            }}
                            selectedBankId={selectedToBank?.bank_id}
                            excludeBankId={selectedFromBank?.bank_id}
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
                        disabled={!selectedFromBank || !selectedToBank}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg text-base font-medium hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200"
                    >
                        Create Contra Entry
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
        case 'CONTRA':
            return <ContraModal {...modalProps} />;
        default:
            return null;
    }
};