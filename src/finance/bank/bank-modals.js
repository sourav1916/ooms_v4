// finance/bank/bank-modals.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUser, FiDollarSign, FiShoppingBag, FiTruck, FiFileText, FiRepeat, FiPlus, FiTrash2, FiSearch, FiMail, FiPhone, FiCreditCard, FiHome } from 'react-icons/fi';
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

// Receive Modal - Updated with correct API response mapping
// Receive Modal - Updated with single client display
// Receive Modal - Updated with fix to prevent second API call after selection
export const ReceiveModal = ({ isOpen, onClose, bankDetails, bankId, onSubmit, formatCurrency, summary }) => {
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [firms, setFirms] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [selectedFirm, setSelectedFirm] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);

    // Search clients API
    const searchClients = async (term) => {
        if (!term || term.length < 2) {
            setFirms([]);
            return;
        }

        setSearchLoading(true);
        try {
            const response = await axios.get(
                `${API_BASE_URL}/firm/search?search=${term}`,
                { headers: getHeaders() }
            );
            
            if (response.data.success) {
                console.log('Search response:', response.data);
                setFirms(response.data.data || []);
                setShowDropdown(true);
            }
        } catch (error) {
            console.error('Error searching clients:', error);
            toast.error('Failed to search clients');
        } finally {
            setSearchLoading(false);
        }
    };

    // Debounce search - but only if no firm is selected
    useEffect(() => {
        // Don't search if a firm is already selected
        if (selectedFirm) {
            return;
        }
        
        const debounceTimer = setTimeout(() => {
            if (searchTerm && searchTerm.length >= 2) {
                searchClients(searchTerm);
            } else {
                setFirms([]);
                setShowDropdown(false);
            }
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [searchTerm, selectedFirm]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log('=== RECEIVE MODAL - FORM SUBMITTED ===');
        
        if (!selectedFirm) {
            console.error('Validation failed: No client selected');
            toast.error('Please select a client');
            return;
        }

        if (!bankId) {
            console.error('Validation failed: No bank selected');
            toast.error('Bank information not available');
            return;
        }

        const formData = new FormData(e.target);
        const amount = formData.get('amount');
        const date = formData.get('date');
        const description = formData.get('description');

        console.log('Form values:', { amount, date, description });
        console.log('Selected client:', selectedFirm);
        console.log('Bank ID:', bankId);
        console.log('Bank details:', bankDetails);

        if (!amount || parseFloat(amount) <= 0) {
            console.error('Validation failed: Invalid amount', amount);
            toast.error('Please enter a valid amount');
            return;
        }

        setLoading(true);
        
        // CORRECTED: For RECEIVE API - Client is party1, Bank is party2
        // This means the client is giving money (sending) and bank is receiving it
        const payload = {
            amount: parseFloat(amount),
            party1_id: selectedFirm.client?.username,  // Client username as party1_id
            party1_type: "client",                    // party1_type is client
            party2_id: bankId,                        // Bank ID as party2_id
            party2_type: "bank",                      // party2_type is bank
            remark: description || `Payment received from ${selectedFirm.client?.name}`,
            transaction_date: date
        };

        console.log('Receive payment payload:', JSON.stringify(payload, null, 2));
        console.log('API Endpoint:', `${API_BASE_URL}/transaction/payment/receive`);

        try {
            const response = await axios.post(
                `${API_BASE_URL}/transaction/payment/receive`,
                payload,
                { headers: getHeaders() }
            );

            console.log('Receive payment response status:', response.status);
            console.log('Receive payment response data:', response.data);

            if (response.data.success) {
                console.log('Receive payment successful:', response.data.message);
                toast.success(response.data.message || 'Payment received successfully');
                if (onSubmit) {
                    onSubmit('RECEIVE', response.data.data);
                }
                onClose();
                // Reset form
                setSearchTerm('');
                setSelectedFirm(null);
                setFirms([]);
            } else {
                console.error('Receive payment failed:', response.data);
                toast.error(response.data.message || 'Payment receive failed');
            }
        } catch (error) {
            console.error('=== ERROR IN RECEIVE PAYMENT ===');
            console.error('Error object:', error);
            console.error('Error message:', error.message);
            
            if (error.response) {
                console.error('Error response status:', error.response.status);
                console.error('Error response status text:', error.response.statusText);
                console.error('Error response data:', error.response.data);
                
                if (error.response.data) {
                    console.error('Error details:', {
                        message: error.response.data.message,
                        error: error.response.data.error,
                        ...error.response.data
                    });
                    
                    // Check for party_id specific errors
                    if (error.response.data.message && error.response.data.message.includes('party_id')) {
                        console.error('Party ID validation failed:', {
                            party1_id: payload.party1_id,
                            party1_type: payload.party1_type,
                            party2_id: payload.party2_id,
                            party2_type: payload.party2_type
                        });
                    }
                }
                
                const errorMessage = error.response?.data?.message || 
                                    error.response?.data?.error || 
                                    `Server error: ${error.response.status} ${error.response.statusText}`;
                toast.error(errorMessage);
            } else if (error.request) {
                console.error('No response received from server');
                toast.error('No response from server. Please check your network connection.');
            } else {
                console.error('Error setting up request:', error.message);
                toast.error(`Request error: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Create Receive from Client">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-xs text-blue-600 font-medium">Bank Name</p>
                            <p className="text-sm font-bold text-slate-700">{bankDetails?.bank || 'Current Bank'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-blue-600 font-medium">Bank Balance</p>
                            <p className="text-lg font-bold text-blue-700">₹{formatCurrency(bankDetails?.balance || 0)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-blue-600 font-medium">Bank ID</p>
                            <p className="text-xs font-mono text-slate-600">{bankId || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Client Search */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Search Client <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setSearchTerm(value);
                                    // Clear selected firm when user starts typing again
                                    if (selectedFirm) {
                                        setSelectedFirm(null);
                                    }
                                    if (!value) {
                                        setFirms([]);
                                        setShowDropdown(false);
                                    }
                                }}
                                onFocus={() => {
                                    // Only show dropdown if there are firms and no firm is selected
                                    if (firms.length > 0 && !selectedFirm) {
                                        setShowDropdown(true);
                                    }
                                }}
                                placeholder="Type client name, mobile or PAN to search..."
                                className="w-full px-4 py-3 pl-10 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            {searchLoading && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                                </div>
                            )}
                        </div>

                        {/* Search Results Dropdown */}
                        {showDropdown && firms.length > 0 && (
                            <div className="absolute z-10 mt-1 w-full max-w-[calc(100%-3rem)] bg-white border-2 border-slate-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                                {firms.map((firm) => (
                                    <button
                                        key={firm.firm_id}
                                        type="button"
                                        onClick={() => {
                                            console.log('Selected firm:', firm);
                                            setSelectedFirm(firm);
                                            setSearchTerm(firm.firm_name);
                                            setShowDropdown(false);
                                            setFirms([]); // Clear the firms list
                                        }}
                                        className="w-full px-4 py-3 text-left hover:bg-blue-50 border-b border-slate-100 last:border-0 transition-colors"
                                    >
                                        <div className="font-medium text-slate-800">{firm.firm_name}</div>
                                        <div className="text-sm text-slate-500 flex items-center gap-3 mt-1">
                                            <span className="flex items-center gap-1">
                                                <FiUser className="w-3 h-3" />
                                                {firm.client?.name || 'N/A'}
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <FiPhone className="w-3 h-3" />
                                                {firm.client?.mobile || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1">
                                            Username: {firm.client?.username || 'N/A'} | PAN: {firm.client?.pan_number || firm.pan_no || 'N/A'}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Selected Client Details Card */}
                        {selectedFirm && (
                            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-semibold text-blue-800">Selected Client</h3>
                                    <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">Active</span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-xs text-blue-600 font-medium mb-1">Client Name</p>
                                        <p className="text-sm font-semibold text-slate-800">{selectedFirm.client?.name}</p>
                                    </div>
                                    
                                    <div>
                                        <p className="text-xs text-blue-600 font-medium mb-1">Username</p>
                                        <p className="text-sm font-mono text-slate-700">{selectedFirm.client?.username}</p>
                                    </div>
                                    
                                    <div>
                                        <p className="text-xs text-blue-600 font-medium mb-1 flex items-center gap-1">
                                            <FiPhone className="w-3 h-3" /> Phone
                                        </p>
                                        <p className="text-sm text-slate-700">{selectedFirm.client?.mobile || 'N/A'}</p>
                                    </div>
                                    
                                    <div>
                                        <p className="text-xs text-blue-600 font-medium mb-1 flex items-center gap-1">
                                            <FiCreditCard className="w-3 h-3" /> PAN
                                        </p>
                                        <p className="text-sm font-mono text-slate-700">
                                            {selectedFirm.client?.pan_number || selectedFirm.pan_no || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Hidden field to store client username */}
                                <input 
                                    type="hidden" 
                                    name="client_username" 
                                    value={selectedFirm.client?.username} 
                                />
                            </div>
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
                            Description
                        </label>
                        <textarea
                            name="description"
                            placeholder="Enter description"
                            rows="3"
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <p className="text-xs text-slate-600 mb-2">Transaction Flow Summary</p>
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">From (Client):</span>
                            <span className="text-blue-600">{selectedFirm?.client?.name || 'Not selected'}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-1">
                            <span className="font-medium">To (Bank):</span>
                            <span className="text-blue-600">{bankDetails?.bank || 'Not selected'}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-1">
                            <span className="font-medium">Transaction Type:</span>
                            <span className="text-green-600">Receive Payment</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-200">
                    <button
                        type="submit"
                        disabled={loading || !selectedFirm}
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

// Payment Modal - Updated with fix to prevent second API call after selection
export const PaymentModal = ({ isOpen, onClose, bankDetails, bankId, onSubmit, formatCurrency, summary }) => {
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [firms, setFirms] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [selectedFirm, setSelectedFirm] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);

    // Search clients API
    const searchClients = async (term) => {
        if (!term || term.length < 2) {
            setFirms([]);
            return;
        }

        setSearchLoading(true);
        try {
            const response = await axios.get(
                `${API_BASE_URL}/firm/search?search=${term}`,
                { headers: getHeaders() }
            );
            
            if (response.data.success) {
                console.log('Search response:', response.data);
                setFirms(response.data.data || []);
                setShowDropdown(true);
            }
        } catch (error) {
            console.error('Error searching clients:', error);
            toast.error('Failed to search clients');
        } finally {
            setSearchLoading(false);
        }
    };

    // Debounce search - but only if no firm is selected
    useEffect(() => {
        // Don't search if a firm is already selected
        if (selectedFirm) {
            return;
        }
        
        const debounceTimer = setTimeout(() => {
            if (searchTerm && searchTerm.length >= 2) {
                searchClients(searchTerm);
            } else {
                setFirms([]);
                setShowDropdown(false);
            }
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [searchTerm, selectedFirm]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedFirm) {
            toast.error('Please select a client');
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

        setLoading(true);
        
        const payload = {
            amount: parseFloat(amount),
            party1_id: bankId,
            party2_id: selectedFirm.client?.username,
            party1_type: "bank",
            party2_type: "client",
            remark: description || `Payment made to ${selectedFirm.client?.name} via ${paymentMode}`,
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
                setSearchTerm('');
                setSelectedFirm(null);
                setFirms([]);
            }
        } catch (error) {
            console.error('Error creating payment transaction:', error);
            toast.error(error.response?.data?.message || 'Failed to create payment transaction');
        } finally {
            setLoading(false);
        }
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Create Payment to Client">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-xs text-red-600 font-medium">Bank Name</p>
                            <p className="text-sm font-bold text-slate-700">{bankDetails?.bank || 'Current Bank'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-red-600 font-medium">Credit</p>
                            <p className="text-sm font-bold text-green-600">₹{formatCurrency(summary?.totalCredit || 0)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-red-600 font-medium">Debit</p>
                            <p className="text-sm font-bold text-red-600">₹{formatCurrency(summary?.totalDebit || 0)}</p>
                        </div>
                        <div className="col-span-3 mt-2 pt-2 border-t border-red-200">
                            <p className="text-xs text-red-600 font-medium">Current Balance</p>
                            <p className="text-lg font-bold text-red-700">₹{formatCurrency(bankDetails?.balance || 0)}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Client Search */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Search Client <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setSearchTerm(value);
                                    // Clear selected firm when user starts typing again
                                    if (selectedFirm) {
                                        setSelectedFirm(null);
                                    }
                                    if (!value) {
                                        setFirms([]);
                                        setShowDropdown(false);
                                    }
                                }}
                                onFocus={() => {
                                    // Only show dropdown if there are firms and no firm is selected
                                    if (firms.length > 0 && !selectedFirm) {
                                        setShowDropdown(true);
                                    }
                                }}
                                placeholder="Type client name, mobile or PAN to search..."
                                className="w-full px-4 py-3 pl-10 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            {searchLoading && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                                </div>
                            )}
                        </div>

                        {/* Search Results Dropdown */}
                        {showDropdown && firms.length > 0 && (
                            <div className="absolute z-10 mt-1 w-full max-w-[calc(100%-3rem)] bg-white border-2 border-slate-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                                {firms.map((firm) => (
                                    <button
                                        key={firm.firm_id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedFirm(firm);
                                            setSearchTerm(firm.firm_name);
                                            setShowDropdown(false);
                                            setFirms([]); // Clear the firms list
                                        }}
                                        className="w-full px-4 py-3 text-left hover:bg-red-50 border-b border-slate-100 last:border-0 transition-colors"
                                    >
                                        <div className="font-medium text-slate-800">{firm.firm_name}</div>
                                        <div className="text-sm text-slate-500 flex items-center gap-3 mt-1">
                                            <span className="flex items-center gap-1">
                                                <FiUser className="w-3 h-3" />
                                                {firm.client?.name || 'N/A'}
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <FiPhone className="w-3 h-3" />
                                                {firm.client?.mobile || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1">
                                            PAN: {firm.client?.pan_number || firm.pan_no || 'N/A'}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Selected Client Details Card - Simplified */}
                        {selectedFirm && (
                            <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-semibold text-red-800">Selected Client</h3>
                                    <span className="px-2 py-0.5 bg-red-600 text-white text-xs rounded-full">Active</span>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <p className="text-xs text-red-600 font-medium mb-1">Client Name</p>
                                        <p className="text-sm font-semibold text-slate-800">{selectedFirm.client?.name}</p>
                                    </div>
                                    
                                    <div>
                                        <p className="text-xs text-red-600 font-medium mb-1 flex items-center gap-1">
                                            <FiPhone className="w-3 h-3" /> Phone
                                        </p>
                                        <p className="text-sm text-slate-700">{selectedFirm.client?.mobile || 'N/A'}</p>
                                    </div>
                                    
                                    <div>
                                        <p className="text-xs text-red-600 font-medium mb-1 flex items-center gap-1">
                                            <FiCreditCard className="w-3 h-3" /> PAN
                                        </p>
                                        <p className="text-sm font-mono text-slate-700">
                                            {selectedFirm.client?.pan_number || selectedFirm.pan_no || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Hidden field to store client username */}
                                <input 
                                    type="hidden" 
                                    name="client_username" 
                                    value={selectedFirm.client?.username} 
                                />
                            </div>
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
                            Description
                        </label>
                        <textarea
                            name="description"
                            placeholder="Enter description"
                            rows="3"
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
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
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Select Bank <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="bank"
                            required
                            disabled
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                        >
                            <option value={bankId}>
                                {bankDetails?.bank || 'Current Bank'} - Balance: ₹{formatCurrency(bankDetails?.balance || 0)}
                            </option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-200">
                    <button
                        type="submit"
                        disabled={loading || !selectedFirm}
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
// Sale Modal with Items
export const SaleModal = ({ isOpen, onClose, bankDetails, bankId, onSubmit, formatCurrency }) => {
    const [items, setItems] = useState([{ id: 1, service: '', description: '', price: 0 }]);
    const [total, setTotal] = useState(0);

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
        
        // Recalculate total
        const newTotal = updatedItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
        setTotal(newTotal);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            date: formData.get('date'),
            items: items,
            total: total,
            bank: formData.get('bank')
        };
        onSubmit('SALE', data);
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Create Sale from Bank">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-xs text-green-600 font-medium">Bank Name</p>
                            <p className="text-sm font-bold text-slate-700">{bankDetails?.bank || 'Current Bank'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-green-600 font-medium">Credit</p>
                            <p className="text-sm font-bold text-green-600">₹{formatCurrency(bankDetails?.balance || 0)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-green-600 font-medium">Debit</p>
                            <p className="text-sm font-bold text-red-600">₹0.00</p>
                        </div>
                    </div>
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
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                            {items.map((item, index) => (
                                <tr key={item.id}>
                                    <td className="p-2">
                                        <select
                                            value={item.service}
                                            onChange={(e) => updateItem(item.id, 'service', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Select Service</option>
                                            <option value="service1">Service 1</option>
                                            <option value="service2">Service 2</option>
                                            <option value="service3">Service 3</option>
                                        </select>
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="text"
                                            value={item.description}
                                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                            placeholder="Description"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
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
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                >
                    <FiPlus className="w-4 h-4" />
                    Add Item
                </button>

                {/* Summary */}
                <div className="bg-slate-50 p-4 rounded-lg border-2 border-slate-200">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-slate-600">Total:</span>
                        <span className="text-lg font-bold text-slate-800">₹{formatCurrency(total)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                        <span className="text-base font-medium text-slate-700">Payable:</span>
                        <span className="text-xl font-bold text-blue-600">₹{formatCurrency(total)}</span>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Select Bank <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="bank"
                        required
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value={bankId}>
                            {bankDetails?.bank || 'Current Bank'} - Balance: ₹{formatCurrency(bankDetails?.balance || 0)}
                        </option>
                    </select>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-200">
                    <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-base font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                    >
                        Submit
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

// Purchase Modal (similar to Sale)
export const PurchaseModal = ({ isOpen, onClose, bankDetails, bankId, onSubmit, formatCurrency }) => {
    const [items, setItems] = useState([{ id: 1, item: '', description: '', price: 0 }]);
    const [total, setTotal] = useState(0);

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
        const formData = new FormData(e.target);
        const data = {
            date: formData.get('date'),
            vendor: formData.get('vendor'),
            items: items,
            total: total,
            bank: formData.get('bank')
        };
        onSubmit('PURCHASE', data);
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Create Purchase">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 mb-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-xs text-purple-600 font-medium">Bank Name</p>
                            <p className="text-sm font-bold text-slate-700">{bankDetails?.bank || 'Current Bank'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-purple-600 font-medium">Credit</p>
                            <p className="text-sm font-bold text-green-600">₹{formatCurrency(bankDetails?.balance || 0)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-purple-600 font-medium">Debit</p>
                            <p className="text-sm font-bold text-red-600">₹0.00</p>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Select Vendor <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="vendor"
                        required
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Select Vendor</option>
                        <option value="1">Vendor 1</option>
                        <option value="2">Vendor 2</option>
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
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                            {items.map((item, index) => (
                                <tr key={item.id}>
                                    <td className="p-2">
                                        <input
                                            type="text"
                                            value={item.item}
                                            onChange={(e) => updateItem(item.id, 'item', e.target.value)}
                                            placeholder="Item name"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="text"
                                            value={item.description}
                                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                            placeholder="Description"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
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
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                >
                    <FiPlus className="w-4 h-4" />
                    Add Item
                </button>

                {/* Summary */}
                <div className="bg-slate-50 p-4 rounded-lg border-2 border-slate-200">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-slate-600">Total:</span>
                        <span className="text-lg font-bold text-slate-800">₹{formatCurrency(total)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                        <span className="text-base font-medium text-slate-700">Payable:</span>
                        <span className="text-xl font-bold text-blue-600">₹{formatCurrency(total)}</span>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Select Bank <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="bank"
                        required
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value={bankId}>
                            {bankDetails?.bank || 'Current Bank'} - Balance: ₹{formatCurrency(bankDetails?.balance || 0)}
                        </option>
                    </select>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-200">
                    <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-base font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                    >
                        Submit
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

// Expense Modal
export const ExpenseModal = ({ isOpen, onClose, bankDetails, bankId, onSubmit, formatCurrency }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        onSubmit('EXPENSE', Object.fromEntries(formData));
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Create Expense from Bank">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 mb-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-xs text-orange-600 font-medium">Bank Name</p>
                            <p className="text-sm font-bold text-slate-700">{bankDetails?.bank || 'Current Bank'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-orange-600 font-medium">Credit</p>
                            <p className="text-sm font-bold text-green-600">₹{formatCurrency(bankDetails?.balance || 0)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-orange-600 font-medium">Debit</p>
                            <p className="text-sm font-bold text-red-600">₹0.00</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Expense To <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="expense_to"
                            placeholder="Enter payee name"
                            required
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                            Description
                        </label>
                        <textarea
                            name="description"
                            placeholder="Enter description"
                            rows="3"
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Expense Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="category"
                            required
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                            From Account (Bank) <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="bank"
                            required
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value={bankId}>
                                {bankDetails?.bank || 'Current Bank'} - Balance: ₹{formatCurrency(bankDetails?.balance || 0)}
                            </option>
                        </select>
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
                        </select>
                    </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-200">
                    <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-base font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                    >
                        Submit
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

// Contra Modal
export const ContraModal = ({ isOpen, onClose, bankDetails, bankId, onSubmit, formatCurrency }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        onSubmit('CONTRA', Object.fromEntries(formData));
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Create Contra Entry">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 mb-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                            <p className="text-xs text-indigo-600 font-medium">From Bank</p>
                            <p className="text-sm font-bold text-slate-700">{bankDetails?.bank || 'Current Bank'}</p>
                            <p className="text-xs text-indigo-600 mt-1">Balance: ₹{formatCurrency(bankDetails?.balance || 0)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-indigo-600 font-medium">To Bank</p>
                            <p className="text-sm font-bold text-slate-700">To be selected</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <label className="block text-sm font-medium text-red-700 mb-2">
                            From Bank (Payment Out) <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="from_bank"
                            required
                            className="w-full px-4 py-3 border-2 border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
                        >
                            <option value={bankId}>
                                {bankDetails?.bank || 'Current Bank'} - Balance: ₹{formatCurrency(bankDetails?.balance || 0)}
                            </option>
                        </select>
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
                            Description
                        </label>
                        <textarea
                            name="description"
                            placeholder="Enter description"
                            rows="3"
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <label className="block text-sm font-medium text-green-700 mb-2">
                            To Bank (Payment In) <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="to_bank"
                            required
                            className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                        >
                            <option value="">Select Bank</option>
                            <option value="1">Bank 1</option>
                            <option value="2">Bank 2</option>
                            <option value="3">Bank 3</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-200">
                    <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-base font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                    >
                        Submit
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
    summary 
}) => {
    const modalProps = {
        isOpen,
        onClose,
        bankDetails,
        bankId,
        onSubmit,
        formatCurrency,
        summary
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