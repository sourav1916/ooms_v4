import React, { useState, useEffect, useMemo } from 'react';
import { FiX, FiCalendar, FiDollarSign, FiFileText, FiArrowRight, FiMinus, FiPlus, FiHash, FiCreditCard, FiUser } from 'react-icons/fi';

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
        transaction_ref_id: ''
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
                transaction_ref_id: ''
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
                return `${account.name} • ${account.email}`;
            case 'bank':
                return `${account.name} • ${account.account}`;
            case 'staff':
                return `${account.name} • ${account.designation}`;
            case 'capital':
                return `${account.name} • ${account.description}`;
            case 'expense':
                return `${account.name} • ${account.category}`;
            case 'income':
                return `${account.name} • ${account.category}`;
            default:
                return account.name;
        }
    };

    const getAccountTypeBadge = (type) => {
        const typeConfig = {
            client: { color: 'bg-green-100 text-green-800', label: 'C' },
            bank: { color: 'bg-blue-100 text-blue-800', label: 'B' },
            staff: { color: 'bg-purple-100 text-purple-800', label: 'S' },
            capital: { color: 'bg-orange-100 text-orange-800', label: 'CAP' },
            expense: { color: 'bg-red-100 text-red-800', label: 'EXP' },
            income: { color: 'bg-teal-100 text-teal-800', label: 'INC' }
        };
        
        const config = typeConfig[type] || { color: 'bg-gray-100 text-gray-800', label: type.charAt(0).toUpperCase() };
        return `text-xs font-bold px-2 py-1 rounded ${config.color}`;
    };

    const getAccountIcon = (type) => {
        const icons = {
            client: <FiUser className="w-4 h-4" />,
            bank: <FiCreditCard className="w-4 h-4" />,
            staff: <FiUser className="w-4 h-4" />,
            capital: <FiDollarSign className="w-4 h-4" />,
            expense: <FiMinus className="w-4 h-4" />,
            income: <FiPlus className="w-4 h-4" />
        };
        return icons[type] || <FiUser className="w-4 h-4" />;
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
        <div className="bg-white rounded-xl shadow-2xl flex flex-col h-full border border-gray-200">
            {/* Compact Header */}
            <div className="flex-shrink-0 flex items-center justify-between p-3 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-t-xl">
                <div className="flex items-center space-x-3">
                    <div className="p-1.5 bg-white/10 rounded-lg">
                        <FiArrowRight className="w-5 h-5" />
                    </div>
                    <div className="flex items-center space-x-4">
                        <h2 className="text-lg font-bold">Journal Entry</h2>
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
                    {/* Account Selection Section - Compact */}
                    <div className="mb-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Decrease From Account */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Decrease From <span className="text-red-500">*</span>
                                    </label>
                                    <span className="text-xs text-gray-500 px-1.5 py-0.5 bg-gray-100 rounded">Required</span>
                                </div>
                                <div className="relative">
                                    <div
                                        className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg bg-white cursor-pointer hover:border-red-400 transition-all duration-200 shadow-sm"
                                        onClick={() => setShowFromDropdown(!showFromDropdown)}
                                    >
                                        {formData.from_account_id ? (
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <div className="p-1 bg-red-100 text-red-600 rounded">
                                                        <FiMinus className="w-3.5 h-3.5" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                                                            {getSelectedFromAccount()?.name}
                                                        </div>
                                                        <div className="text-xs text-gray-600 truncate max-w-[200px]">
                                                            {getAccountDisplayText(getSelectedFromAccount())}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className={getAccountTypeBadge(getSelectedFromAccount()?.type)}>
                                                        {getSelectedFromAccount()?.type === 'capital' ? 'CAP' : 
                                                         getSelectedFromAccount()?.type === 'expense' ? 'EXP' : 
                                                         getSelectedFromAccount()?.type === 'income' ? 'INC' : 
                                                         getSelectedFromAccount()?.type?.charAt(0).toUpperCase()}
                                                    </span>
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between text-gray-500">
                                                <div className="flex items-center space-x-2">
                                                    <FiMinus className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm">Select account to decrease...</span>
                                                </div>
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {showFromDropdown && (
                                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                                            <div className="p-2 border-b border-gray-200 bg-gray-50">
                                                <input
                                                    type="text"
                                                    placeholder="Search accounts..."
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                                    value={fromSearchTerm}
                                                    onChange={(e) => setFromSearchTerm(e.target.value)}
                                                    autoFocus
                                                />
                                            </div>
                                            <div className="py-1">
                                                {filteredFromAccounts.map(account => (
                                                    <div
                                                        key={account.id}
                                                        className={`px-3 py-2 cursor-pointer hover:bg-gray-50 border-l-2 ${formData.from_account_id === account.id
                                                            ? 'bg-red-50 border-red-500'
                                                            : 'border-transparent'
                                                            }`}
                                                        onClick={() => handleFromAccountSelect(account.id)}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-2">
                                                                <div className="p-1 bg-red-100 text-red-600 rounded">
                                                                    <FiMinus className="w-3 h-3" />
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-medium text-gray-900">{account.name}</div>
                                                                    <div className="text-xs text-gray-600">
                                                                        {account.type === 'client' && `${account.email}`}
                                                                        {account.type === 'bank' && `Account: ${account.account}`}
                                                                        {account.type === 'staff' && `${account.designation}`}
                                                                        {account.type === 'capital' && `${account.description}`}
                                                                        {account.type === 'expense' && `Category: ${account.category}`}
                                                                        {account.type === 'income' && `Category: ${account.category}`}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <span className="text-xs text-gray-500">₹{account.balance}</span>
                                                                <span className={getAccountTypeBadge(account.type)}>
                                                                    {account.type === 'capital' ? 'CAP' : 
                                                                     account.type === 'expense' ? 'EXP' : 
                                                                     account.type === 'income' ? 'INC' : 
                                                                     account.type.charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {formData.from_account_id && (
                                    <div className="mt-1.5 text-xs text-gray-600 flex items-center space-x-2">
                                        <span className="font-medium">Balance: ₹{getSelectedFromAccount()?.balance}</span>
                                        <span className="text-gray-400">•</span>
                                        <span className="text-gray-500">{getSelectedFromAccount()?.type?.toUpperCase()}</span>
                                    </div>
                                )}
                            </div>

                            {/* Increase To Account */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Increase To <span className="text-red-500">*</span>
                                    </label>
                                    <span className="text-xs text-gray-500 px-1.5 py-0.5 bg-gray-100 rounded">Required</span>
                                </div>
                                <div className="relative">
                                    <div
                                        className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg bg-white cursor-pointer hover:border-green-400 transition-all duration-200 shadow-sm"
                                        onClick={() => setShowToDropdown(!showToDropdown)}
                                    >
                                        {formData.to_account_id ? (
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <div className="p-1 bg-green-100 text-green-600 rounded">
                                                        <FiPlus className="w-3.5 h-3.5" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                                                            {getSelectedToAccount()?.name}
                                                        </div>
                                                        <div className="text-xs text-gray-600 truncate max-w-[200px]">
                                                            {getAccountDisplayText(getSelectedToAccount())}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className={getAccountTypeBadge(getSelectedToAccount()?.type)}>
                                                        {getSelectedToAccount()?.type === 'capital' ? 'CAP' : 
                                                         getSelectedToAccount()?.type === 'expense' ? 'EXP' : 
                                                         getSelectedToAccount()?.type === 'income' ? 'INC' : 
                                                         getSelectedToAccount()?.type?.charAt(0).toUpperCase()}
                                                    </span>
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between text-gray-500">
                                                <div className="flex items-center space-x-2">
                                                    <FiPlus className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm">Select account to increase...</span>
                                                </div>
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {showToDropdown && (
                                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                                            <div className="p-2 border-b border-gray-200 bg-gray-50">
                                                <input
                                                    type="text"
                                                    placeholder="Search accounts..."
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                                    value={toSearchTerm}
                                                    onChange={(e) => setToSearchTerm(e.target.value)}
                                                    autoFocus
                                                />
                                            </div>
                                            <div className="py-1">
                                                {filteredToAccounts.map(account => (
                                                    <div
                                                        key={account.id}
                                                        className={`px-3 py-2 cursor-pointer hover:bg-gray-50 border-l-2 ${formData.to_account_id === account.id
                                                            ? 'bg-green-50 border-green-500'
                                                            : 'border-transparent'
                                                            }`}
                                                        onClick={() => handleToAccountSelect(account.id)}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-2">
                                                                <div className="p-1 bg-green-100 text-green-600 rounded">
                                                                    <FiPlus className="w-3 h-3" />
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-medium text-gray-900">{account.name}</div>
                                                                    <div className="text-xs text-gray-600">
                                                                        {account.type === 'client' && `${account.email}`}
                                                                        {account.type === 'bank' && `Account: ${account.account}`}
                                                                        {account.type === 'staff' && `${account.designation}`}
                                                                        {account.type === 'capital' && `${account.description}`}
                                                                        {account.type === 'expense' && `Category: ${account.category}`}
                                                                        {account.type === 'income' && `Category: ${account.category}`}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <span className="text-xs text-gray-500">₹{account.balance}</span>
                                                                <span className={getAccountTypeBadge(account.type)}>
                                                                    {account.type === 'capital' ? 'CAP' : 
                                                                     account.type === 'expense' ? 'EXP' : 
                                                                     account.type === 'income' ? 'INC' : 
                                                                     account.type.charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {formData.to_account_id && (
                                    <div className="mt-1.5 text-xs text-gray-600 flex items-center space-x-2">
                                        <span className="font-medium">Balance: ₹{getSelectedToAccount()?.balance}</span>
                                        <span className="text-gray-400">•</span>
                                        <span className="text-gray-500">{getSelectedToAccount()?.type?.toUpperCase()}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Date and Amount Section - Compact */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                        {/* Date */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Journal Date <span className="text-red-500">*</span>
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
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

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
                                Bank transaction ID, UTR number, or journal reference
                            </p>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Journal Description
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
                                    placeholder="Enter journal description or remarks..."
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Journal Summary - Compact */}
                    <div className="bg-gradient-to-br from-indigo-50 to-white p-4 rounded-lg border border-indigo-100 shadow-sm">
                        <div className="flex items-center mb-3">
                            <div className="p-1.5 bg-indigo-600 text-white rounded mr-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h4 className="text-sm font-bold text-gray-900">Journal Summary</h4>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="text-center p-2 bg-white rounded border border-gray-200">
                                <div className="text-xs text-gray-600 mb-1">Decrease From</div>
                                <div className="font-semibold text-red-600 text-sm truncate">
                                    {getSelectedFromAccount()?.name || 'Not selected'}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {getSelectedFromAccount()?.type?.toUpperCase() || 'N/A'}
                                </div>
                            </div>
                            <div className="text-center p-2 bg-white rounded border border-gray-200">
                                <div className="text-xs text-gray-600 mb-1">Amount</div>
                                <div className="font-semibold text-indigo-600 text-sm">
                                    {formData.amount ? formatCurrency(formData.amount) : '₹0'}
                                </div>
                            </div>
                            <div className="text-center p-2 bg-white rounded border border-gray-200">
                                <div className="text-xs text-gray-600 mb-1">Increase To</div>
                                <div className="font-semibold text-green-600 text-sm truncate">
                                    {getSelectedToAccount()?.name || 'Not selected'}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {getSelectedToAccount()?.type?.toUpperCase() || 'N/A'}
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
                    {/* Warning Message */}
                    {formData.from_account_id === formData.to_account_id && formData.from_account_id && formData.to_account_id && (
                        <div className="w-full lg:w-auto">
                            <div className="flex items-center text-amber-600 text-xs font-medium px-3 py-1.5 bg-amber-50 border border-amber-200 rounded">
                                <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                Cannot journal between same accounts
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
                        {/* Amount Display */}
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
                                disabled={isSubmitting || !formData.from_account_id || !formData.to_account_id || !formData.amount || formData.from_account_id === formData.to_account_id}
                                className="px-5 py-2 text-xs font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-700 border border-transparent rounded-lg hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 shadow hover:shadow-md min-w-[140px] flex items-center justify-center"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <FiArrowRight className="w-3.5 h-3.5 mr-1.5" />
                                        Create Journal
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

export default JournalEntry;