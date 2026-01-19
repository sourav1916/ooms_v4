import React, { useState, useEffect, useMemo } from 'react';
import { FiX, FiUser, FiCalendar, FiDollarSign, FiFileText, FiCreditCard, FiHash } from 'react-icons/fi';

// Enhanced professional data for received payments
const clientOptions = [
    { id: 'client_1', name: 'ABC Enterprises Ltd', email: 'accounts@abcenterprises.com', contact: 'Mr. Sharma', outstanding: '1,50,000' },
    { id: 'client_2', name: 'XYZ Solutions Inc', email: 'billing@xyzsolutions.com', contact: 'Ms. Patel', outstanding: '75,000' },
    { id: 'client_3', name: 'Global Traders Co.', email: 'finance@globaltraders.com', contact: 'Mr. Gupta', outstanding: '2,25,000' },
    { id: 'client_4', name: 'Premium Services Ltd', email: 'accounts@premiumservices.com', contact: 'Customer Service', outstanding: '50,000' },
    { id: 'client_5', name: 'Tech Innovations', email: 'billing@techinnovations.com', contact: 'Accounts Dept', outstanding: '1,80,000' },
    { id: 'client_6', name: 'Professional Consultants', email: 'finance@proconsultants.com', contact: 'Finance Dept', outstanding: '95,000' }
];

const bankOptions = [
    { id: 'bank_1', name: 'HDFC Bank', account: '123456789012', holder: 'Company Name Ltd', balance: '10,50,000' },
    { id: 'bank_2', name: 'ICICI Bank', account: '987654321098', holder: 'Company Name Ltd', balance: '25,75,000' },
    { id: 'bank_3', name: 'State Bank of India', account: '456789012345', holder: 'Company Name Ltd', balance: '15,20,000' },
    { id: 'bank_4', name: 'Axis Bank', account: '321098765432', holder: 'Company Name Ltd', balance: '8,90,000' }
];

const appSettings = {
    company_name: 'Professional Accounting Services',
    currency: 'INR',
};

const PaymentReceived = ({
    isOpen = false,
    onClose = () => { },
    onSuccess = () => { },
    initialClientId = '',
    mode = 'modal'
}) => {
    const [formData, setFormData] = useState({
        client_id: initialClientId || '',
        payment_date: new Date().toISOString().split('T')[0],
        amount: '',
        remark: '',
        bank_id: '',
        transaction_ref_id: '' // New field added
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showClientDropdown, setShowClientDropdown] = useState(false);
    const [sendEmail, setSendEmail] = useState(true);
    const [sendWhatsApp, setSendWhatsApp] = useState(true);

    // Filter clients based on search
    const filteredClients = useMemo(() => {
        if (!searchTerm) return clientOptions;
        return clientOptions.filter(client =>
            client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.contact.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setFormData({
                client_id: initialClientId || '',
                payment_date: new Date().toISOString().split('T')[0],
                amount: '',
                remark: '',
                bank_id: '',
                transaction_ref_id: '' // Reset new field
            });
            setSearchTerm('');
            setShowClientDropdown(false);
        }
    }, [isOpen, initialClientId]);

    const getSelectedClient = () => {
        return clientOptions.find(client => client.id === formData.client_id);
    };

    const getClientDisplayText = (client) => {
        if (!client) return 'Select Client';
        return `${client.name} • ₹${client.outstanding}`;
    };

    const getSelectedBank = () => {
        return bankOptions.find(bank => bank.id === formData.bank_id);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleClientSelect = (clientId) => {
        setFormData(prev => ({ ...prev, client_id: clientId }));
        setShowClientDropdown(false);
        setSearchTerm('');
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
        if (!formData.client_id || !formData.bank_id || !formData.amount || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const submissionData = {
                ...formData,
                selected_client: getSelectedClient(),
                selected_bank: getSelectedBank(),
                timestamp: new Date().toISOString(),
                company: appSettings.company_name,
                notifications: {
                    email: sendEmail,
                    whatsapp: sendWhatsApp
                }
            };
            console.log('Payment Received submitted:', submissionData);
            onSuccess(submissionData);
            if (mode === 'modal') onClose();
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formContent = (
        <div className="bg-white rounded-xl shadow-2xl flex flex-col h-full border border-gray-200">
            {/* Compact Header */}
            <div className="flex-shrink-0 flex items-center justify-between p-3 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-t-xl">
                <div className="flex items-center space-x-3">
                    <div className="p-1.5 bg-white/10 rounded-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="flex items-center space-x-4">
                        <h2 className="text-lg font-bold">Receive Payment</h2>
                        <span className="text-indigo-200 text-sm hidden sm:inline">|</span>
                        <p className="text-indigo-100 text-xs sm:text-sm hidden sm:block">{appSettings.company_name}</p>
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
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-gray-50">
                <form onSubmit={handleSubmit}>
                    {/* Client Selection and Date Section - Compact */}
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
                                    {formData.client_id ? (
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center space-x-2">
                                                <div className="p-1.5 rounded bg-blue-100 text-blue-600">
                                                    <FiUser className="w-4 h-4" />
                                                </div>
                                                <div className="truncate">
                                                    <span className="text-gray-800 font-medium block truncate">
                                                        {getClientDisplayText(getSelectedClient())}
                                                    </span>
                                                </div>
                                            </div>
                                            <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    ) : (
                                        <div className="flex justify-between items-center text-gray-500">
                                            <div className="flex items-center space-x-2">
                                                <div className="p-1.5 rounded bg-gray-100">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                                <span className="font-medium truncate">Click to select client...</span>
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
                                                <svg className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                                <input
                                                    type="text"
                                                    placeholder="Search by name, email, or contact..."
                                                    className="w-full pl-8 pr-3 py-2 border-2 border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    autoFocus
                                                />
                                            </div>
                                        </div>
                                        <div className="py-1">
                                            {filteredClients.map(client => (
                                                <div
                                                    key={client.id}
                                                    className={`px-3 py-2 cursor-pointer border-l-2 transition-all duration-150 ${formData.client_id === client.id
                                                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                                                        : 'border-transparent hover:bg-gray-50'
                                                        }`}
                                                    onClick={() => handleClientSelect(client.id)}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center space-x-2 mb-1">
                                                                <div className="p-1 rounded bg-blue-100 text-blue-600">
                                                                    <FiUser className="w-4 h-4" />
                                                                </div>
                                                                <div className="flex items-center min-w-0">
                                                                    <span className="font-medium text-gray-900 truncate">{client.name}</span>
                                                                    <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full font-medium bg-green-100 text-green-800 border border-green-200">
                                                                        CLIENT
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="text-xs text-gray-600 ml-7 truncate">
                                                                {client.email} • {client.contact}
                                                            </div>
                                                            <div className="text-xs font-medium text-orange-600 mt-1 ml-7">
                                                                Outstanding: ₹{client.outstanding}
                                                            </div>
                                                        </div>
                                                        {formData.client_id === client.id && (
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

                    {/* Amount and Bank Section - Compact */}
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
                                    min="1"
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
                                <span className="text-xs text-gray-500 px-1.5 py-0.5 bg-gray-100 rounded">Required</span>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                                    <FiCreditCard className="w-4 h-4 text-gray-400" />
                                </div>
                                <select
                                    name="bank_id"
                                    value={formData.bank_id}
                                    onChange={handleInputChange}
                                    className="pl-9 w-full pr-10 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-400 transition-all duration-200 shadow-sm appearance-none bg-white text-sm"
                                    required
                                >
                                    <option value="" disabled>Select Bank Account</option>
                                    {bankOptions.map(bank => (
                                        <option key={bank.id} value={bank.id} className="text-sm">
                                            {bank.name} - {bank.account} (₹{bank.balance})
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transaction Ref ID and Description Section - Compact */}
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

                    {/* Summary Section - Compact */}
                    <div className="bg-gradient-to-br from-indigo-50 to-white p-4 rounded-lg border border-indigo-100 shadow-sm">
                        <div className="flex items-center mb-3">
                            <div className="p-1.5 bg-indigo-600 text-white rounded mr-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h4 className="text-sm font-bold text-gray-900">Payment Summary</h4>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="text-center p-2 bg-white rounded border border-gray-200">
                                <div className="text-xs text-gray-600 mb-1">Client</div>
                                <div className="font-semibold text-gray-900 text-sm truncate">
                                    {getSelectedClient()?.name || 'Not selected'}
                                </div>
                            </div>
                            <div className="text-center p-2 bg-white rounded border border-gray-200">
                                <div className="text-xs text-gray-600 mb-1">Amount</div>
                                <div className="font-semibold text-green-600 text-sm">
                                    {formData.amount ? formatCurrency(formData.amount) : '₹0'}
                                </div>
                            </div>
                            <div className="text-center p-2 bg-white rounded border border-gray-200">
                                <div className="text-xs text-gray-600 mb-1">Bank</div>
                                <div className="font-semibold text-gray-900 text-sm truncate">
                                    {getSelectedBank()?.name || 'Not selected'}
                                </div>
                            </div>
                            <div className="text-center p-2 bg-white rounded border border-gray-200">
                                <div className="text-xs text-gray-600 mb-1">Ref ID</div>
                                <div className="font-semibold text-blue-600 text-sm truncate">
                                    {formData.transaction_ref_id || 'N/A'}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {/* Compact Footer */}
            <div className="flex-shrink-0 border-t border-gray-200 bg-white p-4 rounded-b-xl shadow-lg">
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
                                disabled={isSubmitting || !formData.client_id || !formData.bank_id || !formData.amount}
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
                    {/* Compact Modal panel */}
                    <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl h-[85vh] flex flex-col transform transition-all duration-300 scale-100">
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