import React, { useState, useEffect, useMemo } from 'react';
import { FiX, FiCalendar, FiDollarSign, FiFileText, FiArrowRight, FiCreditCard, FiHash, FiPlus, FiUser, FiTrash2, FiChevronDown } from 'react-icons/fi';

// Enhanced professional data
const vendorOptions = [
    { id: 'vendor_1', type: 'vendor', name: 'Office Supplies Ltd', email: 'orders@officesupplies.com', contact: 'Supplier', outstanding: '45,000' },
    { id: 'vendor_2', type: 'vendor', name: 'Tech Solutions Inc', email: 'accounts@techsolutions.com', contact: 'IT Supplier', outstanding: '1,20,000' },
    { id: 'vendor_3', type: 'vendor', name: 'Marketing Pro Agency', email: 'billing@marketingpro.com', contact: 'Marketing', outstanding: '85,000' },
    { id: 'service_1', type: 'service', name: 'Utilities Provider', email: 'billing@utilities.com', contact: 'Utilities', outstanding: '25,000' },
    { id: 'service_2', type: 'service', name: 'Internet Services Co', email: 'accounts@internetco.com', contact: 'Internet', outstanding: '15,000' }
];

const expenseItemOptions = [
    { item_id: '1', name: 'Office Supplies', type: 'direct expense', default_amount: '5000' },
    { item_id: '2', name: 'Employee Salaries', type: 'direct expense', default_amount: '75000' },
    { item_id: '3', name: 'Marketing Campaign', type: 'indirect expense', default_amount: '25000' },
    { item_id: '4', name: 'Business Travel', type: 'reimbursable expense', default_amount: '18000' },
    { item_id: '5', name: 'Software Subscriptions', type: 'indirect expense', default_amount: '12000' },
    { item_id: '6', name: 'Rent & Utilities', type: 'direct expense', default_amount: '45000' },
    { item_id: '7', name: 'Professional Fees', type: 'indirect expense', default_amount: '30000' },
    { item_id: '8', name: 'Office Maintenance', type: 'direct expense', default_amount: '8000' }
];

const bankOptions = [
    { id: 'bank_1', type: 'bank', name: 'HDFC Bank', account: '1234567890', holder: 'John Doe', balance: '15,00,000' },
    { id: 'bank_2', type: 'bank', name: 'ICICI Bank', account: '0987654321', holder: 'Jane Smith', balance: '25,00,000' },
    { id: 'bank_3', type: 'bank', name: 'SBI', account: '1122334455', holder: 'Bob Wilson', balance: '18,00,000' }
];

const appSettings = {
    company_name: 'Professional Accounting Services',
    currency: 'INR',
};

const CreateExpense = ({
    isOpen = false,
    onClose = () => { },
    onSuccess = () => { },
    initialVendorId = '',
    mode = 'modal'
}) => {
    const [formData, setFormData] = useState({
        vendor_id: initialVendorId || '',
        payment_date: new Date().toISOString().split('T')[0],
        expense_number: `EXP-${Date.now().toString().slice(-6)}`,
        items: [{ item_id: '', description: '', amount: '' }],
        bank_id: '',
        total_amount: 0,
        notes: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showVendorDropdown, setShowVendorDropdown] = useState(false);

    // Filter vendors based on search
    const filteredVendors = useMemo(() => {
        if (!searchTerm) return vendorOptions;
        return vendorOptions.filter(vendor =>
            vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (vendor.email && vendor.email.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [searchTerm]);

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setFormData({
                vendor_id: initialVendorId || '',
                payment_date: new Date().toISOString().split('T')[0],
                expense_number: `EXP-${Date.now().toString().slice(-6)}`,
                items: [{ item_id: '', description: '', amount: '' }],
                bank_id: '',
                total_amount: 0,
                notes: ''
            });
            setSearchTerm('');
            setShowVendorDropdown(false);
        }
    }, [isOpen, initialVendorId]);

    const getSelectedVendor = () => {
        return vendorOptions.find(vendor => vendor.id === formData.vendor_id);
    };

    const getVendorDisplayText = (vendor) => {
        if (!vendor) return 'Select Vendor/Service Provider';
        return `${vendor.name} • ${vendor.email}`;
    };

    const getVendorTypeBadge = (type) => {
        const typeConfig = {
            vendor: { color: 'bg-orange-100 text-orange-800', label: 'VENDOR' },
            service: { color: 'bg-purple-100 text-purple-800', label: 'SERVICE' }
        };
        const config = typeConfig[type] || { color: 'bg-gray-100 text-gray-800', label: type.toUpperCase() };
        return `text-xs font-bold px-2 py-1 rounded ${config.color}`;
    };

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [
                ...prev.items,
                { item_id: '', description: '', amount: '' }
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
                return {
                    ...item,
                    [field]: field === 'amount' ? Number(value) || 0 : value
                };
            }
            return item;
        });

        setFormData(prev => ({ ...prev, items: updatedItems }));
    };

    const handleExpenseItemChange = (index, itemId) => {
        const expenseItem = expenseItemOptions.find(item => item.item_id === itemId);
        if (expenseItem) {
            const updatedItems = formData.items.map((item, i) =>
                i === index ? {
                    ...item,
                    item_id: itemId,
                    amount: expenseItem.default_amount
                } : item
            );

            setFormData(prev => ({
                ...prev,
                items: updatedItems
            }));
        }
    };

    const handleVendorSelect = (vendorId) => {
        setFormData(prev => ({ ...prev, vendor_id: vendorId }));
        setShowVendorDropdown(false);
        setSearchTerm('');
    };

    // Calculate totals
    useEffect(() => {
        let total_amount = 0;
        formData.items.forEach(item => {
            total_amount += Number(item.amount) || 0;
        });

        setFormData(prev => ({
            ...prev,
            total_amount
        }));
    }, [formData.items]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.vendor_id || !formData.bank_id || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const submissionData = {
                ...formData,
                selected_vendor: getSelectedVendor(),
                timestamp: new Date().toISOString(),
                company: appSettings.company_name
            };
            console.log('Expense submitted:', submissionData);
            onSuccess(submissionData);
            if (mode === 'modal') onClose();
        } catch (error) {
            console.error('Error submitting expense:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const getExpenseItemDetails = (itemId) => {
        return expenseItemOptions.find(item => item.item_id === itemId);
    };

    const getExpenseTypeBadge = (type) => {
        const typeConfig = {
            'direct expense': 'bg-red-100 text-red-800',
            'indirect expense': 'bg-blue-100 text-blue-800',
            'reimbursable expense': 'bg-green-100 text-green-800'
        };
        return typeConfig[type] || 'bg-gray-100 text-gray-800';
    };

    const formContent = (
        <div className="bg-white rounded-xl shadow-2xl flex flex-col h-full border border-gray-200">
            {/* Compact Header */}
            <div className="flex-shrink-0 flex items-center justify-between p-3 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl">
                <div className="flex items-center space-x-3">
                    <div className="p-1.5 bg-white/10 rounded-lg">
                        <FiDollarSign className="w-5 h-5" />
                    </div>
                    <div className="flex items-center space-x-4">
                        <h2 className="text-lg font-bold">Create Expense</h2>
                        <span className="text-blue-200 text-sm hidden sm:inline">|</span>
                        <p className="text-blue-100 text-xs sm:text-sm hidden sm:block">{appSettings.company_name}</p>
                    </div>
                </div>
                {mode === 'modal' && (
                    <button
                        onClick={onClose}
                        className="p-1.5 text-blue-200 hover:text-white hover:bg-blue-500 rounded-lg transition-colors"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-gray-50">
                <form onSubmit={handleSubmit}>
                    {/* Vendor Selection and Date Section - Compact */}
                    <div className="mb-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Vendor Selection */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Vendor/Service Provider <span className="text-red-500">*</span>
                                    </label>
                                    <span className="text-xs text-gray-500 px-1.5 py-0.5 bg-gray-100 rounded">Required</span>
                                </div>
                                <div className="relative">
                                    <div
                                        className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg bg-white cursor-pointer hover:border-blue-400 transition-all duration-200 shadow-sm group"
                                        onClick={() => setShowVendorDropdown(!showVendorDropdown)}
                                    >
                                        {formData.vendor_id ? (
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <div className="p-1 bg-blue-100 text-blue-600 rounded group-hover:bg-blue-200 transition-colors">
                                                        <FiUser className="w-3.5 h-3.5" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                                                            {getSelectedVendor()?.name}
                                                        </div>
                                                        <div className="text-xs text-gray-600 truncate max-w-[200px]">
                                                            {getVendorDisplayText(getSelectedVendor())}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className={getVendorTypeBadge(getSelectedVendor()?.type)}>
                                                        {getSelectedVendor()?.type?.toUpperCase()}
                                                    </span>
                                                    <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between text-gray-500 group-hover:text-gray-600 transition-colors">
                                                <div className="flex items-center space-x-2">
                                                    <FiUser className="w-4 h-4 text-gray-400 group-hover:text-gray-500 transition-colors" />
                                                    <span className="text-sm">Select vendor or service provider...</span>
                                                </div>
                                                <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {showVendorDropdown && (
                                        <div className="absolute z-40 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto animate-fadeIn">
                                            <div className="p-2 border-b border-gray-200 bg-gray-50">
                                                <input
                                                    type="text"
                                                    placeholder="Search vendors..."
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    autoFocus
                                                />
                                            </div>
                                            <div className="py-1">
                                                {filteredVendors.map(vendor => (
                                                    <div
                                                        key={vendor.id}
                                                        className={`px-3 py-2 cursor-pointer hover:bg-gray-50 border-l-2 transition-all duration-200 ${formData.vendor_id === vendor.id
                                                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                                                            : 'border-transparent hover:border-blue-300'
                                                            }`}
                                                        onClick={() => handleVendorSelect(vendor.id)}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-2">
                                                                <div className="p-1 bg-blue-100 text-blue-600 rounded">
                                                                    <FiUser className="w-3 h-3" />
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
                                                                    <div className="text-xs text-gray-600">
                                                                        {vendor.email} • {vendor.contact}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <span className="text-xs text-gray-500">₹{vendor.outstanding}</span>
                                                                <span className={getVendorTypeBadge(vendor.type)}>
                                                                    {vendor.type?.toUpperCase()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {formData.vendor_id && (
                                    <div className="mt-1.5 text-xs text-gray-600 flex items-center space-x-2 animate-fadeIn">
                                        <span className="font-medium">Outstanding: ₹{getSelectedVendor()?.outstanding}</span>
                                        <span className="text-gray-400">•</span>
                                        <span className="text-gray-500">{getSelectedVendor()?.contact}</span>
                                    </div>
                                )}
                            </div>

                            {/* Date Input */}
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
                                        className="pl-9 w-full pr-3 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-all duration-200 shadow-sm bg-white text-sm"
                                        name="payment_date"
                                        value={formData.payment_date}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mt-1.5 text-xs text-gray-500">
                                    Selected: {formatDate(formData.payment_date)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Expense Items Section - Compact */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center space-x-2">
                                <h3 className="text-sm font-bold text-gray-900">Expense Items</h3>
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded transition-all duration-200 hover:bg-gray-200">
                                    {formData.items.length} item{formData.items.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={addItem}
                                className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-green-500 transition-all duration-200 shadow-sm hover:shadow transform hover:-translate-y-0.5"
                            >
                                <FiPlus className="w-3.5 h-3.5 mr-1.5 transition-transform duration-200 group-hover:rotate-90" />
                                Add Item
                            </button>
                        </div>

                        <div className="space-y-3">
                            {formData.items.map((item, index) => {
                                const expenseItem = getExpenseItemDetails(item.item_id);
                                return (
                                    <div 
                                        key={index} 
                                        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                                            {/* Expense Item - 5 columns */}
                                            <div className="md:col-span-5">
                                                <div className="flex items-center justify-between mb-1">
                                                    <label className="text-xs font-medium text-gray-700">Expense Item</label>
                                                    {expenseItem && (
                                                        <span className={`text-xs px-2 py-1 rounded-full transition-colors duration-200 ${getExpenseTypeBadge(expenseItem.type)}`}>
                                                            {expenseItem.type}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <FiFileText className="w-4 h-4 text-gray-400" />
                                                    </div>
                                                    <select
                                                        className="pl-10 w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-all duration-200 appearance-none bg-white"
                                                        value={item.item_id}
                                                        onChange={(e) => handleExpenseItemChange(index, e.target.value)}
                                                        required
                                                    >
                                                        <option value="" disabled>Select Expense Item</option>
                                                        {expenseItemOptions.map(expenseItem => (
                                                            <option key={expenseItem.item_id} value={expenseItem.item_id}>
                                                                {expenseItem.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                        <FiChevronDown className="w-4 h-4 text-gray-400" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Description - 5 columns */}
                                            <div className="md:col-span-5">
                                                <label className="text-xs font-medium text-gray-700 mb-1 block">Description</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                                        </svg>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        className="pl-10 w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-all duration-200"
                                                        placeholder="Expense description..."
                                                        value={item.description}
                                                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            {/* Amount and Delete - 2 columns */}
                                            <div className="md:col-span-2">
                                                <div className="flex items-end space-x-2 h-full">
                                                    <div className="flex-1">
                                                        <label className="text-xs font-medium text-gray-700 mb-1 block">Amount</label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <FiDollarSign className="w-4 h-4 text-gray-400" />
                                                            </div>
                                                            <input
                                                                type="number"
                                                                className="pl-10 w-full pr-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-all duration-200 text-right"
                                                                placeholder="0.00"
                                                                value={item.amount}
                                                                onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(index)}
                                                        disabled={formData.items.length <= 1}
                                                        className="p-2 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-200 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                                                    >
                                                        <FiTrash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Payment Details and Notes Section - Compact */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                        {/* Notes */}
                        <div className="lg:col-span-2">
                            <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-lg border border-blue-100 shadow-sm transition-all duration-300 hover:shadow-md">
                                <div className="flex items-center mb-3">
                                    <div className="p-1.5 bg-blue-600 text-white rounded-lg mr-2 transition-transform duration-200 hover:rotate-3">
                                        <FiFileText className="w-4 h-4" />
                                    </div>
                                    <h4 className="text-sm font-bold text-gray-900">Notes & References</h4>
                                </div>
                                <div className="relative">
                                    <div className="absolute left-3 top-3 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                        </svg>
                                    </div>
                                    <textarea
                                        className="pl-10 w-full px-3 py-2.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-all duration-200"
                                        placeholder="Additional notes, reference numbers, or special instructions..."
                                        name="notes"
                                        rows={4}
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2 transition-opacity duration-200 hover:opacity-100">
                                    Reference numbers, payment terms, or any special instructions
                                </p>
                            </div>
                        </div>

                        {/* Payment Details */}
                        <div>
                            <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md">
                                <div className="flex items-center mb-3">
                                    <div className="p-1.5 bg-blue-600 text-white rounded-lg mr-2 transition-transform duration-200 hover:rotate-3">
                                        <FiCreditCard className="w-4 h-4" />
                                    </div>
                                    <h4 className="text-sm font-bold text-gray-900">Payment Details</h4>
                                </div>
                                
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                            Bank Account <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                                                <FiCreditCard className="w-3.5 h-3.5 text-gray-400" />
                                            </div>
                                            <select
                                                className="pl-9 w-full pr-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-all duration-200 appearance-none bg-white"
                                                name="bank_id"
                                                value={formData.bank_id}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="" disabled>Select Bank Account</option>
                                                {bankOptions.map(bank => (
                                                    <option key={bank.id} value={bank.id}>
                                                        {bank.name} - {bank.account}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                                                <FiChevronDown className="w-3.5 h-3.5 text-gray-400" />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                            Expense Number
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                                                <FiHash className="w-3.5 h-3.5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                className="pl-9 w-full pr-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-all duration-200 bg-gray-50"
                                                name="expense_number"
                                                value={formData.expense_number}
                                                onChange={handleInputChange}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Expense Summary - Compact */}
                    <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-lg border border-blue-100 shadow-sm transition-all duration-300 hover:shadow-md">
                        <div className="flex items-center mb-3">
                            <div className="p-1.5 bg-blue-600 text-white rounded-lg mr-2 transition-transform duration-200 hover:rotate-3">
                                <FiDollarSign className="w-4 h-4" />
                            </div>
                            <h4 className="text-sm font-bold text-gray-900">Expense Summary</h4>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="text-center p-3 bg-white rounded-lg border border-gray-200 transition-all duration-200 hover:border-blue-300 hover:shadow-sm">
                                <div className="text-xs text-gray-600 mb-1">Items Count</div>
                                <div className="font-semibold text-blue-600 text-lg">
                                    {formData.items.length}
                                </div>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg border border-gray-200 transition-all duration-200 hover:border-green-300 hover:shadow-sm">
                                <div className="text-xs text-gray-600 mb-1">Vendor</div>
                                <div className="font-semibold text-green-600 text-sm truncate">
                                    {getSelectedVendor()?.name || 'Not selected'}
                                </div>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg border border-gray-200 transition-all duration-200 hover:border-purple-300 hover:shadow-sm">
                                <div className="text-xs text-gray-600 mb-1">Payment Date</div>
                                <div className="font-semibold text-purple-600 text-sm">
                                    {new Date(formData.payment_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                </div>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg border border-gray-200 transition-all duration-200 hover:border-red-300 hover:shadow-sm">
                                <div className="text-xs text-gray-600 mb-1">Total Amount</div>
                                <div className="font-semibold text-red-600 text-lg">
                                    {formatCurrency(formData.total_amount)}
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
                    {!formData.vendor_id || !formData.bank_id || formData.items.some(item => !item.item_id || !item.amount) ? (
                        <div className="w-full lg:w-auto animate-pulse">
                            <div className="flex items-center text-amber-600 text-xs font-medium px-3 py-1.5 bg-amber-50 border border-amber-200 rounded transition-all duration-200 hover:bg-amber-100">
                                <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                Please fill all required fields (*) to create expense
                            </div>
                        </div>
                    ) : null}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
                        {/* Amount Display */}
                        <div className="hidden lg:flex items-center space-x-4">
                            <div className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 transition-all duration-200 hover:border-blue-300 hover:shadow-sm">
                                <div className="text-xs text-blue-700 font-semibold">
                                    Date: <span className="text-sm">{formatDate(formData.payment_date)}</span>
                                </div>
                            </div>
                            <div className="px-3 py-1.5 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200 transition-all duration-200 hover:border-green-300 hover:shadow-sm">
                                <div className="text-xs text-green-700 font-semibold">
                                    Total: <span className="text-sm">{formatCurrency(formData.total_amount)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {mode === 'modal' && (
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={isSubmitting}
                                    className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 shadow-sm hover:shadow"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={isSubmitting || !formData.vendor_id || !formData.bank_id || formData.items.some(item => !item.item_id || !item.amount)}
                                className="px-5 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 border border-transparent rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow hover:shadow-md transform hover:-translate-y-0.5 min-w-[140px] flex items-center justify-center"
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
                                        <FiArrowRight className="w-3.5 h-3.5 mr-1.5 transition-transform duration-200 group-hover:translate-x-1" />
                                        Create Expense
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
                        className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
                        onClick={() => {
                            setShowVendorDropdown(false);
                            onClose();
                        }}
                    />
                    {/* Compact Modal panel */}
                    <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl h-[85vh] flex flex-col transform transition-all duration-300 scale-100 animate-fadeIn">
                        {formContent}
                    </div>
                </div>
            </div>
        ) : null;
    }

    // Render as standalone page component
    return formContent;
};

// Add CSS for animations
const styles = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .animate-fadeIn {
        animation: fadeIn 0.3s ease-out;
    }
`;

// Add styles to document head
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
}

export default CreateExpense;