import React, { useState, useEffect, useMemo } from 'react';
import { IoTrash } from "react-icons/io5";

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

        switch (vendor.type) {
            case 'vendor':
                return `${vendor.name} • ${vendor.email} • ${vendor.contact}`;
            case 'service':
                return `${vendor.name} • ${vendor.email} • ${vendor.contact}`;
            default:
                return vendor.name;
        }
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
                const updatedItem = {
                    ...item,
                    [field]: field === 'amount' ? Number(value) || 0 : value
                };

                return updatedItem;
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

    const getExpenseItemDetails = (itemId) => {
        return expenseItemOptions.find(item => item.item_id === itemId);
    };

    const formContent = (
        <div className="bg-white rounded-xl shadow-2xl flex flex-col h-full border border-gray-300">
            {/* Professional Header */}
            <div className="flex-shrink-0 flex items-center justify-between p-3 border-b border-gray-300 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl">
                <div>
                    <h2 className="text-xl font-bold">Create Expense</h2>
                </div>
                {mode === 'modal' && (
                    <button
                        onClick={onClose}
                        className="text-blue-200 p-1 text-white rounded-lg bg-blue-500 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6">
                <form onSubmit={handleSubmit}>
                    {/* Vendor Selection and Date Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
                        {/* Vendor Selection - takes 4 columns */}
                        <div className="lg:col-span-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Vendor/Service Provider <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white cursor-pointer hover:border-blue-400 transition-colors"
                                    onClick={() => setShowVendorDropdown(!showVendorDropdown)}
                                >
                                    {formData.vendor_id ? (
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-800 font-medium">
                                                {getVendorDisplayText(getSelectedVendor())}
                                            </span>
                                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    ) : (
                                        <div className="flex justify-between items-center text-gray-500">
                                            <span>Click to select a vendor...</span>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {showVendorDropdown && (
                                    <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-xl max-h-80 overflow-y-auto">
                                        <div className="p-3 border-b border-gray-200 bg-gray-50">
                                            <input
                                                type="text"
                                                placeholder="Search by name or email..."
                                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                autoFocus
                                            />
                                        </div>
                                        <div className="py-2">
                                            {filteredVendors.map(vendor => (
                                                <div
                                                    key={vendor.id}
                                                    className={`px-4 py-3 cursor-pointer border-l-4 transition-colors ${formData.vendor_id === vendor.id
                                                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                                                        : 'border-transparent hover:bg-gray-50'
                                                        }`}
                                                    onClick={() => handleVendorSelect(vendor.id)}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <div className="flex items-center space-x-3 mb-1">
                                                                <span className="font-semibold text-gray-900">{vendor.name}</span>
                                                                <span className={`px-2 py-1 text-xs rounded-full font-medium ${vendor.type === 'vendor' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                                                                    'bg-purple-100 text-purple-800 border border-purple-200'
                                                                    }`}>
                                                                    {vendor.type.toUpperCase()}
                                                                </span>
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                {vendor.email} • {vendor.contact} • Outstanding: ₹{vendor.outstanding}
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

                        {/* Date - takes 1 column */}
                        <div className="lg:col-span-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Payment Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                                name="payment_date"
                                value={formData.payment_date}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Expense Items Section */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Expense Items</h3>
                            <button
                                type="button"
                                onClick={addItem}
                                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Item
                            </button>
                        </div>

                        <div className="overflow-hidden border border-gray-300 rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Expense Item</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Description</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {formData.items.map((item, index) => {
                                        const expenseItem = getExpenseItemDetails(item.item_id);
                                        return (
                                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3">
                                                    <select
                                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        value={item.item_id}
                                                        onChange={(e) => handleExpenseItemChange(index, e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Select Expense Item</option>
                                                        {expenseItemOptions.map(expenseItem => (
                                                            <option key={expenseItem.item_id} value={expenseItem.item_id}>
                                                                {expenseItem.name} - {formatCurrency(expenseItem.default_amount)} ({expenseItem.type})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="text"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Expense description..."
                                                        value={item.description}
                                                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="number"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="0.00"
                                                        value={item.amount}
                                                        onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                                                        required
                                                    />
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(index)}
                                                        disabled={formData.items.length <= 1}
                                                        className="inline-flex items-center px-2 py-2 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <IoTrash />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h4 className="text-md font-semibold text-gray-900 mb-3">Notes</h4>
                            <div className="space-y-3">
                                <textarea 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Additional notes, reference numbers, or special instructions..."
                                    name="notes"
                                    rows={5}
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        
                        {/* Bank Selection Section */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h4 className="text-md font-semibold text-gray-900 mb-3">Payment Details</h4>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Bank Account <span className="text-red-500">*</span></label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        name="bank_id"
                                        value={formData.bank_id}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select Bank Account</option>
                                        {bankOptions.map(bank => (
                                            <option key={bank.id} value={bank.id}>
                                                {bank.name} - {bank.account}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Expense Number</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        name="expense_number"
                                        value={formData.expense_number}
                                        onChange={handleInputChange}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Totals Section */}
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <h4 className="text-md font-semibold text-gray-900 mb-3">Expense Summary</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Total Amount:</span>
                                    <span className="font-medium">{formatCurrency(formData.total_amount)}</span>
                                </div>

                                <div className="border-t border-gray-200 pt-2 mt-2">
                                    <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                                        <span>Amount Payable:</span>
                                        <span>{formatCurrency(formData.total_amount)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div className="flex-shrink-0 border-t border-gray-200 bg-white p-4 rounded-b-xl shadow-sm">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    {/* Total Amount */}
                    <div className="text-sm">
                        <div className="font-semibold text-gray-900 text-lg">
                            Total Amount: {formatCurrency(formData.total_amount)}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
                        {/* Buttons */}
                        <div className="flex items-center gap-3">
                            {mode === 'modal' && (
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={isSubmitting}
                                    className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={isSubmitting || !formData.vendor_id || !formData.bank_id}
                                className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center min-w-[180px] justify-center"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating...
                                    </>
                                ) : (
                                    `Create Expense - ${formatCurrency(formData.total_amount)}`
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
                    {/* Professional Modal panel */}
                    <div className="relative w-full max-w-6xl bg-white rounded-xl shadow-2xl h-[90vh] flex flex-col">
                        {formContent}
                    </div>
                </div>
            </div>
        ) : null;
    }

    // Render as standalone page component
    return formContent;
};

export default CreateExpense;