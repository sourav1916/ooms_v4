// JournalEntry.js
import React, { useState, useEffect, useMemo } from 'react';
import { FiX, FiUser, FiCalendar, FiDollarSign, FiFileText, FiArrowRight, FiMinus, FiPlus, FiHash } from 'react-icons/fi';

// Enhanced professional data for journal entries
const accountOptions = [
    // Clients
    { id: 'client_1', type: 'client', name: 'ABC Enterprises Ltd', email: 'accounts@abcenterprises.com', contact: 'Mr. Sharma', balance: '1,50,000' },
    { id: 'client_2', type: 'client', name: 'XYZ Solutions Inc', email: 'billing@xyzsolutions.com', contact: 'Ms. Patel', balance: '75,000' },
    { id: 'client_3', type: 'client', name: 'Global Traders Co.', email: 'finance@globaltraders.com', contact: 'Mr. Gupta', balance: '2,25,000' },
    
    // Banks
    { id: 'bank_1', type: 'bank', name: 'HDFC Bank', account: '123456789012', holder: 'Company Name Ltd', balance: '10,50,000' },
    { id: 'bank_2', type: 'bank', name: 'ICICI Bank', account: '987654321098', holder: 'Company Name Ltd', balance: '25,75,000' },
    { id: 'bank_3', type: 'bank', name: 'State Bank of India', account: '456789012345', holder: 'Company Name Ltd', balance: '15,20,000' },
    
    // Staff
    { id: 'staff_1', type: 'staff', name: 'Rajesh Kumar', email: 'rajesh@company.com', designation: 'Account Manager', balance: '50,000' },
    { id: 'staff_2', type: 'staff', name: 'Priya Sharma', email: 'priya@company.com', designation: 'Sales Executive', balance: '25,000' },
    
    // Capital Accounts
    { id: 'capital_1', type: 'capital', name: 'Proprietor Capital', description: 'Owner Investment', balance: '50,00,000' },
    { id: 'capital_2', type: 'capital', name: 'Partner Capital A', description: 'Partner A Investment', balance: '25,00,000' },
    
    // Expenses
    { id: 'expense_1', type: 'expense', name: 'Office Rent', category: 'Fixed Expenses', balance: '75,000' },
    { id: 'expense_2', type: 'expense', name: 'Salary Expenses', category: 'Staff Costs', balance: '2,50,000' },
    
    // Income
    { id: 'income_1', type: 'income', name: 'Service Revenue', category: 'Service Income', balance: '15,00,000' },
    { id: 'income_2', type: 'income', name: 'Product Sales', category: 'Sales Income', balance: '25,00,000' }
];

const appSettings = {
    company_name: 'Professional Accounting Services',
    currency: 'INR',
};

const JournalEntry = ({
    isOpen = false,
    onClose = () => { },
    onSuccess = () => { },
    initialFromAccountId = '',
    mode = 'modal'
}) => {
    const [formData, setFormData] = useState({
        from_account_id: initialFromAccountId || '',
        to_account_id: '',
        date: new Date().toISOString().split('T')[0],
        amount: '',
        remark: '',
        transaction_ref_id: '' // New field added
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fromSearchTerm, setFromSearchTerm] = useState('');
    const [toSearchTerm, setToSearchTerm] = useState('');
    const [showFromDropdown, setShowFromDropdown] = useState(false);
    const [showToDropdown, setShowToDropdown] = useState(false);

    // Filter accounts based on search
    const filteredFromAccounts = useMemo(() => {
        if (!fromSearchTerm) return accountOptions;
        return accountOptions.filter(account =>
            account.name.toLowerCase().includes(fromSearchTerm.toLowerCase()) ||
            (account.email && account.email.toLowerCase().includes(fromSearchTerm.toLowerCase())) ||
            (account.contact && account.contact.toLowerCase().includes(fromSearchTerm.toLowerCase())) ||
            account.type.toLowerCase().includes(fromSearchTerm.toLowerCase())
        );
    }, [fromSearchTerm]);

    const filteredToAccounts = useMemo(() => {
        if (!toSearchTerm) return accountOptions;
        return accountOptions.filter(account =>
            account.name.toLowerCase().includes(toSearchTerm.toLowerCase()) ||
            (account.email && account.email.toLowerCase().includes(toSearchTerm.toLowerCase())) ||
            (account.contact && account.contact.toLowerCase().includes(toSearchTerm.toLowerCase())) ||
            account.type.toLowerCase().includes(toSearchTerm.toLowerCase())
        );
    }, [toSearchTerm]);

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setFormData({
                from_account_id: initialFromAccountId || '',
                to_account_id: '',
                date: new Date().toISOString().split('T')[0],
                amount: '',
                remark: '',
                transaction_ref_id: '' // Reset new field
            });
            setFromSearchTerm('');
            setToSearchTerm('');
            setShowFromDropdown(false);
            setShowToDropdown(false);
        }
    }, [isOpen, initialFromAccountId]);

    const getSelectedFromAccount = () => {
        return accountOptions.find(account => account.id === formData.from_account_id);
    };

    const getSelectedToAccount = () => {
        return accountOptions.find(account => account.id === formData.to_account_id);
    };

    const getAccountDisplayText = (account) => {
        if (!account) return 'Select Account';
        
        switch (account.type) {
            case 'client':
                return `${account.name} • ${account.email} • Balance: ₹${account.balance}`;
            case 'bank':
                return `${account.name} • ${account.account} • Balance: ₹${account.balance}`;
            case 'staff':
                return `${account.name} • ${account.designation} • Balance: ₹${account.balance}`;
            case 'capital':
                return `${account.name} • ${account.description} • Balance: ₹${account.balance}`;
            case 'expense':
                return `${account.name} • ${account.category} • Balance: ₹${account.balance}`;
            case 'income':
                return `${account.name} • ${account.category} • Balance: ₹${account.balance}`;
            default:
                return `${account.name} • Balance: ₹${account.balance}`;
        }
    };

    const getAccountTypeBadge = (type) => {
        const typeConfig = {
            client: { color: 'bg-green-100 text-green-800 border-green-200', label: 'CLIENT' },
            bank: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'BANK' },
            staff: { color: 'bg-purple-100 text-purple-800 border-purple-200', label: 'STAFF' },
            capital: { color: 'bg-orange-100 text-orange-800 border-orange-200', label: 'CAPITAL' },
            expense: { color: 'bg-red-100 text-red-800 border-red-200', label: 'EXPENSE' },
            income: { color: 'bg-teal-100 text-teal-800 border-teal-200', label: 'INCOME' }
        };
        
        const config = typeConfig[type] || { color: 'bg-gray-100 text-gray-800 border-gray-200', label: type.toUpperCase() };
        return `px-2 py-1 text-xs rounded-full font-medium ${config.color} border`;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFromAccountSelect = (accountId) => {
        setFormData(prev => ({ ...prev, from_account_id: accountId }));
        setShowFromDropdown(false);
        setFromSearchTerm('');
    };

    const handleToAccountSelect = (accountId) => {
        setFormData(prev => ({ ...prev, to_account_id: accountId }));
        setShowToDropdown(false);
        setToSearchTerm('');
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
        if (!formData.from_account_id || !formData.to_account_id || !formData.amount || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const submissionData = {
                ...formData,
                selected_from_account: getSelectedFromAccount(),
                selected_to_account: getSelectedToAccount(),
                timestamp: new Date().toISOString(),
                company: appSettings.company_name
            };
            console.log('Journal Entry submitted:', submissionData);
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
            <div className="flex-shrink-0 flex items-center justify-between p-3 border-b border-gray-300 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-t-xl">
                <div>
                    <h2 className="text-xl font-bold">Journal Entry</h2>
                </div>
                {mode === 'modal' && (
                    <button
                        onClick={onClose}
                        className="text-indigo-200 hover:text-white p-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition-colors"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
                <form onSubmit={handleSubmit}>
                    {/* Account Selection Section */}
                    <div className="mb-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Decrease From Account */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Decrease From <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white cursor-pointer hover:border-red-400 transition-colors"
                                        onClick={() => setShowFromDropdown(!showFromDropdown)}
                                    >
                                        {formData.from_account_id ? (
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-800 font-medium">
                                                    {getAccountDisplayText(getSelectedFromAccount())}
                                                </span>
                                                <div className="flex items-center space-x-2">
                                                    <div className="bg-red-100 text-red-600 p-1 rounded">
                                                        <FiMinus className="w-4 h-4" />
                                                    </div>
                                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between items-center text-gray-500">
                                                <span>Select account to decrease...</span>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {showFromDropdown && (
                                        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-xl max-h-80 overflow-y-auto">
                                            <div className="p-3 border-b border-gray-200 bg-gray-50">
                                                <input
                                                    type="text"
                                                    placeholder="Search by name, type, email, or contact..."
                                                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                    value={fromSearchTerm}
                                                    onChange={(e) => setFromSearchTerm(e.target.value)}
                                                    autoFocus
                                                />
                                            </div>
                                            <div className="py-2">
                                                {filteredFromAccounts.map(account => (
                                                    <div
                                                        key={account.id}
                                                        className={`px-4 py-3 cursor-pointer border-l-4 transition-colors ${formData.from_account_id === account.id
                                                            ? 'bg-red-50 border-red-500 text-red-700'
                                                            : 'border-transparent hover:bg-gray-50'
                                                            }`}
                                                        onClick={() => handleFromAccountSelect(account.id)}
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex-1">
                                                                <div className="flex items-center space-x-3 mb-1">
                                                                    <span className="font-semibold text-gray-900">{account.name}</span>
                                                                    <span className={getAccountTypeBadge(account.type)}>
                                                                        {account.type.toUpperCase()}
                                                                    </span>
                                                                </div>
                                                                <div className="text-sm text-gray-600">
                                                                    {account.type === 'client' && `Email: ${account.email} • ${account.contact}`}
                                                                    {account.type === 'bank' && `Account: ${account.account} • ${account.holder}`}
                                                                    {account.type === 'staff' && `Email: ${account.email} • ${account.designation}`}
                                                                    {account.type === 'capital' && `${account.description}`}
                                                                    {account.type === 'expense' && `Category: ${account.category}`}
                                                                    {account.type === 'income' && `Category: ${account.category}`}
                                                                </div>
                                                                <div className="text-sm font-medium text-orange-600 mt-1">
                                                                    Balance: ₹{account.balance}
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

                            {/* Increase To Account */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Increase To <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white cursor-pointer hover:border-green-400 transition-colors"
                                        onClick={() => setShowToDropdown(!showToDropdown)}
                                    >
                                        {formData.to_account_id ? (
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-800 font-medium">
                                                    {getAccountDisplayText(getSelectedToAccount())}
                                                </span>
                                                <div className="flex items-center space-x-2">
                                                    <div className="bg-green-100 text-green-600 p-1 rounded">
                                                        <FiPlus className="w-4 h-4" />
                                                    </div>
                                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between items-center text-gray-500">
                                                <span>Select account to increase...</span>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {showToDropdown && (
                                        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-xl max-h-80 overflow-y-auto">
                                            <div className="p-3 border-b border-gray-200 bg-gray-50">
                                                <input
                                                    type="text"
                                                    placeholder="Search by name, type, email, or contact..."
                                                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                    value={toSearchTerm}
                                                    onChange={(e) => setToSearchTerm(e.target.value)}
                                                    autoFocus
                                                />
                                            </div>
                                            <div className="py-2">
                                                {filteredToAccounts.map(account => (
                                                    <div
                                                        key={account.id}
                                                        className={`px-4 py-3 cursor-pointer border-l-4 transition-colors ${formData.to_account_id === account.id
                                                            ? 'bg-green-50 border-green-500 text-green-700'
                                                            : 'border-transparent hover:bg-gray-50'
                                                            }`}
                                                        onClick={() => handleToAccountSelect(account.id)}
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex-1">
                                                                <div className="flex items-center space-x-3 mb-1">
                                                                    <span className="font-semibold text-gray-900">{account.name}</span>
                                                                    <span className={getAccountTypeBadge(account.type)}>
                                                                        {account.type.toUpperCase()}
                                                                    </span>
                                                                </div>
                                                                <div className="text-sm text-gray-600">
                                                                    {account.type === 'client' && `Email: ${account.email} • ${account.contact}`}
                                                                    {account.type === 'bank' && `Account: ${account.account} • ${account.holder}`}
                                                                    {account.type === 'staff' && `Email: ${account.email} • ${account.designation}`}
                                                                    {account.type === 'capital' && `${account.description}`}
                                                                    {account.type === 'expense' && `Category: ${account.category}`}
                                                                    {account.type === 'income' && `Category: ${account.category}`}
                                                                </div>
                                                                <div className="text-sm font-medium text-orange-600 mt-1">
                                                                    Balance: ₹{account.balance}
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
                        </div>
                    </div>

                    {/* Date and Amount Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Date */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Journal Date <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiCalendar className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="date"
                                    className="pl-10 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-400 transition-colors"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

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
                                    className="pl-10 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-400 transition-colors"
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
                                    className="pl-10 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-400 transition-colors"
                                    name="transaction_ref_id"
                                    value={formData.transaction_ref_id}
                                    onChange={handleInputChange}
                                    placeholder="Enter transaction reference number"
                                    maxLength="50"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Bank transaction ID, UTR number, or journal reference
                            </p>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Journal Description
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                                    <FiFileText className="w-5 h-5 text-gray-400" />
                                </div>
                                <textarea
                                    className="pl-10 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-400 transition-colors"
                                    name="remark"
                                    value={formData.remark}
                                    onChange={handleInputChange}
                                    placeholder="Enter journal description or remarks..."
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Journal Summary */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="text-md font-semibold text-gray-900 mb-3">Journal Summary</h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                                <div className="text-sm text-gray-600 mb-1">Decrease From</div>
                                <div className="font-semibold text-red-600 truncate">
                                    {getSelectedFromAccount()?.name || 'Not selected'}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {getSelectedFromAccount()?.type ? `${getSelectedFromAccount().type.toUpperCase()}` : ''} • 
                                    Balance: {getSelectedFromAccount() ? `₹${getSelectedFromAccount().balance}` : 'N/A'}
                                </div>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                                <div className="text-sm text-gray-600 mb-1">Transfer Amount</div>
                                <div className="font-semibold text-indigo-600 text-lg">
                                    {formData.amount ? `₹${Number(formData.amount).toLocaleString('en-IN')}` : '0.00'}
                                </div>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                                <div className="text-sm text-gray-600 mb-1">Increase To</div>
                                <div className="font-semibold text-green-600 truncate">
                                    {getSelectedToAccount()?.name || 'Not selected'}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {getSelectedToAccount()?.type ? `${getSelectedToAccount().type.toUpperCase()}` : ''} • 
                                    Balance: {getSelectedToAccount() ? `₹${getSelectedToAccount().balance}` : 'N/A'}
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
                            Journal Amount: {formData.amount ? `₹${Number(formData.amount).toLocaleString('en-IN')}` : '0.00'}
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
                            disabled={isSubmitting || !formData.from_account_id || !formData.to_account_id || !formData.amount || formData.from_account_id === formData.to_account_id}
                            className="px-8 py-3 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Journal Entry...
                                </>
                            ) : (
                                `Create Journal - ${formData.amount ? `₹${Number(formData.amount).toLocaleString('en-IN')}` : '0.00'}`
                            )}
                        </button>
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

export default JournalEntry;