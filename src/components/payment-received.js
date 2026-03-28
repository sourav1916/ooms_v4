import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiUser, FiCalendar, FiDollarSign, FiFileText, FiCreditCard, FiHash, FiSearch } from 'react-icons/fi';
import getHeaders from '../utils/get-headers';
import API_BASE_URL from '../utils/api-controller';
import axios from 'axios';
import toast from 'react-hot-toast';

const appSettings = {
    company_name: 'Professional Accounting Services',
    currency: 'INR',
};

const PaymentReceived = ({
    isOpen = false,
    onClose = () => { },
    onSuccess = () => { },
    initialClientId = '',
    initialUsername = '',
    mode = 'modal'
}) => {
    const usernameToUse = initialUsername || initialClientId || '';
    const [formData, setFormData] = useState({
        client_username: usernameToUse || '',
        payment_date: new Date().toISOString().split('T')[0],
        amount: '',
        remark: '',
        bank_id: '',
        transaction_ref_id: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [clientSearchQuery, setClientSearchQuery] = useState('');
    const [clientSearchResults, setClientSearchResults] = useState([]);
    const [clientSearchLoading, setClientSearchLoading] = useState(false);
    const [showClientDropdown, setShowClientDropdown] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [sendEmail, setSendEmail] = useState(true);
    const [sendWhatsApp, setSendWhatsApp] = useState(true);
    const [bankOptions, setBankOptions] = useState([]);
    const [bankLoading, setBankLoading] = useState(false);
    const [clientSummary, setClientSummary] = useState(null); // Add client summary state
    const clientSearchAbortRef = useRef(null);

    // Fetch banks from API (same as ReceiveModal)
    useEffect(() => {
        if (isOpen) {
            fetchBanks();
        }
    }, [isOpen]);

    const fetchBanks = async () => {
        setBankLoading(true);
        try {
            const response = await axios.get(
                `${API_BASE_URL}/transaction/bank/list?page_no=1&limit=100&search=`,
                { headers: getHeaders() }
            );
            
            if (response.data.success) {
                const bankData = response.data.data || [];
                setBankOptions(bankData);
            } else {
                toast.error('Failed to fetch bank accounts');
            }
        } catch (error) {
            console.error('Error fetching banks:', error);
            toast.error('Failed to load bank accounts');
        } finally {
            setBankLoading(false);
        }
    };

    // Fetch client summary when client is selected (like in ReceiveModal)
    const fetchClientSummary = async (clientUsername) => {
        if (!clientUsername) return;
        
        try {
            const response = await axios.get(
                `${API_BASE_URL}/transaction/summary/client/${clientUsername}`,
                { headers: getHeaders() }
            );
            
            if (response.data.success) {
                setClientSummary(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching client summary:', error);
            // Don't show toast error for summary, it's not critical
        }
    };

    // Client search API – min 3 chars, debounced
    useEffect(() => {
        const term = (clientSearchQuery || '').trim();
        if (term.length < 3) {
            setClientSearchResults([]);
            setClientSearchLoading(false);
            return;
        }
        const t = setTimeout(() => {
            setClientSearchLoading(true);
            clientSearchAbortRef.current?.abort();
            const controller = new AbortController();
            clientSearchAbortRef.current = controller;
            const url = `${API_BASE_URL.replace(/\/$/, '')}/client/search?search=${encodeURIComponent(term)}`;
            fetch(url, { headers: getHeaders(), signal: controller.signal })
                .then((res) => res.json())
                .then((data) => {
                    const list = Array.isArray(data?.data) ? data.data : [];
                    setClientSearchResults(list);
                })
                .catch((err) => {
                    if (err?.name !== 'AbortError') setClientSearchResults([]);
                })
                .finally(() => setClientSearchLoading(false));
        }, 400);
        return () => {
            clearTimeout(t);
            clientSearchAbortRef.current?.abort();
        };
    }, [clientSearchQuery]);

    // Auto-select when initialUsername passed and fetch summary
    useEffect(() => {
        if (!isOpen || !usernameToUse || usernameToUse.length < 3) return;
        const headers = getHeaders();
        if (!headers) return;
        const url = `${API_BASE_URL.replace(/\/$/, '')}/client/search?search=${encodeURIComponent(usernameToUse)}`;
        fetch(url, { headers })
            .then((res) => res.json())
            .then((data) => {
                const list = Array.isArray(data?.data) ? data.data : [];
                const match = list.find((c) => String(c.username) === String(usernameToUse));
                if (match) {
                    setSelectedClient(match);
                    setFormData((prev) => ({ ...prev, client_username: match.username }));
                    fetchClientSummary(match.username); // Fetch summary when client is auto-selected
                }
            })
            .catch(() => {});
    }, [isOpen, usernameToUse]);

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setFormData({
                client_username: usernameToUse || '',
                payment_date: new Date().toISOString().split('T')[0],
                amount: '',
                remark: '',
                bank_id: '',
                transaction_ref_id: ''
            });
            setClientSearchQuery('');
            setClientSearchResults([]);
            setShowClientDropdown(false);
            setClientSummary(null); // Reset client summary
            if (!usernameToUse) setSelectedClient(null);
        }
    }, [isOpen, usernameToUse]);

    const getSelectedClient = () => selectedClient;

    const getClientDisplayText = (client) => {
        if (!client) return formData.client_username ? 'Loading...' : 'Select Client';
        const name = client.name || client.username || '';
        const extra = [client.mobile, client.email].filter(Boolean).join(' • ');
        return extra ? `${name} • ${extra}` : name;
    };

    const getSelectedBank = () => {
        return bankOptions.find(bank => bank.bank_id === formData.bank_id);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleClientSelect = (client) => {
        setSelectedClient(client);
        setFormData((prev) => ({ ...prev, client_username: client.username }));
        setShowClientDropdown(false);
        setClientSearchQuery('');
        fetchClientSummary(client.username); // Fetch summary when client is selected
    };

    const handleClientClear = () => {
        setSelectedClient(null);
        setFormData((prev) => ({ ...prev, client_username: '' }));
        setClientSummary(null); // Clear summary
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.client_username) {
            toast.error('Please select a client');
            return;
        }
        
        if (!formData.bank_id) {
            toast.error('Please select a bank account');
            return;
        }
        
        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        setIsSubmitting(true);
        
        try {
            const selectedBank = getSelectedBank();
            // Same payload structure as ReceiveModal
            const payload = {
                amount: parseFloat(formData.amount),
                party1_id: formData.client_username, // Client username as party1_id
                party1_type: "client",               // party1_type is client
                party2_id: formData.bank_id,         // Bank ID as party2_id
                party2_type: "bank",                 // party2_type is bank
                remark: formData.remark || `Payment received from ${selectedClient?.name || selectedClient?.username}`,
                transaction_date: formData.payment_date
            };

            console.log('Payment received payload:', payload);

            const response = await axios.post(
                `${API_BASE_URL}/transaction/payment/receive`,
                payload,
                { headers: getHeaders() }
            );

            if (response.data.success) {
                toast.success(response.data.message || 'Payment received successfully');
                
                const submissionData = {
                    ...formData,
                    selected_client: getSelectedClient(),
                    selected_bank: getSelectedBank(),
                    transaction_id: response.data.data?.transaction_id,
                    timestamp: new Date().toISOString(),
                    company: appSettings.company_name,
                    notifications: {
                        email: sendEmail,
                        whatsapp: sendWhatsApp
                    }
                };
                
                onSuccess(submissionData);
                if (mode === 'modal') onClose();
                
                // Reset form
                setFormData({
                    client_username: '',
                    payment_date: new Date().toISOString().split('T')[0],
                    amount: '',
                    remark: '',
                    bank_id: '',
                    transaction_ref_id: ''
                });
                setSelectedClient(null);
                setClientSearchQuery('');
                setClientSummary(null); // Clear summary
            } else {
                toast.error(response.data.message || 'Failed to receive payment');
            }
        } catch (error) {
            console.error('Error submitting payment:', error);
            
            if (error.response) {
                console.error('Error response:', error.response.data);
                const errorMessage = error.response?.data?.message || 
                                    error.response?.data?.error || 
                                    'Failed to process payment';
                toast.error(errorMessage);
            } else if (error.request) {
                toast.error('No response from server. Please check your network connection.');
            } else {
                toast.error(`Error: ${error.message}`);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const formContent = (
        <div className="bg-white rounded-2xl flex flex-col h-full">
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white rounded-t-2xl shadow-lg">
                <div className="flex items-center space-x-4">
                    <div className="p-2.5 bg-white/20 rounded-xl">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Receive Payment from Client</h2>
                        <p className="text-indigo-200 text-sm mt-0.5">{appSettings.company_name}</p>
                    </div>
                </div>
                {mode === 'modal' && (
                    <button
                        onClick={onClose}
                        className="p-1.5 text-indigo-200 hover:text-white hover:bg-indigo-500 rounded-lg transition-colors"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-gradient-to-b from-slate-50 to-white">
                <form onSubmit={handleSubmit}>
                    {/* Client Info Section - Similar to ReceiveModal */}
                    {selectedClient && clientSummary && (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-blue-600 font-medium">Client</p>
                                    <p className="text-lg font-semibold text-slate-800">{selectedClient.name}</p>
                                    <p className="text-xs text-slate-500">Username: {selectedClient.username}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-blue-600 font-medium">Balance Summary</p>
                                    <p className="text-sm text-green-600">Credit: ₹{formatCurrency(clientSummary?.totalCredit || 0)}</p>
                                    <p className="text-sm text-red-600">Debit: ₹{formatCurrency(clientSummary?.totalDebit || 0)}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Client Selection and Date Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                        {/* Client Selection */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Client <span className="text-red-500">*</span>
                                </label>
                                <span className="text-xs text-gray-500 px-1.5 py-0.5 bg-gray-100 rounded">Required</span>
                            </div>
                            <div className="relative">
                                <div
                                    className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg bg-white cursor-pointer hover:border-indigo-400 transition-all duration-200 shadow-sm text-sm"
                                    onClick={() => setShowClientDropdown(!showClientDropdown)}
                                >
                                    {formData.client_username ? (
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center space-x-2 min-w-0">
                                                <div className="p-1.5 rounded bg-blue-100 text-blue-600 shrink-0">
                                                    <FiUser className="w-4 h-4" />
                                                </div>
                                                <div className="truncate min-w-0">
                                                    <span className="text-gray-800 font-medium block truncate">
                                                        {getClientDisplayText(getSelectedClient())}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); handleClientClear(); }}
                                                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded shrink-0"
                                            >
                                                <FiX className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex justify-between items-center text-gray-500">
                                            <div className="flex items-center space-x-2">
                                                <div className="p-1.5 rounded bg-gray-100">
                                                    <FiSearch className="w-4 h-4" />
                                                </div>
                                                <span className="font-medium truncate">Search client (min 3 characters)...</span>
                                            </div>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {showClientDropdown && (
                                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-64 overflow-y-auto text-sm">
                                        <div className="p-2 border-b border-gray-200 bg-gray-50 sticky top-0">
                                            <div className="relative">
                                                <FiSearch className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Search by name, mobile, email..."
                                                    className="w-full pl-8 pr-3 py-2 border-2 border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                                    value={clientSearchQuery}
                                                    onChange={(e) => setClientSearchQuery(e.target.value)}
                                                    autoFocus
                                                />
                                            </div>
                                            {clientSearchQuery.trim().length > 0 && clientSearchQuery.trim().length < 3 && (
                                                <p className="text-xs text-gray-500 mt-1">Type at least 3 characters</p>
                                            )}
                                        </div>
                                        <div className="py-1">
                                            {clientSearchLoading && (
                                                <div className="px-3 py-4 text-center text-gray-500 text-sm">Searching...</div>
                                            )}
                                            {!clientSearchLoading && clientSearchQuery.trim().length >= 3 && clientSearchResults.length === 0 && (
                                                <div className="px-3 py-4 text-center text-gray-500 text-sm">No clients found</div>
                                            )}
                                            {!clientSearchLoading && clientSearchResults.map((client) => (
                                                <div
                                                    key={client.username}
                                                    className={`px-3 py-2 cursor-pointer border-l-2 transition-all duration-150 ${formData.client_username === client.username
                                                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                                                        : 'border-transparent hover:bg-gray-50'
                                                        }`}
                                                    onClick={() => handleClientSelect(client)}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center space-x-2 mb-0.5">
                                                                <div className="p-1 rounded bg-blue-100 text-blue-600 shrink-0">
                                                                    <FiUser className="w-4 h-4" />
                                                                </div>
                                                                <span className="font-medium text-gray-900 truncate">{client.name || client.username}</span>
                                                            </div>
                                                            <div className="text-xs text-gray-600 ml-7 truncate">
                                                                {[client.mobile, client.email].filter(Boolean).join(' • ') || client.username}
                                                            </div>
                                                            {client.firms && client.firms.length > 0 && (
                                                                <div className="text-xs text-gray-500 mt-0.5 ml-7 truncate">
                                                                    Firms: {client.firms.map((f) => f.firm_name).filter(Boolean).join(', ')}
                                                                </div>
                                                            )}
                                                        </div>
                                                        {formData.client_username === client.username && (
                                                            <svg className="w-4 h-4 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Date */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Payment Date <span className="text-red-500">*</span>
                                </label>
                                <span className="text-xs text-gray-500 px-1.5 py-0.5 bg-gray-100 rounded">Required</span>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                                    <FiCalendar className="w-4 h-4 text-gray-400" />
                                </div>
                                <input
                                    type="date"
                                    className="pl-9 w-full pr-3 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-400 transition-all duration-200 shadow-sm bg-white text-sm"
                                    name="payment_date"
                                    value={formData.payment_date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Amount and Bank Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                        {/* Amount */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Amount <span className="text-red-500">*</span>
                                </label>
                                <span className="text-xs text-gray-500 px-1.5 py-0.5 bg-gray-100 rounded">Required</span>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                                    <FiDollarSign className="w-4 h-4 text-gray-400" />
                                </div>
                                <input
                                    type="number"
                                    className="pl-9 w-full pr-3 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-400 transition-all duration-200 shadow-sm text-sm"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleInputChange}
                                    placeholder="Enter amount"
                                    required
                                    min="0.01"
                                    step="0.01"
                                />
                            </div>
                        </div>

                        {/* Bank Selection */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Bank Account <span className="text-red-500">*</span>
                                </label>
                                <span className="text-xs text-gray-500 px-2 py-0.5 bg-gray-100 rounded-lg">Required</span>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                    <FiCreditCard className="w-4 h-4 text-gray-400" />
                                </div>
                                <select
                                    name="bank_id"
                                    value={formData.bank_id}
                                    onChange={handleInputChange}
                                    className="pl-10 w-full pr-10 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-300 transition-all duration-200 appearance-none bg-white text-sm font-medium"
                                    required
                                    disabled={bankLoading}
                                >
                                    <option value="" disabled>{bankLoading ? 'Loading banks...' : 'Select Bank Account'}</option>
                                    {bankOptions.map(bank => (
                                        <option key={bank.bank_id} value={bank.bank_id} className="text-sm">
                                            {bank.bank} — {bank.account_no} (₹{formatCurrency(bank.balance || 0)})
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transaction Ref ID and Description Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                        {/* Transaction Ref ID */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Transaction Reference ID
                                </label>
                                <span className="text-xs text-gray-500 px-1.5 py-0.5 bg-gray-100 rounded">Optional</span>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                                    <FiHash className="w-4 h-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="pl-9 w-full pr-3 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-400 transition-all duration-200 shadow-sm text-sm"
                                    name="transaction_ref_id"
                                    value={formData.transaction_ref_id}
                                    onChange={handleInputChange}
                                    placeholder="Enter transaction reference"
                                    maxLength="50"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Bank transaction ID, UTR number, or payment reference
                            </p>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Description / Remarks
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-3 pointer-events-none">
                                    <FiFileText className="w-4 h-4 text-gray-400" />
                                </div>
                                <textarea
                                    className="pl-10 w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-400 transition-all duration-200 shadow-sm text-sm"
                                    name="remark"
                                    value={formData.remark}
                                    onChange={handleInputChange}
                                    placeholder="Enter payment description or remarks..."
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Transaction Summary - Similar to ReceiveModal */}
                    {selectedClient && getSelectedBank() && formData.amount && (
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
                            <p className="text-xs text-slate-600 mb-2 font-medium">Transaction Summary</p>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-slate-600">Receiving from:</span>
                                    <span className="text-blue-600 font-semibold">{selectedClient.name}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-slate-600">To Bank:</span>
                                    <span className="text-blue-600 font-semibold">{getSelectedBank()?.bank}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-slate-600">Amount:</span>
                                    <span className="text-green-600 font-bold">{formatCurrency(formData.amount)}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-slate-600">Date:</span>
                                    <span className="text-slate-700">{formData.payment_date}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </form>
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 border-t border-gray-200 bg-white p-6 rounded-b-2xl shadow-inner">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    {/* Notification Options */}
                    <div className="w-full lg:w-auto">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">Send Receipt:</span>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center cursor-pointer">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={sendEmail}
                                            onChange={(e) => setSendEmail(e.target.checked)}
                                            className="sr-only"
                                        />
                                        <div className={`w-9 h-5 rounded-full transition-colors duration-200 ${sendEmail ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                                        <div className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 transform ${sendEmail ? 'translate-x-4' : ''}`}></div>
                                    </div>
                                    <div className="ml-2 flex items-center">
                                        <svg className="w-4 h-4 text-gray-600 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-xs text-gray-700 font-medium">Email</span>
                                    </div>
                                </label>

                                <label className="flex items-center cursor-pointer">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={sendWhatsApp}
                                            onChange={(e) => setSendWhatsApp(e.target.checked)}
                                            className="sr-only"
                                        />
                                        <div className={`w-9 h-5 rounded-full transition-colors duration-200 ${sendWhatsApp ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                        <div className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 transform ${sendWhatsApp ? 'translate-x-4' : ''}`}></div>
                                    </div>
                                    <div className="ml-2 flex items-center">
                                        <svg className="w-4 h-4 text-green-600 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.675-.236-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.9 6.994c-.004 5.45-4.438 9.88-9.888 9.88m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.892 0-3.18-1.24-6.162-3.495-8.411" />
                                        </svg>
                                        <span className="text-xs text-gray-700 font-medium">WhatsApp</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
                        {/* Total Display */}
                        <div className="hidden lg:block px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded border border-indigo-200">
                            <div className="text-xs text-indigo-700 font-semibold">
                                Amount: <span className="text-sm">{formData.amount ? formatCurrency(formData.amount) : '₹0'}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {mode === 'modal' && (
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={isSubmitting}
                                    className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition-all duration-150 disabled:opacity-50 shadow-sm"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={isSubmitting || !formData.client_username || !formData.bank_id || !formData.amount}
                                className="px-5 py-2 text-xs font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-700 border border-transparent rounded-lg hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 shadow hover:shadow-md min-w-[140px] flex items-center justify-center"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Receive Payment
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Render as modal or standalone component
    if (mode === 'modal') {
        return isOpen ? (
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen p-2 sm:p-4">
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity"
                        onClick={onClose}
                    />
                    {/* Modal panel - large */}
                    <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl min-h-[90vh] max-h-[95vh] flex flex-col transform transition-all duration-300 scale-100">
                        {formContent}
                    </div>
                </div>
            </div>
        ) : null;
    }

    // Render as standalone page component
    return formContent;
};

export default PaymentReceived;