// PaymentSend.js
import React, { useState, useEffect, useMemo } from 'react';
import { FiX, FiUser, FiCalendar, FiDollarSign, FiFileText, FiCreditCard, FiHash } from 'react-icons/fi';

// Enhanced professional data for sent payments
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

const PaymentSend = ({
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
        return `${client.name} • ${client.email} • Outstanding: ₹${client.outstanding}`;
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
                company: appSettings.company_name
            };
            console.log('Payment Send submitted:', submissionData);
            onSuccess(submissionData);
            if (mode === 'modal') onClose();
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formContent = (
        <div className="bg-white rounded-xl shadow-2xl flex flex-col h-full border border-gray-300">
            {/* Fixed Header */}
            <div className="flex-shrink-0 flex items-center justify-between p-3 border-b border-gray-300 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-xl">
                <div>
                    <h2 className="text-xl font-bold">Send Payment</h2>
                </div>
                {mode === 'modal' && (
                    <button
                        onClick={onClose}
                        className="text-red-200 hover:text-white p-2 rounded-lg bg-red-500 hover:bg-red-600 transition-colors"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
                <form onSubmit={handleSubmit}>
                    {/* Client Selection and Date Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Client Selection */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Client <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white cursor-pointer hover:border-red-400 transition-colors"
                                    onClick={() => setShowClientDropdown(!showClientDropdown)}
                                >
                                    {formData.client_id ? (
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-800 font-medium">
                                                {getClientDisplayText(getSelectedClient())}
                                            </span>
                                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    ) : (
                                        <div className="flex justify-between items-center text-gray-500">
                                            <span>Click to select client...</span>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {showClientDropdown && (
                                    <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-xl max-h-80 overflow-y-auto">
                                        <div className="p-3 border-b border-gray-200 bg-gray-50">
                                            <input
                                                type="text"
                                                placeholder="Search by name, email, or contact..."
                                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                autoFocus
                                            />
                                        </div>
                                        <div className="py-2">
                                            {filteredClients.map(client => (
                                                <div
                                                    key={client.id}
                                                    className={`px-4 py-3 cursor-pointer border-l-4 transition-colors ${formData.client_id === client.id
                                                        ? 'bg-red-50 border-red-500 text-red-700'
                                                        : 'border-transparent hover:bg-gray-50'
                                                        }`}
                                                    onClick={() => handleClientSelect(client.id)}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <div className="flex items-center space-x-3 mb-1">
                                                                <span className="font-semibold text-gray-900">{client.name}</span>
                                                                <span className="px-2 py-1 text-xs rounded-full font-medium bg-green-100 text-green-800 border border-green-200">
                                                                    CLIENT
                                                                </span>
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                Email: {client.email} • {client.contact}
                                                            </div>
                                                            <div className="text-sm font-medium text-orange-600 mt-1">
                                                                Outstanding: ₹{client.outstanding}
                                                            </div>
                                                        </div>
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
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Payment Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 hover:border-red-400 transition-colors"
                                name="payment_date"
                                value={formData.payment_date}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Amount and Bank Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Amount <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiDollarSign className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="number"
                                    className="pl-10 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 hover:border-red-400 transition-colors"
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
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Bank Account <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiCreditCard className="w-5 h-5 text-gray-400" />
                                </div>
                                <select
                                    name="bank_id"
                                    value={formData.bank_id}
                                    onChange={handleInputChange}
                                    className="pl-10 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 hover:border-red-400 transition-colors appearance-none bg-white"
                                    required
                                >
                                    <option value="" disabled>Select Bank Account</option>
                                    {bankOptions.map(bank => (
                                        <option key={bank.id} value={bank.id}>
                                            {bank.name} - {bank.account} - BAL: ₹{bank.balance}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transaction Ref ID and Description Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Transaction Ref ID */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Transaction Reference ID
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiHash className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="pl-10 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 hover:border-red-400 transition-colors"
                                    name="transaction_ref_id"
                                    value={formData.transaction_ref_id}
                                    onChange={handleInputChange}
                                    placeholder="Enter transaction reference number"
                                    maxLength="50"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Bank transaction ID, UTR number, or payment reference
                            </p>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Description / Remarks
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                                    <FiFileText className="w-5 h-5 text-gray-400" />
                                </div>
                                <textarea
                                    className="pl-10 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 hover:border-red-400 transition-colors"
                                    name="remark"
                                    value={formData.remark}
                                    onChange={handleInputChange}
                                    placeholder="Enter payment description or remarks..."
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Summary Section */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="text-md font-semibold text-gray-900 mb-3">Payment Summary</h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                                <div className="text-sm text-gray-600 mb-1">Client</div>
                                <div className="font-semibold text-gray-900 truncate">
                                    {getSelectedClient()?.name || 'Not selected'}
                                </div>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                                <div className="text-sm text-gray-600 mb-1">Amount</div>
                                <div className="font-semibold text-red-600 text-lg">
                                    {formData.amount ? `₹${Number(formData.amount).toLocaleString('en-IN')}` : '0.00'}
                                </div>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                                <div className="text-sm text-gray-600 mb-1">Bank</div>
                                <div className="font-semibold text-gray-900 truncate">
                                    {getSelectedBank()?.name || 'Not selected'}
                                </div>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                                <div className="text-sm text-gray-600 mb-1">Transaction Ref</div>
                                <div className="font-semibold text-blue-600 truncate">
                                    {formData.transaction_ref_id || 'Not provided'}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {/* Fixed Footer */}
            <div className="flex-shrink-0 border-t border-gray-300 bg-gray-50 p-3 rounded-b-xl">
                <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                        <div className="font-semibold">
                            Amount: {formData.amount ? `₹${Number(formData.amount).toLocaleString('en-IN')}` : '0.00'}
                        </div>
                        {formData.transaction_ref_id && (
                            <div className="text-xs text-blue-600 mt-1">
                                Ref: {formData.transaction_ref_id}
                            </div>
                        )}
                    </div>
                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
                        {/* Send Options */}
                        <div className="flex items-center gap-4">
                            {/* Send Invoice Checkbox */}
                            <div className="flex items-center">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        checked
                                        type='checkbox'
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <span className="ml-2 text-sm text-gray-700 whitespace-nowrap">
                                        Email to client
                                    </span>
                                </label>
                            </div>

                            {/* Send Invoice Checkbox */}
                            <div className="flex items-center">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        checked
                                        type='checkbox'
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <span className="ml-2 text-sm text-gray-700 whitespace-nowrap">
                                        WhatsaApp to client
                                    </span>
                                </label>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            {mode === 'modal' && (
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={isSubmitting || !formData.client_id || !formData.bank_id || !formData.amount}
                                className="px-8 py-3 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing Payment...
                                    </>
                                ) : (
                                    `Send Payment - ${formData.amount ? `₹${Number(formData.amount).toLocaleString('en-IN')}` : '0.00'}`
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
                <div className="flex items-center justify-center min-h-screen p-4">
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                        onClick={onClose}
                    />
                    {/* Professional Modal panel with fixed height */}
                    <div className="relative w-full max-w-6xl bg-white rounded-xl shadow-2xl h-[85vh] flex flex-col">
                        {formContent}
                    </div>
                </div>
            </div>
        ) : null;
    }

    // Render as standalone page component
    return formContent;
};

export default PaymentSend;